// src/components/ScoringGuide.jsx
import React from 'react';
import styled from 'styled-components';
import GavelIcon from '@mui/icons-material/Gavel';

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 24px;
  border: 1px solid #E5E5EA;
  margin-bottom: 24px;
  padding: 28px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E5EA;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1E3A5F;
    margin: 0;
  }
  
  .total {
    background: #1E3A5F;
    color: white;
    padding: 8px 20px;
    border-radius: 40px;
    font-weight: 600;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled.div`
  background: #F9F9FB;
  border-radius: 16px;
  padding: 16px;
  border-left: 4px solid ${props => props.$color};
`;

const CategoryTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1E3A5F;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
`;

const CategoryTotal = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$color};
`;

const RequirementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RequirementRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 0.5px solid #E5E5EA;
  
  .name {
    color: #3A3A3C;
  }
  .score {
    font-weight: 600;
    color: #1E3A5F;
  }
`;

const GradeTable = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #E5E5EA;
`;

const GradeItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  background: #F9F9FB;
  border-radius: 12px;
  
  .grade {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.$color};
  }
  .range {
    font-size: 11px;
    color: #8E8E93;
    margin-top: 4px;
  }
`;

const FooterNote = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 11px;
  color: #8E8E93;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ScoringGuide = () => {
  const categories = [
    { name: 'Шрифт и форматирование', color: '#1E3A5F', total: 20, items: ['Times New Roman (3)', 'Размер 14 pt (3)', 'Интервал 1.15 (4)', 'Поля по ГОСТ (5)', 'Нумерация страниц (5)'] },
    { name: 'Объём работы', color: '#2C5282', total: 15, items: ['Общий объём 70 стр (10)', 'Введение 2-3 стр (3)', 'Заключение 2-3 стр (2)'] },
    { name: 'Структура', color: '#3A6B4B', total: 40, items: ['Титульный лист (3)', 'Введение (3)', 'Глава 1 с подразделами (6)', 'Глава 2 с подразделами (8)', 'Глава 3 с подразделами (8)', 'Заключение (3)', 'Список литературы (4)', 'Приложения (5)'] },
    { name: 'Библиография', color: '#C4A43A', total: 20, items: ['Наличие списка (5)', 'Количество источников 20+ (5)', 'Оформление по ГОСТ (5)', 'Ссылки в тексте (5)'] },
    { name: 'Уникальность', color: '#C23B22', total: 5, items: ['Оригинальность текста (5)'] }
  ];

  // НОВАЯ ШКАЛА ОЦЕНОК
  const grades = [
    { grade: '5 — ОТЛИЧНО', range: '90-100%', color: '#2C6E49' },
    { grade: '4 — ХОРОШО', range: '70-89%', color: '#1E3A5F' },
    { grade: '3 — УДОВЛЕТВОРИТЕЛЬНО', range: '60-69%', color: '#C4A43A' },
    { grade: '2 — НЕУДОВЛЕТВОРИТЕЛЬНО', range: '0-59%', color: '#C23B22' }
  ];

  return (
    <Card>
      <Header>
        <h2>Система оценки ВКР</h2>
        <div className="total">Максимум: 100 баллов → 100%</div>
      </Header>
      
      <CategoriesGrid>
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} $color={cat.color}>
            <CategoryTitle>
              {cat.name}
              <CategoryTotal $color={cat.color}>{cat.total} б.</CategoryTotal>
            </CategoryTitle>
            <RequirementList>
              {cat.items.map((item, i) => (
                <RequirementRow key={i}>
                  <span className="name">{item.split('(')[0]}</span>
                  <span className="score">{item.split('(')[1]}</span>
                </RequirementRow>
              ))}
            </RequirementList>
          </CategoryCard>
        ))}
      </CategoriesGrid>
      
      <GradeTable>
        {grades.map((g, idx) => (
          <GradeItem key={idx} $color={g.color}>
            <div className="grade">{g.grade}</div>
            <div className="range">{g.range}</div>
          </GradeItem>
        ))}
      </GradeTable>
      
      <FooterNote>
        <GavelIcon sx={{ fontSize: 12 }} />
        <span>Утверждено в соответствии с требованиями ГОСТ Р 7.0.11-2024</span>
      </FooterNote>
    </Card>
  );
};

export default ScoringGuide;