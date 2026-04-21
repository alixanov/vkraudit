// src/components/Uploader.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArticleIcon from '@mui/icons-material/Article';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const subtlePulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const UploadZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed ${props => props.$hasFile ? '#2C6E49' : '#C6C6C8'};
  border-radius: 32px;
  padding: 56px 32px;
  background: ${props => props.$hasFile ? '#F0F7F2' : '#FFFFFF'};
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
  
  &:hover {
    border-color: #1E3A5F;
    background: ${props => props.$hasFile ? '#E8F0EA' : '#F8FAFC'};
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(30, 58, 95, 0.08);
  }
`;

const UploadInput = styled.input`display: none;`;

const FileInfo = styled.div`
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 0.5px solid rgba(30, 58, 95, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    padding: 16px 20px;
  }
`;

const FileInfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
  
  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const FileIconWrapper = styled.div`
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #F0F4F8 0%, #E8ECEF 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.02);
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FileName = styled.span`
  font-weight: 600;
  color: #1E3A5F;
  font-size: 15px;
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    max-width: 200px;
    font-size: 13px;
  }
`;

const FileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #6B7A8A;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const FileStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #2C6E49;
  animation: ${subtlePulse} 1.5s ease-in-out infinite;
`;

const ActionButton = styled.button`
  background: #1E3A5F;
  color: white;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 510;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  letter-spacing: 0.3px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.12);
  
  &:hover {
    background: #2C5282;
    transform: scale(0.97);
    box-shadow: 0 6px 16px rgba(30, 58, 95, 0.2);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 640px) {
    justify-content: center;
    width: 100%;
  }
`;

const extractText = async (file) => {
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  } else if (file.name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  return '';
};

const Uploader = ({ onFileExtracted, isAnalyzing }) => {
  const [fileName, setFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      setIsExtracted(false);
      setFileName(file.name);
      const text = await extractText(file);
      setIsExtracted(true);
      onFileExtracted(text, file.name);
      setIsLoading(false);
    }
  };

  const handleReplace = () => {
    if (!isAnalyzing) {
      document.getElementById('upload').click();
    }
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <UploadInput 
        type="file" 
        id="upload" 
        accept=".pdf,.docx" 
        onChange={handleUpload} 
        disabled={isAnalyzing}
      />
      
      <UploadZone htmlFor="upload" $hasFile={fileName}>
        <CloudUploadIcon sx={{ fontSize: 60, color: fileName ? '#2C6E49' : '#A0AAB5', transition: 'all 0.25s ease' }} />
        <h3 style={{ marginTop: 20, marginBottom: 8, color: fileName ? '#2C6E49' : '#1E3A5F', fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px' }}>
          {fileName ? 'Документ загружен' : 'Загрузите дипломную работу'}
        </h3>
        <p style={{ color: '#8E8E93', fontSize: 14, margin: 0, fontWeight: 400 }}>
          {fileName || 'Принимаются файлы PDF, DOCX (до 20 МБ)'}
        </p>
      </UploadZone>
      
      {fileName && (
        <FileInfo>
          <FileInfoLeft>
            <FileIconWrapper>
              <ArticleIcon sx={{ color: '#1E3A5F', fontSize: 26 }} />
            </FileIconWrapper>
            <FileDetails>
              <FileName title={fileName}>{fileName}</FileName>
              <FileMeta>
                {isLoading && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⏳ Обработка документа...</span>}
                {isExtracted && !isLoading && (
                  <FileStatus>
                    <CheckCircleIcon sx={{ fontSize: 14 }} />
                    Документ верифицирован
                  </FileStatus>
                )}
                {!isLoading && isExtracted && (
                  <span style={{ fontSize: 11, color: '#A0AAB5' }}>• Готов к проверке</span>
                )}
              </FileMeta>
            </FileDetails>
          </FileInfoLeft>
          <ActionButton 
            onClick={handleReplace} 
            disabled={isAnalyzing}
          >
            <AutorenewIcon sx={{ fontSize: 18 }} />
            Заменить документ
          </ActionButton>
        </FileInfo>
      )}
    </div>
  );
};

export default Uploader;