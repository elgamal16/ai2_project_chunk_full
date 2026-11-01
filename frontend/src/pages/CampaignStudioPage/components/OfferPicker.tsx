import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Gift } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { Offer } from '../../../api/types';

export interface OfferPickerProps {
  offers: Offer[];
  selectedOfferId: string | null;
  onSelectOffer: (id: string | null) => void;
}

export const OfferPicker: React.FC<OfferPickerProps> = ({
  offers,
  selectedOfferId,
  onSelectOffer,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-bold text-on-surface">
        {t('campaign.offerSection')}
      </h3>

      <div className="space-y-2">
        <label
          className={`flex items-center gap-3 p-3 rounded-card border cursor-pointer transition-colors ${
            selectedOfferId === null
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-outline-variant/30 hover:bg-surface-low'
          }`}
        >
          <input
            type="radio"
            name="offerSelection"
            checked={selectedOfferId === null}
            onChange={() => onSelectOffer(null)}
            className="accent-primary"
          />
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-bold text-on-surface">
            {t('campaign.useSuggested')}
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {offers.map((offer) => {
            const isSelected = selectedOfferId === offer.id;
            return (
              <label
                key={offer.id}
                className={`flex items-start gap-2.5 p-3 rounded-card border cursor-pointer transition-colors text-xs ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-on-surface'
                    : 'border-outline-variant/30 hover:bg-surface-low text-on-surface-variant'
                }`}
              >
                <input
                  type="radio"
                  name="offerSelection"
                  checked={isSelected}
                  onChange={() => onSelectOffer(offer.id)}
                  className="mt-0.5 accent-primary"
                />
                <div className="min-w-0">
                  <span className="font-semibold block text-on-surface flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-primary-container shrink-0" />
                    {offer.title}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

