// src/App.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Uploader from './components/Uploader';
import RequirementsList from './components/RequirementsList';
import ResultsDashboard from './components/ResultsDashboard';
import ReportDownloader from './components/ReportDownloader';
import ProcessTimeline from './components/ProcessTimeline';
import ScoringGuide from './components/ScoringGuide';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: #F5F5F7;
  font-family: -apple-system, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(30, 58, 95, 0.12);
  padding: 16px 48px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '✓';
    font-size: 24px;
    font-weight: 700;
    color: white;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1E3A5F;
  letter-spacing: -0.3px;
  
  span {
    font-weight: 400;
    color: #C4A43A;
  }
`;

const LogoSubtitle = styled.div`
  font-size: 10px;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Badge = styled.div`
  background: #F0F4F8;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #1E3A5F;
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 48px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const App = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const steps = [
    { id: 0, name: 'Извлечение текста' },
    { id: 1, name: 'Анализ требований' },
    { id: 2, name: 'Расчёт баллов' },
    { id: 3, name: 'Формирование отчёта' }
  ];

  const analyzeDocument = async (extractedText, name) => {
    setText(extractedText);
    setFileName(name);
    setIsAnalyzing(true);
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    const wordCount = extractedText.split(/\s+/).filter(w => w).length;
    const pageCount = Math.ceil(wordCount / 250);
    const lowerText = extractedText.toLowerCase();
    
    // === РАСЧЁТ БАЛЛОВ ===
    const fontTimes = true;
    const fontTimesScore = fontTimes ? 3 : 0;
    const fontSize14 = true;
    const fontSize14Score = fontSize14 ? 3 : 0;
    const lineSpacing = true;
    const lineSpacingScore = lineSpacing ? 4 : 0;
    const margins = true;
    const marginsScore = margins ? 5 : 0;
    const hasPageNumbers = /стр\.|с\.|\d+\s*из\s*\d+/i.test(lowerText);
    const pageNumbersScore = hasPageNumbers ? 5 : 0;
    
    let volumeScore = 0;
    if (pageCount >= 68 && pageCount <= 72) volumeScore = 10;
    else if (pageCount >= 65 && pageCount <= 75) volumeScore = 7;
    else if (pageCount >= 60 && pageCount <= 80) volumeScore = 4;
    
    let introScore = 0;
    const introMatch = extractedText.match(/введение([\s\S]*?)(глава|раздел)/i);
    if (introMatch) {
      const introWords = introMatch[1].split(/\s+/).length;
      const introPages = Math.ceil(introWords / 250);
      if (introPages >= 2 && introPages <= 3) introScore = 3;
      else if (introPages >= 1 && introPages <= 4) introScore = 2;
      else introScore = 1;
    }
    
    let conclusionScore = 0;
    const conclusionMatch = extractedText.match(/заключение([\s\S]*?)(список литературы|$)/i);
    if (conclusionMatch) {
      const conclusionWords = conclusionMatch[1].split(/\s+/).length;
      const conclusionPages = Math.ceil(conclusionWords / 250);
      if (conclusionPages >= 2 && conclusionPages <= 3) conclusionScore = 2;
      else if (conclusionPages >= 1 && conclusionPages <= 4) conclusionScore = 1;
    }
    
    const hasTitle = lowerText.includes('титульный') || lowerText.includes('министерство') || lowerText.includes('университет');
    const titleScore = hasTitle ? 3 : 0;
    const hasIntro = lowerText.includes('введение');
    const introSectionScore = hasIntro ? 3 : 0;
    
    let chapter1Score = 0;
    if (lowerText.includes('глава 1') || lowerText.includes('глава1')) chapter1Score += 2;
    if (lowerText.includes('1.1')) chapter1Score += 1;
    if (lowerText.includes('1.2')) chapter1Score += 1;
    if (lowerText.includes('1.3')) chapter1Score += 1;
    if (lowerText.includes('1.4')) chapter1Score += 1;
    
    let chapter2Score = 0;
    if (lowerText.includes('глава 2') || lowerText.includes('глава2')) chapter2Score += 2;
    if (lowerText.includes('2.1')) chapter2Score += 1;
    if (lowerText.includes('2.2')) chapter2Score += 1;
    if (lowerText.includes('2.3')) chapter2Score += 1;
    if (lowerText.includes('2.4')) chapter2Score += 1;
    if (lowerText.includes('2.5')) chapter2Score += 2;
    
    let chapter3Score = 0;
    if (lowerText.includes('глава 3') || lowerText.includes('глава3')) chapter3Score += 2;
    if (lowerText.includes('3.1')) chapter3Score += 1;
    if (lowerText.includes('3.2')) chapter3Score += 1;
    if (lowerText.includes('3.3')) chapter3Score += 1;
    if (lowerText.includes('3.4')) chapter3Score += 1;
    if (lowerText.includes('3.5')) chapter3Score += 2;
    
    const hasConclusion = lowerText.includes('заключение');
    const conclusionSectionScore = hasConclusion ? 3 : 0;
    const hasBibliography = lowerText.includes('список литературы') || lowerText.includes('библиография');
    const bibliographyScore = hasBibliography ? 4 : 0;
    const hasAppendix = lowerText.includes('приложение');
    const appendixScore = hasAppendix ? 5 : 0;
    const bibliographyPresentScore = hasBibliography ? 5 : 0;
    
    let sourcesCount = 0;
    if (hasBibliography) {
      const bibliographyMatch = extractedText.match(/(список литературы|библиография)[\s\S]*?(?=глава|приложение|$)/i);
      if (bibliographyMatch) {
        sourcesCount = (bibliographyMatch[0].match(/\d{4}/g) || []).length;
      }
    }
    let sourcesScore = 0;
    if (sourcesCount >= 20) sourcesScore = 5;
    else if (sourcesCount >= 15) sourcesScore = 4;
    else if (sourcesCount >= 10) sourcesScore = 3;
    else if (sourcesCount >= 5) sourcesScore = 2;
    else sourcesScore = 1;
    
    const hasGOST = /\.\s*[А-Я][а-я]+\.[\s]*[А-Я][а-я]+\.[\s]*[А-Я][а-я]+/.test(extractedText);
    const gostScore = hasGOST ? 5 : 0;
    const hasReferences = /\[\d+\]|\([А-Яа-я]+\s\d{4}\)/.test(extractedText);
    const referencesScore = hasReferences ? 5 : 0;
    
    const words = extractedText.split(/\s+/);
    const uniqueWords = new Set(words);
    const uniquenessRatio = Math.min(100, Math.max(0, Math.floor((uniqueWords.size / words.length) * 100)));
    let uniquenessScore = 0;
    if (uniquenessRatio >= 80) uniquenessScore = 5;
    else if (uniquenessRatio >= 70) uniquenessScore = 4;
    else if (uniquenessRatio >= 60) uniquenessScore = 3;
    else if (uniquenessRatio >= 50) uniquenessScore = 2;
    else uniquenessScore = 1;
    
    const fontTotal = fontTimesScore + fontSize14Score + lineSpacingScore + marginsScore + pageNumbersScore;
    const volumeTotal = volumeScore + introScore + conclusionScore;
    const structureTotal = titleScore + introSectionScore + chapter1Score + chapter2Score + chapter3Score + conclusionSectionScore + bibliographyScore + appendixScore;
    const referencesTotal = bibliographyPresentScore + sourcesScore + gostScore + referencesScore;
    const totalScore = fontTotal + volumeTotal + structureTotal + referencesTotal + uniquenessScore;
    const percentage = Math.round((totalScore / 100) * 100);
    
    let status = 'poor';
    let grade = '2 — НЕУДОВЛЕТВОРИТЕЛЬНО';
    if (percentage >= 90) { status = 'excellent'; grade = '5 — ОТЛИЧНО'; }
    else if (percentage >= 70) { status = 'good'; grade = '4 — ХОРОШО'; }
    else if (percentage >= 60) { status = 'satisfactory'; grade = '3 — УДОВЛЕТВОРИТЕЛЬНО'; }
    
    setResults({
      totalScore, percentage, status, grade,
      fontTotal, volumeTotal, structureTotal, referencesTotal, uniquenessScore,
      details: {
        fontTimesScore, fontSize14Score, lineSpacingScore, marginsScore, pageNumbersScore,
        volumeScore, introScore, conclusionScore,
        titleScore, introSectionScore, chapter1Score, chapter2Score, chapter3Score,
        conclusionSectionScore, bibliographyScore, appendixScore,
        bibliographyPresentScore, sourcesScore, gostScore, referencesScore,
        uniquenessScore, uniquenessRatio
      }
    });
    
    setIsAnalyzing(false);
  };

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoIcon />
            <LogoText>
              <LogoTitle>VKR<span>Audit</span></LogoTitle>
              <LogoSubtitle>Система оценки выпускных работ</LogoSubtitle>
            </LogoText>
          </Logo>
          <Badge>ГОСТ Р 7.0.11-2024</Badge>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <Uploader onFileExtracted={analyzeDocument} isAnalyzing={isAnalyzing} />
        
        {isAnalyzing && <ProcessTimeline steps={steps} />}
        
        {!text && !isAnalyzing && <ScoringGuide />}
        
        {text && !isAnalyzing && results && (
          <>
            <ResultsDashboard results={results} />
            <RequirementsList results={results.details} />
            <ReportDownloader analysis={results} fileName={fileName} />
          </>
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;