# VKRAudit

Проверка выпускных квалификационных работ (ВКР) по ГОСТ Р 7.0.11-2024.
Максимум 100 баллов по 4 критериям: Форматирование (15), Объём (20),
Структура (50), Экспертный анализ работы (15).

## Структура

```
vkr/
├── frontend/      # React (CRA) — отдельный сервис
│   └── railway.json
└── backend/       # Express (ES modules) — API, отдельный сервис
    └── railway.json
```

Каждая папка деплоится как **самостоятельный сервис Railway** (Root Directory =
`frontend` / `backend`).

## Локальная разработка

```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run dev   # :5001

# Frontend (новый терминал)
cd frontend && npm install && npm start                           # :3005 (proxy → :5001)
```

## Production / Railway — два сервиса

**backend** (Root Directory = `backend`)
- Build: NIXPACKS (`npm install`)
- Start: `npm start` → Express, слушает `0.0.0.0:$PORT`
- Healthcheck: `/health`
- Переменные: `NODE_ENV=production`, `MONGODB_URI`, `TIGRIS_ENDPOINT`,
  `TIGRIS_ACCESS_KEY_ID`, `TIGRIS_SECRET_ACCESS_KEY`, `TIGRIS_BUCKET`,
  `CLIENT_URL` (домен фронтенда).

**frontend** (Root Directory = `frontend`)
- Build: `npm run build` → `frontend/build`
- Start: `npx serve -s build -l $PORT` (статика SPA)
- Переменная: `REACT_APP_API_URL=https://<backend>.up.railway.app`

CORS на backend автоматически разрешает `localhost` и любые
`*.railway.app` / `*.up.railway.app`, поэтому фронт и API общаются без правок
кода. Никакие URL/ключи не захардкожены — всё через env.
