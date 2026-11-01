import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { FilterState } from '../ResultsPage.types';

export interface CustomerFiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onSelectAllHighRisk: () => void;
}

export const CustomerFiltersBar: React.FC<CustomerFiltersBarProps> = ({
  filters,
  onFilterChange,
  onSelectAllHighRisk,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <input
          type="text"
          placeholder={t('results.searchPlaceholder')}
          value={filters.q || ''}
          onChange={(e) => onFilterChange({ q: e.target.value })}
          className="px-3 py-1.5 text-xs rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary w-48 min-h-[38px]"
        />
        <select
          value={filters.risk || ''}
          onChange={(e) => onFilterChange({ risk: (e.target.value as FilterState['risk']) || undefined })}
          className="px-2.5 py-1.5 text-xs rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface min-h-[38px]"
        >
          <option value="">{t('results.filterRisk')}</option>
          <option value="high">{t('results.riskHigh')}</option>
          <option value="medium">{t('results.riskMedium')}</option>
          <option value="low">{t('results.riskLow')}</option>
        </select>
        <select
          value={filters.prediction || ''}
          onChange={(e) => onFilterChange({ prediction: (e.target.value as FilterState['prediction']) || undefined })}
          className="px-2.5 py-1.5 text-xs rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface min-h-[38px]"
        >
          <option value="">{t('results.filterPrediction')}</option>
          <option value="will_leave">{t('results.willLeaveBadge')}</option>
          <option value="will_stay">{t('results.willStayBadge')}</option>
        </select>
        <select
          value={filters.contact || ''}
          onChange={(e) => onFilterChange({ contact: (e.target.value as FilterState['contact']) || undefined })}
          className="px-2.5 py-1.5 text-xs rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface min-h-[38px]"
        >
          <option value="">{t('results.filterContact')}</option>
          <option value="phone">{t('validate.phoneOnly')}</option>
          <option value="email">{t('validate.emailOnly')}</option>
          <option value="both">{t('validate.both')}</option>
          <option value="none">{t('validate.neither')}</option>
        </select>
      </div>
      <Button variant="outline" size="sm" onClick={onSelectAllHighRisk}>
        <CheckSquare className="w-4 h-4 me-1.5" />
        {t('results.selectAllHighRisk')}
      </Button>
    </div>
  );
};

