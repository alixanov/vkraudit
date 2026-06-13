const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel,
  VerticalAlign, PageBreak
} = require('docx');
const fs = require('fs');

// Цвета
const BLUE_DARK  = '1F3864';
const BLUE_MID   = '2E75B6';
const BLUE_LIGHT = 'D6E4F0';
const BLUE_PALE  = 'EBF3FB';
const GREEN      = '375623';
const GREEN_LIGHT= 'E2EFDA';
const GRAY       = 'F2F2F2';
const WHITE      = 'FFFFFF';

const border = (color = '000000', size = 6) => ({
  top:    { style: BorderStyle.SINGLE, size, color },
  bottom: { style: BorderStyle.SINGLE, size, color },
  left:   { style: BorderStyle.SINGLE, size, color },
  right:  { style: BorderStyle.SINGLE, size, color },
});

const noBorder = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

function cell(text, { bg = WHITE, bold = false, color = '000000', align = AlignmentType.LEFT, w = 2000, colspan = 1, fs = 22, border: b = border('2E75B6', 4), vAlign = VerticalAlign.CENTER } = {}) {
  return new TableCell({
    columnSpan: colspan,
    width: { size: w, type: WidthType.DXA },
    borders: b,
    shading: { fill: bg, type: ShadingType.CLEAR },
    verticalAlign: vAlign,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, size: fs, font: 'Times New Roman' })]
    })]
  });
}

// ══════════════════════════════════════════════════════════════
// ТАБЛИЦА 1 — Система оценивания VKRAudit
// ══════════════════════════════════════════════════════════════

const scoringRows = [
  // Заголовок
  new TableRow({
    tableHeader: true,
    children: [
      cell('Группа критериев', { bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 2400, fs: 24, border: border(BLUE_DARK) }),
      cell('Критерий проверки',{ bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 4500, fs: 24, border: border(BLUE_DARK) }),
      cell('Баллов', { bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 24, border: border(BLUE_DARK) }),
      cell('Максимум', { bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 24, border: border(BLUE_DARK) }),
    ]
  }),
  // Форматирование
  new TableRow({ children: [
    cell('Форматирование', { bg: BLUE_LIGHT, bold: true, color: BLUE_DARK, align: AlignmentType.CENTER, w: 2400, fs: 22 }),
    cell('Шрифт Times New Roman', { bg: BLUE_PALE, w: 4500, fs: 22 }),
    cell('4', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: BLUE_LIGHT, w: 2400, fs: 22 }),
    cell('Размер шрифта 14 пт', { bg: WHITE, w: 4500, fs: 22 }),
    cell('4', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: BLUE_LIGHT, w: 2400, fs: 22 }),
    cell('Межстрочный интервал 1,5', { bg: BLUE_PALE, w: 4500, fs: 22 }),
    cell('4', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: BLUE_LIGHT, w: 2400, fs: 22 }),
    cell('Нумерация страниц', { bg: WHITE, w: 4500, fs: 22 }),
    cell('3', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('15', { bg: BLUE_LIGHT, bold: true, color: BLUE_DARK, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  // Объём
  new TableRow({ children: [
    cell('Объём', { bg: '1F4E79', bold: true, color: WHITE, align: AlignmentType.CENTER, w: 2400, fs: 22 }),
    cell('Общий объём ≥ 70 страниц', { bg: BLUE_PALE, w: 4500, fs: 22 }),
    cell('12', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '1F4E79', w: 2400, fs: 22 }),
    cell('Объём введения > 2 страниц', { bg: WHITE, w: 4500, fs: 22 }),
    cell('4', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '1F4E79', w: 2400, fs: 22 }),
    cell('Объём заключения > 2 страниц', { bg: BLUE_PALE, w: 4500, fs: 22 }),
    cell('4', { bg: BLUE_PALE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('20', { bg: BLUE_LIGHT, bold: true, color: BLUE_DARK, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  // Структура
  new TableRow({ children: [
    cell('Структура', { bg: '375623', bold: true, color: WHITE, align: AlignmentType.CENTER, w: 2400, fs: 22 }),
    cell('Оглавление', { bg: GREEN_LIGHT, w: 4500, fs: 22 }),
    cell('5', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '375623', w: 2400, fs: 22 }),
    cell('Введение (раздел)', { bg: WHITE, w: 4500, fs: 22 }),
    cell('4', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '375623', w: 2400, fs: 22 }),
    cell('Глава 1 с подразделами', { bg: GREEN_LIGHT, w: 4500, fs: 22 }),
    cell('9', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '375623', w: 2400, fs: 22 }),
    cell('Глава 2 с подразделами', { bg: WHITE, w: 4500, fs: 22 }),
    cell('10', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '375623', w: 2400, fs: 22 }),
    cell('Глава 3 с подразделами', { bg: GREEN_LIGHT, w: 4500, fs: 22 }),
    cell('10', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '375623', w: 2400, fs: 22 }),
    cell('Заключение (раздел)', { bg: WHITE, w: 4500, fs: 22 }),
    cell('5', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '375623', w: 2400, fs: 22 }),
    cell('Приложения и библиография', { bg: GREEN_LIGHT, w: 4500, fs: 22 }),
    cell('7', { bg: GREEN_LIGHT, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('50', { bg: GREEN_LIGHT, bold: true, color: GREEN, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  // Анализ содержания
  new TableRow({ children: [
    cell('Анализ содержания', { bg: '7B2D00', bold: true, color: WHITE, align: AlignmentType.CENTER, w: 2400, fs: 22 }),
    cell('Таблицы и рисунки', { bg: 'FDEBD0', w: 4500, fs: 22 }),
    cell('5', { bg: 'FDEBD0', align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: 'FDEBD0', align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '7B2D00', w: 2400, fs: 22 }),
    cell('Выводы по главам', { bg: WHITE, w: 4500, fs: 22 }),
    cell('5', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('', { bg: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  new TableRow({ children: [
    cell('', { bg: '7B2D00', w: 2400, fs: 22 }),
    cell('Ссылки на источники [n]', { bg: 'FDEBD0', w: 4500, fs: 22 }),
    cell('5', { bg: 'FDEBD0', align: AlignmentType.CENTER, w: 1200, fs: 22 }),
    cell('15', { bg: 'FDEBD0', bold: true, color: '7B2D00', align: AlignmentType.CENTER, w: 1200, fs: 22 }),
  ]}),
  // Итого
  new TableRow({ children: [
    cell('ИТОГО', { bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 2400, fs: 24, border: border(BLUE_DARK) }),
    cell('Максимальный суммарный балл', { bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 4500, fs: 24, border: border(BLUE_DARK) }),
    cell('—', { bg: BLUE_DARK, bold: true, color: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 24, border: border(BLUE_DARK) }),
    cell('100', { bg: 'FF0000', bold: true, color: WHITE, align: AlignmentType.CENTER, w: 1200, fs: 28, border: border('FF0000') }),
  ]}),
];

// ══════════════════════════════════════════════════════════════
// ДИАГРАММА — Блок-схема процесса анализа (таблица-схема)
// ══════════════════════════════════════════════════════════════

function flowBox(text, bg = BLUE_MID, color = WHITE, w = 5760) {
  return new Table({
    width: { size: w, type: WidthType.DXA },
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: w, type: WidthType.DXA },
        borders: border(bg, 8),
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 200, right: 200 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, bold: true, color, size: 22, font: 'Times New Roman' })]
        })]
      })
    ]})]
  });
}

function arrow() {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '▼', color: BLUE_MID, size: 28, font: 'Times New Roman' })]
  });
}

function emptyLine() {
  return new Paragraph({ children: [new TextRun({ text: '' })] });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Times New Roman', size: 24 } }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1134, bottom: 1134, left: 1701, right: 850 }
      }
    },
    children: [

      // ── ЗАГОЛОВОК ТАБЛИЦЫ ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({
          text: 'Таблица 1 — Система оценивания дипломных работ в системе VKRAudit',
          bold: true, size: 26, font: 'Times New Roman'
        })]
      }),

      new Table({
        width: { size: 9300, type: WidthType.DXA },
        rows: scoringRows
      }),

      emptyLine(),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({
          text: 'Примечание: итоговая оценка определяется как: ≥ 90 баллов — «5 (отлично)»; ≥ 70 баллов — «4 (хорошо)»; ≥ 60 баллов — «3 (удовлетворительно)»; < 60 баллов — «2 (неудовлетворительно)».',
          size: 20, italics: true, font: 'Times New Roman'
        })]
      }),

      // ── РАЗРЫВ СТРАНИЦЫ ──
      new Paragraph({ children: [new PageBreak()] }),

      // ── ЗАГОЛОВОК ДИАГРАММЫ ──
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 300 },
        children: [new TextRun({
          text: 'Рисунок 1 — Схема процесса автоматизированного анализа документа в системе VKRAudit',
          bold: true, size: 26, font: 'Times New Roman'
        })]
      }),

      // ── БЛОК-СХЕМА ──
      flowBox('НАЧАЛО: пользователь выбирает файл PDF или DOCX', BLUE_DARK, WHITE),
      arrow(),

      flowBox('ЗАГРУЗКА: multer принимает файл в память (лимит 52 МБ)\nПроверка MIME-типа — PDF или DOCX', BLUE_MID, WHITE),
      arrow(),

      flowBox('ПАРСИНГ ДОКУМЕНТА\nDOCX → jszip читает word/document.xml, styles.xml, theme1.xml\nPDF → pdfjs-dist извлекает текст и количество страниц', '1F4E79', WHITE),
      arrow(),

      // Блок проверок — 4 колонки
      new Table({
        width: { size: 9100, type: WidthType.DXA },
        rows: [
          new TableRow({ children: [
            new TableCell({
              width: { size: 2200, type: WidthType.DXA },
              borders: border('375623', 6),
              shading: { fill: GREEN_LIGHT, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'formatting', bold: true, size: 20, color: GREEN, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '.checker.js', size: 20, color: GREEN, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'max 15 баллов', size: 18, color: '555555', font: 'Times New Roman' })] }),
              ]
            }),
            new TableCell({
              width: { size: 2200, type: WidthType.DXA },
              borders: border('1F4E79', 6),
              shading: { fill: BLUE_PALE, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'volume', bold: true, size: 20, color: BLUE_DARK, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '.checker.js', size: 20, color: BLUE_DARK, font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'max 20 баллов', size: 18, color: '555555', font: 'Times New Roman' })] }),
              ]
            }),
            new TableCell({
              width: { size: 2200, type: WidthType.DXA },
              borders: border('7B2D00', 6),
              shading: { fill: 'FDEBD0', type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'structure', bold: true, size: 20, color: '7B2D00', font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '.checker.js', size: 20, color: '7B2D00', font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'max 50 баллов', size: 18, color: '555555', font: 'Times New Roman' })] }),
              ]
            }),
            new TableCell({
              width: { size: 2500, type: WidthType.DXA },
              borders: border('5B2C6F', 6),
              shading: { fill: 'F4ECF7', type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'analysis', bold: true, size: 20, color: '5B2C6F', font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '.checker.js', size: 20, color: '5B2C6F', font: 'Times New Roman' })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'max 15 баллов', size: 18, color: '555555', font: 'Times New Roman' })] }),
              ]
            }),
          ]}),
        ]
      }),
      arrow(),

      flowBox('СУММИРОВАНИЕ: analyzer.js объединяет баллы\ntotalScore (0–100) → gradeFromScore() → оценка', '5B2C6F', WHITE),
      arrow(),

      // Параллельное сохранение
      new Table({
        width: { size: 9100, type: WidthType.DXA },
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            borders: border('196F3D', 6),
            shading: { fill: GREEN_LIGHT, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 150, right: 150 },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tigris S3', bold: true, size: 22, color: GREEN, font: 'Times New Roman' })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'сохранение файла в облако', size: 20, font: 'Times New Roman' })] }),
            ]
          }),
          new TableCell({
            width: { size: 4600, type: WidthType.DXA },
            borders: border(BLUE_MID, 6),
            shading: { fill: BLUE_PALE, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 150, right: 150 },
            children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'MongoDB', bold: true, size: 22, color: BLUE_DARK, font: 'Times New Roman' })] }),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'сохранение результата в results', size: 20, font: 'Times New Roman' })] }),
            ]
          }),
        ]})]
      }),
      arrow(),

      flowBox('ОТВЕТ КЛИЕНТУ: JSON с баллами, оценкой и замечаниями\nReact отображает ResultsDashboard', '196F3D', WHITE),

      emptyLine(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = 'E:\\ВКР_Таблица_и_Диаграмма.docx';
  fs.writeFileSync(out, buf);
  console.log('✅ Файл сохранён:', out);
}).catch(e => { console.error(e); process.exit(1); });
