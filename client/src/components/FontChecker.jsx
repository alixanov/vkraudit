// src/components/FontChecker.jsx
import React from 'react';
import styled from 'styled-components';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #DCE1E6;
  padding: 20px;
  transition: all 0.2s ease;
  &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1E3A5F;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: 16px 0;
`;

const ScoreNumber = styled.div`
  font-size: 42px;
  font-weight: 800;
  color: ${props => props.$passed ? '#2C6E49' : '#C23B22'};
`;

const ScoreMax = styled.div`
  font-size: 14px;
  color: #6B7A8A;
  margin-top: 4px;
`;

const FontChecker = ({ text, results, maxScore = 20 }) => {
  if (results) {
    const passed = results.score >= maxScore * 0.7;
    return (
      <Card>
        <CardTitle><TextFieldsIcon sx={{ fontSize: 18 }} /> Шрифт и форматирование</CardTitle>
        <ScoreDisplay>
          <ScoreNumber $passed={passed}>{results.score}/{maxScore}</ScoreNumber>
          <ScoreMax>максимум {maxScore} баллов</ScoreMax>
        </ScoreDisplay>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardTitle><TextFieldsIcon sx={{ fontSize: 18 }} /> Шрифт и форматирование</CardTitle>
      <ScoreDisplay><div style={{ color: '#A0AAB5' }}>Ожидание проверки...</div></ScoreDisplay>
    </Card>
  );
};

export default FontChecker;