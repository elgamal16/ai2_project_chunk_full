import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatNumber } from '../../../lib/format';

export interface ConfusionMatrixProps {
  matrix: [[number, number], [number, number]];
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix }) => {
  const { t, i18n } = useTranslation();

  const [row0, row1] = matrix;
  const tn = row0[0];
  const fp = row0[1];
  const fn = row1[0];
  const tp = row1[1];

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Grid className="w-5 h-5 text-primary-container" />
        <h3 className="text-base font-bold text-on-surface">
          {t('model.confusionMatrix')}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[280px] max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {/* Header row */}
            <div />
            <div className="font-semibold text-on-surface-variant p-1">
              {t('model.predStay')}
            </div>
            <div className="font-semibold text-on-surface-variant p-1">
              {t('model.predLeave')}
            </div>

            {/* Row 1: Actual Stay */}
            <div className="font-semibold text-on-surface-variant flex items-center justify-center p-1 text-end">
              {t('model.actualStay')}
            </div>
            <div className="p-4 rounded-card bg-risk-low-bg border border-risk-low-fg/30 flex flex-col justify-center">
              <span className="text-lg font-black font-mono text-risk-low-fg">
                {formatNumber(tn, i18n.language)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {t('model.trueNegative')}
              </span>
            </div>
            <div className="p-4 rounded-card bg-surface-low border border-outline-variant/30 flex flex-col justify-center">
              <span className="text-lg font-black font-mono text-on-surface">
                {formatNumber(fp, i18n.language)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {t('model.falsePositive')}
              </span>
            </div>

            {/* Row 2: Actual Leave */}
            <div className="font-semibold text-on-surface-variant flex items-center justify-center p-1 text-end">
              {t('model.actualLeave')}
            </div>
            <div className="p-4 rounded-card bg-surface-low border border-outline-variant/30 flex flex-col justify-center">
              <span className="text-lg font-black font-mono text-on-surface">
                {formatNumber(fn, i18n.language)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {t('model.falseNegative')}
              </span>
            </div>
            <div className="p-4 rounded-card bg-risk-high-bg border border-risk-high-fg/30 flex flex-col justify-center">
              <span className="text-lg font-black font-mono text-risk-high-fg">
                {formatNumber(tp, i18n.language)}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                {t('model.truePositive')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

