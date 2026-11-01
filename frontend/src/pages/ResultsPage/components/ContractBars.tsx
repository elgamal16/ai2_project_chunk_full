import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../../../components/ui/Card';

export interface ContractBarsProps {
  byContract: Record<string, { total: number; will_leave: number }>;
}

export const ContractBars: React.FC<ContractBarsProps> = ({ byContract }) => {
  const { t } = useTranslation();

  const data = Object.entries(byContract).map(([contract, stats]) => ({
    contract,
    total: stats.total,
    will_leave: stats.will_leave,
  }));

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-sm font-bold text-on-surface mb-2">
        {t('results.contractDistribution')}
      </h3>
      <div className="h-56 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="contract" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#bec9c7',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="total" name={t('results.total')} fill="#2c7a74" radius={[4, 4, 0, 0]} />
            <Bar dataKey="will_leave" name={t('results.willLeave')} fill="#bd3b3b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

