import 'dotenv/config';
import express   from 'express';
import cors      from 'cors';
import multer    from 'multer';
import path      from 'path';
import fs        from 'fs';
import { fileURLToPath } from 'url';
import { analyzeVkr }     from './src/analyzer.js';
import { uploadToTigris } from './src/storage/tigris.js';
import { connectMongo }   from './src/db/mongo.js';
import { saveResult, getRecentResults } from './src/db/results.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';
const isProd = process.env.NODE_ENV === 'production';

/* ── CORS ────────────────────────────────────────────────────────────────
   Разрешены: localhost (любой порт), любые *.railway.app / *.up.railway.app,
   плюс явные адреса из CLIENT_URL (можно несколько через запятую).            */
const explicitOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3005')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;                    // curl / server-to-server / same-origin
  if (explicitOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (/\.railway\.app$/.test(hostname) || /\.up\.railway\.app$/.test(hostname)) return true;
  } catch { /* ignore */ }
  return false;
}

app.use(cors({
  origin: (origin, cb) => {
    const ok = isAllowedOrigin(origin);
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
}));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    cb(ok.includes(file.mimetype) ? null : new Error('Принимаются только PDF и DOCX'), ok.includes(file.mimetype));
  },
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

/* ── POST /api/check ─────────────────────────────────────────────────── */
app.post('/api/check', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен или неверный формат' });
  }

  const { buffer, originalname, mimetype, size } = req.file;

  try {
    // 1. Анализируем документ
    const result = await analyzeVkr(buffer, mimetype);

    // 2. Сохраняем файл в Tigris (не блокируем ответ при ошибке хранилища)
    let fileKey = null;
    let fileUrl = null;
    try {
      const stored = await uploadToTigris(buffer, originalname, mimetype);
      fileKey = stored.key;
      fileUrl = stored.url;
    } catch (storageErr) {
      console.warn('⚠️  Tigris upload failed (continuing):', storageErr.message);
    }

    // 3. Сохраняем результат в MongoDB
    let resultId = null;
    try {
      resultId = await saveResult({
        fileName: originalname,
        fileKey,
        fileUrl,
        mimeType: mimetype,
        fileSize: size,
        result,
      });
    } catch (dbErr) {
      console.warn('⚠️  MongoDB save failed (continuing):', dbErr.message);
    }

    // 4. Возвращаем результат клиенту
    res.json({ ...result, resultId, fileUrl });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Ошибка при анализе документа: ' + err.message });
  }
});

/* ── GET /api/results — последние проверки ───────────────────────────── */
app.get('/api/results', async (_, res) => {
  try {
    const list = await getRecentResults(20);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Production: отдаём собранный фронтенд (монолит-деплой) ───────────────
   Если рядом есть client/build — сервер раздаёт SPA и работает как единый
   origin (тогда фронт обращается к /api/* относительными путями).            */
const CLIENT_BUILD = process.env.CLIENT_BUILD_PATH
  || path.resolve(__dirname, '../frontend/build');

if (fs.existsSync(CLIENT_BUILD)) {
  app.use(express.static(CLIENT_BUILD));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
  });
  console.log(`🗂  Serving client build from ${CLIENT_BUILD}`);
}

/* ── Multer / error handler ──────────────────────────────────────────── */
app.use((err, req, res, _next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

/* ── Start ───────────────────────────────────────────────────────────── */
function listen(note = '') {
  app.listen(PORT, HOST, () => {
    console.log(`VKRAudit server → http://${HOST}:${PORT}${note} [${isProd ? 'production' : 'development'}]`);
  });
}

connectMongo()
  .then(() => listen())
  .catch(err => {
    console.error('❌ Failed to connect MongoDB:', err.message);
    // Запускаем сервер даже без MongoDB — анализ всё равно работает
    listen(' (without MongoDB)');
  });
