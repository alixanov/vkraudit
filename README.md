# VKRAudit

Проверка выпускных квалификационных работ (ВКР) по ГОСТ Р 7.0.11-2024.
Максимум 100 баллов по 4 критериям: Форматирование (15), Объём (20),
Структура (50), Экспертный анализ работы (15).

## Структура

```
vkr/
├── client/        # React (CRA) — фронтенд
├── backend/       # Express (ES modules) — API + анализ
├── package.json   # корневые скрипты для монолит-деплоя
└── railway.json   # конфиг Railway (NIXPACKS)
```

## Локальная разработка

```bash
# 1. Backend
cd backend
cp .env.example .env        # заполнить MONGODB_URI и ключи Tigris
npm install
npm run dev                 # http://localhost:5001

# 2. Frontend (в новом терминале)
cd client
npm install
npm start                   # http://localhost:3005 (proxy → :5001)
```

Фронтенд обращается к API относительными путями (`/api/...`). В dev запросы
идут через `proxy` в `client/package.json`, поэтому менять код не нужно.

## Production / Railway

Деплой монолитом: один сервис собирает фронт и раздаёт его из backend
(один origin — CORS не требуется, env с URL backend не нужен).

- **Build:** `npm run build` — ставит зависимости client, собирает `client/build`,
  ставит prod-зависимости backend.
- **Start:** `npm start` — запускает backend, который раздаёт `client/build`
  и отвечает на `/api/*`.
- **Healthcheck:** `GET /health`.

### Переменные окружения на Railway

| Переменная | Назначение |
|------------|------------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | строка подключения MongoDB |
| `TIGRIS_ENDPOINT` | `https://fly.storage.tigris.dev` |
| `TIGRIS_ACCESS_KEY_ID` | ключ Tigris |
| `TIGRIS_SECRET_ACCESS_KEY` | секрет Tigris |
| `TIGRIS_BUCKET` | имя бакета |
| `CLIENT_URL` | (опц.) доп. origin'ы через запятую |
| `PORT` | задаётся Railway автоматически |

`localhost` и любые `*.railway.app` / `*.up.railway.app` разрешены в CORS
автоматически. Никакие URL в коде не захардкожены.

### Раздельный деплой (опционально)

Если фронт и backend — два разных сервиса, задайте на фронтенде
`REACT_APP_API_URL=https://<backend>.up.railway.app` (на этапе build).
Остальное работает без изменений кода.
