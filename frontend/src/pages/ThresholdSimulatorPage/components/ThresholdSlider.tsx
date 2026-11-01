import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sliders } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface ThresholdSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export const ThresholdSlider: React.FC<ThresholdSliderProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-primary-container" />
          <h3 className="text-base font-bold text-on-surface">
            {t('simulator.thresholdSlider')}
          </h3>
        </div>
        <span className="text-2xl font-black text-primary font-mono px-3 py-1 bg-primary/10 rounded-control">
          {value}%
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={30}
          max={70}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-outline-variant/30 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-xs text-on-surface-variant font-mono">
          <span>30% (Sensitive)</span>
          <span className="font-bold text-primary">50% (Default)</span>
          <span>70% (Conservative)</span>
        </div>
      </div>

      <p className="text-xs text-on-surface-variant bg-surface-low p-2.5 rounded-control">
        {t('simulator.defaultNote')}
      </p>
    </Card>
  );
};

