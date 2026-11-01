import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';
import { useAnalysisContext } from '../../../app/AnalysisContext';
import { downloadSampleFile } from '../../../api/offers';
import { Button } from '../../../components/ui/Button';

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export const DropZone: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setFile } = useAnalysisContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);

  const handleValidateAndSelect = (file: File) => {
    setErrorMessage(null);
    const name = file.name.toLowerCase();
    if (!name.endsWith('.csv') && !name.endsWith('.xlsx')) {
      setErrorMessage(t('upload.invalidFileType'));
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrorMessage(t('upload.fileTooLarge'));
      return;
    }
    setFile(file);
    navigate('/check');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndSelect(e.target.files[0]);
    }
  };

  const handleSampleDownload = async () => {
    try {
      setIsDownloadingSample(true);
      await downloadSampleFile();
    } catch {
      setErrorMessage(t('ui.errorTitle'));
    } finally {
      setIsDownloadingSample(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`w-full p-8 md:p-12 rounded-card border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center bg-surface-lowest ${
          isDragOver
            ? 'border-primary bg-primary/5 shadow-md scale-[1.005]'
            : 'border-primary-container/40 hover:border-primary-container hover:bg-surface-low/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-on-surface">{t('upload.dropText')}</h3>
        <p className="mt-1 text-sm text-on-surface-variant flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-primary-container" />
          {t('upload.dropHint')}
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-sm rounded-control bg-error-container text-error border border-error/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSampleDownload}
          isLoading={isDownloadingSample}
        >
          <Download className="w-4 h-4 me-2" />
          {t('upload.downloadSample')}
        </Button>
      </div>
    </div>
  );
};

