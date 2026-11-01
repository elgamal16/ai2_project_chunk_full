import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, MessageSquare, Mail } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface ChannelSelectorProps {
  channel: 'smart' | 'whatsapp' | 'email';
  onSelectChannel: (ch: 'smart' | 'whatsapp' | 'email') => void;
  lang: 'en' | 'ar';
  onSelectLang: (lang: 'en' | 'ar') => void;
}

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  channel,
  onSelectChannel,
  lang,
  onSelectLang,
}) => {
  const { t } = useTranslation();

  const channels = [
    { id: 'whatsapp', label: t('campaign.channelWhatsapp'), icon: MessageSquare },
    { id: 'email', label: t('campaign.channelEmail'), icon: Mail },
    { id: 'smart', label: t('campaign.channelSmart'), icon: Zap },
  ] as const;

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-on-surface mb-2">
          {t('campaign.channelSection')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isSelected = channel === ch.id;
            return (
              <label
                key={ch.id}
                className={`flex items-center gap-2.5 p-3 rounded-card border cursor-pointer transition-colors text-xs font-semibold ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/30 hover:bg-surface-low text-on-surface'
                }`}
              >
                <input
                  type="radio"
                  name="channel"
                  value={ch.id}
                  checked={isSelected}
                  onChange={() => onSelectChannel(ch.id)}
                  className="accent-primary"
                />
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{ch.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
        <h4 className="text-xs font-bold text-on-surface">
          {t('campaign.langSection')}
        </h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectLang('en')}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-colors min-h-[38px] ${
              lang === 'en'
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onSelectLang('ar')}
            className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-colors min-h-[38px] ${
              lang === 'ar'
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
            }`}
          >
            العربية
          </button>
        </div>
      </div>
    </Card>
  );
};

