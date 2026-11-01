import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Send, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Badge } from '../../../components/ui/Badge';
import type { CampaignPreviewResponse } from '../../../api/types';

export interface PreviewPanelProps {
  preview: CampaignPreviewResponse | undefined;
  isLoading: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ preview, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="space-y-3">
        <Skeleton height={20} width={120} />
        <Skeleton height={80} />
        <Skeleton height={120} />
      </Card>
    );
  }

  if (!preview) {
    return (
      <Card className="p-6 text-center text-xs text-on-surface-variant">
        {t('ui.emptyDesc')}
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
        <Eye className="w-5 h-5 text-primary-container" />
        <div>
          <h3 className="text-sm font-bold text-on-surface">{t('campaign.previewTitle')}</h3>
          <p className="text-[11px] text-on-surface-variant">{t('campaign.previewDesc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-control bg-risk-low-bg text-risk-low-fg border border-risk-low-fg/20">
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>{t('campaign.willSend')}</span>
          </div>
          <span className="text-xl font-bold font-mono">{preview.will_send}</span>
        </div>
        <div className="p-3 rounded-control bg-surface-low text-on-surface-variant border border-outline-variant/30">
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-risk-medium-fg" />
            <span>{t('campaign.skipped')}</span>
          </div>
          <span className="text-xl font-bold font-mono text-on-surface">{preview.skipped}</span>
        </div>
      </div>

      {Object.keys(preview.by_channel).length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-on-surface">{t('campaign.byChannel')}</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(preview.by_channel).map(([ch, count]) => (
              <Badge key={ch} variant="teal">
                {ch.toUpperCase()}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {preview.examples.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-outline-variant/20">
          <h4 className="text-xs font-semibold text-on-surface">{t('campaign.exampleMessages')}</h4>
          <div className="space-y-2">
            {preview.examples.map((ex, i) => (
              <div key={i} className="p-2.5 rounded-control bg-surface-low border border-outline-variant/20 text-xs">
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1 font-mono">
                  <span>{ex.customer_id}</span>
                  <span className="font-semibold text-primary">{ex.channel} → {ex.to}</span>
                </div>
                <p className="whitespace-pre-line text-on-surface font-sans text-xs bg-surface-lowest p-2 rounded border border-outline-variant/10">
                  {ex.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

