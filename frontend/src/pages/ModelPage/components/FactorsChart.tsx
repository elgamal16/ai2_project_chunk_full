import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import type { ModelFactor } from '../../../api/types';

export interface FactorsChartProps {
  factors: ModelFactor[];
}

export const FactorsChart: React.FC<FactorsChartProps> = ({ factors }) => {
  const { t } = useTranslation();

  const data = factors.map((f) => ({
    name: f.name,
    strength: f.strength,
    direction: f.direction,
    color: f.direction === 'churn' ? '#bd3b3b' : '#2e7d5b',
  }));

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
        <div>
          <h3 className="text-base font-bold text-on-surface">
            {t('model.factorsTitle')}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {t('model.factorsDesc')}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#bd3b3b]" />
            <span className="text-on-surface-variant">{t('model.directionChurn')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#2e7d5b]" />
            <span className="text-on-surface-variant">{t('model.directionRetain')}</span>
          </div>
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11 }}
              interval={0}
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#bec9c7',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}`, t('model.factorStrength')]}
            />
            <Bar dataKey="strength" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

