import JSZip from 'jszip';

const MM_PER_TWIP = 25.4 / 1440;
const toMm = t => Math.round(parseInt(t || 0) * MM_PER_TWIP * 10) / 10;

/* ────────────────────────────────────────────────────────────────────────
 * Низкоуровневые помощники чтения OOXML
 * ──────────────────────────────────────────────────────────────────────── */
function attr(tag, name) {
  if (!tag) return null;
  const m = tag.match(new RegExp(`w:${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function topByWeight(map) {
  const e = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
  return e ? e[0] : undefined;
}

/* ── Тематические шрифты (theme1.xml) ─────────────────────────────────── */
function parseTheme(xml) {
  if (!xml) return { major: null, minor: null };
  const maj = xml.match(/<a:majorFont>[\s\S]*?<a:latin\s+typeface="([^"]*)"/);
  const min = xml.match(/<a:minorFont>[\s\S]*?<a:latin\s+typeface="([^"]*)"/);
  return { major: maj?.[1] || null, minor: min?.[1] || null };
}

function resolveThemeFont(themeRef, theme) {
  if (!themeRef) return null;
  if (/^major/i.test(themeRef)) return theme.major;
  if (/^minor/i.test(themeRef)) return theme.minor;
  return null;
}

/* ── Чтение свойств run (rPr) ──────────────────────────────────────────── */
function readRunProps(rPrXml, theme) {
  const out = {};
  if (!rPrXml) return out;
  const fonts = rPrXml.match(/<w:rFonts\b[^>]*\/?>/);
  if (fonts) {
    const ascii = attr(fonts[0], 'ascii');
    if (ascii && !ascii.startsWith('+')) out.font = ascii;
    else {
      const themed = resolveThemeFont(attr(fonts[0], 'asciiTheme'), theme);
      if (themed) out.font = themed;
    }
  }
  const sz = rPrXml.match(/<w:sz\b[^>]*w:val="(\d+)"/);
  if (sz) out.size = parseInt(sz[1]) / 2; // half-points → pt
  return out;
}

/* ── Чтение межстрочного интервала (pPr/spacing) ──────────────────────── */
function readParaSpacing(pPrXml) {
  if (!pPrXml) return {};
  const sp = pPrXml.match(/<w:spacing\b[^>]*\/?>/);
  if (!sp) return {};
  const line = attr(sp[0], 'line');
  if (line == null) return {};
  const rule = attr(sp[0], 'lineRule') || 'auto';
  if (rule === 'auto') return { spacing: Math.round((parseInt(line) / 240) * 100) / 100 };
  // exact / atLeast: значение в твипах (высота строки). 360 твип ≈ одинарный для 14pt.
  // Переводим в коэффициент относительно одинарного для 14pt (≈ 280 твип).
  return { spacing: Math.round((parseInt(line) / 280) * 100) / 100 };
}

/* ── styles.xml: docDefaults + именованные стили с наследованием ──────── */
function parseStyles(xml, theme) {
  const styles = {};
  const defaults = { font: null, size: null, spacing: null };
  let defaultParaStyleId = null;
  if (!xml) return { styles, defaults, defaultParaStyleId };

  const dd = xml.match(/<w:docDefaults>[\s\S]*?<\/w:docDefaults>/);
  if (dd) {
    const rPr = dd[0].match(/<w:rPrDefault>[\s\S]*?<\/w:rPrDefault>/)?.[0];
    const pPr = dd[0].match(/<w:pPrDefault>[\s\S]*?<\/w:pPrDefault>/)?.[0];
    Object.assign(defaults, readRunProps(rPr, theme));
    const sp = readParaSpacing(pPr);
    if (sp.spacing != null) defaults.spacing = sp.spacing;
  }

  const styleRe = /<w:style\b([^>]*)>([\s\S]*?)<\/w:style>/g;
  let m;
  while ((m = styleRe.exec(xml))) {
    const head = m[1], body = m[2];
    const id = attr(head, 'styleId');
    if (!id) continue;
    if (attr(head, 'type') === 'paragraph' && /w:default="1"/.test(head)) defaultParaStyleId = id;
    const rp = readRunProps(body.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0], theme);
    const sp = readParaSpacing(body.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0]);
    styles[id] = {
      font: rp.font ?? null,
      size: rp.size ?? null,
      spacing: sp.spacing ?? null,
      basedOn: attr(body.match(/<w:basedOn\b[^>]*\/?>/)?.[0], 'val'),
    };
  }
  return { styles, defaults, defaultParaStyleId };
}

function resolveStyleChain(styleId, styles, seen = new Set()) {
  if (!styleId || !styles[styleId] || seen.has(styleId)) return {};
  seen.add(styleId);
  const s = styles[styleId];
  const parent = resolveStyleChain(s.basedOn, styles, seen);
  return {
    font: s.font ?? parent.font ?? null,
    size: s.size ?? parent.size ?? null,
    spacing: s.spacing ?? parent.spacing ?? null,
  };
}

/* ── Эффективное форматирование (взвешенное по длине текста) ───────────── */
function analyzeFormatting(docXml, theme, parsedStyles) {
  const { styles, defaults, defaultParaStyleId } = parsedStyles;
  const fontW = {}, sizeW = {}, spaceW = {};
  const add = (map, k, w) => { if (k != null && k !== 'null' && w > 0) map[k] = (map[k] || 0) + w; };

  for (const para of docXml.split(/<\/w:p>/)) {
    const pPr = para.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] || '';
    const pStyleId = attr(pPr.match(/<w:pStyle\b[^>]*\/?>/)?.[0], 'val') || defaultParaStyleId;
    const styled = resolveStyleChain(pStyleId, styles);

    const paraSp = readParaSpacing(pPr).spacing;
    const effSpacing = paraSp ?? styled.spacing ?? defaults.spacing;

    let paraLen = 0;
    const runRe = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g;
    let rm;
    while ((rm = runRe.exec(para))) {
      const runXml = rm[1];
      const text = [...runXml.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map(x => x[1]).join('');
      const len = text.replace(/\s/g, '').length;
      if (len === 0) continue;
      paraLen += len;
      const rp = readRunProps(runXml.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0], theme);
      const effFont = rp.font ?? styled.font ?? defaults.font;
      const effSize = rp.size ?? styled.size ?? defaults.size;
      add(fontW, effFont, len);
      add(sizeW, effSize, len);
    }
    if (effSpacing != null) add(spaceW, effSpacing, paraLen);
  }

  const fn = topByWeight(fontW);
  const sz = topByWeight(sizeW);
  const sp = topByWeight(spaceW);
  return {
    fontName:    fn ?? null,
    fontSize:    sz != null ? parseFloat(sz) : null,
    lineSpacing: sp != null ? parseFloat(sp) : null,
  };
}

/* ── Поля страницы ─────────────────────────────────────────────────────── */
function extractMargins(xml) {
  const tag = xml.match(/<w:pgMar\b[^>]*\/?>/)?.[0];
  if (!tag) return null;
  const g = a => { const v = attr(tag, a); return v != null ? toMm(v) : null; };
  return { left: g('left'), right: g('right'), top: g('top'), bottom: g('bottom') };
}

/* ── Параграфы (с сохранением чисел) ──────────────────────────────────── */
function extractParagraphs(xml) {
  const out = [];
  for (const block of xml.split(/<\/w:p>/)) {
    const style = attr(block.match(/<w:pStyle\b[^>]*\/?>/)?.[0], 'val');
    // Обычный текст
    const tParts = [...block.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map(m => m[1]);
    // Результаты полей (номера страниц TOC и т.п.) — внутри <w:instrText> их нет,
    // но отображаемое значение лежит в <w:t> после fldChar; уже учтено выше.
    const text = tParts.join('');
    if (text.trim()) out.push({ text: text.replace(/ /g, ' ').trim(), style: style || null });
  }
  return out;
}

/* ── Разбор оглавления → диапазоны страниц секций ─────────────────────── */
// TOC-строка выглядит как «<Заголовок><номер страницы>» (число в конце).
function parseTocPageMap(paragraphs) {
  const map = {};
  const KEYS = [
    ['intro',        /^введени[ея]\s*\.*\s*(\d+)$/i],
    ['ch1',          /^глава\s*1\b.*?(\d+)$/i],
    ['conclusion',   /^заключени[ея]\s*\.*\s*(\d+)$/i],
    ['bibliography', /^(?:список\s+использованных?\s+источников?|список\s+литературы|библиографический\s+список)\s*\.*\s*(\d+)$/i],
    ['appendix',     /^приложени[ея]\s*\.*\s*(\d+)$/i],
  ];
  for (const p of paragraphs) {
    const t = p.text.replace(/\s+/g, ' ').trim();
    for (const [key, re] of KEYS) {
      if (map[key] != null) continue;
      const m = t.match(re);
      if (m) map[key] = parseInt(m[1]);
    }
  }
  return map;
}

/* ── Нумерация страниц (колонтитулы) ──────────────────────────────────── */
async function checkPageNumbering(zip, docXml) {
  let hasPageNum = false;
  for (const fp of Object.keys(zip.files).filter(f => /^word\/footer\d*\.xml$/i.test(f))) {
    const xml = await zip.file(fp).async('string');
    if (/\bPAGE\b|w:pgNum|fldSimple[^>]*PAGE/i.test(xml)) { hasPageNum = true; break; }
  }
  // нумерация может быть и в колонтитуле документа через fldSimple
  if (!hasPageNum && /<w:fldSimple[^>]*\bPAGE\b/i.test(docXml)) hasPageNum = true;
  const firstPageSeparate = /<w:titlePg\s*\/>/.test(docXml);
  return { hasPageNum, firstPageSeparate };
}

function extractPageCount(appXml) {
  if (!appXml) return null;
  const m = appXml.match(/<Pages>(\d+)<\/Pages>/i);
  return m ? parseInt(m[1]) : null;
}

/* ──────────────────────────────────────────────────────────────────────── */
export async function parseDocx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const docXml    = await zip.file('word/document.xml').async('string');
  const stylesXml = await zip.file('word/styles.xml')?.async('string');
  const themeXml  = await zip.file('word/theme/theme1.xml')?.async('string');
  const appXml    = await zip.file('docProps/app.xml')?.async('string');

  const theme        = parseTheme(themeXml);
  const parsedStyles = parseStyles(stylesXml, theme);

  const paragraphs = extractParagraphs(docXml);
  const fullText   = paragraphs.map(p => p.text).join('\n');

  const formatting = analyzeFormatting(docXml, theme, parsedStyles);
  formatting.margins = extractMargins(docXml);

  const { hasPageNum, firstPageSeparate } = await checkPageNumbering(zip, docXml);
  const tocPages = parseTocPageMap(paragraphs);

  return {
    format: 'docx',
    paragraphs,
    fullText,
    formatting,
    tocPages,
    pageNumbering: { hasPageNum, firstPageSeparate },
    pageCount: extractPageCount(appXml),
  };
}
