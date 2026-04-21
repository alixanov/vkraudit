// src/components/ResultsDashboard.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import GavelIcon from '@mui/icons-material/Gavel';
import BalanceIcon from '@mui/icons-material/Balance';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%);
  border-radius: 32px;
  margin-bottom: 28px;
  padding: 28px 32px;
  color: white;
  animation: ${fadeIn} 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: 0 8px 28px rgba(30, 58, 95, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 280px;
    height: 280px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 50%;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

const ScoreLeft = styled.div`
  .label {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.7;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .value {
    font-size: 52px;
    font-weight: 800;
    line-height: 1;
    margin-top: 8px;
    letter-spacing: -0.5px;
  }
  .grade {
    font-size: 16px;
    font-weight: 600;
    margin-top: 10px;
    color: #FFD700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ScoreRight = styled.div`
  text-align: right;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  padding: 16px 24px;
  border-radius: 28px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  
  .percentage {
    font-size: 48px;
    font-weight: 800;
    line-height: 1;
  }
  .status {
    font-size: 13px;
    opacity: 0.8;
    margin-top: 6px;
    letter-spacing: 0.5px;
  }
`;

const ProgressSection = styled.div`
  margin: 24px 0;
  position: relative;
  z-index: 1;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$width}%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1);
`;

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 11px;
  opacity: 0.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 0.5px solid rgba(255, 255, 255, 0.15);
  position: relative;
  z-index: 1;
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 14px 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  transition: all 0.25s ease;
  border: 0.5px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
  }
  
  .value {
    font-size: 24px;
    font-weight: 700;
    font-feature-settings: 'tnum';
  }
  .label {
    font-size: 10px;
    opacity: 0.7;
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ResultsDashboard = ({ results }) => {
  // Определение цвета для шкалы
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#FFD700';
    if (percentage >= 70) return '#C4A43A';
    if (percentage >= 60) return '#E8A317';
    return '#FF6B6B';
  };

  return (
    <Card>
      <TopRow>
        <ScoreLeft>
          <div className="label">
            <BalanceIcon sx={{ fontSize: 14 }} />
            ИТОГОВАЯ ОЦЕНКА
          </div>
          <div className="value">{results.totalScore}/100</div>
          <div className="grade">
            <GavelIcon sx={{ fontSize: 16 }} />
            {results.grade}
          </div>
        </ScoreLeft>
        <ScoreRight>
          <div className="percentage">{results.percentage}%</div>
          <div className="status">СООТВЕТСТВИЯ</div>
        </ScoreRight>
      </TopRow>
      
      <ProgressSection>
        <ProgressBar>
          <ProgressFill $width={results.percentage} />
        </ProgressBar>
        <ProgressLabels>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </ProgressLabels>
      </ProgressSection>
      
      <StatsGrid>
        <StatItem>
          <div className="value">{results.fontTotal}/20</div>
          <div className="label">Шрифт</div>
        </StatItem>
        <StatItem>
          <div className="value">{results.volumeTotal}/15</div>
          <div className="label">Объём</div>
        </StatItem>
        <StatItem>
          <div className="value">{results.structureTotal}/40</div>
          <div className="label">Структура</div>
        </StatItem>
        <StatItem>
          <div className="value">{results.referencesTotal}/20</div>
          <div className="label">Библиография</div>
        </StatItem>
        <StatItem>
          <div className="value">{results.uniquenessScore}/5</div>
          <div className="label">Уникальность</div>
        </StatItem>
      </StatsGrid>
    </Card>
  );
};

export default ResultsDashboard;