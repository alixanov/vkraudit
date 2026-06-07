import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

/* Нормализация имени PDF-шрифта:
 *   "ABCDEF+TimesNewRomanPSMT" → "Times New Roman"
 *   "Arial-BoldMT"            → "Arial"
 */
function normalizeFontName(raw) {
  if (!raw) return null;
  let n = raw.replace(/^[A-Z]{6}\+/, '');        // убрать subset-префикс
  n = n.replace(/[-,].*$/, '');                  // убрать суффиксы стиля
  n = n.replace(/(PSMT|MT|PS|Regular|Bold|Italic|Oblique)$/i, '');
  const low = n.toLowerCase();
  if (low.includes('times')) return 'Times New Roman';
  if (low.includes('arial') || low.includes('helvetica')) return 'Arial';
  if (low.includes('calibri')) return 'Calibri';
  if (low.includes('aptos')) return 'Aptos';
  // Базовые шрифты PDF без встраивания pdf.js подменяет родовым именем.
  // В контексте ВКР serif-семейство — это практически всегда Times New Roman.
  if (low === 'serif') return 'Times New Roman';
  if (low === 'sans-serif' || low === 'sans serif') return 'Arial';
  // CamelCase → слова
  return n.replace(/([a-z])([A-Z])/g, '$1 $2').trim() || null;
}

function topByWeight(map) {
  const e = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
  return e ? e[0] : undefined;
}

async function realFontName(page, fontId) {
  try {
    if (page.commonObjs.has(fontId)) {
      const f = page.commonObjs.get(fontId);
      return f?.name || null;
    }
  } catch { /* объект ещё не разрешён */ }
  return null;
}

export async function parsePdf(buffer) {
  const data = new Uint8Array(buffer);
  const doc = await pdfjs.getDocument({
    data,
    disableFontFace: true,
    useSystemFonts: false,
    isEvalSupported: false,
  }).promise;

  const numPages = doc.numPages;
  const fontW = {}, sizeW = {}, spacingW = {};
  const pageTexts = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();

    let pageLine = '';
    let prevY = null, prevSize = null;

    for (const it of tc.items) {
      if (!it.str) { if (it.hasEOL) pageLine += '\n'; continue; }

      const len = it.str.replace(/\s/g, '').length;
      pageLine += it.str + (it.hasEOL ? '\n' : '');
      if (len === 0) continue;

      // размер шрифта: высота glyph или масштаб трансформации
      const size = Math.round((it.height || Math.hypot(it.transform[2], it.transform[3])) * 10) / 10;
      if (size > 0) sizeW[size] = (sizeW[size] || 0) + len;

      // имя шрифта
      const styleFam = tc.styles[it.fontName]?.fontFamily;
      const real = await realFontName(page, it.fontName);
      const name = normalizeFontName(real) || normalizeFontName(styleFam);
      if (name) fontW[name] = (fontW[name] || 0) + len;

      // межстрочный интервал: расстояние между базовыми линиями / размер
      const y = it.transform[5];
      if (prevY != null && prevSize) {
        const gap = Math.abs(prevY - y);
        if (gap > prevSize * 0.5 && gap < prevSize * 4) {
          const ratio = Math.round((gap / prevSize) * 10) / 10;
          spacingW[ratio] = (spacingW[ratio] || 0) + 1;
        }
      }
      prevY = y; prevSize = size;
    }
    pageTexts.push(pageLine);
  }

  const fullText = pageTexts.join('\n');
  const paragraphs = fullText
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(text => ({ text, style: null }));

  const fontName = topByWeight(fontW) || null;
  const sz = topByWeight(sizeW);
  const sp = topByWeight(spacingW);

  return {
    format: 'pdf',
    paragraphs,
    fullText,
    formatting: {
      fontName,
      fontSize:    sz != null ? parseFloat(sz) : null,
      lineSpacing: sp != null ? parseFloat(sp) : null,
      margins:     null,
    },
    tocPages: {},
    pageNumbering: { hasPageNum: /^\s*[-–—]?\s*\d+\s*[-–—]?\s*$/m.test(fullText), firstPageSeparate: null },
    pageCount: numPages,
  };
}
