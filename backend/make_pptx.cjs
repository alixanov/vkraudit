/**
 * Создание презентации дипломной работы VKRAudit
 */
const PptxGenJS = require('pptxgenjs');
const pptx = new PptxGenJS();

// ─── Тема ──────────────────────────────────────────────────────────────
const BG_DARK   = '0D1B2A';
const BG_SLIDE  = '0F2744';
const ACCENT    = '2E9BDA';
const ACCENT2   = '4FC3F7';
const WHITE     = 'FFFFFF';
const GRAY      = 'B0BEC5';
const CARD_BG   = '162E4A';
const GREEN     = '43D98C';
const YELLOW    = 'FFC107';
const RED       = 'EF5350';

pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 in

function slide(title, addContent) {
  const s = pptx.addSlide();
  // Фон
  s.background = { color: BG_DARK };
  // Полоса-акцент слева
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.07, h: 7.5, fill: { color: ACCENT } });
  // Заголовок слайда
  if (title) {
    s.addShape(pptx.ShapeType.rect, { x: 0.2, y: 0.1, w: 12.9, h: 0.65, fill: { color: BG_SLIDE }, line: { color: BG_SLIDE } });
    s.addText(title, {
      x: 0.25, y: 0.12, w: 12.8, h: 0.6,
      fontSize: 22, bold: true, color: ACCENT2, fontFace: 'Calibri', valign: 'middle'
    });
    s.addShape(pptx.ShapeType.line, { x: 0.25, y: 0.8, w: 12.8, h: 0, line: { color: ACCENT, width: 2 } });
  }
  addContent(s);
  return s;
}

function card(s, x, y, w, h, headerText, lines, headerColor) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 }, rectRadius: 0.08 });
  if (headerText) {
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 0.38, fill: { color: headerColor || ACCENT }, line: { color: headerColor || ACCENT }, rectRadius: 0.06 });
    s.addText(headerText, { x, y: y+0.04, w, h: 0.32, fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Calibri' });
  }
  if (lines && lines.length) {
    const txt = lines.map(l => ({ text: l.t || l, options: { bullet: l.b !== false ? { code: '2022' } : undefined, bold: l.bold || false, color: l.color || WHITE, fontSize: l.fs || 11 } }));
    s.addText(txt, { x: x+0.12, y: y+0.44, w: w-0.24, h: h-0.52, fontFace: 'Calibri', valign: 'top' });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// Слайд 1 — ТИТУЛ
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  // Декоративная полоса
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.07, h: 7.5, fill: { color: ACCENT } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 6.8, w: 13.33, h: 0.7, fill: { color: BG_SLIDE }, line: { color: BG_SLIDE } });

  s.addText('Министерство высшего образования, науки и инноваций\nРеспублики Узбекистан\nТашкентский государственный технический университет', {
    x: 0.3, y: 0.2, w: 12.7, h: 0.9,
    fontSize: 11, color: GRAY, align: 'center', fontFace: 'Calibri'
  });

  s.addShape(pptx.ShapeType.line, { x: 1.5, y: 1.15, w: 10.3, h: 0, line: { color: ACCENT, width: 1 } });

  s.addText('ДИПЛОМНАЯ РАБОТА', {
    x: 0.3, y: 1.25, w: 12.7, h: 0.5,
    fontSize: 14, bold: true, color: GRAY, align: 'center', fontFace: 'Calibri'
  });

  s.addText('VKRAudit', {
    x: 0.3, y: 1.75, w: 12.7, h: 1.2,
    fontSize: 56, bold: true, color: ACCENT2, align: 'center', fontFace: 'Calibri'
  });

  s.addText('Система автоматизированной проверки дипломных работ\nна соответствие стандартам ГОСТ Р 7.0.11-2024', {
    x: 0.3, y: 2.9, w: 12.7, h: 0.8,
    fontSize: 18, color: WHITE, align: 'center', fontFace: 'Calibri', italic: true
  });

  s.addShape(pptx.ShapeType.line, { x: 1.5, y: 3.8, w: 10.3, h: 0, line: { color: ACCENT, width: 1 } });

  s.addText('Студент:  Алихонов Шукурулло\nНаучный руководитель:  ___________________', {
    x: 0.3, y: 3.95, w: 12.7, h: 0.7,
    fontSize: 13, color: GRAY, align: 'center', fontFace: 'Calibri'
  });

  s.addText('Ташкент — 2025', {
    x: 0.3, y: 6.9, w: 12.7, h: 0.45,
    fontSize: 12, color: GRAY, align: 'center', fontFace: 'Calibri'
  });
}

// ══════════════════════════════════════════════════════════════════════════
// Слайд 2 — ПЛАН РАБОТЫ
// ══════════════════════════════════════════════════════════════════════════
slide('ПЛАН РАБОТЫ', s => {
  const items = [
    { num: '01', label: 'Введение', sub: 'Актуальность, цель, задачи, объект и предмет исследования' },
    { num: '02', label: 'Письменная часть', sub: 'Обзор литературы, анализ требований, архитектура системы' },
    { num: '03', label: 'Программная часть', sub: 'Технологический стек, модули системы, база данных' },
    { num: '04', label: 'Реализация продукта', sub: 'Интерфейс, алгоритмы проверки, результаты тестирования' },
    { num: '05', label: 'Выводы', sub: 'Достигнутые результаты и направления развития' },
  ];
  items.forEach((item, i) => {
    const y = 1.0 + i * 1.1;
    s.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 12.5, h: 0.9, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 }, rectRadius: 0.07 });
    s.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 0.7, h: 0.9, fill: { color: ACCENT }, line: { color: ACCENT } });
    s.addText(item.num, { x: 0.4, y: y+0.05, w: 0.7, h: 0.8, fontSize: 22, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    s.addText(item.label, { x: 1.25, y: y+0.08, w: 6, h: 0.35, fontSize: 15, bold: true, color: ACCENT2, fontFace: 'Calibri' });
    s.addText(item.sub, { x: 1.25, y: y+0.46, w: 11.4, h: 0.3, fontSize: 11, color: GRAY, fontFace: 'Calibri' });
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 3 — ВВЕДЕНИЕ: Актуальность
// ══════════════════════════════════════════════════════════════════════════
slide('01 | ВВЕДЕНИЕ — Актуальность', s => {
  s.addText('Проблема', { x: 0.3, y: 0.92, w: 12.5, h: 0.4, fontSize: 16, bold: true, color: ACCENT2, fontFace: 'Calibri' });

  const problems = [
    'Ежегодно тысячи студентов защищают дипломные работы, но ручная проверка оформления занимает значительное время преподавателей',
    'Ошибки в оформлении (шрифт, межстрочный интервал, структура) выявляются только на стадии защиты',
    'Отсутствуют доступные инструменты автоматизированной проверки по ГОСТ Р 7.0.11-2024',
  ];
  problems.forEach((p, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.38 + i*0.9, w: 12.5, h: 0.75, fill: { color: CARD_BG }, line: { color: RED, width: 1 }, rectRadius: 0.06 });
    s.addShape(pptx.ShapeType.ellipse, { x: 0.45, y: 1.53 + i*0.9, w: 0.32, h: 0.32, fill: { color: RED }, line: { color: RED } });
    s.addText('!', { x: 0.45, y: 1.52 + i*0.9, w: 0.32, h: 0.33, fontSize: 16, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    s.addText(p, { x: 0.9, y: 1.44 + i*0.9, w: 11.8, h: 0.6, fontSize: 12, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 4.2, w: 12.5, h: 0.95, fill: { color: '0A3320' }, line: { color: GREEN, width: 2 }, rectRadius: 0.08 });
  s.addText('✓  Решение:', { x: 0.5, y: 4.28, w: 2.5, h: 0.35, fontSize: 13, bold: true, color: GREEN, fontFace: 'Calibri' });
  s.addText('Разработка веб-приложения VKRAudit — сервиса автоматизированной проверки дипломных работ\nна соответствие ГОСТ Р 7.0.11-2024 с мгновенной обратной связью для студентов и преподавателей', {
    x: 0.5, y: 4.62, w: 12.1, h: 0.5, fontSize: 12, color: WHITE, fontFace: 'Calibri'
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 4 — ВВЕДЕНИЕ: Цель и задачи
// ══════════════════════════════════════════════════════════════════════════
slide('01 | ВВЕДЕНИЕ — Цель и задачи', s => {
  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 0.92, w: 12.5, h: 0.85, fill: { color: '0A2E4A' }, line: { color: ACCENT2, width: 2 }, rectRadius: 0.08 });
  s.addText('ЦЕЛЬ:', { x: 0.55, y: 0.98, w: 1.2, h: 0.35, fontSize: 13, bold: true, color: ACCENT2, fontFace: 'Calibri' });
  s.addText('Разработать веб-систему автоматизированной проверки дипломных работ на соответствие\nтребованиям ГОСТ Р 7.0.11-2024', {
    x: 1.75, y: 0.95, w: 10.8, h: 0.72, fontSize: 12.5, color: WHITE, fontFace: 'Calibri', valign: 'middle'
  });

  s.addText('ЗАДАЧИ:', { x: 0.35, y: 1.9, w: 3, h: 0.35, fontSize: 14, bold: true, color: ACCENT2, fontFace: 'Calibri' });

  const tasks = [
    'Изучить требования ГОСТ Р 7.0.11-2024 к оформлению дипломных работ',
    'Разработать алгоритмы автоматизированной проверки форматирования, структуры, объёма и содержания',
    'Реализовать серверную часть (Node.js/Express) с модульной системой проверщиков',
    'Разработать клиентскую SPA-часть (React 19) с отображением детальных результатов',
    'Обеспечить облачное хранение файлов (Tigris S3) и базу данных (MongoDB)',
    'Развернуть систему на платформе Railway',
  ];

  tasks.forEach((t, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.35, y: 2.32 + i*0.8, w: 12.55, h: 0.66, fill: { color: CARD_BG }, line: { color: BG_SLIDE }, rectRadius: 0.06 });
    s.addShape(pptx.ShapeType.rect, { x: 0.35, y: 2.32 + i*0.8, w: 0.45, h: 0.66, fill: { color: ACCENT }, line: { color: ACCENT } });
    s.addText(String(i+1), { x: 0.35, y: 2.34 + i*0.8, w: 0.45, h: 0.6, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    s.addText(t, { x: 0.9, y: 2.36 + i*0.8, w: 11.85, h: 0.55, fontSize: 11.5, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
  });

  // Объект / Предмет
  s.addText('Объект: процесс проверки оформления дипломных работ     |     Предмет: методы автоматизированного анализа документов', {
    x: 0.3, y: 7.1, w: 12.7, h: 0.3, fontSize: 10, color: GRAY, align: 'center', fontFace: 'Calibri'
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 5 — ПИСЬМЕННАЯ ЧАСТЬ: Обзор
// ══════════════════════════════════════════════════════════════════════════
slide('02 | ПИСЬМЕННАЯ ЧАСТЬ — Структура работы', s => {
  const chapters = [
    { n: 'Глава 1', title: 'Анализ предметной области', items: ['Требования ГОСТ Р 7.0.11-2024', 'Обзор существующих систем проверки', 'Анализ технологий разработки', 'Обоснование выбора стека'], color: ACCENT },
    { n: 'Глава 2', title: 'Проектирование системы', items: ['Функциональные требования', 'Архитектура клиент-сервер', 'Структура базы данных', 'Алгоритмы проверки'], color: '8B5CF6' },
    { n: 'Глава 3', title: 'Реализация системы', items: ['Серверные модули (checkers)', 'Клиентские компоненты (React)', 'Интеграция хранилища Tigris', 'Деплой на Railway'], color: GREEN },
  ];
  chapters.forEach((ch, i) => {
    const x = 0.3 + i * 4.35;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 0.95, w: 4.1, h: 5.7, fill: { color: CARD_BG }, line: { color: ch.color, width: 2 }, rectRadius: 0.1 });
    s.addShape(pptx.ShapeType.roundRect, { x, y: 0.95, w: 4.1, h: 0.65, fill: { color: ch.color }, line: { color: ch.color }, rectRadius: 0.08 });
    s.addText(ch.n, { x, y: 0.97, w: 4.1, h: 0.3, fontSize: 11, bold: true, color: WHITE, align: 'center', fontFace: 'Calibri' });
    s.addText(ch.title, { x: x+0.1, y: 1.27, w: 3.9, h: 0.3, fontSize: 11, color: WHITE, align: 'center', fontFace: 'Calibri', bold: true });
    ch.items.forEach((item, j) => {
      s.addShape(pptx.ShapeType.roundRect, { x: x+0.15, y: 1.78 + j*1.08, w: 3.8, h: 0.88, fill: { color: BG_DARK }, line: { color: ch.color, width: 1 }, rectRadius: 0.06 });
      s.addText(item, { x: x+0.25, y: 1.83 + j*1.08, w: 3.6, h: 0.76, fontSize: 11, color: WHITE, fontFace: 'Calibri', valign: 'middle', align: 'center' });
    });
  });
  s.addText('Общий объём письменной части: не менее 70 страниц  •  Список литературы: не менее 20 источников', {
    x: 0.3, y: 6.9, w: 12.7, h: 0.35, fontSize: 10, color: GRAY, align: 'center', fontFace: 'Calibri'
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 6 — ПРОГРАММНАЯ ЧАСТЬ: Стек
// ══════════════════════════════════════════════════════════════════════════
slide('03 | ПРОГРАММНАЯ ЧАСТЬ — Технологический стек', s => {
  const cols = [
    { title: 'Фронтенд', color: '0288D1', items: ['React.js 19', 'MUI 7', 'styled-components 6', 'framer-motion 12', 'React Router 7', 'PDF.js / html2canvas'] },
    { title: 'Бэкенд', color: '00897B', items: ['Node.js 20 LTS', 'Express.js 4', 'multer (загрузка)', 'jszip (DOCX-парсер)', 'pdfjs-dist 5 (PDF)', 'dotenv'] },
    { title: 'Хранение данных', color: '7B1FA2', items: ['MongoDB 7', 'Нативный драйвер mongodb', 'Коллекция results', 'Tigris S3', '@aws-sdk/client-s3', 'Бакет vkr-audit-files'] },
    { title: 'Инфраструктура', color: 'E64A19', items: ['Railway (деплой)', '2 сервиса: backend + frontend', 'serve (статика)', 'CORS-whitelist', 'railway.json конфиг', 'Node.js ≥ 20.0.0'] },
  ];
  cols.forEach((col, i) => {
    const x = 0.25 + i * 3.22;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 0.95, w: 3.05, h: 5.9, fill: { color: CARD_BG }, line: { color: col.color, width: 1.5 }, rectRadius: 0.1 });
    s.addShape(pptx.ShapeType.roundRect, { x, y: 0.95, w: 3.05, h: 0.55, fill: { color: col.color }, line: { color: col.color }, rectRadius: 0.08 });
    s.addText(col.title, { x, y: 0.98, w: 3.05, h: 0.45, fontSize: 13, bold: true, color: WHITE, align: 'center', fontFace: 'Calibri' });
    col.items.forEach((item, j) => {
      s.addShape(pptx.ShapeType.roundRect, { x: x+0.12, y: 1.63 + j*0.74, w: 2.81, h: 0.58, fill: { color: BG_DARK }, line: { color: col.color, width: 1 }, rectRadius: 0.05 });
      s.addText(item, { x: x+0.18, y: 1.66 + j*0.74, w: 2.69, h: 0.5, fontSize: 11, color: WHITE, fontFace: 'Calibri', valign: 'middle', align: 'center' });
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 7 — ПРОГРАММНАЯ ЧАСТЬ: Архитектура
// ══════════════════════════════════════════════════════════════════════════
slide('03 | ПРОГРАММНАЯ ЧАСТЬ — Архитектура системы', s => {

  // Клиент
  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.0, w: 3.5, h: 5.5, fill: { color: '0A2E4A' }, line: { color: ACCENT, width: 2 }, rectRadius: 0.1 });
  s.addText('КЛИЕНТ\nReact SPA', { x: 0.3, y: 1.05, w: 3.5, h: 0.6, fontSize: 13, bold: true, color: ACCENT2, align: 'center', fontFace: 'Calibri' });
  ['Uploader.jsx', 'ResultsDashboard.jsx', 'RequirementsList.jsx', 'FeedbackCard.jsx', 'ReportDownloader.jsx', 'Тема / Язык (RU/UZ)'].forEach((c, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.48, y: 1.77 + i*0.72, w: 3.15, h: 0.56, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 }, rectRadius: 0.05 });
    s.addText(c, { x: 0.5, y: 1.8 + i*0.72, w: 3.1, h: 0.5, fontSize: 10, color: WHITE, fontFace: 'Calibri', align: 'center', valign: 'middle' });
  });

  // Стрелки HTTP
  s.addShape(pptx.ShapeType.line, { x: 3.8, y: 2.8, w: 1.2, h: 0, line: { color: YELLOW, width: 2 } });
  s.addText('POST /api/check', { x: 3.72, y: 2.5, w: 1.4, h: 0.25, fontSize: 9, color: YELLOW, align: 'center', fontFace: 'Calibri' });
  s.addShape(pptx.ShapeType.line, { x: 3.8, y: 3.5, w: 1.2, h: 0, line: { color: GREEN, width: 2 } });
  s.addText('JSON ответ', { x: 3.72, y: 3.6, w: 1.4, h: 0.25, fontSize: 9, color: GREEN, align: 'center', fontFace: 'Calibri' });

  // Сервер
  s.addShape(pptx.ShapeType.roundRect, { x: 5.0, y: 1.0, w: 3.6, h: 5.5, fill: { color: '0A3320' }, line: { color: GREEN, width: 2 }, rectRadius: 0.1 });
  s.addText('СЕРВЕР\nNode.js / Express', { x: 5.0, y: 1.05, w: 3.6, h: 0.6, fontSize: 13, bold: true, color: GREEN, align: 'center', fontFace: 'Calibri' });
  const serverMods = ['server.js (multer, CORS)', 'analyzer.js', 'docx.parser.js', 'pdf.parser.js', 'checkers/ (5 модулей)', 'storage/tigris.js'];
  serverMods.forEach((m, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 5.18, y: 1.77 + i*0.72, w: 3.25, h: 0.56, fill: { color: CARD_BG }, line: { color: GREEN, width: 1 }, rectRadius: 0.05 });
    s.addText(m, { x: 5.2, y: 1.8 + i*0.72, w: 3.2, h: 0.5, fontSize: 10, color: WHITE, fontFace: 'Calibri', align: 'center', valign: 'middle' });
  });

  // Стрелки к данным
  s.addShape(pptx.ShapeType.line, { x: 8.6, y: 2.5, w: 1.0, h: 0, line: { color: GRAY, width: 2 } });
  s.addShape(pptx.ShapeType.line, { x: 8.6, y: 4.3, w: 1.0, h: 0, line: { color: GRAY, width: 2 } });

  // MongoDB
  s.addShape(pptx.ShapeType.roundRect, { x: 9.6, y: 1.0, w: 3.5, h: 2.5, fill: { color: '1A0A3A' }, line: { color: '8B5CF6', width: 2 }, rectRadius: 0.1 });
  s.addText('MongoDB\nvkraudit.results', { x: 9.6, y: 1.05, w: 3.5, h: 0.65, fontSize: 12, bold: true, color: '8B5CF6', align: 'center', fontFace: 'Calibri' });
  ['fileName, fileKey', 'fileUrl, mimeType', 'result (scores)', 'checkedAt'].forEach((f, i) => {
    s.addText('• ' + f, { x: 9.75, y: 1.78 + i*0.38, w: 3.2, h: 0.34, fontSize: 10.5, color: WHITE, fontFace: 'Calibri' });
  });

  // Tigris
  s.addShape(pptx.ShapeType.roundRect, { x: 9.6, y: 3.9, w: 3.5, h: 2.6, fill: { color: '2A1500' }, line: { color: YELLOW, width: 2 }, rectRadius: 0.1 });
  s.addText('Tigris S3\nvkr-audit-files', { x: 9.6, y: 3.95, w: 3.5, h: 0.65, fontSize: 12, bold: true, color: YELLOW, align: 'center', fontFace: 'Calibri' });
  ['PutObjectCommand', '@aws-sdk/client-s3', 'Ключ: uploads/{ts}_{uuid}', 'PDF + DOCX файлы'].forEach((f, i) => {
    s.addText('• ' + f, { x: 9.75, y: 4.68 + i*0.38, w: 3.2, h: 0.34, fontSize: 10.5, color: WHITE, fontFace: 'Calibri' });
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 8 — ПРОГРАММНАЯ ЧАСТЬ: Модули проверки
// ══════════════════════════════════════════════════════════════════════════
slide('03 | ПРОГРАММНАЯ ЧАСТЬ — Модули проверки (checkers)', s => {
  const checkers = [
    { name: 'formatting.checker.js', color: ACCENT, pts: 'max 15 баллов',
      items: ['Шрифт Times New Roman — 4 балла', 'Размер 14 пт — 4 балла', 'Интервал 1,5 — 4 балла', 'Нумерация страниц — 3 балла'] },
    { name: 'volume.checker.js', color: GREEN, pts: 'max 20 баллов',
      items: ['Объём ≥ 70 стр. — 12 баллов', 'Введение > 2 стр. — 4 балла', 'Заключение > 2 стр. — 4 балла', 'Подсчёт через docProps/app.xml'] },
    { name: 'structure.checker.js', color: YELLOW, pts: 'max 50 баллов',
      items: ['Оглавление (5), Введение (4)', 'Три главы с подразделами', 'Заключение (5)', 'Приложения (7) + Библиография (5)'] },
    { name: 'analysis.checker.js', color: '8B5CF6', pts: 'max 15 баллов',
      items: ['Таблицы/рисунки — 5 баллов', 'Выводы по главам — 5 баллов', 'Ссылки [n] — 5 баллов', 'Поиск по ключевым словам'] },
    { name: 'bibliography.checker.js', color: RED, pts: 'отключён (0)',
      items: ['Модуль временно отключён', 'Возвращает пустой results', 'Запланирован к реализации', 'в следующей версии'] },
  ];

  // Итоговая шкала
  s.addShape(pptx.ShapeType.roundRect, { x: 0.25, y: 0.92, w: 12.8, h: 0.52, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 }, rectRadius: 0.06 });
  s.addText('Итог: сумма баллов (0–100) → оценка:  ≥90% → «5 ОТЛИЧНО»  |  ≥70% → «4 ХОРОШО»  |  ≥60% → «3 УДОВЛЕТВОРИТЕЛЬНО»  |  <60% → «2»', {
    x: 0.35, y: 0.96, w: 12.6, h: 0.4, fontSize: 11.5, color: WHITE, fontFace: 'Calibri', align: 'center'
  });

  checkers.forEach((ch, i) => {
    const x = 0.25 + i * 2.58;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.55, w: 2.42, h: 5.3, fill: { color: CARD_BG }, line: { color: ch.color, width: 1.5 }, rectRadius: 0.08 });
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.55, w: 2.42, h: 0.55, fill: { color: ch.color }, line: { color: ch.color }, rectRadius: 0.07 });
    s.addText(ch.pts, { x, y: 1.57, w: 2.42, h: 0.45, fontSize: 12, bold: true, color: WHITE, align: 'center', fontFace: 'Calibri' });
    s.addText(ch.name, { x: x+0.08, y: 2.15, w: 2.26, h: 0.45, fontSize: 10, bold: true, color: ch.color, fontFace: 'Calibri', align: 'center' });
    ch.items.forEach((item, j) => {
      s.addShape(pptx.ShapeType.roundRect, { x: x+0.1, y: 2.67 + j*0.88, w: 2.22, h: 0.75, fill: { color: BG_DARK }, line: { color: ch.color, width: 1 }, rectRadius: 0.05 });
      s.addText(item, { x: x+0.14, y: 2.7 + j*0.88, w: 2.14, h: 0.68, fontSize: 10, color: WHITE, fontFace: 'Calibri', valign: 'middle', align: 'center' });
    });
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 9 — РЕАЛИЗАЦИЯ: Интерфейс
// ══════════════════════════════════════════════════════════════════════════
slide('04 | РЕАЛИЗАЦИЯ — Пользовательский интерфейс', s => {
  // Мокап главной страницы
  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 0.9, w: 5.8, h: 5.8, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1.5 }, rectRadius: 0.1 });
  s.addText('Главная страница', { x: 0.3, y: 0.95, w: 5.8, h: 0.38, fontSize: 12, bold: true, color: ACCENT2, align: 'center', fontFace: 'Calibri' });
  // Мокап upload-зоны
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 1.42, w: 5.2, h: 1.4, fill: { color: BG_DARK }, line: { color: ACCENT, width: 1 }, rectRadius: 0.08 });
  s.addText('📂  Перетащите файл сюда\nили нажмите для выбора\nPDF, DOCX • до 50 МБ', {
    x: 0.65, y: 1.48, w: 5.1, h: 1.25, fontSize: 10.5, color: ACCENT2, align: 'center', fontFace: 'Calibri'
  });
  // Кнопка
  s.addShape(pptx.ShapeType.roundRect, { x: 1.6, y: 2.98, w: 3.2, h: 0.5, fill: { color: ACCENT }, line: { color: ACCENT }, rectRadius: 0.1 });
  s.addText('Проверить работу →', { x: 1.6, y: 2.98, w: 3.2, h: 0.5, fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Calibri' });
  // Переключатели
  s.addText('🌙 Тёмная тема   •   RU / UZ', { x: 0.6, y: 3.62, w: 5.2, h: 0.3, fontSize: 10, color: GRAY, align: 'center', fontFace: 'Calibri' });
  // История
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 4.02, w: 5.2, h: 0.42, fill: { color: BG_DARK }, line: { color: GRAY, width: 1 }, rectRadius: 0.05 });
  s.addText('История проверок (GET /api/results)', { x: 0.65, y: 4.05, w: 5.1, h: 0.35, fontSize: 10, color: GRAY, align: 'center', fontFace: 'Calibri' });
  // Имитация карточки результата
  s.addShape(pptx.ShapeType.roundRect, { x: 0.6, y: 4.57, w: 5.2, h: 1.8, fill: { color: BG_DARK }, line: { color: GREEN, width: 1 }, rectRadius: 0.06 });
  s.addText('diploma.docx  •  92/100  •  ★ ОТЛИЧНО', { x: 0.7, y: 4.63, w: 5.0, h: 0.3, fontSize: 10.5, color: GREEN, fontFace: 'Calibri', bold: true });
  s.addText('Форматирование: 13/15   Объём: 18/20\nСтруктура: 46/50         Анализ: 15/15', { x: 0.7, y: 5.0, w: 5.0, h: 0.65, fontSize: 10, color: WHITE, fontFace: 'Calibri' });
  s.addText('📋 Скачать отчёт PDF', { x: 0.7, y: 5.75, w: 5.0, h: 0.5, fontSize: 10.5, color: ACCENT2, fontFace: 'Calibri' });

  // Описание справа
  const features = [
    { title: 'Загрузка файла', desc: 'Drag-and-drop зона. Поддержка PDF и DOCX до 50 МБ. Валидация типа и размера на клиенте и сервере.' },
    { title: 'Результаты анализа', desc: 'Итоговый балл (0–100), текстовая оценка, детализация по каждому из 17 критериев, список замечаний с рекомендациями.' },
    { title: 'Тема и язык', desc: 'Переключение тёмной/светлой темы. Интерфейс на русском и узбекском языках через React Context.' },
    { title: 'Скачать отчёт', desc: 'Экспорт PDF-отчёта с помощью jsPDF и html2canvas прямо в браузере.' },
  ];
  features.forEach((f, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 6.35, y: 0.93 + i*1.6, w: 6.65, h: 1.45, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 }, rectRadius: 0.08 });
    s.addText(f.title, { x: 6.55, y: 0.97 + i*1.6, w: 6.35, h: 0.38, fontSize: 13, bold: true, color: ACCENT2, fontFace: 'Calibri' });
    s.addText(f.desc, { x: 6.55, y: 1.38 + i*1.6, w: 6.35, h: 0.85, fontSize: 11, color: WHITE, fontFace: 'Calibri' });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 6.35, y: 7.33, w: 6.65, h: 0.0, fill: { color: CARD_BG }, line: { color: ACCENT, width: 0 }, rectRadius: 0.0 });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 10 — РЕАЛИЗАЦИЯ: Алгоритм анализа
// ══════════════════════════════════════════════════════════════════════════
slide('04 | РЕАЛИЗАЦИЯ — Алгоритм анализа документа', s => {

  const steps = [
    { n: '1', label: 'Загрузка', detail: 'multer принимает файл\n(memoryStorage, ≤52 МБ)\nОпределение MIME-типа', color: ACCENT },
    { n: '2', label: 'Парсинг', detail: 'DOCX → jszip\n(OOXML → параграфы)\nPDF → pdfjs-dist', color: '0288D1' },
    { n: '3', label: 'Проверки', detail: 'formatting / volume /\nstructure / analysis /\nbibliography', color: '8B5CF6' },
    { n: '4', label: 'Суммирование', detail: 'analyzer.js объединяет\nscores, totalScore,\ngrade, issues', color: YELLOW },
    { n: '5', label: 'Сохранение', detail: 'Tigris S3 (файл)\nMongoDB results\n(ошибки не блокируют)', color: GREEN },
    { n: '6', label: 'Ответ', detail: 'JSON → клиент\nReact рендерит\nResultsDashboard', color: RED },
  ];

  steps.forEach((st, i) => {
    const x = 0.25 + i * 2.17;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 1.1, w: 1.9, h: 1.9, fill: { color: st.color }, line: { color: st.color }, rectRadius: 0.12 });
    s.addText(st.n, { x, y: 1.18, w: 1.9, h: 0.55, fontSize: 26, bold: true, color: WHITE, align: 'center', fontFace: 'Calibri' });
    s.addText(st.label, { x, y: 1.73, w: 1.9, h: 0.4, fontSize: 12, bold: true, color: WHITE, align: 'center', fontFace: 'Calibri' });
    s.addText(st.detail, { x, y: 2.2, w: 1.9, h: 0.72, fontSize: 9.5, color: WHITE, align: 'center', fontFace: 'Calibri' });
    if (i < 5) {
      s.addShape(pptx.ShapeType.line, { x: x+1.9, y: 2.0, w: 0.27, h: 0, line: { color: GRAY, width: 2 } });
    }
  });

  // Детали
  const details = [
    { title: 'profile.json', body: 'Конфигурационный файл с эталонными значениями:\nfont: Times New Roman, size: 14, lineSpacing: 1.5\nvolume: totalMin: 70, bibliography: minSources: 20' },
    { title: 'DOCX-парсер', body: 'Разбирает OOXML без сторонних XML-парсеров\nИзвлекает форматирование параграфов с учётом наследования стилей\nЧитает styles.xml + theme1.xml + docProps/app.xml + footer*.xml' },
    { title: 'Структурный анализ', body: 'SECTION — объект с массивами regex-шаблонов\nhasSection() — проверка наличия раздела\ncountSubchapters() — подсчёт «N.1», «N.2», ...' },
    { title: 'Система баллов', body: 'Структура (max 50) + Объём (max 20) +\nФорматирование (max 15) + Анализ (max 15) = 100\nОценка выводится через gradeFromScore()' },
  ];

  details.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.25 + col * 6.55;
    const y = 3.3 + row * 1.85;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 6.3, h: 1.65, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 }, rectRadius: 0.08 });
    s.addText(d.title, { x: x+0.15, y: y+0.08, w: 6.0, h: 0.35, fontSize: 12, bold: true, color: ACCENT2, fontFace: 'Calibri' });
    s.addText(d.body, { x: x+0.15, y: y+0.48, w: 6.0, h: 1.05, fontSize: 10.5, color: WHITE, fontFace: 'Calibri' });
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 11 — РЕАЛИЗАЦИЯ: Тестирование
// ══════════════════════════════════════════════════════════════════════════
slide('04 | РЕАЛИЗАЦИЯ — Результаты тестирования', s => {

  // Таблица тестов
  const headers = ['Тест', 'Вход', 'Ожидаемый результат', 'Статус'];
  const rows = [
    ['DOCX, Times New Roman 14 пт, 1.5', 'Корректный DOCX', 'fontTotal = 15/15', '✓'],
    ['DOCX, Arial 12 пт, интервал 1.0', 'DOCX с нарушениями', 'fontTotal < 10/15', '✓'],
    ['PDF, 80 страниц', 'Корректный PDF', 'volumeTotal = 12/20', '✓'],
    ['DOCX, < 70 страниц', 'DOCX малого объёма', 'volumeTotal < 12', '✓'],
    ['Все обязательные разделы', 'Полная структура', 'structureTotal ≥ 45', '✓'],
    ['Нет введения', 'DOCX без введения', 'Замечание в issues[]', '✓'],
    ['Файл .txt', 'Неподдерж. формат', 'HTTP 400 от сервера', '✓'],
    ['Файл 60 МБ', 'Превышение лимита', 'multer отклоняет', '✓'],
  ];

  const colW = [3.4, 2.6, 3.5, 1.1];
  const colX = [0.25, 3.65, 6.25, 9.75];
  const rowH = 0.52;

  // Заголовок таблицы
  headers.forEach((h, ci) => {
    s.addShape(pptx.ShapeType.rect, { x: colX[ci], y: 0.93, w: colW[ci], h: 0.5, fill: { color: ACCENT }, line: { color: ACCENT } });
    s.addText(h, { x: colX[ci]+0.05, y: 0.95, w: colW[ci]-0.1, h: 0.44, fontSize: 11.5, bold: true, color: WHITE, fontFace: 'Calibri', valign: 'middle', align: 'center' });
  });

  rows.forEach((row, ri) => {
    const y = 1.43 + ri * rowH;
    const bg = ri % 2 === 0 ? CARD_BG : BG_DARK;
    row.forEach((cell, ci) => {
      s.addShape(pptx.ShapeType.rect, { x: colX[ci], y, w: colW[ci], h: rowH - 0.04, fill: { color: bg }, line: { color: '1E3A5F', width: 0.5 } });
      s.addText(cell, {
        x: colX[ci]+0.08, y: y+0.04, w: colW[ci]-0.16, h: rowH-0.12,
        fontSize: ci === 3 ? 14 : 10.5,
        color: ci === 3 ? GREEN : WHITE,
        bold: ci === 3,
        fontFace: 'Calibri',
        valign: 'middle',
        align: ci === 3 ? 'center' : 'left'
      });
    });
  });

  s.addText('Все 8 тестовых сценариев пройдены успешно. Система корректно обрабатывает допустимые и граничные входные данные.', {
    x: 0.25, y: 5.65, w: 12.8, h: 0.35, fontSize: 11, color: GRAY, fontFace: 'Calibri', align: 'center'
  });

  // Деплой
  s.addShape(pptx.ShapeType.roundRect, { x: 0.25, y: 6.05, w: 12.8, h: 1.25, fill: { color: CARD_BG }, line: { color: YELLOW, width: 1.5 }, rectRadius: 0.08 });
  s.addText('Деплой на Railway', { x: 0.45, y: 6.1, w: 4, h: 0.38, fontSize: 13, bold: true, color: YELLOW, fontFace: 'Calibri' });
  s.addText('Бэкенд:  npm start → node server.js  •  Healthcheck: GET /health\nФронтенд:  npm run build → npx serve -s build -l $PORT\nCORS:  разрешены localhost + *.railway.app', {
    x: 0.45, y: 6.5, w: 12.4, h: 0.72, fontSize: 11, color: WHITE, fontFace: 'Calibri'
  });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 12 — ВЫВОДЫ
// ══════════════════════════════════════════════════════════════════════════
slide('05 | ВЫВОДЫ', s => {
  s.addText('Результаты выполненной работы', {
    x: 0.3, y: 0.92, w: 12.5, h: 0.4, fontSize: 15, bold: true, color: ACCENT2, fontFace: 'Calibri'
  });

  const results = [
    { icon: '✓', text: 'Разработана веб-система VKRAudit для автоматизированной проверки дипломных работ на соответствие ГОСТ Р 7.0.11-2024', color: GREEN },
    { icon: '✓', text: 'Реализованы 4 модуля проверки: форматирование (15 б.), объём (20 б.), структура (50 б.), анализ содержания (15 б.)', color: GREEN },
    { icon: '✓', text: 'Создан REST API на Node.js/Express с поддержкой форматов PDF и DOCX, лимитом 50 МБ', color: GREEN },
    { icon: '✓', text: 'Реализован React SPA с тёмной темой, двуязычным интерфейсом (RU/UZ) и экспортом отчёта в PDF', color: GREEN },
    { icon: '✓', text: 'Обеспечено облачное хранение файлов (Tigris S3) и результатов (MongoDB); система задеплоена на Railway', color: GREEN },
  ];

  results.forEach((r, i) => {
    s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 1.45 + i*0.88, w: 12.5, h: 0.73, fill: { color: CARD_BG }, line: { color: GREEN, width: 1 }, rectRadius: 0.07 });
    s.addText(r.icon, { x: 0.4, y: 1.5 + i*0.88, w: 0.5, h: 0.6, fontSize: 18, bold: true, color: GREEN, valign: 'middle', align: 'center' });
    s.addText(r.text, { x: 0.95, y: 1.5 + i*0.88, w: 11.7, h: 0.6, fontSize: 12, color: WHITE, fontFace: 'Calibri', valign: 'middle' });
  });

  s.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 5.95, w: 5.9, h: 1.3, fill: { color: '0A2E4A' }, line: { color: ACCENT, width: 1.5 }, rectRadius: 0.08 });
  s.addText('Направления развития:', { x: 0.5, y: 6.0, w: 5.5, h: 0.32, fontSize: 12, bold: true, color: ACCENT2, fontFace: 'Calibri' });
  s.addText('• Включение модуля библиографии\n• Проверка оригинальности (антиплагиат)\n• Личный кабинет студента', { x: 0.5, y: 6.33, w: 5.5, h: 0.82, fontSize: 11, color: WHITE, fontFace: 'Calibri' });

  s.addShape(pptx.ShapeType.roundRect, { x: 6.5, y: 5.95, w: 6.6, h: 1.3, fill: { color: '0A3320' }, line: { color: GREEN, width: 1.5 }, rectRadius: 0.08 });
  s.addText('Практическая значимость:', { x: 6.7, y: 6.0, w: 6.2, h: 0.32, fontSize: 12, bold: true, color: GREEN, fontFace: 'Calibri' });
  s.addText('• Экономия времени преподавателей на проверку оформления\n• Студент получает обратную связь до сдачи на проверку\n• Готов к использованию: задеплоен на Railway', { x: 6.7, y: 6.33, w: 6.2, h: 0.82, fontSize: 11, color: WHITE, fontFace: 'Calibri' });
});

// ══════════════════════════════════════════════════════════════════════════
// Слайд 13 — ФИНАЛЬНЫЙ
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  s.background = { color: BG_DARK };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.07, h: 7.5, fill: { color: ACCENT } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: BG_DARK }, line: { color: BG_DARK } });

  s.addText('Спасибо за внимание!', {
    x: 0.3, y: 2.0, w: 12.7, h: 1.2, fontSize: 44, bold: true, color: ACCENT2, align: 'center', fontFace: 'Calibri'
  });
  s.addShape(pptx.ShapeType.line, { x: 2.5, y: 3.3, w: 8.3, h: 0, line: { color: ACCENT, width: 2 } });
  s.addText('VKRAudit — система автоматизированной проверки\nдипломных работ на соответствие ГОСТ Р 7.0.11-2024', {
    x: 0.3, y: 3.45, w: 12.7, h: 0.8, fontSize: 16, color: WHITE, align: 'center', fontFace: 'Calibri', italic: true
  });
  s.addText('Готов ответить на вопросы', {
    x: 0.3, y: 4.5, w: 12.7, h: 0.5, fontSize: 18, color: GRAY, align: 'center', fontFace: 'Calibri'
  });
}

// ══════════════════════════════════════════════════════════════════════════
const OUT = 'E:\\ВКР_VKRAudit_Презентация.pptx';
pptx.writeFile({ fileName: OUT }).then(() => {
  console.log('✅ Презентация сохранена:', OUT);
}).catch(e => { console.error(e); process.exit(1); });
