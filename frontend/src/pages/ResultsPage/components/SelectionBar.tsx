import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface SelectionBarProps {
  selectedCount: number;
  reachableCount: number;
  unreachableCount: number;
  onClear: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  reachableCount,
  unreachableCount,
  onClear,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 start-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-surface-lowest/95 backdrop-blur-md border border-primary/40 shadow-2xl rounded-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-on-surface">
        <span>
          {t('results.selectionBarText', {
            selected: selectedCount,
            reachable: reachableCount,
            unreachable: unreachableCount,
          })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4 me-1" />
          {t('results.clearSelection')}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/campaign')}
        >
          <Send className="w-4 h-4 me-1.5" />
          {t('results.goToCampaign')}
        </Button>
      </div>
    </div>
  );
};

