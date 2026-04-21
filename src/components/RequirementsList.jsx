// src/components/RequirementsList.jsx
import React from 'react';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VerifiedIcon from '@mui/icons-material/Verified';

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1E3A5F;
`;

const SectionTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #1E3A5F;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionStats = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1E3A5F;
  background: #F0F4F8;
  padding: 6px 14px;
  border-radius: 20px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
`;

const RequirementCard = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #E5E5EA;
  padding: 18px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`;

const CardNumber = styled.div`
  width: 36px;
  height: 36px;
  background: ${props => props.$completed ? '#2C6E49' : props.$partial ? '#C4A43A' : '#E5E5EA'};
  color: ${props => (props.$completed || props.$partial) ? 'white' : '#8E8E93'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
`;

const CardScore = styled.div`
  text-align: right;
  
  .score {
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.$completed ? '#2C6E49' : props.$partial ? '#C4A43A' : '#C23B22'};
    font-feature-settings: 'tnum';
  }
  .max {
    font-size: 12px;
    color: '#8E8E93';
  }
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1E3A5F;
  margin-bottom: 12px;
  line-height: 1.35;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: #E5E5EA;
  border-radius: 2px;
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.$color || '#2C6E49'};
  border-radius: 2px;
  transition: width 0.4s ease;
`;

const StatusIcon = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.$completed ? '#2C6E49' : props.$partial ? '#C4A43A' : '#C23B22'};
  margin-top: 8px;
`;

const RequirementsList = ({ results }) => {
  // Требования с правильной нумерацией 1-21
  const requirements = [
    // ===== ШРИФТ (1-5) =====
    { id: 1, name: 'Шрифт Times New Roman', maxScore: 3, score: results?.fontTimesScore ?? 3, category: 'Шрифт' },
    { id: 2, name: 'Размер шрифта 14 pt', maxScore: 3, score: results?.fontSize14Score ?? 3, category: 'Шрифт' },
    { id: 3, name: 'Межстрочный интервал 1.15', maxScore: 4, score: results?.lineSpacingScore ?? 4, category: 'Шрифт' },
    { id: 4, name: 'Поля (левое 30мм, остальные 20мм)', maxScore: 5, score: results?.marginsScore ?? 5, category: 'Шрифт' },
    { id: 5, name: 'Нумерация страниц', maxScore: 5, score: results?.pageNumbersScore ?? 5, category: 'Шрифт' },
    
    // ===== ОБЪЁМ (6-8) =====
    { id: 6, name: 'Общий объём 70 страниц', maxScore: 10, score: results?.volumeScore ?? 10, category: 'Объём' },
    { id: 7, name: 'Введение 2-3 страницы', maxScore: 3, score: results?.introScore ?? 3, category: 'Объём' },
    { id: 8, name: 'Заключение 2-3 страницы', maxScore: 2, score: results?.conclusionScore ?? 2, category: 'Объём' },
    
    // ===== СТРУКТУРА (9-16) =====
    { id: 9, name: 'Титульный лист', maxScore: 3, score: results?.titleScore ?? 3, category: 'Структура' },
    { id: 10, name: 'Введение', maxScore: 3, score: results?.introSectionScore ?? 3, category: 'Структура' },
    { id: 11, name: 'Глава 1 (с подразделами 1.1-1.4)', maxScore: 6, score: results?.chapter1Score ?? 6, category: 'Структура' },
    { id: 12, name: 'Глава 2 (с подразделами 2.1-2.5)', maxScore: 8, score: results?.chapter2Score ?? 8, category: 'Структура' },
    { id: 13, name: 'Глава 3 (с подразделами 3.1-3.5)', maxScore: 8, score: results?.chapter3Score ?? 8, category: 'Структура' },
    { id: 14, name: 'Заключение', maxScore: 3, score: results?.conclusionSectionScore ?? 3, category: 'Структура' },
    { id: 15, name: 'Список литературы', maxScore: 4, score: results?.bibliographyScore ?? 4, category: 'Структура' },
    { id: 16, name: 'Приложения', maxScore: 5, score: results?.appendixScore ?? 5, category: 'Структура' },
    
    // ===== БИБЛИОГРАФИЯ (17-20) =====
    { id: 17, name: 'Наличие списка литературы', maxScore: 5, score: results?.bibliographyPresentScore ?? 5, category: 'Библиография' },
    { id: 18, name: 'Количество источников (минимум 20)', maxScore: 5, score: results?.sourcesScore ?? 5, category: 'Библиография' },
    { id: 19, name: 'Оформление по ГОСТ', maxScore: 5, score: results?.gostScore ?? 5, category: 'Библиография' },
    { id: 20, name: 'Ссылки в тексте', maxScore: 5, score: results?.referencesScore ?? 5, category: 'Библиография' },
    
    // ===== УНИКАЛЬНОСТЬ (21) =====
    { id: 21, name: 'Уникальность текста', maxScore: 5, score: results?.uniquenessScore ?? 5, category: 'Уникальность', uniquenessRatio: results?.uniquenessRatio ?? 85 }
  ];

  const categories = [
    { name: 'Шрифт', icon: <FormatQuoteIcon sx={{ fontSize: 18 }} />, color: '#1E3A5F', ids: [1,2,3,4,5] },
    { name: 'Объём', icon: <DescriptionIcon sx={{ fontSize: 18 }} />, color: '#2C5282', ids: [6,7,8] },
    { name: 'Структура', icon: <MenuBookIcon sx={{ fontSize: 18 }} />, color: '#3A6B4B', ids: [9,10,11,12,13,14,15,16] },
    { name: 'Библиография', icon: <LibraryBooksIcon sx={{ fontSize: 18 }} />, color: '#C4A43A', ids: [17,18,19,20] },
    { name: 'Уникальность', icon: <VerifiedIcon sx={{ fontSize: 18 }} />, color: '#C23B22', ids: [21] }
  ];

  const getCategoryTotal = (categoryIds) => {
    let earned = 0;
    let total = 0;
    categoryIds.forEach(id => {
      const req = requirements.find(r => r.id === id);
      if (req) {
        total += req.maxScore;
        earned += req.score;
      }
    });
    return { earned, total };
  };

  return (
    <div>
      {categories.map(category => {
        const categoryReqs = requirements.filter(r => category.ids.includes(r.id));
        const { earned, total } = getCategoryTotal(category.ids);
        
        return (
          <Section key={category.name}>
            <SectionHeader>
              <SectionTitle>
                {category.icon}
                {category.name}
              </SectionTitle>
              <SectionStats>{earned}/{total} баллов</SectionStats>
            </SectionHeader>
            <CardsGrid>
              {categoryReqs.map(req => {
                const isCompleted = req.score === req.maxScore;
                const isPartial = req.score > 0 && req.score < req.maxScore;
                const progressPercent = (req.score / req.maxScore) * 100;
                
                return (
                  <RequirementCard key={req.id}>
                    <CardHeader>
                      <CardNumber $completed={isCompleted} $partial={isPartial && !isCompleted}>
                        {req.id}
                      </CardNumber>
                      <CardScore $completed={isCompleted} $partial={isPartial && !isCompleted}>
                        <div className="score">{req.score}/{req.maxScore}</div>
                        <div className="max">баллов</div>
                      </CardScore>
                    </CardHeader>
                    <CardTitle>
                      {req.name}
                    </CardTitle>
                    <ProgressBar>
                      <ProgressFill $width={progressPercent} $color={isCompleted ? '#2C6E49' : isPartial ? '#C4A43A' : '#C23B22'} />
                    </ProgressBar>
                    <StatusIcon $completed={isCompleted} $partial={isPartial && !isCompleted}>
                      {isCompleted ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <CancelIcon sx={{ fontSize: 14 }} />}
                      {isCompleted ? 'Выполнено' : isPartial ? 'Частично выполнено' : 'Не выполнено'}
                    </StatusIcon>
                    {req.uniquenessRatio && (
                      <div style={{ fontSize: 11, marginTop: 10, color: '#8E8E93' }}>
                        Оригинальность: {req.uniquenessRatio}%
                      </div>
                    )}
                  </RequirementCard>
                );
              })}
            </CardsGrid>
          </Section>
        );
      })}
    </div>
  );
};

export default RequirementsList;