import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import TextFieldsIcon   from '@mui/icons-material/TextFields';
import StraightenIcon   from '@mui/icons-material/Straighten';
import MenuBookIcon     from '@mui/icons-material/MenuBook';
import AnalyticsIcon    from '@mui/icons-material/Analytics';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon   from '@mui/icons-material/ExpandMore';
import ExpandLessIcon   from '@mui/icons-material/ExpandLess';
import CheckIcon        from '@mui/icons-material/Check';
import { useApp }       from '../contexts/AppContext';

const fadeUp  = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const slideIn = keyframes`from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`animation: ${fadeUp} 0.45s ease; margin-bottom: 8px;`;

const HeadRow = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
`;

const Heading = styled.div`
  font-size: 20px; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 4px;
  color: var(--text-1);
`;

const Sub = styled.div`
  font-size: 13px; line-height: 1.5;
  color: var(--text-4);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px; margin-bottom: 18px;
  @media(max-width: 640px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid ${p => p.$accent};
  border-radius: 16px; padding: 18px;
  box-shadow: var(--shadow-s);
`;

const CardTop = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
`;

const CardIcon = styled.div`
  width: 34px; height: 34px; background: ${p => p.$bg};
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
`;

const CardPts = styled.div`
  font-size: 20px; font-weight: 900; color: ${p => p.$c}; letter-spacing: -0.5px;
  span { font-size: 11px; font-weight: 500; opacity: 0.6; margin-left: 1px; }
`;

const CardName = styled.div`
  font-size: 12px; font-weight: 700; margin-bottom: 12px;
  color: var(--text-2);
`;

const Items = styled.div`display: flex; flex-direction: column;`;

const Item = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  font-size: 11px; padding: 6px 0;
  border-bottom: 1px solid var(--border-2);
  &:last-child { border: none; padding-bottom: 0; }
`;

const IName = styled.span`
  color: ${p => p.$bonus ? '#3B82F6' : 'var(--text-3)'};
  font-weight: ${p => p.$bonus ? 600 : 400};
`;

const IPts = styled.span`
  font-weight: 700;
  color: ${p => p.$bonus ? '#3B82F6' : 'var(--text-4)'};
  font-size: 11px;
`;

const InfoToggle = styled.button`
  display: flex; align-items: center; gap: 5px;
  width: 100%; margin-top: 12px; padding: 7px 10px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px; cursor: pointer;
  font-size: 11px; font-weight: 600; letter-spacing: 0.2px;
  color: ${p => p.$c}; transition: background 0.15s;
  &:hover { background: var(--surface-3); }
`;

const DescBox = styled.div`
  margin-top: 8px; padding: 10px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 9px;
  animation: ${slideIn} 0.2s ease;
`;

const DescItem = styled.div`
  display: flex; align-items: flex-start; gap: 6px;
  font-size: 11px; line-height: 1.55;
  color: var(--text-3);
  padding: 3px 0;
  border-bottom: 1px solid var(--border-2);
  &:last-child { border: none; padding-bottom: 0; }
`;

const Divider = styled.div`
  height: 1px; background: var(--border-2); margin-bottom: 14px;
`;

const GradeGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  @media(max-width: 560px) { grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 320px) { grid-template-columns: 1fr; }
`;

const GBox = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom: 3px solid ${p => p.$c};
  border-radius: 13px; padding: 14px; text-align: center;
  box-shadow: var(--shadow-s);
`;

const GNum = styled.div`font-size: 26px; font-weight: 900; color: ${p => p.$c}; line-height: 1;`;
const GLbl = styled.div`
  font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
  color: var(--text-2); margin-top: 4px;
  text-transform: uppercase;
`;
const GRng = styled.div`
  font-size: 11px; font-weight: 600; color: ${p => p.$c}; margin-top: 3px; opacity: 0.8;
`;

function CatCard({ cat }) {
  const [open, setOpen] = useState(false);
  return (
    <Card $accent={cat.accent}>
      <CardTop>
        <CardIcon $bg={cat.bg}>{cat.icon}</CardIcon>
        <CardPts $c={cat.c}>{cat.total}<span>б</span></CardPts>
      </CardTop>
      <CardName>{cat.name}</CardName>
      <Items>
        {cat.items.map(it => (
          <Item key={it.n}>
            <IName $bonus={it.bonus}>{it.n}</IName>
            <IPts $bonus={it.bonus}>{it.p}</IPts>
          </Item>
        ))}
      </Items>
      <InfoToggle $c={cat.c} onClick={() => setOpen(o => !o)}>
        <InfoOutlinedIcon sx={{ fontSize: 12 }}/>
        {open ? 'Скрыть описание' : 'Что проверяется?'}
        {open
          ? <ExpandLessIcon sx={{ fontSize: 12, marginLeft: 'auto' }}/>
          : <ExpandMoreIcon sx={{ fontSize: 12, marginLeft: 'auto' }}/>}
      </InfoToggle>
      {open && (
        <DescBox>
          {cat.desc.map((d, i) => (
            <DescItem key={i}>
              <CheckIcon sx={{ fontSize: 11, color: cat.c, flexShrink: 0, marginTop: '2px' }}/>
              {d}
            </DescItem>
          ))}
        </DescBox>
      )}
    </Card>
  );
}

export default function ScoringGuide() {
  const { t } = useApp();

  const cats = [
    {
      icon: <TextFieldsIcon sx={{ fontSize: 17, color: '#3B82F6' }}/>,
      bg: 'rgba(59,130,246,0.12)', accent: '#3B82F6', c: '#3B82F6',
      name: t.catFont, total: 15,
      items: [
        { n: t.reqNames.fontTimes,   p: '4' },
        { n: t.reqNames.fontSize,    p: '4' },
        { n: t.reqNames.lineSpacing, p: '4' },
        { n: t.reqNames.pageNumbers, p: '3' },
      ],
      desc: [
        'Основной шрифт — Times New Roman во всём документе',
        'Размер шрифта 14 пт для основного текста',
        'Межстрочный интервал 1,5 во всём тексте',
        'Сквозная нумерация страниц (кроме титульного листа)',
      ],
    },
    {
      icon: <StraightenIcon sx={{ fontSize: 17, color: '#10B981' }}/>,
      bg: 'rgba(16,185,129,0.12)', accent: '#10B981', c: '#10B981',
      name: t.catVol, total: 20,
      items: [
        { n: t.reqNames.volume,     p: '12' },
        { n: t.reqNames.intro,      p: '4'  },
        { n: t.reqNames.conclusion, p: '4'  },
      ],
      desc: [
        'Общий объём от 45 страниц — полные баллы',
        'Менее 45 страниц — баллы снижаются пропорционально',
        'Введение более 2 страниц (актуальность, цель, задачи, объект, предмет)',
        'Заключение более 2 страниц (выводы по каждой главе)',
      ],
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 17, color: '#F59E0B' }}/>,
      bg: 'rgba(245,158,11,0.12)', accent: '#F59E0B', c: '#F59E0B',
      name: t.catStruct, total: 50,
      items: [
        { n: t.reqNames.contents,      p: '5'  },
        { n: t.reqNames.introSec,      p: '4'  },
        { n: t.reqNames.ch1,           p: '9'  },
        { n: t.reqNames.ch2,           p: '10' },
        { n: t.reqNames.ch3,           p: '10' },
        { n: t.reqNames.conclusionSec, p: '5'  },
        { n: t.reqNames.appendix,      p: '7'  },
      ],
      desc: [
        'Оглавление с указанием страниц',
        'Раздел «Введение» как самостоятельный раздел',
        'Глава 1 — минимум 2 подраздела (1.1, 1.2, ...)',
        'Глава 2 — минимум 2 подраздела (2.1, 2.2, ...)',
        'Глава 3 — минимум 2 подраздела (3.1, 3.2, ...)',
        'Раздел «Заключение» как самостоятельный раздел',
        'Раздел «Приложения» в конце работы',
      ],
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 17, color: '#8B5CF6' }}/>,
      bg: 'rgba(139,92,246,0.12)', accent: '#8B5CF6', c: '#8B5CF6',
      name: t.catAnalysis, total: 15,
      items: [
        { n: t.reqNames.tablesFigures, p: '5' },
        { n: t.reqNames.findings,      p: '5' },
        { n: t.reqNames.citations,     p: '5' },
      ],
      desc: [
        'Таблицы и рисунки — иллюстративный материал анализа',
        'Выводы по каждой главе, обобщающие результаты',
        'Ссылки на источники в тексте в формате [1], [2, 3]',
      ],
    },
  ];

  const grades = [
    { n: '5', lbl: t.grades[0], rng: '90–100%', c: '#059669' },
    { n: '4', lbl: t.grades[1], rng: '70–89%',  c: '#2563EB' },
    { n: '3', lbl: t.grades[2], rng: '60–69%',  c: '#D97706' },
    { n: '2', lbl: t.grades[3], rng: '0–59%',   c: '#DC2626' },
  ];

  return (
    <Wrap>
      <HeadRow>
        <div>
          <Heading>{t.guideTitle}</Heading>
          <Sub>{t.guideSub}</Sub>
        </div>
      </HeadRow>
      <Grid>
        {cats.map(cat => <CatCard key={cat.name} cat={cat}/>)}
      </Grid>
      <Divider/>
      <GradeGrid>
        {grades.map(g => (
          <GBox key={g.n} $c={g.c}>
            <GNum $c={g.c}>{g.n}</GNum>
            <GLbl>{g.lbl}</GLbl>
            <GRng $c={g.c}>{g.rng}</GRng>
          </GBox>
        ))}
      </GradeGrid>
    </Wrap>
  );
}
