import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Phone, Mail, CheckCheck, XCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatNumber } from '../../../lib/format';

export interface SimulationStatsProps {
  flaggedCount: number;
  delta: number;
  reachability: {
    phoneOnly: number;
    emailOnly: number;
    both: number;
    neither: number;
    reachableTotal: number;
  };
}

export const SimulationStats: React.FC<SimulationStatsProps> = ({
  flaggedCount,
  delta,
  reachability,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-4">
        <div>
          <span className="text-xs text-on-surface-variant font-medium">
            {t('simulator.flaggedCount')}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-2xl font-black text-on-surface">
              {formatNumber(flaggedCount, i18n.language)}
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs text-on-surface-variant block mb-1">
            {t('simulator.deltaVsDefault')}
          </span>
          {delta > 0 ? (
            <Badge variant="warning">
              {t('simulator.moreFlagged', { count: Math.abs(delta) })}
            </Badge>
          ) : delta < 0 ? (
            <Badge variant="teal">
              {t('simulator.fewerFlagged', { count: Math.abs(delta) })}
            </Badge>
          ) : (
            <Badge variant="neutral">{t('simulator.noChange')}</Badge>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
          {t('simulator.simulatedReach')}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-control bg-risk-low-bg text-risk-low-fg border border-risk-low-fg/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-medium mb-1">
              <CheckCheck className="w-4 h-4" />
              <span>{t('validate.both')}</span>
            </div>
            <span className="text-base font-bold">{reachability.both}</span>
          </div>
          <div className="p-2.5 rounded-control bg-primary-container/10 text-primary-container border border-primary-container/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-medium mb-1">
              <Phone className="w-4 h-4" />
              <span>{t('validate.phoneOnly')}</span>
            </div>
            <span className="text-base font-bold">{reachability.phoneOnly}</span>
          </div>
          <div className="p-2.5 rounded-control bg-secondary-container/30 text-secondary border border-secondary/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-medium mb-1">
              <Mail className="w-4 h-4" />
              <span>{t('validate.emailOnly')}</span>
            </div>
            <span className="text-base font-bold">{reachability.emailOnly}</span>
          </div>
          <div className="p-2.5 rounded-control bg-error-container text-error border border-error/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 font-medium mb-1">
              <XCircle className="w-4 h-4" />
              <span>{t('validate.neither')}</span>
            </div>
            <span className="text-base font-bold">{reachability.neither}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

