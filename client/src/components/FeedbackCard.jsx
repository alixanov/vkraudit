import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import CancelIcon       from '@mui/icons-material/Cancel';
import LightbulbIcon    from '@mui/icons-material/Lightbulb';
import ExpandMoreIcon   from '@mui/icons-material/ExpandMore';
import ExpandLessIcon   from '@mui/icons-material/ExpandLess';
import { useApp }       from '../contexts/AppContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  margin-top: 24px;
  animation: ${fadeUp} 0.5s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
`;

const Title = styled.div`
  font-size: 14px; font-weight: 800; letter-spacing: -0.2px;
  color: var(--text-1);
  display: flex; align-items: center; gap: 8px;
`;

const TitleIcon = styled.div`
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex; align-items: center; justify-content: center;
`;

const ExpandBtn = styled.div`
  cursor: pointer; color: var(--text-5); display: flex;
  transition: color 0.15s;
  &:hover { color: var(--text-3); }
`;

const ScoreLine = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px; margin-bottom: 12px;
  font-size: 12px; color: var(--text-3);
`;

const ScoreBig = styled.span`
  font-size: 17px; font-weight: 900;
  color: ${p =>
    p.$v >= 80 ? '#10B981' :
    p.$v >= 60 ? '#F59E0B' : '#EF4444'};
`;

const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;
  @media(max-width: 560px) { grid-template-columns: 1fr; }
`;

const Col = styled.div`
  background: var(--surface);
  border: 1.5px solid ${p =>
    p.$type === 'pro' ? 'var(--green-border)' :
    p.$type === 'con' ? 'var(--red-border)'   :
                        'var(--yellow-border)'};
  border-radius: 14px; padding: 14px;
`;

const ColHead = styled.div`
  display: flex; align-items: center; gap: 7px; margin-bottom: 10px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase;
  color: ${p =>
    p.$type === 'pro' ? '#10B981' :
    p.$type === 'con' ? '#EF4444' : '#F59E0B'};
`;

const Item = styled.div`
  display: flex; align-items: flex-start; gap: 7px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-2);
  &:last-child { border-bottom: none; padding-bottom: 0; }
  font-size: 11.5px; line-height: 1.55;
  color: var(--text-3);
`;

const Dot = styled.div`
  width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
  background: ${p =>
    p.$type === 'pro' ? '#10B981' :
    p.$type === 'con' ? '#EF4444' : '#F59E0B'};
`;

const TipsCol = styled.div`
  background: var(--surface);
  border: 1.5px solid var(--yellow-border);
  border-radius: 14px; padding: 14px;
`;

function generateFeedback(results) {
  const d = results.details || {};
  const pros = [];
  const cons = [];
  const tips = [];
  const pct = results.totalScore || 0;

  // Форматирование
  if (d.fontTimesScore === 4 && d.fontSize14Score === 4 && d.lineSpacingScore === 4) {
    pros.push('Оформление текста полностью соответствует ГОСТ: Times New Roman 14 пт, интервал 1,5');
  } else {
    if ((d.fontTimesScore ?? 0) < 4)   cons.push('Шрифт не соответствует требованиям (требуется Times New Roman)');
    if ((d.fontSize14Score ?? 0) < 4)  cons.push('Размер шрифта не равен 14 пт');
    if ((d.lineSpacingScore ?? 0) < 4) cons.push('Межстрочный интервал не равен 1,5');
    tips.push('Выделите весь текст (Ctrl+A) → установите Times New Roman, 14 пт, интервал 1,5');
  }

  if (d.pageNumbersScore === 3)
    pros.push('Нумерация страниц расставлена корректно');
  else {
    cons.push('Нумерация страниц не обнаружена');
    tips.push('Вставьте → Номера страниц → Внизу → По центру; включите «Особый колонтитул для первой страницы»');
  }

  // Объём
  const pages = results.meta?.pages;
  if (pages >= 70)
    pros.push(`Объём работы ${pages} стр. — соответствует требованиям (≥70 стр.)`);
  else if (pages)
    cons.push(`Объём работы ${pages} стр. — недостаточен (требуется ≥70 стр.)`);

  if ((d.introScore ?? 0) === 4)
    pros.push('Введение полноценное — более 2 страниц');
  else if ((d.introScore ?? 0) > 0) {
    cons.push('Введение короче нормы (требуется более 2 стр.)');
    tips.push('Расширьте введение: актуальность темы, цель, задачи, объект и предмет исследования, методы');
  } else {
    cons.push('Раздел «ВВЕДЕНИЕ» не обнаружен');
    tips.push('Добавьте раздел «ВВЕДЕНИЕ» с отдельным заголовком');
  }

  if ((d.conclusionScore ?? 0) === 4)
    pros.push('Заключение полноценное — более 2 страниц');
  else if ((d.conclusionScore ?? 0) > 0) {
    cons.push('Заключение короче нормы (требуется более 2 стр.)');
    tips.push('Расширьте заключение: выводы по каждой главе и общий итог исследования');
  } else {
    cons.push('Раздел «ЗАКЛЮЧЕНИЕ» не обнаружен');
    tips.push('Добавьте раздел «ЗАКЛЮЧЕНИЕ» с выводами по всем главам');
  }

  // Структура
  if ((d.contentsScore ?? 0) === 5)
    pros.push('Оглавление с нумерацией страниц присутствует');
  else {
    cons.push('Оглавление не обнаружено');
    tips.push('Создайте автооглавление: Ссылки → Оглавление (все заголовки через стили Heading 1/2/3)');
  }

  const chapters = [
    { score: d.chapter1Score ?? 0, max: 9,  num: 1 },
    { score: d.chapter2Score ?? 0, max: 10, num: 2 },
    { score: d.chapter3Score ?? 0, max: 10, num: 3 },
  ];
  let chaptersOk = 0;
  chapters.forEach(({ score, max, num }) => {
    if (score === max) {
      chaptersOk++;
    } else if (score > 0) {
      cons.push(`Глава ${num} содержит менее 2 подразделов`);
      tips.push(`Добавьте минимум 2 подраздела в Главу ${num}: ${num}.1, ${num}.2`);
    } else {
      cons.push(`Глава ${num} не обнаружена в документе`);
      tips.push(`Добавьте заголовок «Глава ${num}» или «${num}. Название» (стиль Heading 1)`);
    }
  });
  if (chaptersOk === 3)
    pros.push('Все три главы структурированы корректно (≥2 подраздела в каждой)');

  if ((d.conclusionSectionScore ?? 0) === 5)
    pros.push('Раздел «Заключение» структурно выделен отдельным заголовком');

  if ((d.appendixScore ?? 0) > 0)
    pros.push('Приложения включены в работу');
  else {
    cons.push('Раздел «Приложения» отсутствует');
    tips.push('Добавьте приложения: схемы, таблицы, скриншоты, листинги кода');
  }

  // Анализ результата
  if ((d.tablesFiguresScore ?? 0) === 5)
    pros.push('Анализ подкреплён таблицами и рисунками');
  else {
    cons.push('Недостаточно иллюстративного материала (таблицы, рисунки)');
    tips.push('Добавьте таблицы, рисунки и диаграммы для наглядного анализа результатов');
  }

  if ((d.findingsScore ?? 0) === 5)
    pros.push('В работе присутствуют выводы по главам');
  else {
    cons.push('Выводы по главам не обнаружены');
    tips.push('Завершайте каждую главу выводами, обобщающими результаты');
  }

  if ((d.citationsScore ?? 0) === 5)
    pros.push('Текст подкреплён ссылками на источники');
  else {
    cons.push('Мало ссылок на источники в тексте');
    tips.push('Подкрепляйте утверждения ссылками на источники в формате [1], [2, 3]');
  }

  // Общий совет
  if (pct >= 90)
    tips.push('Работа на высоком уровне — перед защитой перечитайте введение и заключение ещё раз');
  else if (pct >= 70)
    tips.push('Устраните замечания по структуре — это существенно повысит итоговую оценку');
  else
    tips.push('Уделите внимание структуре и анализу результатов — они дают наибольшее количество баллов (65 из 100)');

  return { pros, cons, tips };
}

export default function FeedbackCard({ results }) {
  const [open, setOpen] = useState(true);
  const { pros, cons, tips } = generateFeedback(results);
  const pct = results.totalScore || 0;

  return (
    <Wrap>
      <Header>
        <Title>
          <TitleIcon>
            <LightbulbIcon sx={{ fontSize: 15, color: '#fff' }}/>
          </TitleIcon>
          Экспертный анализ работы
        </Title>
        <ExpandBtn onClick={() => setOpen(o => !o)}>
          {open ? <ExpandLessIcon sx={{ fontSize: 20 }}/> : <ExpandMoreIcon sx={{ fontSize: 20 }}/>}
        </ExpandBtn>
      </Header>

      {open && (
        <>
          <ScoreLine>
            <ScoreBig $v={pct}>{pct}/100</ScoreBig>
            <span>
              {pct >= 90 ? '— Отличный уровень. Работа готова к защите.' :
               pct >= 70 ? '— Хороший уровень. Исправьте замечания перед защитой.' :
               pct >= 60 ? '— Удовлетворительный уровень. Требуются доработки.' :
                           '— Требуются серьёзные доработки по большинству критериев.'}
            </span>
          </ScoreLine>

          <Grid>
            <Col $type="pro">
              <ColHead $type="pro">
                <CheckCircleIcon sx={{ fontSize: 13 }}/>
                Плюсы ({pros.length})
              </ColHead>
              {pros.length === 0
                ? <Item><Dot $type="pro"/>Нет явных преимуществ</Item>
                : pros.map((p, i) => (
                  <Item key={i}><Dot $type="pro"/>{p}</Item>
                ))}
            </Col>

            <Col $type="con">
              <ColHead $type="con">
                <CancelIcon sx={{ fontSize: 13 }}/>
                Минусы ({cons.length})
              </ColHead>
              {cons.length === 0
                ? <Item><Dot $type="con"/>Замечаний нет — отличный результат!</Item>
                : cons.map((c, i) => (
                  <Item key={i}><Dot $type="con"/>{c}</Item>
                ))}
            </Col>
          </Grid>

          <TipsCol>
            <ColHead $type="tip">
              <LightbulbIcon sx={{ fontSize: 13 }}/>
              Советы по улучшению ({tips.length})
            </ColHead>
            {tips.map((tip, i) => (
              <Item key={i}><Dot $type="tip"/>{tip}</Item>
            ))}
          </TipsCol>
        </>
      )}
    </Wrap>
  );
}
