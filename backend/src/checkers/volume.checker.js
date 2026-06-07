import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const profile = JSON.parse(readFileSync(path.join(__dir, '../config/profile.json'), 'utf8'));
const { totalMin, introMin, conclusionMin } = profile.volume;

function sectionWordCount(paragraphs, startRe, endRe) {
  const lines = paragraphs.map(p => p.text);
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startIdx === -1 && startRe.test(lines[i])) { startIdx = i; continue; }
    if (startIdx !== -1 && endRe.test(lines[i])) {
      return lines.slice(startIdx + 1, i).join(' ').split(/\s+/).filter(Boolean).length;
    }
  }
  if (startIdx !== -1) {
    const slice = lines.slice(startIdx + 1, startIdx + 100);
    return slice.join(' ').split(/\s+/).filter(Boolean).length;
  }
  return null;
}

function wordsToPages(words) {
  // 14pt Times New Roman, интервал 1,5 → ≈300 слов на страницу
  return Math.max(1, Math.round(words / 300));
}

// Размер секции в страницах: сначала по оглавлению (точно), иначе по словам.
function sectionPages(tocPages, fromKey, toKey, words) {
  if (tocPages && tocPages[fromKey] != null && tocPages[toKey] != null) {
    const span = tocPages[toKey] - tocPages[fromKey];
    if (span > 0) return { pages: span, source: 'toc' };
  }
  if (words != null) return { pages: wordsToPages(words), source: 'words' };
  return { pages: null, source: null };
}

export function checkVolume(parsed) {
  const { pageCount, paragraphs, tocPages } = parsed;
  const scores = {};
  const issues = [];

  // ── 1. Общий объём: ≥70 стр = 12 баллов ──────────────────────────────────
  if (pageCount == null) {
    scores.volumeScore = 0;
    issues.push({
      criterion: 'Объём работы',
      issue: 'Объём документа не определён',
      recommendation: 'Проверьте объём вручную',
      location: 'Весь документ',
    });
  } else if (pageCount >= totalMin) {
    scores.volumeScore = 12;
  } else {
    const ratio = pageCount / totalMin;
    scores.volumeScore = Math.max(0, Math.min(11, Math.floor(ratio * 12)));
    issues.push({
      criterion: 'Объём работы',
      issue: `Объём работы ${pageCount} стр. — меньше минимума (${totalMin} стр.)`,
      recommendation: `Дополните работу до ${totalMin} страниц`,
      location: 'Весь документ',
    });
  }

  // ── 2. Введение >2 стр (5 pts) ────────────────────────────────────────────
  const introWords = sectionWordCount(
    paragraphs,
    /^введение$/i,
    /^глава\s+1|^1[\.\s]\s*[А-ЯЁа-яёA-Z]|^раздел\s+1/i,
  );
  const intro = sectionPages(tocPages, 'intro', 'ch1', introWords);
  const introPages = intro.pages;
  const introOk = introPages != null && introPages > introMin;
  if (introPages == null) {
    scores.introScore = 0;
  } else if (introOk) {
    scores.introScore = 4;
  } else {
    scores.introScore = Math.max(0, Math.min(3, Math.floor((introPages / (introMin + 1)) * 4)));
  }
  if (!introOk) issues.push({
    criterion: 'Объём работы',
    issue: introPages == null ? 'Раздел «Введение» не найден'
      : `Введение ~${introPages} стр. (норма >${introMin} стр.)`,
    recommendation: introPages == null ? 'Добавьте раздел «Введение»'
      : 'Расширьте введение: актуальность, цель, задачи, объект, предмет, методы',
    location: 'Раздел «Введение»',
  });

  // ── 3. Заключение >2 стр (5 pts) ─────────────────────────────────────────
  const conclusionWords = sectionWordCount(
    paragraphs,
    /^заключение$/i,
    /^список\s+(?:литературы|использованных?\s+источников?)|^библиографический\s+список|^приложени[ея]/i,
  );
  const conclusion = sectionPages(tocPages, 'conclusion', 'bibliography', conclusionWords);
  const conclusionPages = conclusion.pages;
  const conclusionOk = conclusionPages != null && conclusionPages > conclusionMin;
  if (conclusionPages == null) {
    scores.conclusionScore = 0;
  } else if (conclusionOk) {
    scores.conclusionScore = 4;
  } else {
    scores.conclusionScore = Math.max(0, Math.min(3, Math.floor((conclusionPages / (conclusionMin + 1)) * 4)));
  }
  if (!conclusionOk) issues.push({
    criterion: 'Объём работы',
    issue: conclusionPages == null ? 'Раздел «Заключение» не найден'
      : `Заключение ~${conclusionPages} стр. (норма >${conclusionMin} стр.)`,
    recommendation: conclusionPages == null ? 'Добавьте раздел «Заключение»'
      : 'Расширьте заключение: выводы по каждой главе + общий вывод',
    location: 'Раздел «Заключение»',
  });

  const volumeTotal = scores.volumeScore + scores.introScore + scores.conclusionScore;
  return { scores, volumeTotal, issues };
}
