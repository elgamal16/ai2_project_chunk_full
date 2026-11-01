import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { ThresholdSlider } from './components/ThresholdSlider';
import { SimulationStats } from './components/SimulationStats';
import { CostEstimator } from './components/CostEstimator';
import { useSimulation } from './hooks/useSimulation';

export const ThresholdSimulatorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const {
    isLoading,
    error,
    threshold,
    setThreshold,
    costPerMessage,
    setCostPerMessage,
    stats,
  } = useSimulation(id);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        <Skeleton height={60} />
        <Skeleton height={180} />
        <Skeleton height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <ErrorBanner message={error.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">{t('simulator.title')}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">{t('simulator.subtitle')}</p>
        </div>
        <Link to={`/results/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 me-1.5" />
            {t('simulator.backToResults')}
          </Button>
        </Link>
      </div>

      <div className="p-3 rounded-card bg-primary-container/10 border border-primary-container/30 flex items-start gap-2.5 text-xs text-on-surface">
        <Info className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
        <span>{t('simulator.clientNotice')}</span>
      </div>

      <ThresholdSlider value={threshold} onChange={setThreshold} />

      <SimulationStats
        flaggedCount={stats.simulatedFlagged}
        delta={stats.delta}
        reachability={stats.reachability}
      />

      <CostEstimator
        costPerMessage={costPerMessage}
        onCostChange={setCostPerMessage}
        totalCost={stats.totalCost}
        reachableCount={stats.reachability.reachableTotal}
      />
    </div>
  );
};

