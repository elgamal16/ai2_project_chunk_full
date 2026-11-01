import React from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../../../components/ui/Card';

export interface RiskDonutProps {
  riskLevels: {
    low: number;
    medium: number;
    high: number;
  };
}

export const RiskDonut: React.FC<RiskDonutProps> = ({ riskLevels }) => {
  const { t } = useTranslation();

  const data = [
    { name: t('results.riskLow'), value: riskLevels.low, color: '#2e7d5b' },
    { name: t('results.riskMedium'), value: riskLevels.medium, color: '#b46e1b' },
    { name: t('results.riskHigh'), value: riskLevels.high, color: '#bd3b3b' },
  ];

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-sm font-bold text-on-surface mb-2">
        {t('results.riskDistribution')}
      </h3>
      <div className="h-56 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#bec9c7',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-around pt-2 border-t border-outline-variant/20 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-on-surface-variant font-medium">{item.name}</span>
            <span className="font-bold text-on-surface">({item.value})</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

