import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserX, UserCheck, TrendingDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatNumber, formatPercent } from '../../../lib/format';
import type { AnalysisSummary } from '../../../api/types';

export interface SummaryCardsProps {
  summary: AnalysisSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const { t, i18n } = useTranslation();

  const cards = [
    {
      label: t('results.totalCustomers'),
      value: formatNumber(summary.total, i18n.language),
      icon: Users,
      color: 'text-primary bg-primary/10',
    },
    {
      label: t('results.predictedChurn'),
      value: formatNumber(summary.will_leave, i18n.language),
      icon: UserX,
      color: 'text-risk-high-fg bg-risk-high-bg',
    },
    {
      label: t('results.predictedStay'),
      value: formatNumber(summary.will_stay, i18n.language),
      icon: UserCheck,
      color: 'text-risk-low-fg bg-risk-low-bg',
    },
    {
      label: t('results.churnRate'),
      value: formatPercent(summary.churn_rate),
      icon: TrendingDown,
      color: 'text-risk-medium-fg bg-risk-medium-bg',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="flex items-center gap-4 p-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-on-surface-variant truncate">
                {card.label}
              </span>
              <span className="block text-xl md:text-2xl font-black text-on-surface mt-0.5">
                {card.value}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

