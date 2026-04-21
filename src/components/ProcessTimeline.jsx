// src/components/ProcessTimeline.jsx
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px solid #E5E5EA;
  padding: 24px;
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #1E3A5F;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 16px;
  background: ${props => props.$active ? '#F0F4F8' : '#F9F9FB'};
  border-radius: 16px;
  border: 0.5px solid ${props => props.$active ? '#1E3A5F' : '#E5E5EA'};
  
  .number {
    width: 32px;
    height: 32px;
    background: ${props => props.$active ? '#1E3A5F' : '#E5E5EA'};
    color: ${props => props.$active ? 'white' : '#8E8E93'};
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  .name {
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.$active ? '#1E3A5F' : '#8E8E93'};
  }
`;

const ProcessTimeline = ({ steps }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);
  
  return (
    <Card>
      <Title>Процесс проверки</Title>
      <StepsContainer>
        {steps.map((step, idx) => (
          <Step key={idx} $active={idx === currentStep}>
            <div className="number">{idx + 1}</div>
            <div className="name">{step.name}</div>
          </Step>
        ))}
      </StepsContainer>
    </Card>
  );
};

export default ProcessTimeline;