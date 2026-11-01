import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sliders, Database, Layers } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface ThresholdsCardProps {
  nTrain: number;
  nTest: number;
}

export const ThresholdsCard: React.FC<ThresholdsCardProps> = ({ nTrain, nTest }) => {
  const { t } = useTranslation();

  const bands = [
    {
      title: t('model.thresholdLow'),
      desc: t('model.thresholdLowDesc'),
      color: 'bg-risk-low-bg border-risk-low-fg/30 text-risk-low-fg',
    },
    {
      title: t('model.thresholdMed'),
      desc: t('model.thresholdMedDesc'),
      color: 'bg-risk-medium-bg border-risk-medium-fg/30 text-risk-medium-fg',
    },
    {
      title: t('model.thresholdHigh'),
      desc: t('model.thresholdHighDesc'),
      color: 'bg-risk-high-bg border-risk-high-fg/30 text-risk-high-fg',
    },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-primary-container" />
        <h3 className="text-base font-bold text-on-surface">
          {t('model.thresholdsTitle')}
        </h3>
      </div>

      <div className="space-y-2.5">
        {bands.map((b) => (
          <div key={b.title} className={`p-3 rounded-card border ${b.color}`}>
            <h4 className="text-xs font-bold">{b.title}</h4>
            <p className="text-[11px] mt-0.5 text-on-surface opacity-90">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-outline-variant/20 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 rounded bg-surface-low text-on-surface-variant">
          <Database className="w-4 h-4 text-primary shrink-0" />
          <span>{t('model.trainDataset', { count: nTrain })}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded bg-surface-low text-on-surface-variant">
          <Layers className="w-4 h-4 text-secondary shrink-0" />
          <span>{t('model.testDataset', { count: nTest })}</span>
        </div>
      </div>
    </Card>
  );
};
