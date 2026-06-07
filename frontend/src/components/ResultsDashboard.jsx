import React from 'react';
import styled, { keyframes } from 'styled-components';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import StraightenIcon from '@mui/icons-material/Straighten';
import MenuBookIcon   from '@mui/icons-material/MenuBook';
import AnalyticsIcon  from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useApp }     from '../contexts/AppContext';

const fadeUp  = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
const grow    = keyframes`from{width:0}`;
const countUp = keyframes`from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  margin-bottom: 20px;
  animation: ${fadeUp} .4s ease;
`;

/* ── Score Banner — navy in dark, vivid blue in light ── */
const Banner = styled.div`
  background: linear-gradient(135deg, #0D1525 0%, #1A2744 50%, #0D1F3E 100%);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 18px; padding: 26px 26px 22px;
  color: #fff; margin-bottom: 10px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.35);
  transition: background 0.25s, box-shadow 0.25s;
  &::before {
    content: '';
    position: absolute; top: -50px; right: -50px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  [data-theme="light"] & {
    background:
      radial-gradient(circle, rgba(99,102,241,0.18) 1px, transparent 1.6px) 0 0 / 22px 22px,
      linear-gradient(135deg, #EEF2FF 0%, #E5EAFF 50%, #DCE3FF 100%);
    color: #1E293B;
    border: 1px solid #DCE3F5;
    box-shadow: 0 6px 20px rgba(99,102,241,0.10);
  }
  [data-theme="light"] &::before { display: none; }
  @media(max-width:480px){ padding: 18px 16px; }
`;

const BannerRow = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 14px; margin-bottom: 20px;
`;

const ScoreBlock = styled.div``;

const ScoreLbl = styled.p`
  font-size: 10px; font-weight: 600; letter-spacing: 1.2px;
  text-transform: uppercase; color: #60A5FA;
  display: flex; align-items: center; gap: 4px; margin-bottom: 5px;
  [data-theme="light"] & { color: #4F46E5; }
`;

const ScoreNum = styled.p`
  font-size: 54px; font-weight: 900; line-height: 1; letter-spacing: -3px;
  animation: ${countUp} .5s ease;
  span { font-size: 20px; font-weight: 400; opacity: .3; margin-left: 3px; letter-spacing: 0; }
  [data-theme="light"] & { color: #0F1C2E; }
  @media(max-width:360px){ font-size: 40px; }
`;

const GradeRow = styled.div`display: flex; align-items: center; gap: 7px; margin-top: 9px;`;

const GradePill = styled.div`
  display: inline-flex; align-items: center;
  background: ${p => p.$c}20; border: 1.5px solid ${p => p.$c}50;
  border-radius: 99px; padding: 4px 13px;
  font-size: 12px; font-weight: 800; letter-spacing: .4px; color: ${p => p.$c};
`;

const GradeHint = styled.span`
  font-size: 11px; color: rgba(255,255,255,.3);
  [data-theme="light"] & { color: rgba(15,28,46,.5); }
`;

const PctBox = styled.div`
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
  border-radius: 13px; padding: 14px 18px; text-align: center; min-width: 100px;
  [data-theme="light"] & {
    background: rgba(99,102,241,.07);
    border-color: rgba(99,102,241,.18);
  }
`;

const PctNum = styled.p`
  font-size: 34px; font-weight: 900; line-height: 1; letter-spacing: -2px;
  color: ${p => p.$c};
`;

const PctLbl = styled.p`
  font-size: 9px; letter-spacing: 1px; text-transform: uppercase;
  color: rgba(255,255,255,.3); margin-top: 4px;
  [data-theme="light"] & { color: rgba(15,28,46,.45); }
`;

const BarTrack = styled.div`
  height: 6px; background: rgba(255,255,255,.1); border-radius: 99px; overflow: hidden;
  [data-theme="light"] & { background: rgba(15,28,46,.08); }
`;

const BarFill = styled.div`
  height: 100%; width: ${p => p.$w}%;
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
  border-radius: 99px;
  animation: ${grow} 1.2s cubic-bezier(.22,1,.36,1);
  box-shadow: 0 0 8px rgba(96,165,250,.4);
`;

const Ticks = styled.div`
  display: flex; justify-content: space-between;
  margin-top: 4px; font-size: 9px; color: rgba(255,255,255,.18); font-weight: 500;
  [data-theme="light"] & { color: rgba(15,28,46,.30); }
`;

/* ── Mini cards ── */
const MiniGrid = styled.div`
  display: grid; grid-template-columns: repeat(2,1fr); gap: 10px;
  @media(max-width:480px){ grid-template-columns:1fr; }
`;

const Mini = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 13px; padding: 13px 15px;
  display: flex; align-items: center; gap: 11px;
  box-shadow: var(--shadow-s);
  transition: box-shadow .2s, transform .2s;
  &:hover { box-shadow: var(--shadow-m); transform: translateY(-1px); }
`;

const MiniIcon = styled.div`
  width: 36px; height: 36px; border-radius: 9px;
  background: ${p => p.$bg};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`;

const MiniVal = styled.p`
  font-size: 17px; font-weight: 800; color: var(--text-1);
  letter-spacing: -.5px; line-height: 1; margin-bottom: 2px;
`;

const MiniLbl = styled.p`
  font-size: 10px; color: var(--text-4); font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const GRADE_LABEL = {
  '5': 'Отлично', '4': 'Хорошо', '3': 'Удовлетворительно', '2': 'Неудовлетворительно',
};

function gradeColor(p) {
  if (p >= 90) return '#10B981';
  if (p >= 70) return '#3B82F6';
  if (p >= 60) return '#F59E0B';
  return '#EF4444';
}

export default function ResultsDashboard({ results }) {
  const { t } = useApp();
  const c = gradeColor(results.percentage);

  return (
    <Wrap>
      <Banner>
        <BannerRow>
          <ScoreBlock>
            <ScoreLbl>
              <TrendingUpIcon sx={{ fontSize: 12 }}/>{t.totalScore}
            </ScoreLbl>
            <ScoreNum>{results.totalScore}<span>/100</span></ScoreNum>
            <GradeRow>
              <GradePill $c={c}>{results.grade}</GradePill>
              <GradeHint>{GRADE_LABEL[results.grade] || ''}</GradeHint>
            </GradeRow>
          </ScoreBlock>

          <PctBox>
            <PctNum $c={c}>{results.percentage}%</PctNum>
            <PctLbl>{t.compliance}</PctLbl>
          </PctBox>
        </BannerRow>

        <BarTrack><BarFill $w={results.percentage}/></BarTrack>
        <Ticks>{['0','25%','50%','75%','100%'].map(v => <span key={v}>{v}</span>)}</Ticks>
      </Banner>

      <MiniGrid>
        {[
          { icon: <TextFieldsIcon sx={{ fontSize: 18, color: '#3B82F6' }}/>, bg: 'rgba(59,130,246,.12)', val: `${results.fontTotal ?? 0}/15`,      lbl: t.catFont     },
          { icon: <StraightenIcon sx={{ fontSize: 18, color: '#10B981' }}/>, bg: 'rgba(16,185,129,.12)', val: `${results.volumeTotal ?? 0}/20`,    lbl: t.catVol      },
          { icon: <MenuBookIcon   sx={{ fontSize: 18, color: '#F59E0B' }}/>, bg: 'rgba(245,158,11,.12)', val: `${results.structureTotal ?? 0}/50`, lbl: t.catStruct   },
          { icon: <AnalyticsIcon  sx={{ fontSize: 18, color: '#8B5CF6' }}/>, bg: 'rgba(139,92,246,.12)', val: `${results.analysisTotal ?? 0}/15`,  lbl: t.catAnalysis },
        ].map((m, i) => (
          <Mini key={i}>
            <MiniIcon $bg={m.bg}>{m.icon}</MiniIcon>
            <div style={{ minWidth: 0 }}>
              <MiniVal>{m.val}</MiniVal>
              <MiniLbl>{m.lbl}</MiniLbl>
            </div>
          </Mini>
        ))}
      </MiniGrid>
    </Wrap>
  );
}
