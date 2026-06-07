// Критерий 3: Структура
// Содержание(5) + Введение(4) + Гл1(9) + Гл2(10) + Гл3(10) + Заключение(5) + Приложения(7) = 50

const SECTION = {
  contents:     [/^содержание\s*[.]?\s*$/im, /^оглавление\s*[.]?\s*$/im],
  intro:        [/^введение\s*$/im, /введение/im],
  conclusion:   [/^заключение\s*$/im, /заключение/im],
  bibliography: [/^список\s+(?:литературы|использованных?\s+источников?)/im, /^библиографический\s+список/im, /список\s+использованных/im],
  appendix:     [/^приложени[ея]\s*[А-ЯA-Z\d]?\s*$/im, /^приложение\s+[А-ЯA-Z\d]/im, /приложени[ея]/im],
};

const CHAPTER_RE = [
  [1, /^глава\s+1[\s.]/im, /^1[\s.]\s+[А-ЯЁA-Z]/m],
  [2, /^глава\s+2[\s.]/im, /^2[\s.]\s+[А-ЯЁA-Z]/m],
  [3, /^глава\s+3[\s.]/im, /^3[\s.]\s+[А-ЯЁA-Z]/m],
];

function hasSection(fullText, patterns) {
  return patterns.some(re => re.test(fullText));
}

function countSubchapters(fullText, chNum) {
  const re = new RegExp(`^${chNum}\\.\\d+[\\s.]`, 'gm');
  return (fullText.match(re) || []).length;
}

export function checkStructure(parsed) {
  const { fullText } = parsed;
  const scores = {};
  const issues = [];

  // ── Содержание (5 pts) ────────────────────────────────────────────────────
  scores.contentsScore = hasSection(fullText, SECTION.contents) ? 5 : 0;
  if (!scores.contentsScore) issues.push({
    criterion: 'Структура',
    issue: 'Раздел «Оглавление» не найден',
    recommendation: 'Добавьте раздел «Оглавление» с перечнем разделов и номерами страниц',
    location: 'Начало документа',
  });

  // ── Введение (5 pts) ──────────────────────────────────────────────────────
  scores.introSectionScore = hasSection(fullText, SECTION.intro) ? 4 : 0;
  if (!scores.introSectionScore) issues.push({
    criterion: 'Структура',
    issue: 'Раздел «Введение» не найден',
    recommendation: 'Добавьте раздел «Введение»',
    location: 'Начало основной части',
  });

  // ── Главы 1, 2, 3 (8 + 10 + 10) ─────────────────────────────────────────
  const chapterMaxes = [9, 10, 10];
  const chapterScoreKeys = ['chapter1Score', 'chapter2Score', 'chapter3Score'];

  CHAPTER_RE.forEach(([num, re1, re2], idx) => {
    const found = re1.test(fullText) || re2.test(fullText);
    const subCount = countSubchapters(fullText, num);
    const max = chapterMaxes[idx];

    let score = 0;
    if (found) {
      if (subCount >= 2)     score = max;
      else if (subCount === 1) score = Math.round(max / 2);
    }
    scores[chapterScoreKeys[idx]] = score;

    if (!found) issues.push({
      criterion: 'Структура',
      issue: `Глава ${num} не найдена`,
      recommendation: `Добавьте заголовок «Глава ${num}» или «${num}. Название главы»`,
      location: `Основная часть, Глава ${num}`,
    });
    else if (subCount < 2) issues.push({
      criterion: 'Структура',
      issue: `Глава ${num}: найдено ${subCount} подраздел(ов), требуется минимум 2`,
      recommendation: `Добавьте подразделы ${num}.1, ${num}.2 и т.д.`,
      location: `Глава ${num}`,
    });
  });

  // ── Заключение (5 pts) ────────────────────────────────────────────────────
  scores.conclusionSectionScore = hasSection(fullText, SECTION.conclusion) ? 5 : 0;
  if (!scores.conclusionSectionScore) issues.push({
    criterion: 'Структура',
    issue: 'Раздел «Заключение» не найден',
    recommendation: 'Добавьте раздел «Заключение»',
    location: 'Конец основной части',
  });

  scores.bibliographyScore = 0; // считается в bibliography.checker

  // ── Приложения (5 pts) ────────────────────────────────────────────────────
  scores.appendixScore = hasSection(fullText, SECTION.appendix) ? 7 : 0;
  if (!scores.appendixScore) issues.push({
    criterion: 'Структура',
    issue: 'Раздел «Приложения» не найден',
    recommendation: 'Добавьте приложения в конец работы',
    location: 'Конец документа',
  });

  const structureTotal =
    scores.contentsScore + scores.introSectionScore +
    scores.chapter1Score + scores.chapter2Score + scores.chapter3Score +
    scores.conclusionSectionScore + scores.bibliographyScore + scores.appendixScore;

  return { scores, structureTotal, issues };
}
