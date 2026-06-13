import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckCircleIcon  from '@mui/icons-material/CheckCircle';
import CancelIcon       from '@mui/icons-material/Cancel';
import LightbulbIcon    from '@mui/icons-material/Lightbulb';
import ExpandMoreIcon   from '@mui/icons-material/ExpandMore';
import ExpandLessIcon   from '@mui/icons-material/ExpandLess';
import { useApp }       from '../contexts/AppContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  margin-top: 24px;
  animation: ${fadeUp} 0.5s ease;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
`;

const Title = styled.div`
  font-size: 14px; font-weight: 800; letter-spacing: -0.2px;
  color: var(--text-1);
  display: flex; align-items: center; gap: 8px;
`;

const TitleIcon = styled.div`
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  display: flex; align-items: center; justify-content: center;
`;

const ExpandBtn = styled.div`
  cursor: pointer; color: var(--text-5); display: flex;
  transition: color 0.15s;
  &:hover { color: var(--text-3); }
`;

const ScoreLine = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px; margin-bottom: 12px;
  font-size: 12px; color: var(--text-2);
  flex-wrap: wrap;
  @media(max-width:480px){ font-size: 11px; }
`;

const ScoreBig = styled.span`
  font-size: 17px; font-weight: 900;
  color: ${p =>
    p.$v >= 80 ? '#10B981' :
    p.$v >= 60 ? '#F59E0B' : '#EF4444'};
`;

const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;
  @media(max-width: 600px) { grid-template-columns: 1fr; }
`;

const Col = styled.div`
  background: ${p =>
    p.$type === 'pro' ? 'var(--green-tint)' :
    p.$type === 'con' ? 'var(--red-tint)'   :
                        'var(--yellow-tint)'};
  border: 1.5px solid ${p =>
    p.$type === 'pro' ? 'var(--green-border)' :
    p.$type === 'con' ? 'var(--red-border)'   :
                        'var(--yellow-border)'};
  border-radius: 14px; padding: 14px;
`;

const ColHead = styled.div`
  display: flex; align-items: center; gap: 7px; margin-bottom: 10px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase;
  color: ${p =>
    p.$type === 'pro' ? '#10B981' :
    p.$type === 'con' ? '#EF4444' : '#F59E0B'};
`;

const Item = styled.div`
  display: flex; align-items: flex-start; gap: 7px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  &:last-child { border-bottom: none; padding-bottom: 0; }
  font-size: 11.5px; line-height: 1.55;
  color: var(--text-2);
`;

const Dot = styled.div`
  width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
  background: ${p =>
    p.$type === 'pro' ? '#10B981' :
    p.$type === 'con' ? '#EF4444' : '#F59E0B'};
`;

const TipsCol = styled.div`
  background: var(--yellow-tint);
  border: 1.5px solid var(--yellow-border);
  border-radius: 14px; padding: 14px;
`;

function generateFeedback(results, t) {
  const d = results.details || {};
  const pros = [];
  const cons = [];
  const tips = [];
  const pct = results.totalScore || 0;

  // Форматирование
  if (d.fontTimesScore === 4 && d.fontSize14Score === 4 && d.lineSpacingScore === 4) {
    pros.push(t.proFormatOk);
  } else {
    if ((d.fontTimesScore ?? 0) < 4)   cons.push(t.conFontTimes);
    if ((d.fontSize14Score ?? 0) < 4)  cons.push(t.conFontSize);
    if ((d.lineSpacingScore ?? 0) < 4) cons.push(t.conLineSpacing);
    tips.push(t.tipFormat);
  }

  if (d.pageNumbersScore === 3)
    pros.push(t.proPageNums);
  else {
    cons.push(t.conPageNums);
    tips.push(t.tipPageNums);
  }

  // Объём
  const pages = results.meta?.pages;
  if (pages >= 45)
    pros.push(t.proVolOk(pages));
  else if (pages)
    cons.push(t.conVolLow(pages));

  if ((d.introScore ?? 0) === 4)
    pros.push(t.proIntroOk);
  else if ((d.introScore ?? 0) > 0) {
    cons.push(t.conIntroShort);
    tips.push(t.tipIntro);
  } else {
    cons.push(t.conIntroMissing);
    tips.push(t.tipIntroMissing);
  }

  if ((d.conclusionScore ?? 0) === 4)
    pros.push(t.proConclusionOk);
  else if ((d.conclusionScore ?? 0) > 0) {
    cons.push(t.conConcShort);
    tips.push(t.tipConclusion);
  } else {
    cons.push(t.conConcMissing);
    tips.push(t.tipConcMissing);
  }

  // Структура
  if ((d.contentsScore ?? 0) === 5)
    pros.push(t.proContentsOk);
  else {
    cons.push(t.conContents);
    tips.push(t.tipContents);
  }

  const chapters = [
    { score: d.chapter1Score ?? 0, max: 9,  num: 1 },
    { score: d.chapter2Score ?? 0, max: 10, num: 2 },
    { score: d.chapter3Score ?? 0, max: 10, num: 3 },
  ];
  let chaptersOk = 0;
  chapters.forEach(({ score, max, num }) => {
    if (score === max) {
      chaptersOk++;
    } else if (score > 0) {
      cons.push(t.conChapterSubs(num));
      tips.push(t.tipChapterSubs(num));
    } else {
      cons.push(t.conChapterMiss(num));
      tips.push(t.tipChapterMiss(num));
    }
  });
  if (chaptersOk === 3) pros.push(t.proChaptersOk);

  if ((d.conclusionSectionScore ?? 0) === 5)
    pros.push(t.proConcSecOk);

  if ((d.appendixScore ?? 0) > 0)
    pros.push(t.proAppendixOk);
  else {
    cons.push(t.conAppendix);
    tips.push(t.tipAppendix);
  }

  // Анализ
  if ((d.tablesFiguresScore ?? 0) === 5)
    pros.push(t.proTablesOk);
  else {
    cons.push(t.conTables);
    tips.push(t.tipTables);
  }

  if ((d.findingsScore ?? 0) === 5)
    pros.push(t.proFindingsOk);
  else {
    cons.push(t.conFindings);
    tips.push(t.tipFindings);
  }

  if ((d.citationsScore ?? 0) === 5)
    pros.push(t.proCitationsOk);
  else {
    cons.push(t.conCitations);
    tips.push(t.tipCitations);
  }

  // Общий совет
  if (pct >= 90)      tips.push(t.tipExcellent);
  else if (pct >= 70) tips.push(t.tipGood);
  else                tips.push(t.tipPoor);

  return { pros, cons, tips };
}

export default function FeedbackCard({ results }) {
  const [open, setOpen] = useState(true);
  const { t } = useApp();
  const { pros, cons, tips } = generateFeedback(results, t);
  const pct = results.totalScore || 0;

  const scoreText =
    pct >= 90 ? t.scoreExcellent :
    pct >= 70 ? t.scoreGood :
    pct >= 60 ? t.scoreFair :
                t.scorePoor;

  return (
    <Wrap>
      <Header>
        <Title>
          <TitleIcon>
            <LightbulbIcon sx={{ fontSize: 15, color: '#fff' }}/>
          </TitleIcon>
          {t.feedbackTitle}
        </Title>
        <ExpandBtn onClick={() => setOpen(o => !o)}>
          {open ? <ExpandLessIcon sx={{ fontSize: 20 }}/> : <ExpandMoreIcon sx={{ fontSize: 20 }}/>}
        </ExpandBtn>
      </Header>

      {open && (
        <>
          <ScoreLine>
            <ScoreBig $v={pct}>{pct}/100</ScoreBig>
            <span>{scoreText}</span>
          </ScoreLine>

          <Grid>
            <Col $type="pro">
              <ColHead $type="pro">
                <CheckCircleIcon sx={{ fontSize: 13 }}/>
                {t.feedbackPros} ({pros.length})
              </ColHead>
              {pros.length === 0
                ? <Item><Dot $type="pro"/>{t.feedbackNoPros}</Item>
                : pros.map((p, i) => (
                  <Item key={i}><Dot $type="pro"/>{p}</Item>
                ))}
            </Col>

            <Col $type="con">
              <ColHead $type="con">
                <CancelIcon sx={{ fontSize: 13 }}/>
                {t.feedbackCons} ({cons.length})
              </ColHead>
              {cons.length === 0
                ? <Item><Dot $type="con"/>{t.feedbackNoCons}</Item>
                : cons.map((c, i) => (
                  <Item key={i}><Dot $type="con"/>{c}</Item>
                ))}
            </Col>
          </Grid>

          <TipsCol>
            <ColHead $type="tip">
              <LightbulbIcon sx={{ fontSize: 13 }}/>
              {t.feedbackTips} ({tips.length})
            </ColHead>
            {tips.map((tip, i) => (
              <Item key={i}><Dot $type="tip"/>{tip}</Item>
            ))}
          </TipsCol>
        </>
      )}
    </Wrap>
  );
}
