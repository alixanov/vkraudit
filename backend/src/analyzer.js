import { parseDocx } from './parsers/docx.parser.js';
import { parsePdf }  from './parsers/pdf.parser.js';
import { checkFormatting }   from './checkers/formatting.checker.js';
import { checkVolume }       from './checkers/volume.checker.js';
import { checkStructure }    from './checkers/structure.checker.js';
import { checkBibliography } from './checkers/bibliography.checker.js';
import { checkAnalysis }     from './checkers/analysis.checker.js';

function gradeFromScore(score) {
  if (score >= 90) return { grade: '5 — ОТЛИЧНО',           status: 'excellent' };
  if (score >= 70) return { grade: '4 — ХОРОШО',            status: 'good' };
  if (score >= 60) return { grade: '3 — УДОВЛЕТВОРИТЕЛЬНО', status: 'satisfactory' };
  return              { grade: '2 — НЕУДОВЛЕТВОРИТЕЛЬНО',   status: 'poor' };
}

export async function analyzeVkr(buffer, mimetype) {
  const isDocx = mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const parsed = isDocx ? await parseDocx(buffer) : await parsePdf(buffer);

  const fmt  = checkFormatting(parsed);
  const vol  = checkVolume(parsed);
  const str  = checkStructure(parsed);
  const bib  = checkBibliography(parsed);
  const ana  = checkAnalysis(parsed);

  const totalScore = fmt.fontTotal + vol.volumeTotal + str.structureTotal + ana.analysisTotal;
  const percentage = Math.min(100, Math.round(totalScore));
  const { grade, status } = gradeFromScore(percentage);

  const allIssues = [...fmt.issues, ...vol.issues, ...str.issues, ...ana.issues, ...bib.issues];

  return {
    totalScore: percentage,
    percentage,
    status,
    grade,

    fontTotal:       fmt.fontTotal,
    volumeTotal:     vol.volumeTotal,
    structureTotal:  str.structureTotal,
    analysisTotal:   ana.analysisTotal,
    referencesTotal: bib.referencesTotal,

    details: {
      // Форматирование
      fontTimesScore:   fmt.scores.fontTimesScore,
      fontSize14Score:  fmt.scores.fontSize14Score,
      lineSpacingScore: fmt.scores.lineSpacingScore,
      marginsScore:     fmt.scores.marginsScore,
      pageNumbersScore: fmt.scores.pageNumbersScore,
      // Объём
      volumeScore:      vol.scores.volumeScore,
      introScore:       vol.scores.introScore,
      conclusionScore:  vol.scores.conclusionScore,
      // Структура
      contentsScore:          str.scores.contentsScore,
      introSectionScore:      str.scores.introSectionScore,
      chapter1Score:          str.scores.chapter1Score,
      chapter2Score:          str.scores.chapter2Score,
      chapter3Score:          str.scores.chapter3Score,
      conclusionSectionScore: str.scores.conclusionSectionScore,
      bibliographyScore:      str.scores.bibliographyScore,
      appendixScore:          str.scores.appendixScore,
      // Анализ результата
      tablesFiguresScore: ana.scores.tablesFiguresScore,
      findingsScore:      ana.scores.findingsScore,
      citationsScore:     ana.scores.citationsScore,
      // Библиография
      bibliographyFullScore: bib.scores.bibliographyScore,
    },

    issues: allIssues,

    meta: {
      format: parsed.format,
      pages:  parsed.pageCount,
      checkedAt: new Date().toISOString(),
    },
  };
}
