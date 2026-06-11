import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import UploadFileIcon      from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SyncIcon            from '@mui/icons-material/Sync';
import CheckCircleIcon     from '@mui/icons-material/CheckCircle';
import { useApp }          from '../contexts/AppContext';

const pulse  = keyframes`0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}`;
const fadeUp = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

/* ── Drop zone ── */
const Zone = styled.label`
  display: block;
  border: 2px dashed ${p => p.$drag ? '#3B82F6' : p.$file ? 'var(--green-border)' : 'var(--border)'};
  border-radius: 18px;
  padding: 36px 20px 28px;
  text-align: center;
  cursor: pointer;
  background: ${p => p.$drag
    ? 'rgba(59,130,246,0.06)'
    : p.$file
    ? 'var(--green-tint)'
    : 'var(--surface)'};
  transition: border-color .2s, background .2s, box-shadow .2s;
  margin-bottom: 14px;
  box-shadow: ${p => p.$drag ? '0 0 0 4px rgba(59,130,246,0.1)' : 'var(--shadow-s)'};
  &:hover {
    border-color: #3B82F6;
    background: rgba(59,130,246,0.04);
    box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
  }
  @media(max-width:480px){ padding: 26px 16px 22px; }
`;

const IconRing = styled.div`
  position: relative; width: 64px; height: 64px; margin: 0 auto 14px;
`;

const IconBox = styled.div`
  width: 64px; height: 64px; border-radius: 16px;
  background: ${p => p.$drag ? 'rgba(59,130,246,0.14)' : 'var(--blue-tint)'};
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
`;

const Ripple = styled.div`
  position: absolute; inset: -4px; border-radius: 20px;
  border: 2px solid rgba(59,130,246,0.5);
  animation: ${pulse} 1.6s ease-in-out infinite;
  pointer-events: none;
`;

const ZoneTitle = styled.p`
  font-size: 16px; font-weight: 800; letter-spacing: -.3px;
  color: var(--text-1); margin-bottom: 4px;
`;

const ZoneHint = styled.p`
  font-size: 12px; color: var(--text-4); margin-bottom: 16px;
`;

const Tags = styled.div`
  display: flex; justify-content: center; gap: 6px; margin-bottom: 16px;
`;

const Tag = styled.span`
  font-size: 10px; font-weight: 700; letter-spacing: .4px;
  color: var(--text-3);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 5px; padding: 3px 8px;
`;

const PickBtn = styled.div`
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  color: #fff; font-size: 13px; font-weight: 700;
  padding: 11px 22px; border-radius: 10px; min-height: 44px;
  box-shadow: 0 4px 14px rgba(59,130,246,0.3);
  transition: box-shadow .2s, transform .15s;
  cursor: pointer;
  &:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.4); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const OrText = styled.p`font-size: 11px; color: var(--text-4); margin-top: 10px;`;

/* ── File row ── */
const FileRow = styled.div`
  background: var(--surface);
  border: 1.5px solid var(--green-border);
  border-radius: 14px; padding: 12px 14px;
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px;
  animation: ${fadeUp} .3s ease;
  box-shadow: var(--shadow-s);
  @media(max-width:420px){ flex-wrap: wrap; }
`;

const FileIcon = styled.div`
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--blue-tint);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
`;

const FileMeta = styled.div`flex:1; min-width:0;`;

const FileName = styled.p`
  font-size: 13px; font-weight: 700; color: var(--text-1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 1px;
`;

const FileSize = styled.p`font-size: 11px; color: var(--text-4);`;

const StatusPill = styled.div`
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 700; white-space: nowrap;
  color: ${p => p.$analyzing ? '#F59E0B' : '#10B981'};
  background: ${p => p.$analyzing ? 'var(--yellow-tint)' : 'var(--green-tint)'};
  border: 1px solid ${p => p.$analyzing ? 'var(--yellow-border)' : 'var(--green-border)'};
  border-radius: 99px; padding: 3px 9px;
`;

const ReplBtn = styled.button`
  display: flex; align-items: center; gap: 4px;
  background: none; border: 1px solid var(--border);
  border-radius: 8px; padding: 8px 12px; min-height: 36px;
  font-size: 11px; font-weight: 600; color: var(--text-3);
  cursor: pointer; white-space: nowrap; transition: all .15s;
  &:hover { border-color: #3B82F6; color: #3B82F6; background: rgba(59,130,246,.05); }
  &:focus-visible { outline: 2px solid #3B82F6; outline-offset: 2px; }
`;

const HiddenInput = styled.input`display:none;`;

function fmtSize(b) {
  if (b < 1024)    return b + ' Б';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' КБ';
  return (b / 1048576).toFixed(1) + ' МБ';
}

export default function Uploader({ onFileSelected, isAnalyzing }) {
  const { t } = useApp();
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);

  const pick = useCallback((f) => {
    if (!f) return;
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(f.type) && !f.name.endsWith('.docx')) {
      alert('Только PDF или DOCX');
      return;
    }
    setFile(f);
    onFileSelected(f, f.name);
  }, [onFileSelected]);

  if (file) {
    return (
      <FileRow>
        <FileIcon>
          <InsertDriveFileIcon sx={{ fontSize: 20, color: '#3B82F6' }}/>
        </FileIcon>
        <FileMeta>
          <FileName>{file.name}</FileName>
          <FileSize>{fmtSize(file.size)} · {file.name.endsWith('.docx') ? 'DOCX' : 'PDF'}</FileSize>
        </FileMeta>
        {isAnalyzing ? (
          <StatusPill $analyzing>Анализ...</StatusPill>
        ) : (
          <>
            <StatusPill>
              <CheckCircleIcon sx={{ fontSize: 11 }}/>Готово
            </StatusPill>
            <ReplBtn onClick={() => document.getElementById('vkr-upload').click()}>
              <SyncIcon sx={{ fontSize: 12 }}/>{t.replace}
            </ReplBtn>
          </>
        )}
        <HiddenInput id="vkr-upload" type="file" accept=".pdf,.docx"
          onChange={e => { pick(e.target.files[0]); e.target.value = ''; }}/>
      </FileRow>
    );
  }

  return (
    <>
      <HiddenInput id="vkr-upload" type="file" accept=".pdf,.docx" disabled={isAnalyzing}
        onChange={e => { pick(e.target.files[0]); e.target.value = ''; }}/>

      <Zone htmlFor="vkr-upload" $drag={drag} $file={false}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}>

        <IconRing>
          <IconBox $drag={drag}>
            <UploadFileIcon sx={{ fontSize: 28, color: '#3B82F6' }}/>
          </IconBox>
          {drag && <Ripple/>}
        </IconRing>

        <ZoneTitle>{drag ? t.uploadDrag : t.uploadTitle}</ZoneTitle>
        <ZoneHint>{t.uploadHint}</ZoneHint>

        <Tags>
          <Tag>PDF</Tag><Tag>DOCX</Tag><Tag>до 50 МБ</Tag>
        </Tags>

        <PickBtn><UploadFileIcon sx={{ fontSize: 16 }}/>{t.uploadBtn}</PickBtn>
        <OrText>{t.uploadOrDrag}</OrText>
      </Zone>
    </>
  );
}
