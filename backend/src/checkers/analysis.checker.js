// Критерий 4: Анализ результата
// Таблицы и рисунки (5) + Выводы по главам (5) + Цитирование источников (5) = 15

const TABLE_RE  = [/табл(?:\.|иц)/i];
const FIGURE_RE = [/рис(?:\.|ун)/i];
const CONCL_RE  = [/вывод/i, /выводы\s+по\s+глав/i];
// ссылки на источники в тексте: [1], [12], [3, 4], [5; 6]
const CITE_RE   = /\[\s*\d+(?:\s*[,;]\s*\d+)*\s*\]/g;

function anyMatch(text, list) {
  return list.some(re => re.test(text));
}

export function checkAnalysis(parsed) {
  const { fullText } = parsed;
  const text = fullText || '';
  const scores = {};
  const issues = [];

  // ── 1. Таблицы и рисунки (5 pts) ──────────────────────────────────────────
  const hasTable  = anyMatch(text, TABLE_RE);
  const hasFigure = anyMatch(text, FIGURE_RE);
  if (hasTable && hasFigure)       scores.tablesFiguresScore = 5;
  else if (hasTable || hasFigure)  scores.tablesFiguresScore = 3;
  else                             scores.tablesFiguresScore = 0;
  if (scores.tablesFiguresScore < 5) issues.push({
    criterion: 'Анализ результата',
    issue: !hasTable && !hasFigure
      ? 'Таблицы и рисунки в работе не обнаружены'
      : `Найдены только ${hasTable ? 'таблицы' : 'рисунки'} — рекомендуется добавить ${hasTable ? 'рисунки/схемы' : 'таблицы'}`,
    recommendation: 'Подкрепите анализ иллюстративным материалом: таблицами, рисунками, диаграммами',
    location: 'Основная часть',
  });

  // ── 2. Выводы по главам (5 pts) ───────────────────────────────────────────
  scores.findingsScore = anyMatch(text, CONCL_RE) ? 5 : 0;
  if (!scores.findingsScore) issues.push({
    criterion: 'Анализ результата',
    issue: 'Выводы по главам не обнаружены',
    recommendation: 'Завершайте каждую главу выводами, обобщающими результаты анализа',
    location: 'Конец каждой главы',
  });

  // ── 3. Цитирование источников в тексте (5 pts) ────────────────────────────
  const citeCount = (text.match(CITE_RE) || []).length;
  if (citeCount >= 5)      scores.citationsScore = 5;
  else if (citeCount >= 1) scores.citationsScore = 3;
  else                     scores.citationsScore = 0;
  if (scores.citationsScore < 5) issues.push({
    criterion: 'Анализ результата',
    issue: citeCount === 0
      ? 'Ссылки на источники в тексте не обнаружены'
      : `Найдено мало ссылок на источники (${citeCount})`,
    recommendation: 'Подкрепляйте анализ ссылками на источники в формате [1], [2, 3]',
    location: 'Весь документ',
  });

  const analysisTotal =
    scores.tablesFiguresScore + scores.findingsScore + scores.citationsScore;

  return { scores, analysisTotal, issues };
}
