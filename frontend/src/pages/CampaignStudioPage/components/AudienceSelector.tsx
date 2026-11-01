import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface AudienceSelectorProps {
  audience: 'high_risk' | 'selected';
  selectedCount: number;
  onSelectAudience: (aud: 'high_risk' | 'selected') => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  audience,
  selectedCount,
  onSelectAudience,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-bold text-on-surface">
        {t('campaign.audienceSection')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label
          className={`flex items-start gap-3 p-3.5 rounded-card border cursor-pointer transition-colors ${
            audience === 'selected'
              ? 'border-primary bg-primary/5 text-on-surface'
              : 'border-outline-variant/30 hover:bg-surface-low'
          } ${selectedCount === 0 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            type="radio"
            name="audience"
            value="selected"
            checked={audience === 'selected'}
            disabled={selectedCount === 0}
            onChange={() => onSelectAudience('selected')}
            className="mt-1 accent-primary"
          />
          <div className="text-xs">
            <span className="font-bold flex items-center gap-1.5 text-on-surface">
              <UserCheck className="w-4 h-4 text-primary" />
              {t('campaign.usingSelected', { count: selectedCount })}
            </span>
          </div>
        </label>

        <label
          className={`flex items-start gap-3 p-3.5 rounded-card border cursor-pointer transition-colors ${
            audience === 'high_risk'
              ? 'border-primary bg-primary/5 text-on-surface'
              : 'border-outline-variant/30 hover:bg-surface-low'
          }`}
        >
          <input
            type="radio"
            name="audience"
            value="high_risk"
            checked={audience === 'high_risk'}
            onChange={() => onSelectAudience('high_risk')}
            className="mt-1 accent-primary"
          />
          <div className="text-xs">
            <span className="font-bold flex items-center gap-1.5 text-on-surface">
              <Users className="w-4 h-4 text-primary-container" />
              {t('campaign.usingAllHighRisk')}
            </span>
          </div>
        </label>
      </div>
    </Card>
  );
};
