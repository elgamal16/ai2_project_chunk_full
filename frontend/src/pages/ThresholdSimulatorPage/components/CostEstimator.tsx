import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatCharge } from '../../../lib/format';

export interface CostEstimatorProps {
  costPerMessage: number;
  onCostChange: (val: number) => void;
  totalCost: number;
  reachableCount: number;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  costPerMessage,
  onCostChange,
  totalCost,
  reachableCount,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary-container" />
        <h3 className="text-base font-bold text-on-surface">
          {t('simulator.costEstimatorTitle')}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
            {t('simulator.costPerUnit')} ($)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={costPerMessage}
            onChange={(e) => onCostChange(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono min-h-[44px]"
          />
          <span className="text-[11px] text-on-surface-variant mt-1 block">
            {reachableCount} {t('simulator.units')}
          </span>
        </div>

        <div className="p-4 rounded-card bg-surface-low border border-outline-variant/30 flex flex-col justify-center">
          <span className="text-xs text-on-surface-variant font-medium">
            {t('simulator.totalEstimatedCost')}
          </span>
          <span className="text-2xl font-black text-primary font-mono mt-0.5">
            ${formatCharge(totalCost)}
          </span>
        </div>
      </div>
    </Card>
  );
};

