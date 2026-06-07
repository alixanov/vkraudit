// Базовый адрес API.
// • dev (localhost):   REACT_APP_API_URL пуст → используется proxy из package.json.
// • монолит-prod:      пуст → относительные пути на тот же origin (backend раздаёт build).
// • раздельный deploy: REACT_APP_API_URL = https://<backend>.up.railway.app
export const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const apiUrl = (path) => `${API_BASE}${path}`;
