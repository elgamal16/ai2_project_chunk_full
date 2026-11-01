import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Target, Search, Scale, Activity } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatPercent } from '../../../lib/format';
import type { ModelMetrics } from '../../../api/types';

export interface MetricsGridProps {
  metrics: ModelMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const { t } = useTranslation();

  const items = [
    {
      name: t('model.accuracy'),
      value: formatPercent(metrics.accuracy),
      desc: t('model.accuracyDesc'),
      icon: CheckCircle2,
      color: 'text-primary bg-primary/10',
    },
    {
      name: t('model.precision'),
      value: formatPercent(metrics.precision),
      desc: t('model.precisionDesc'),
      icon: Target,
      color: 'text-primary-container bg-primary-container/10',
    },
    {
      name: t('model.recall'),
      value: formatPercent(metrics.recall),
      desc: t('model.recallDesc'),
      icon: Search,
      color: 'text-secondary bg-secondary-container/30',
    },
    {
      name: t('model.f1'),
      value: formatPercent(metrics.f1),
      desc: t('model.f1Desc'),
      icon: Scale,
      color: 'text-primary-container bg-surface-container',
    },
    {
      name: t('model.rocAuc'),
      value: Number(metrics.roc_auc).toFixed(3),
      desc: t('model.rocAucDesc'),
      icon: Activity,
      color: 'text-primary bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.name} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-on-surface-variant">
                  {item.name}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-on-surface font-mono block">
                {item.value}
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/20 leading-tight">
              {item.desc}
            </p>
          </Card>
        );
      })}
    </div>
  );
};

