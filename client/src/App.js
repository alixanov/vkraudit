import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import DarkModeIcon     from '@mui/icons-material/DarkMode';
import LightModeIcon    from '@mui/icons-material/LightMode';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UploadFileIcon   from '@mui/icons-material/UploadFile';
import SearchIcon       from '@mui/icons-material/Search';
import AssessmentIcon   from '@mui/icons-material/Assessment';

import Uploader         from './components/Uploader';
import ProcessTimeline  from './components/ProcessTimeline';
import ResultsDashboard from './components/ResultsDashboard';
import RequirementsList from './components/RequirementsList';
import ReportDownloader from './components/ReportDownloader';
import FeedbackCard     from './components/FeedbackCard';
import ScoringGuide     from './components/ScoringGuide';
import { useApp }       from './contexts/AppContext';
import { apiUrl }       from './config';

/* ─── Animations ─── */
const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

/* ─── Flags ─── */
function FlagRU() {
  return (
    <svg width="18" height="12" viewBox="0 0 30 20" style={{ borderRadius: 3, display: 'block', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
      <rect width="30" height="7"  y="0"  fill="#FFF"/>
      <rect width="30" height="6"  y="7"  fill="#003DA5"/>
      <rect width="30" height="7"  y="13" fill="#CC0000"/>
    </svg>
  );
}

function FlagUZ() {
  return (
    <svg width="18" height="12" viewBox="0 0 30 20" style={{ borderRadius: 3, display: 'block', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
      <rect width="30" height="8"   y="0"   fill="#1CAFF6"/>
      <rect width="30" height="1.2" y="8"   fill="#CE1126"/>
      <rect width="30" height="1.6" y="9.2" fill="#FFF"/>
      <rect width="30" height="1.2" y="10.8" fill="#CE1126"/>
      <rect width="30" height="8.8" y="12"  fill="#1EB53A"/>
      <circle cx="5.5" cy="4" r="2.8" fill="#fff"/>
      <circle cx="6.8" cy="3.2" r="2.2" fill="#1CAFF6"/>
    </svg>
  );
}

/* ─── Nav ─── */
const NavBar = styled.nav`
  position: sticky; top: 0; z-index: 300;
  height: 58px;
  background: rgba(7,10,16,0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center;
  padding: 0 20px;
  &::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.5) 40%, rgba(99,102,241,0.5) 60%, transparent);
  }
`;

const NavInner = styled.div`
  max-width: 920px; width: 100%; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
`;

const Logo = styled.div`
  display: flex; align-items: center; gap: 10px;
`;

const LogoMark = styled.div`
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, #3B82F6, #6366F1);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 900; color: #fff;
  box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 4px 12px rgba(59,130,246,0.3);
  flex-shrink: 0;
`;

const LogoText = styled.div`
  display: flex; flex-direction: column; gap: 1px;
`;

const LogoName = styled.span`
  font-size: 14px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -0.3px;
  em { font-style: normal; color: #60A5FA; }
`;

const LogoSub = styled.span`
  font-size: 9px; font-weight: 600; letter-spacing: 1px;
  color: rgba(255,255,255,0.25); text-transform: uppercase; line-height: 1;
`;

const NavControls = styled.div`
  display: flex; align-items: center; gap: 8px;
`;

const LangSwitcher = styled.div`
  display: flex; align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; overflow: hidden; height: 32px;
`;

const LangBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 0 10px; height: 100%;
  background: ${p => p.$on ? 'rgba(59,130,246,0.3)' : 'transparent'};
  border: none; border-right: 1px solid rgba(255,255,255,0.07);
  cursor: pointer; transition: background 0.15s;
  font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
  color: ${p => p.$on ? '#fff' : 'rgba(255,255,255,0.35)'};
  &:last-child { border-right: none; }
  &:hover { background: rgba(255,255,255,0.1); color: #fff; }
`;

const Sep = styled.div`width:1px; height:18px; background:rgba(255,255,255,0.08);`;

const ThemeBtn = styled.button`
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.45);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.13); color: #fff; }
`;

/* ─── Layout ─── */
const Shell = styled.div`
  min-height: 100vh; display: flex; flex-direction: column;
  background: var(--bg);
`;

const Main = styled.main`
  flex: 1;
  max-width: 920px; width: 100%;
  margin: 0 auto;
  padding: 28px 20px 80px;
  @media(max-width:640px){ padding: 20px 14px 60px; }
`;

/* ─── Landing hero ─── */
const HowItWorks = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden;
  box-shadow: var(--shadow-m);
  margin-bottom: 24px;
  animation: ${fadeUp} 0.4s ease;
  @media(max-width:500px){ grid-template-columns:1fr; }
`;

const HowStep = styled.div`
  display: flex; flex-direction: column; align-items: center;
  padding: 20px 14px; text-align: center;
  border-right: 1px solid var(--border);
  &:last-child { border-right: none; }
  @media(max-width:500px){
    border-right: none;
    border-bottom: 1px solid var(--border);
    &:last-child { border-bottom: none; }
    flex-direction: row; text-align: left; gap: 12px; padding: 14px 16px;
  }
`;

const HowNum = styled.div`
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--blue-tint); border: 1.5px solid var(--blue-border);
  font-size: 11px; font-weight: 800; color: #3B82F6;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 8px; flex-shrink: 0;
  @media(max-width:500px){ margin-bottom:0; }
`;

const HowIcon = styled.div`
  color: ${p => p.$c}; margin-bottom: 6px;
  @media(max-width:500px){ display:none; }
`;

const HowLabel = styled.div`
  font-size: 11px; font-weight: 700; color: var(--text-2); margin-bottom: 2px;
`;

const HowHint = styled.div`
  font-size: 10px; color: var(--text-4); line-height: 1.4;
`;

/* ─── Divider ─── */
const Divider = styled.div`
  display: flex; align-items: center; gap: 12px; margin: 32px 0 20px;
`;

const DivLine = styled.div`flex:1; height:1px; background:var(--border-2);`;

const DivLabel = styled.div`
  font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
  text-transform: uppercase; color: var(--text-4);
`;

/* ─── Error ─── */
const ErrBox = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  background: var(--red-tint); border: 1px solid var(--red-border);
  border-radius: 12px; padding: 14px 16px;
  color: #F87171; font-size: 14px; line-height: 1.5;
  margin-bottom: 20px;
`;

/* ─── Results wrapper ─── */
const ResultsWrap = styled.div`animation: ${fadeUp} 0.4s ease;`;

/* ─── Footer ─── */
const Footer = styled.footer`
  border-top: 1px solid var(--border-2);
  background: var(--bg);
  padding: 16px 20px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 8px;
`;

const FooterTxt = styled.span`
  font-size: 12px; color: var(--text-4); font-weight: 500;
`;

/* ─── App ─── */
export default function App() {
  const { dark, setDark, lang, setLang, t } = useApp();
  const [fileName,    setFileName]    = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results,     setResults]     = useState(null);
  const [error,       setError]       = useState(null);

  const analyze = async (file, name) => {
    setFileName(name); setResults(null); setError(null); setIsAnalyzing(true);
    const t0 = Date.now();
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch(apiUrl('/api/check'), { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`);
      const wait = 5500 - (Date.now() - t0);
      if (wait > 0) await new Promise(r => setTimeout(r, wait));
      setResults(data);
    } catch (e) {
      setError(e.message || 'Не удалось связаться с сервером');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { num: '1', icon: <UploadFileIcon sx={{ fontSize: 20 }}/>, c: '#3B82F6', label: t.step1Label, hint: t.step1Hint },
    { num: '2', icon: <SearchIcon     sx={{ fontSize: 20 }}/>, c: '#F59E0B', label: t.step2Label, hint: t.step2Hint },
    { num: '3', icon: <AssessmentIcon sx={{ fontSize: 20 }}/>, c: '#10B981', label: t.step3Label, hint: t.step3Hint },
  ];

  return (
    <Shell>
      {/* ── Nav ── */}
      <NavBar>
        <NavInner>
          <Logo>
            <LogoMark>V</LogoMark>
            <LogoText>
              <LogoName>VKR<em>Audit</em></LogoName>
              <LogoSub>ГОСТ Р 7.0.11-2024</LogoSub>
            </LogoText>
          </Logo>

          <NavControls>
            <LangSwitcher>
              <LangBtn $on={lang === 'ru'} onClick={() => setLang('ru')}>
                <FlagRU/> RU
              </LangBtn>
              <LangBtn $on={lang === 'uz'} onClick={() => setLang('uz')}>
                <FlagUZ/> UZ
              </LangBtn>
            </LangSwitcher>
            <Sep/>
            <ThemeBtn onClick={() => setDark(d => !d)} title={dark ? 'Светлая тема' : 'Тёмная тема'}>
              {dark
                ? <LightModeIcon sx={{ fontSize: 15 }}/>
                : <DarkModeIcon  sx={{ fontSize: 15 }}/>}
            </ThemeBtn>
          </NavControls>
        </NavInner>
      </NavBar>

      <Main>
        {/* ── Steps (only on landing) ── */}
        {!results && !isAnalyzing && (
          <HowItWorks>
            {steps.map((s, i) => (
              <HowStep key={i}>
                <HowNum>{s.num}</HowNum>
                <HowIcon $c={s.c}>{s.icon}</HowIcon>
                <div>
                  <HowLabel>{s.label}</HowLabel>
                  <HowHint>{s.hint}</HowHint>
                </div>
              </HowStep>
            ))}
          </HowItWorks>
        )}

        {/* ── Uploader ── */}
        <Uploader onFileSelected={analyze} isAnalyzing={isAnalyzing}/>

        {/* ── Progress ── */}
        {isAnalyzing && <ProcessTimeline/>}

        {/* ── Error ── */}
        {error && (
          <ErrBox>
            <ErrorOutlineIcon sx={{ fontSize: 18, flexShrink: 0, marginTop: '1px' }}/>
            {error}
          </ErrBox>
        )}

        {/* ── Guide (landing only) ── */}
        {!results && !isAnalyzing && !error && (
          <>
            <Divider>
              <DivLine/><DivLabel>{t.guideTitle}</DivLabel><DivLine/>
            </Divider>
            <ScoringGuide/>
          </>
        )}

        {/* ── Results ── */}
        {results && !isAnalyzing && (
          <ResultsWrap>
            <ResultsDashboard results={results}/>
            <RequirementsList results={results.details}/>
            <FeedbackCard results={results}/>
            <ReportDownloader analysis={results} fileName={fileName}/>
          </ResultsWrap>
        )}
      </Main>

      {/* ── Footer ── */}
      <Footer>
        <FooterTxt>VKRAudit — {t.footerLeft}</FooterTxt>
        <FooterTxt>{t.footerRight}</FooterTxt>
      </Footer>
    </Shell>
  );
}
