import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Layers } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { MetricsGrid } from './components/MetricsGrid';
import { ConfusionMatrix } from './components/ConfusionMatrix';
import { FactorsChart } from './components/FactorsChart';
import { ThresholdsCard } from './components/ThresholdsCard';
import { useModel } from './hooks/useModel';

export const ModelPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    metrics,
    isMetricsLoading,
    metricsError,
    factors,
    isFactorsLoading,
    factorsError,
  } = useModel();

  if (isMetricsLoading || isFactorsLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton height={60} />
        <Skeleton height={140} />
        <Skeleton height={300} />
      </div>
    );
  }

  const activeError = metricsError || factorsError;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">{t('model.title')}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">{t('model.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-primary-container/10 border border-primary-container/30 text-xs font-semibold text-primary">
            <Activity className="w-4 h-4 shrink-0" />
            <span>{t('model.modelName')}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-surface-container border border-outline-variant/30 text-xs font-semibold text-on-surface">
            <Layers className="w-4 h-4 shrink-0 text-on-surface-variant" />
            <span>{t('model.featuresCount')}</span>
          </div>
        </div>
      </div>

      {activeError && <ErrorBanner message={activeError.message} />}

      {metrics && (
        <>
          <MetricsGrid metrics={metrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfusionMatrix matrix={metrics.confusion_matrix} />
            <ThresholdsCard nTrain={metrics.n_train} nTest={metrics.n_test} />
          </div>
        </>
      )}

      {factors.length > 0 && <FactorsChart factors={factors} />}
    </div>
  );
};

