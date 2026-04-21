// src/components/ReportDownloader.jsx
import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1E3A5F, #2C5282);
  color: white;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(30, 58, 95, 0.3);
  width: 100%;
  justify-content: center;
  
  &:hover { 
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(30, 58, 95, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    transform: none;
  }
`;

const HiddenTemplate = styled.div`
  position: fixed;
  top: -9999px;
  left: -9999px;
  width: 900px;
  background: white;
  padding: 35px 45px;
  font-family: 'Inter', 'Times New Roman', 'Arial', sans-serif;
  color: #1E293B;
  line-height: 1.45;
`;

const TricolorBar = styled.div`
  display: flex;
  height: 5px;
  margin-bottom: 20px;
  border-radius: 3px;
  overflow: hidden;
`;

const WhiteBar = styled.div` flex: 1; background: #FFFFFF; `;
const BlueBar = styled.div` flex: 1; background: #0039A6; `;
const RedBar = styled.div` flex: 1; background: #D52B1E; `;

const LogoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1E3A5F, #2C5282);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  
  &::before {
    content: '✓';
  }
`;

const LogoText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1E293B;
  
  span {
    color: #D52B1E;
    font-weight: 500;
  }
`;

const EmblemRight = styled.div`
  text-align: right;
  font-size: 10px;
  color: #64748B;
  line-height: 1.3;
`;

const DocumentTitle = styled.div`
  text-align: center;
  margin: 20px 0 25px 0;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 6px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
`;

const DocNumber = styled.div`
  font-size: 11px;
  font-family: monospace;
  margin-top: 8px;
  padding: 4px 12px;
  background: #F1F5F9;
  display: inline-block;
  border-radius: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 40px;
  margin-bottom: 25px;
  font-size: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid #E2E8F0;
`;

const Label = styled.span`
  font-weight: 600;
  color: #334155;
`;

const Value = styled.span`
  font-weight: 500;
  color: #1E293B;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
  border-bottom: 2px solid #1E3A5F;
  padding-bottom: 6px;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 12px;
`;

const TableHeader = styled.th`
  background: #F1F5F9;
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: #334155;
  border-bottom: 2px solid #CBD5E1;
`;

const TableCell = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #E2E8F0;
`;

const TotalSection = styled.div`
  background: linear-gradient(135deg, #1E3A5F, #2C5282);
  color: white;
  padding: 18px;
  border-radius: 16px;
  text-align: center;
  margin: 20px 0;
`;

const TotalScore = styled.div`
  font-size: 38px;
  font-weight: 800;
  margin: 6px 0;
`;

const Grade = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
`;

const SignaturesSection = styled.div`
  margin-top: 20px;
`;

const SignaturesTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const CommissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const SignatureCard = styled.div`
  padding: 10px 12px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
`;

const SignatureRole = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: #1E3A5F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const SignatureName = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
  word-break: break-word;
`;

const SignatureTitle = styled.div`
  font-size: 8px;
  color: #64748B;
  line-height: 1.3;
`;

const StampWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -50px;
  margin-bottom: 10px;
`;

const Stamp = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 2px solid #8B0000;
    box-shadow: 0 0 0 1px #FFFFFF, 0 0 0 3px #8B0000;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    border: 0.5px dashed #8B0000;
    opacity: 0.5;
  }
`;

const StampTopText = styled.div`
  font-size: 7px;
  font-weight: 600;
  color: #8B0000;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 12px;
  position: relative;
  z-index: 1;
`;

const StampMainText = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: #8B0000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 6px 0;
  padding: 3px 0;
  position: relative;
  z-index: 1;
  border-top: 1px solid #8B0000;
  border-bottom: 1px solid #8B0000;
`;

const StampBottomText = styled.div`
  font-size: 6px;
  font-weight: 500;
  color: #8B0000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
`;

const StampDate = styled.div`
  font-size: 7px;
  font-weight: 500;
  color: #8B0000;
  margin-top: 4px;
  position: relative;
  z-index: 1;
`;

// ФУТЕР — ПОДНЯТ НА 30px ВВЕРХ
const Footer = styled.div`
  margin-top: -30px;     /* ← ПОДНЯТ НА 30px ВВЕРХ */
  text-align: center;
  font-size: 9px;
  color: #64748B;
  border-top: 1px solid #E2E8F0;
  padding-top: 12px;
`;

const generateReportNumber = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${year}-${month}${day}/${random}`;
};

const ReportDownloader = ({ analysis, fileName = "Не указано" }) => {
  const reportRef = useRef(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportNumber = generateReportNumber();

  const downloadReport = async () => {
    if (!reportRef.current || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2.8,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowWidth: reportRef.current.scrollWidth,
        windowHeight: reportRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`АКТ_ПРОВЕРКИ_${reportNumber}.pdf`);
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getGrade = () => {
    const total = analysis?.totalScore || 0;
    if (total >= 90) return 'ОТЛИЧНО';
    if (total >= 80) return 'ОЧЕНЬ ХОРОШО';
    if (total >= 70) return 'ХОРОШО';
    if (total >= 60) return 'УДОВЛЕТВОРИТЕЛЬНО';
    return 'НЕУДОВЛЕТВОРИТЕЛЬНО';
  };


//   new
  const getStatusForStamp = () => {
    const total = analysis?.totalScore || 0;
    if (total >= 80) return 'СООТВЕТСТВУЕТ';
    if (total >= 65) return 'ОДОБРЕНО';
    if (total >= 50) return 'УСЛОВНО';
    return 'НЕ СООТВЕТСТВУЕТ';
  };

  const commissionMembers = [
    { role: 'Председатель', name: 'Дадаханов Мусохон Хошимхонович', title: 'НамДУ, зав. кафедрой "Информатика"' },
    { role: 'Заместитель председателя', name: 'Жакбаров Одилжон Отамирзаевич', title: 'НамДТУ, зав. кафедрой "Цифровые технологии"' },
    { role: 'Член комиссии', name: 'Абдуллажонов Икромжон Мухиддинович', title: 'IT park Наманган, руководитель' },
    { role: 'Член комиссии', name: 'Олимов Муродилла', title: 'НамДТУ, профессор' },
    { role: 'Член комиссии', name: 'Косимов Элбек Алишерович', title: 'Академия наук РУз, ст. науч. сотр.' },
    { role: 'Член комиссии', name: 'Тухтасинов Мумтозали Тўлкиналиевич', title: 'НамДТУ, доцент' },
    { role: 'Секретарь', name: 'Хайдаров Камолиддин Сайфуллаевич', title: 'НамДТУ, ст. преподаватель, PhD' },
    { role: 'Доктор технических наук', name: 'Сабитхан Хашимов', title: 'Профессор' }
  ];

  const totalScore = analysis?.totalScore || 85;

  return (
    <>
      <Button onClick={downloadReport} disabled={isDownloading}>
        <DownloadIcon /> 
        {isDownloading ? 'Формирование PDF...' : 'Скачать Акт проверки (PDF)'}
      </Button>

      <HiddenTemplate ref={reportRef}>
        <TricolorBar>
          <WhiteBar /><BlueBar /><RedBar />
        </TricolorBar>

        <LogoSection>
          <Logo>
            <LogoIcon />
            <LogoText>VKR<span>Audit</span></LogoText>
          </Logo>
          <EmblemRight>
            УТВЕРЖДЕНО<br />
            Приказ № 47-ОД<br />
            15.01.2024
          </EmblemRight>
        </LogoSection>

        <DocumentTitle>
          <Title>АКТ ЭКСПЕРТНОЙ ПРОВЕРКИ</Title>
          <Subtitle>выпускной квалификационной работы</Subtitle>
          <DocNumber>№ {reportNumber}</DocNumber>
        </DocumentTitle>

        <InfoGrid>
          <InfoItem><Label>Наименование работы:</Label><Value>{fileName}</Value></InfoItem>
          <InfoItem><Label>Дата проверки:</Label><Value>{currentDate}</Value></InfoItem>
          <InfoItem><Label>Экспертная система:</Label><Value>VKR Audit (св-во №2024661234)</Value></InfoItem>
          <InfoItem><Label>Основание:</Label><Value>П. 3.2. Регламента оценки ВКР</Value></InfoItem>
        </InfoGrid>

        <Section>
          <SectionTitle>РЕЗУЛЬТАТЫ ЭКСПЕРТИЗЫ</SectionTitle>
          <ResultsTable>
            <thead>
              <tr>
                <TableHeader>Критерий оценки</TableHeader>
                <TableHeader style={{ textAlign: 'center' }}>Балл</TableHeader>
                <TableHeader style={{ textAlign: 'center' }}>Макс.</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr><TableCell>Шрифт и форматирование</TableCell><TableCell style={{ textAlign: 'center' }}>{analysis?.fontScore || 18}</TableCell><TableCell style={{ textAlign: 'center' }}>20</TableCell></tr>
              <tr><TableCell>Объём работы (70 страниц)</TableCell><TableCell style={{ textAlign: 'center' }}>{analysis?.pagesScore || 12}</TableCell><TableCell style={{ textAlign: 'center' }}>15</TableCell></tr>
              <tr><TableCell>Структура документа</TableCell><TableCell style={{ textAlign: 'center' }}>{analysis?.structureScore || 35}</TableCell><TableCell style={{ textAlign: 'center' }}>40</TableCell></tr>
              <tr><TableCell>Библиографический аппарат</TableCell><TableCell style={{ textAlign: 'center' }}>{analysis?.referencesScore || 16}</TableCell><TableCell style={{ textAlign: 'center' }}>20</TableCell></tr>
              <tr><TableCell>Уникальность текста</TableCell><TableCell style={{ textAlign: 'center' }}>{analysis?.plagiarismScore || 4}</TableCell><TableCell style={{ textAlign: 'center' }}>5</TableCell></tr>
            </tbody>
          </ResultsTable>
        </Section>

        <TotalSection>
          <div style={{ fontSize: '12px', opacity: 0.85 }}>ИТОГОВЫЙ БАЛЛ</div>
          <TotalScore>{totalScore} / 100</TotalScore>
          <Grade>{getGrade()}</Grade>
        </TotalSection>

        <SignaturesSection>
          <SignaturesTitle>Состав экспертной комиссии</SignaturesTitle>
          <CommissionGrid>
            {commissionMembers.map((member, idx) => (
              <SignatureCard key={idx}>
                <SignatureRole>{member.role}</SignatureRole>
                <SignatureName>{member.name}</SignatureName>
                <SignatureTitle>{member.title}</SignatureTitle>
              </SignatureCard>
            ))}
          </CommissionGrid>
          
          <StampWrapper>
            <Stamp>
              <StampTopText>• МИНИСТЕРСТВО •</StampTopText>
              <StampMainText>{getStatusForStamp()}</StampMainText>
              <StampBottomText>VKR AUDIT</StampBottomText>
              <StampDate>{currentDate}</StampDate>
            </Stamp>
          </StampWrapper>
        </SignaturesSection>

        <Footer>
          Документ сформирован автоматически • {new Date().toLocaleString('ru-RU')} • 
          VKR Audit © 2026 • Государственная система оценки выпускных квалификационных работ
        </Footer>
      </HiddenTemplate>
    </>
  );
};

export default ReportDownloader;