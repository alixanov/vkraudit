import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckCircleIcon          from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AutorenewIcon            from '@mui/icons-material/Autorenew';
import { useApp } from '../contexts/AppContext';

const spin    = keyframes`to{transform:rotate(360deg)}`;
const fadeUp  = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const blink   = keyframes`0%,100%{opacity:1}50%{opacity:.4}`;
const shimmer = keyframes`0%{transform:translateX(-100%)}100%{transform:translateX(200%)}`;

const Card = styled.div`
  background: var(--surface);
  border: 1.5px solid rgba(59,130,246,0.25);
  border-radius: 18px; padding: 22px;
  margin-bottom: 18px;
  animation: ${fadeUp} .35s ease;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.06), var(--shadow-l);
  @media(max-width:480px){ padding: 16px; }
`;

const Header = styled.div`
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
`;

const SpinBox = styled.div`
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(59,130,246,0.1);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`;

const Spinner = styled(AutorenewIcon)`
  animation: ${spin} 1.3s linear infinite !important;
  color: #3B82F6 !important; font-size: 22px !important;
`;

const HeaderInfo = styled.div`flex:1; min-width:0;`;

const Title = styled.p`
  font-size: 15px; font-weight: 800; letter-spacing: -.3px;
  color: var(--text-1); margin-bottom: 2px;
`;

const ActiveStep = styled.p`
  font-size: 12px; font-weight: 600; color: #3B82F6;
  display: flex; align-items: center; gap: 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const Dot = styled.span`
  width: 6px; height: 6px; border-radius: 50%;
  background: #3B82F6; flex-shrink: 0;
  animation: ${blink} 1.1s ease-in-out infinite; display: inline-block;
`;

const PctBig = styled.div`
  font-size: 36px; font-weight: 900; color: #3B82F6;
  letter-spacing: -2.5px; line-height: 1; min-width: 66px; text-align: right;
  span { font-size: 14px; font-weight: 500; opacity: .45; letter-spacing: 0; }
`;

const BarWrap = styled.div`margin-bottom: 18px;`;

const BarMeta = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 6px;
`;

const BarLbl = styled.span`
  font-size: 10px; font-weight: 600; letter-spacing: .7px;
  text-transform: uppercase; color: var(--text-4);
`;

const BarPct = styled.span`font-size: 11px; font-weight: 700; color: #3B82F6;`;

const Track = styled.div`
  height: 8px; background: var(--surface-3);
  border-radius: 99px; overflow: hidden;
`;

const Fill = styled.div`
  height: 100%; width: ${p => p.$w}%;
  background: linear-gradient(90deg, #1E40AF, #3B82F6, #93C5FD);
  border-radius: 99px;
  transition: width 1.1s cubic-bezier(.22,1,.36,1);
  position: relative; overflow: hidden;
  &::after {
    content: '';
    position: absolute; inset: 0; width: 40%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
    animation: ${shimmer} 1.8s ease-in-out infinite;
  }
`;

const Ticks = styled.div`
  display: flex; justify-content: space-between;
  margin-top: 4px; font-size: 9px; font-weight: 600; color: var(--text-5);
`;

const Steps = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const StepRow = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: 8px;
  background: ${p => p.$done ? 'var(--green-tint)' : p.$active ? 'var(--blue-tint)' : 'transparent'};
  border: 1px solid ${p => p.$done ? 'var(--green-border)' : p.$active ? 'var(--blue-border)' : 'transparent'};
  transition: background .3s, border-color .3s;
`;

const StepLbl = styled.span`
  flex: 1; font-size: 12px;
  font-weight: ${p => p.$active ? 700 : p.$done ? 600 : 400};
  color: ${p => p.$done ? '#10B981' : p.$active ? '#3B82F6' : 'var(--text-4)'};
  transition: color .3s;
`;

const StepPct = styled.span`
  font-size: 10px; font-weight: 700;
  color: ${p => p.$done ? '#10B981' : p.$active ? '#3B82F6' : 'transparent'};
`;

const CHECKPOINTS    = [8, 25, 52, 80, 100];
const STEP_DELAYS    = [0, 1000, 2300, 3700, 5100];
const ANIM_DURATIONS = [400, 800, 900, 1000, 800];

export default function ProcessTimeline() {
  const { t } = useApp();
  const [cur, setCur] = useState(0);
  const [pct, setPct] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    function run(from, to, dur) {
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
        setPct(v);
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else setPct(to);
      };
      raf.current = requestAnimationFrame(tick);
    }

    const timers = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => {
        setCur(i);
        run(i === 0 ? 0 : CHECKPOINTS[i - 1], CHECKPOINTS[i], ANIM_DURATIONS[i]);
      }, delay)
    );

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <Card>
      <Header>
        <SpinBox><Spinner/></SpinBox>
        <HeaderInfo>
          <Title>{t.analyzing}</Title>
          <ActiveStep><Dot/>{t.loadSteps[cur]}</ActiveStep>
        </HeaderInfo>
        <PctBig>{pct}<span>%</span></PctBig>
      </Header>

      <BarWrap>
        <BarMeta>
          <BarLbl>{t.progressLabel}</BarLbl>
          <BarPct>{pct}%</BarPct>
        </BarMeta>
        <Track><Fill $w={pct}/></Track>
        <Ticks>{[0,25,50,75,100].map(v => <span key={v}>{v}%</span>)}</Ticks>
      </BarWrap>

      <Steps>
        {t.loadSteps.map((s, i) => (
          <StepRow key={i} $active={i === cur} $done={i < cur}>
            {i < cur
              ? <CheckCircleIcon sx={{ fontSize: 14, color: '#10B981', flexShrink: 0 }}/>
              : i === cur
                ? <CheckCircleIcon sx={{ fontSize: 14, color: '#3B82F6', flexShrink: 0 }}/>
                : <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: 'var(--text-5)', flexShrink: 0 }}/>}
            <StepLbl $active={i === cur} $done={i < cur}>{s}</StepLbl>
            <StepPct $done={i < cur} $active={i === cur}>
              {i < cur ? `${CHECKPOINTS[i]}%` : i === cur ? `${pct}%` : ''}
            </StepPct>
          </StepRow>
        ))}
      </Steps>
    </Card>
  );
}
