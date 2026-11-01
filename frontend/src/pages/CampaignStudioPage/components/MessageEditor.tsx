import React from 'react';
import { useTranslation } from 'react-i18next';
import { Send, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export interface MessageEditorProps {
  channel: 'smart' | 'whatsapp' | 'email';
  subject: string;
  onSubjectChange: (s: string) => void;
  message: string;
  onMessageChange: (m: string) => void;
  consent: boolean;
  onConsentChange: (c: boolean) => void;
  onSubmit: () => void;
  isSending: boolean;
}

export const MessageEditor: React.FC<MessageEditorProps> = ({
  channel,
  subject,
  onSubjectChange,
  message,
  onMessageChange,
  consent,
  onConsentChange,
  onSubmit,
  isSending,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="space-y-4">
      {channel === 'email' && (
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            {t('campaign.subjectLabel')}
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder={t('campaign.subjectPlaceholder')}
            className="w-full px-3 py-2 text-sm rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-on-surface mb-1">
          {t('campaign.messageLabel')}
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-control border border-outline-variant/40 bg-surface-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-y"
        />
        <p className="text-[11px] text-on-surface-variant mt-1">
          {t('campaign.placeholdersHint')}
        </p>
      </div>

      <div className="p-3 rounded-card bg-surface-low border border-outline-variant/30">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
          />
          <span className="text-on-surface font-medium leading-relaxed">
            {t('campaign.consentCheckbox')}
          </span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {!consent && (
          <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-risk-medium-fg shrink-0" />
            Consent is required to dispatch
          </span>
        )}
        <Button
          variant="primary"
          size="lg"
          disabled={!consent || isSending}
          isLoading={isSending}
          onClick={onSubmit}
          className="w-full sm:w-auto ms-auto"
        >
          <Send className="w-4 h-4 me-2" />
          {t('campaign.reviewAndSend')}
        </Button>
      </div>
    </Card>
  );
};

