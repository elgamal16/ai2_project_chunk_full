import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Play, UploadCloud } from 'lucide-react';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { ColumnStatus } from './components/ColumnStatus';
import { ContactsCard } from './components/ContactsCard';
import { ProblemsTable } from './components/ProblemsTable';
import { useValidate } from './hooks/useValidate';

export const ValidatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    file,
    validation,
    isLoading,
    error,
    refetchValidation,
    runAnalysis,
    isAnalyzing,
    analyzeError,
  } = useValidate();

  if (!file) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-12 text-center">
        <Stepper currentStep={2} />
        <div className="p-8 bg-surface-lowest rounded-card border border-outline-variant/30 space-y-4">
          <UploadCloud className="w-12 h-12 text-primary-container mx-auto" />
          <h2 className="text-lg font-bold">{t('validate.noFileSelected')}</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 me-2" />
            {t('validate.backToUpload')}
          </Button>
        </div>
      </div>
    );
  }

  const activeError = error || analyzeError;
  const canAnalyze = validation && validation.missing_columns.length === 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Stepper currentStep={2} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface">{t('validate.title')}</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">{file.name}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          disabled={!canAnalyze || isAnalyzing}
          isLoading={isAnalyzing}
          onClick={runAnalysis}
        >
          <Play className="w-4 h-4 me-2 fill-current" />
          {t('validate.runAnalysis')}
        </Button>
      </div>

      {activeError && (
        <ErrorBanner
          message={activeError.message}
          onRetry={error ? () => void refetchValidation() : undefined}
        />
      )}

      {isLoading && (
        <div className="space-y-4">
          <Skeleton height={140} />
          <Skeleton height={140} />
          <Skeleton height={200} />
        </div>
      )}

      {validation && (
        <div className="space-y-6">
          <ColumnStatus
            columnsFound={validation.columns_found}
            missingColumns={validation.missing_columns}
          />
          <ContactsCard contacts={validation.contacts} />
          <ProblemsTable
            problems={validation.problems}
            blockingRows={validation.blocking_rows}
          />
        </div>
      )}
    </div>
  );
};

