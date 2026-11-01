import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, AlertCircle, Phone, Mail, FileText, MessageCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { formatCharge } from '../../../lib/format';
import { getRiskBarColor } from '../../../lib/risk';
import { getWhatsAppUrl } from '../../../lib/whatsapp';
import type { CustomerRecord } from '../../../api/types';

export interface CustomerDrawerProps {
  customer: CustomerRecord | null;
  onClose: () => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({ customer, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && customer) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customer, onClose]);

  if (!customer) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-on-surface/40 backdrop-blur-sm flex justify-end"
    >
      <div className="w-full max-w-md bg-surface-lowest shadow-2xl h-full flex flex-col overflow-y-auto border-s border-outline-variant/30">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 sticky top-0 bg-surface-lowest z-10">
          <div>
            <h2 className="text-base font-bold text-on-surface">{t('results.drawerTitle')}</h2>
            <p className="text-xs text-on-surface-variant font-mono">{customer.customer_id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-control text-on-surface-variant hover:bg-surface-container transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="p-4 rounded-card bg-surface-low border border-outline-variant/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">
                {t('results.colPrediction')}
              </span>
              <Badge variant={customer.prediction === 'will_leave' ? 'high' : 'low'}>
                {customer.prediction === 'will_leave'
                  ? t('results.willLeaveBadge')
                  : t('results.willStayBadge')}
              </Badge>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-on-surface">{t('results.colRiskScore')}</span>
                <span className="font-bold">{customer.risk_score}%</span>
              </div>
              <div className="w-full bg-outline-variant/30 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getRiskBarColor(customer.risk_score)}`}
                  style={{ width: `${customer.risk_score}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-surface-lowest border border-outline-variant/20">
              <FileText className="w-4 h-4 text-on-surface-variant shrink-0" />
              <span className="text-on-surface-variant">{t('results.colContract')}:</span>
              <span className="font-semibold text-on-surface">{customer.contract}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-surface-lowest border border-outline-variant/20">
              <span className="text-on-surface-variant">{t('results.colTenure')}:</span>
              <span className="font-semibold text-on-surface">{customer.tenure} months</span>
              <span className="ms-auto text-on-surface-variant">{t('results.colMonthly')}:</span>
              <span className="font-semibold text-on-surface">{formatCharge(customer.monthly_charges)}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center justify-between p-2 rounded bg-surface-lowest border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary-container shrink-0" />
                  <span className="font-mono text-on-surface">{customer.phone}</span>
                </div>
                <a
                  href={getWhatsAppUrl(customer)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1ebd5a] active:scale-95 transition-all rounded-control shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>فتح واتساب</span>
                </a>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-2 p-2 rounded bg-surface-lowest border border-outline-variant/20">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-mono text-on-surface">{customer.email}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-risk-medium-fg" />
              {t('results.driversTitle')}
            </h4>
            {customer.reasons.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic">{t('results.noDrivers')}</p>
            ) : (
              <div className="space-y-2">
                {customer.reasons.map((r) => (
                  <div key={r.code} className="p-2.5 rounded-card border border-outline-variant/30 bg-surface-lowest text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-on-surface">{r.text}</span>
                      <span className="font-mono text-on-surface-variant text-[11px]">+{r.impact}</span>
                    </div>
                    <div className="w-full bg-outline-variant/20 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-container h-full"
                        style={{ width: `${Math.min(100, Math.round(r.impact * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-container" />
              {t('results.suggestedOffer')}
            </h4>
            <div className="p-3 rounded-card bg-primary-container/10 border border-primary-container/30 text-xs text-on-surface font-medium">
              {customer.suggested_offer || t('results.noSuggestedOffer')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

