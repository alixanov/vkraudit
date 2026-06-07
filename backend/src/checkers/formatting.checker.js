import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const profile = JSON.parse(readFileSync(path.join(__dir, '../config/profile.json'), 'utf8'));

export function checkFormatting(parsed) {
  const { formatting, pageNumbering, format } = parsed;
  const { fontName, fontSize, lineSpacing } = formatting;
  const pf = profile.font;

  const scores = {};
  const issues = [];

  // Форматирование извлекается и для DOCX, и для PDF. Если значение не удалось
  // извлечь (null) — не штрафуем (ограничение парсера, а не ошибка автора).

  // ── 1. Times New Roman (4 pts) ────────────────────────────────────────────
  if (fontName == null) {
    scores.fontTimesScore = 4;
  } else {
    const ok = fontName.toLowerCase() === pf.name.toLowerCase();
    scores.fontTimesScore = ok ? 4 : 0;
    if (!ok) issues.push({
      criterion: 'Шрифт и форматирование',
      issue: `Использован шрифт «${fontName}» вместо «${pf.name}»`,
      recommendation: `Выделите весь текст (Ctrl+A) и установите шрифт ${pf.name}`,
      location: 'Весь документ',
    });
  }

  // ── 2. Размер 14 пт (4 pts) ───────────────────────────────────────────────
  if (fontSize == null) {
    scores.fontSize14Score = 4;
  } else {
    const ok = fontSize === pf.size;
    scores.fontSize14Score = ok ? 4 : 0;
    if (!ok) issues.push({
      criterion: 'Шрифт и форматирование',
      issue: `Размер шрифта ${fontSize} пт, требуется ${pf.size} пт`,
      recommendation: `Установите размер основного текста ${pf.size} пт`,
      location: 'Весь документ',
    });
  }

  // ── 3. Межстрочный интервал 1,5 (4 pts) ──────────────────────────────────
  if (lineSpacing == null) {
    scores.lineSpacingScore = 4;
  } else {
    const ok = Math.abs(lineSpacing - pf.lineSpacing) <= 0.2;
    scores.lineSpacingScore = ok ? 4 : 0;
    if (!ok) issues.push({
      criterion: 'Шрифт и форматирование',
      issue: `Межстрочный интервал ${lineSpacing}, требуется ${pf.lineSpacing}`,
      recommendation: 'Выделите текст → Абзац → Межстрочный → Полуторный (1,5)',
      location: 'Весь документ',
    });
  }

  scores.marginsScore = 0;

  // ── 4. Нумерация страниц (3 pts) ─────────────────────────────────────────
  const { hasPageNum } = pageNumbering;
  scores.pageNumbersScore = hasPageNum ? 3 : 0;
  if (!hasPageNum) issues.push({
    criterion: 'Шрифт и форматирование',
    issue: 'Нумерация страниц не обнаружена',
    recommendation: format === 'docx'
      ? 'Вставьте → Номера страниц → Внизу → По центру; включите «Особый колонтитул для первой страницы»'
      : 'Убедитесь, что страницы пронумерованы перед сохранением в PDF',
    location: format === 'docx' ? 'Колонтитулы' : 'Весь документ',
  });

  const fontTotal = scores.fontTimesScore + scores.fontSize14Score +
                    scores.lineSpacingScore + scores.pageNumbersScore;

  return { scores, fontTotal, issues };
}
