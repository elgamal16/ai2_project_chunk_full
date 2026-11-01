import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Mail, XCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatNumber } from '../../../lib/format';

export interface ReachabilityCardProps {
  highRiskReachable: {
    sms: number;
    email: number;
    unreachable: number;
  };
}

export const ReachabilityCard: React.FC<ReachabilityCardProps> = ({ highRiskReachable }) => {
  const { t, i18n } = useTranslation();

  const channels = [
    {
      label: t('results.reachableWhatsapp') || t('results.reachableSms'),
      count: highRiskReachable.sms,
      icon: MessageSquare,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-400',
    },
    {
      label: t('results.reachableEmail'),
      count: highRiskReachable.email,
      icon: Mail,
      color: 'text-secondary bg-secondary-container/30 border-secondary/20',
    },
    {
      label: t('results.unreachable'),
      count: highRiskReachable.unreachable,
      icon: XCircle,
      color: 'text-error bg-error-container/40 border-error/20',
    },
  ];

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-sm font-bold text-on-surface mb-3">
        {t('results.reachabilityTitle')}
      </h3>
      <div className="flex-1 flex flex-col justify-around gap-2.5">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <div
              key={ch.label}
              className={`p-3 rounded-card border flex items-center justify-between ${ch.color}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium text-on-surface">{ch.label}</span>
              </div>
              <span className="text-base font-bold">
                {formatNumber(ch.count, i18n.language)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

