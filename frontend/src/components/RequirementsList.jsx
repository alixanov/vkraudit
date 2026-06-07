import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckCircleIcon       from '@mui/icons-material/CheckCircle';
import CancelIcon            from '@mui/icons-material/Cancel';
import RemoveCircleIcon      from '@mui/icons-material/RemoveCircle';
import TextFieldsIcon        from '@mui/icons-material/TextFields';
import StraightenIcon        from '@mui/icons-material/Straighten';
import MenuBookIcon          from '@mui/icons-material/MenuBook';
import AnalyticsIcon         from '@mui/icons-material/Analytics';
import ExpandMoreIcon        from '@mui/icons-material/ExpandMore';
import ExpandLessIcon        from '@mui/icons-material/ExpandLess';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useApp }            from '../contexts/AppContext';

const fadeUp   = keyframes`from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}`;
const slideIn  = keyframes`from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}`;

/* ── Category section ── */
const Sec = styled.section`margin-bottom: 22px; animation: ${fadeUp} .35s ease;`;

const SecHead = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
`;

const SecLeft = styled.div`display: flex; align-items: center; gap: 9px;`;

const SecIcon = styled.div`
  width: 30px; height: 30px; background: ${p => p.$bg};
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
`;

const SecName = styled.h3`
  font-size: 13px; font-weight: 800; letter-spacing: -.1px; color: var(--text-1);
`;

const SecBadge = styled.div`
  font-size: 11px; font-weight: 700;
  color: ${p => p.$ok ? '#059669' : 'var(--text-4)'};
  background: ${p => p.$ok ? 'var(--green-tint)' : 'var(--surface-2)'};
  border: 1px solid ${p => p.$ok ? 'var(--green-border)' : 'var(--border)'};
  border-radius: 99px; padding: 2px 10px;
`;

/* ── Cards grid ── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 9px;
  @media(max-width:520px){ grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: var(--surface);
  border: 1.5px solid ${p =>
    p.$ok ? 'var(--green-border)' :
    p.$partial ? 'var(--yellow-border)' :
    p.$bonusOn ? 'var(--blue-border)' :
    'var(--border)'};
  border-radius: 13px; padding: 12px;
  cursor: ${p => p.$click ? 'pointer' : 'default'};
  box-shadow: var(--shadow-s);
  transition: box-shadow .2s, transform .2s, border-color .2s;
  &:hover {
    box-shadow: ${p => p.$click ? 'var(--shadow-m)' : 'var(--shadow-s)'};
    transform: ${p => p.$click ? 'translateY(-1px)' : 'none'};
  }
`;

const CardTop = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 7px; margin-bottom: 7px;
`;

const CardName = styled.p`
  font-size: 11.5px; font-weight: 600; line-height: 1.45; flex: 1;
  color: var(--text-2);
`;

const BonusBadge = styled.span`
  font-size: 9px; font-weight: 700; color: #3B82F6;
  background: var(--blue-tint); border: 1px solid var(--blue-border);
  border-radius: 99px; padding: 1px 6px; margin-left: 4px;
  vertical-align: middle; text-transform: uppercase;
`;

const CardScore = styled.p`
  font-size: 13px; font-weight: 800; white-space: nowrap; letter-spacing: -.3px;
  color: ${p => p.$ok ? '#10B981' : p.$partial ? '#F59E0B' : p.$bonusOn ? '#3B82F6' : '#EF4444'};
`;

const BarRow = styled.div`
  height: 3px; background: var(--surface-3); border-radius: 99px;
  overflow: hidden; margin-bottom: 8px;
`;

const BarFill = styled.div`
  height: 100%; width: ${p => p.$w}%;
  background: ${p =>
    p.$ok ? 'linear-gradient(90deg,#059669,#10B981)' :
    p.$partial ? 'linear-gradient(90deg,#D97706,#F59E0B)' :
    p.$bonusOn ? 'linear-gradient(90deg,#2563EB,#3B82F6)' :
    'linear-gradient(90deg,#DC2626,#EF4444)'};
  border-radius: 99px; transition: width .5s ease;
`;

const Bottom = styled.div`display: flex; align-items: center; justify-content: space-between;`;

const StatusTxt = styled.div`
  display: flex; align-items: center; gap: 3px;
  font-size: 10.5px; font-weight: 600;
  color: ${p => p.$ok ? '#10B981' : p.$partial ? '#F59E0B' : p.$bonusOn ? '#3B82F6' : '#EF4444'};
`;

const ExpandIco = styled.div`
  color: var(--text-5); display: flex; align-items: center;
  transition: color .15s;
  &:hover { color: #3B82F6; }
`;

const DescTxt = styled.p`
  margin-top: 7px; padding-top: 7px;
  border-top: 1px solid var(--border-2);
  font-size: 10.5px; line-height: 1.55; color: var(--text-4);
`;

const IssueBox = styled.div`
  margin-top: 8px; padding: 9px 11px;
  background: var(--yellow-tint);
  border-left: 3px solid #F59E0B; border-radius: 8px;
  font-size: 11px; line-height: 1.6;
  animation: ${slideIn} .2s ease;
`;

const IssueTxt = styled.p`
  color: ${p => p.$dark ? '#D97706' : '#92400E'};
`;

const RecoRow = styled.div`
  display: flex; align-items: flex-start; gap: 5px;
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid var(--yellow-border);
  font-size: 10.5px; line-height: 1.5; color: var(--text-3);
`;

/* ── Card component ── */
function ReqCard({ req, idx }) {
  const { dark, t } = useApp();
  const [open, setOpen] = useState(true);
  const ok      = req.score > 0 && req.score === req.max;
  const partial = req.score > 0 && !ok;
  const bonusOn = req.bonus && req.score > 0;
  const pct     = req.max > 0 ? Math.round((req.score / req.max) * 100) : 0;
  const hasIssue = !!req.issue;

  return (
    <Card $ok={ok} $partial={partial} $bonusOn={bonusOn}
      $click={hasIssue} onClick={() => hasIssue && setOpen(o => !o)}>

      <CardTop>
        <CardName>
          {idx}. {req.name}
          {req.bonus && <BonusBadge>{t.bonus}</BonusBadge>}
        </CardName>
        <CardScore $ok={ok} $partial={partial} $bonusOn={bonusOn}>
          {req.score}/{req.max}
        </CardScore>
      </CardTop>

      <BarRow><BarFill $w={pct} $ok={ok} $partial={partial} $bonusOn={bonusOn}/></BarRow>

      <Bottom>
        <StatusTxt $ok={ok} $partial={partial} $bonusOn={bonusOn}>
          {ok
            ? <><CheckCircleIcon sx={{ fontSize: 12 }}/>{t.done}</>
            : partial
            ? <><RemoveCircleIcon sx={{ fontSize: 12 }}/>{t.partial}</>
            : req.bonus
            ? req.score > 0 ? t.bonusDone : t.bonusNone
            : <><CancelIcon sx={{ fontSize: 12 }}/>{t.notDone}</>}
        </StatusTxt>
        {hasIssue && (
          <ExpandIco>
            {open
              ? <ExpandLessIcon sx={{ fontSize: 14 }}/>
              : <ExpandMoreIcon sx={{ fontSize: 14 }}/>}
          </ExpandIco>
        )}
      </Bottom>

      {req.desc && <DescTxt>{req.desc}</DescTxt>}

      {open && hasIssue && (
        <IssueBox>
          <IssueTxt $dark={dark}>{req.issue}</IssueTxt>
          {req.recommendation && (
            <RecoRow>
              <LightbulbOutlinedIcon sx={{ fontSize: 12, color: '#F59E0B', flexShrink: 0, mt: '1px' }}/>
              {req.recommendation}
            </RecoRow>
          )}
        </IssueBox>
      )}
    </Card>
  );
}

/* ── Category definitions ── */
const buildCats = (d, t) => [
  {
    icon: <TextFieldsIcon sx={{ fontSize: 15, color: '#3B82F6' }}/>,
    bg: 'rgba(59,130,246,.12)', name: t.catFont, max: 15,
    reqs: [
      { name: t.reqNames.fontTimes,   score: d.fontTimesScore   ?? 0, max: 4,  desc: 'Весь основной текст — Times New Roman' },
      { name: t.reqNames.fontSize,    score: d.fontSize14Score  ?? 0, max: 4,  desc: 'Размер шрифта основного текста — 14 пт' },
      { name: t.reqNames.lineSpacing, score: d.lineSpacingScore ?? 0, max: 4,  desc: 'Межстрочный интервал — 1,5 по всему тексту' },
      { name: t.reqNames.pageNumbers, score: d.pageNumbersScore ?? 0, max: 3,  desc: 'Сквозная нумерация страниц (титул не нумеруется)' },
    ],
  },
  {
    icon: <StraightenIcon sx={{ fontSize: 15, color: '#10B981' }}/>,
    bg: 'rgba(16,185,129,.12)', name: t.catVol, max: 20,
    reqs: [
      { name: t.reqNames.volume,     score: d.volumeScore     ?? 0, max: 12, desc: 'Общий объём — не менее 70 страниц' },
      { name: t.reqNames.intro,      score: d.introScore      ?? 0, max: 4,  desc: 'Введение более 2 стр.: актуальность, цель, задачи, объект, предмет' },
      { name: t.reqNames.conclusion, score: d.conclusionScore ?? 0, max: 4,  desc: 'Заключение более 2 стр.: выводы по каждой главе' },
    ],
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 15, color: '#F59E0B' }}/>,
    bg: 'rgba(245,158,11,.12)', name: t.catStruct, max: 50,
    reqs: [
      { name: t.reqNames.contents,      score: d.contentsScore          ?? 0, max: 5,  desc: 'Оглавление с перечнем разделов и номерами страниц' },
      { name: t.reqNames.introSec,      score: d.introSectionScore      ?? 0, max: 4,  desc: 'Раздел «Введение» как самостоятельный раздел' },
      { name: t.reqNames.ch1,           score: d.chapter1Score          ?? 0, max: 9,  desc: 'Глава 1 — минимум 2 подраздела (1.1, 1.2, ...)' },
      { name: t.reqNames.ch2,           score: d.chapter2Score          ?? 0, max: 10, desc: 'Глава 2 — минимум 2 подраздела (2.1, 2.2, ...)' },
      { name: t.reqNames.ch3,           score: d.chapter3Score          ?? 0, max: 10, desc: 'Глава 3 — минимум 2 подраздела (3.1, 3.2, ...)' },
      { name: t.reqNames.conclusionSec, score: d.conclusionSectionScore ?? 0, max: 5,  desc: 'Раздел «Заключение» как самостоятельный раздел' },
      { name: t.reqNames.appendix,      score: d.appendixScore          ?? 0, max: 7,  desc: 'Раздел «Приложения» в конце работы' },
    ],
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 15, color: '#8B5CF6' }}/>,
    bg: 'rgba(139,92,246,.12)', name: t.catAnalysis, max: 15,
    reqs: [
      { name: t.reqNames.tablesFigures, score: d.tablesFiguresScore ?? 0, max: 5, desc: 'Иллюстративный материал: таблицы, рисунки, диаграммы' },
      { name: t.reqNames.findings,      score: d.findingsScore      ?? 0, max: 5, desc: 'Выводы по каждой главе, обобщающие результаты' },
      { name: t.reqNames.citations,     score: d.citationsScore     ?? 0, max: 5, desc: 'Ссылки на источники в тексте в формате [1], [2, 3]' },
    ],
  },
];

export default function RequirementsList({ results }) {
  const { t } = useApp();
  const d = results || {};
  let idx = 1;

  return (
    <div style={{ marginBottom: 20 }}>
      {buildCats(d, t).map(cat => {
        const earned = cat.reqs.reduce((s, r) => s + (r.score || 0), 0);
        return (
          <Sec key={cat.name}>
            <SecHead>
              <SecLeft>
                <SecIcon $bg={cat.bg}>{cat.icon}</SecIcon>
                <SecName>{cat.name}</SecName>
              </SecLeft>
              <SecBadge $ok={earned >= cat.max}>{earned}/{cat.max}</SecBadge>
            </SecHead>
            <Grid>
              {cat.reqs.map(req => <ReqCard key={idx} req={req} idx={idx++}/>)}
            </Grid>
          </Sec>
        );
      })}
    </div>
  );
}
