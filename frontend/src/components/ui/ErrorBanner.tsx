import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title,
  message,
  onRetry,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-card bg-error-container/40 border border-error/30 text-error ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">{title || t('ui.errorTitle')}</h4>
          <p className="text-sm mt-0.5 opacity-90">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="shrink-0 border-error/40 text-error hover:bg-error/10"
        >
          <RotateCcw className="w-4 h-4 me-1.5" />
          {t('ui.retry')}
        </Button>
      )}
    </div>
  );
};

