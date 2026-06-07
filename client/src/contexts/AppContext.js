import React, { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext({});

export const LANGS = {
  ru: {
    brand: 'Система оценки выпускных работ',
    navBadge: 'ГОСТ 7.32-2017',
    heroTitle: 'Проверка дипломной работы',
    heroSub: 'Загрузите файл DOCX или PDF — система автоматически оценит соответствие требованиям',
    uploadTitle: 'Загрузите дипломную работу',
    uploadDrag: 'Отпустите файл',
    uploadHint: 'PDF или DOCX · до 50 МБ · перетащите или нажмите',
    uploadedLabel: 'Документ загружен',
    replace: 'Заменить',
    analyzing: 'Анализируем работу...',
    loadSteps: ['Загрузка файла', 'Анализ форматирования', 'Проверка структуры', 'Оценка библиографии', 'Расчёт итогового балла'],
    totalScore: 'Итоговый балл',
    compliance: 'Соответствия',
    catFont: 'Форматирование',
    catVol: 'Объём',
    catStruct: 'Структура',
    catAnalysis: 'Экспертный анализ работы',
    catBib: 'Библиография',
    guideTitle: 'Критерии оценки ВКР',
    guideSub: 'Максимум 100 баллов · ГОСТ Р 7.0.11-2024',
    done: 'Выполнено',
    partial: 'Частично',
    notDone: 'Не выполнено',
    bonus: 'бонус',
    bonusDone: 'Бонус получен',
    bonusNone: 'Не найдено',
    details: 'подробнее',
    grades: ['ОТЛИЧНО', 'ХОРОШО', 'УДОВЛ.', 'НЕУДОВЛ.'],
    step1Label: 'Загрузите файл', step1Hint: 'PDF или DOCX',
    step2Label: 'Анализ',         step2Hint: '~15 секунд',
    step3Label: 'Результат',      step3Hint: 'Детальный отчёт',
    uploadBtn: 'Выбрать файл', uploadOrDrag: 'или перетащите сюда',
    guideFootnote: 'Бонусные баллы (Глава 4) добавляются сверх базовых 81 балла',
    footerLeft:  'Система проверки дипломных работ',
    footerRight: 'ГОСТ Р 7.0.11-2024',
    reqNames: {
      fontTimes: 'Шрифт Times New Roman',
      fontSize: 'Размер шрифта 14 пт',
      lineSpacing: 'Межстрочный интервал 1,5',
      pageNumbers: 'Нумерация страниц',
      volume: 'Общий объём 70–120 стр.',
      intro: 'Введение >2 стр.',
      conclusion: 'Заключение >2 стр.',
      bibliography: 'Список использованных источников (≥20)',
      contents: 'Оглавление',
      introSec: 'Введение',
      ch1: 'Глава 1 (с подразделами ≥2)',
      ch2: 'Глава 2 (с подразделами ≥2)',
      ch3: 'Глава 3 (с подразделами ≥2)',
      ch4: 'Глава 4 (с подразделами ≥2)',
      conclusionSec: 'Заключение',
      appendix: 'Приложения',
      tablesFigures: 'Таблицы и рисунки',
      findings: 'Выводы по главам',
      citations: 'Ссылки на источники',
    },
  },
  uz: {
    brand: 'Bitiruv malakaviy ishlarini baholash tizimi',
    navBadge: 'GOST 7.32-2017',
    heroTitle: 'Diplom ishini tekshirish',
    heroSub: 'DOCX yoki PDF faylni yuklang — tizim talablarga muvofiqligini avtomatik baholaydi',
    uploadTitle: 'Diplom ishini yuklang',
    uploadDrag: 'Faylni qo\'ying',
    uploadHint: 'PDF yoki DOCX · 50 MB gacha · torting yoki bosing',
    uploadedLabel: 'Hujjat yuklandi',
    replace: 'Almashtirish',
    analyzing: 'Ish tahlil qilinmoqda...',
    loadSteps: ['Fayl yuklanmoqda', 'Formatlash tahlili', 'Tuzilma tekshiruvi', 'Bibliografiya baholash', 'Yakuniy ball hisoblash'],
    totalScore: 'Yakuniy ball',
    compliance: 'Muvofiqlik',
    catFont: 'Formatlash',
    catVol: 'Hajm',
    catStruct: 'Tuzilma',
    catAnalysis: 'Ishning ekspert tahlili',
    catBib: 'Bibliografiya',
    guideTitle: 'BMI baholash mezonlari',
    guideSub: 'Maksimum 100 ball · GOST R 7.0.11-2024',
    done: 'Bajarildi',
    partial: 'Qisman',
    notDone: 'Bajarilmadi',
    bonus: 'bonus',
    bonusDone: 'Bonus olindi',
    bonusNone: 'Topilmadi',
    details: 'batafsil',
    grades: ['A\'LO', 'YAXSHI', 'QONIQARLI', 'QONIQARSIZ'],
    step1Label: 'Fayl yuklang',   step1Hint: 'PDF yoki DOCX',
    step2Label: 'Tahlil',         step2Hint: '~15 soniya',
    step3Label: 'Natija',         step3Hint: 'Batafsil hisobot',
    uploadBtn: 'Fayl tanlash', uploadOrDrag: 'yoki bu yerga torting',
    footerLeft:  'Bitiruv ishlarini tekshirish tizimi',
    footerRight: 'GOST R 7.0.11-2024',
    reqNames: {
      fontTimes: 'Times New Roman shrifti',
      fontSize: 'Shrift o\'lchami 14 pt',
      lineSpacing: 'Satrlar oralig\'i 1,5',
      pageNumbers: 'Sahifalar raqamlash',
      volume: 'Umumiy hajm 70–120 bet',
      intro: 'Kirish >2 bet',
      conclusion: 'Xulosa >2 bet',
      bibliography: 'Foydalanilgan adabiyotlar ro\'yxati (≥20)',
      contents: 'Mundarija',
      introSec: 'Kirish',
      ch1: '1-bob (≥2 bo\'lim bilan)',
      ch2: '2-bob (≥2 bo\'lim bilan)',
      ch3: '3-bob (≥2 bo\'lim bilan)',
      ch4: '4-bob (≥2 bo\'lim bilan)',
      conclusionSec: 'Xulosa',
      appendix: 'Ilovalar',
      tablesFigures: 'Jadval va rasmlar',
      findings: 'Boblar bo\'yicha xulosalar',
      citations: 'Manbalarga havolalar',
    },
  },
};

export function AppProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // set on initial render too
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = LANGS[lang];

  return (
    <Ctx.Provider value={{ dark, setDark, lang, setLang, t }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
