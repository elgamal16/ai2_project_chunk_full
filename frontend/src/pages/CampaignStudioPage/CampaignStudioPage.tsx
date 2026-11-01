import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { History, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { AudienceSelector } from './components/AudienceSelector';
import { OfferPicker } from './components/OfferPicker';
import { ChannelSelector } from './components/ChannelSelector';
import { MessageEditor } from './components/MessageEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { SendModal } from './components/SendModal';
import { useCampaignForm } from './hooks/useCampaignForm';
import { usePreview } from './hooks/usePreview';

export const CampaignStudioPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    form,
    updateForm,
    offers,
    sendCampaign,
    isSending,
    sendError,
    sendResult,
  } = useCampaignForm();
  const { data: preview, isLoading: isPreviewLoading } = usePreview(form);

  const handleConfirmSend = async () => {
    try {
      await sendCampaign(form);
      setIsModalOpen(false);
    } catch {
      // handled by mutation
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Stepper currentStep={4} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">{t('campaign.title')}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">{t('campaign.subtitle')}</p>
        </div>
        <Link to="/campaigns">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 me-1.5" />{t('campaign.viewHistory')}
          </Button>
        </Link>
      </div>

      {sendResult && (
        <div className={`p-4 rounded-card border flex items-center justify-between gap-3 ${
          sendResult.mode === 'dryrun'
            ? 'bg-risk-medium-bg border-risk-medium-fg/30 text-risk-medium-fg'
            : 'bg-risk-low-bg border-risk-low-fg/30 text-risk-low-fg'
        }`}>
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            {sendResult.mode === 'dryrun' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
            <span>{sendResult.mode === 'dryrun' ? t('campaign.dryRunBanner') : t('campaign.liveBanner')}</span>
          </div>
          <Link to={`/campaigns`}><Button size="sm" variant="outline">{t('campaign.viewHistory')}</Button></Link>
        </div>
      )}

      {sendError && <ErrorBanner message={sendError.message} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <AudienceSelector
            audience={form.audience}
            selectedCount={form.customer_ids.length}
            onSelectAudience={(aud) => updateForm({ audience: aud })}
          />
          <OfferPicker
            offers={offers}
            selectedOfferId={form.offer_id ?? null}
            onSelectOffer={(id) => updateForm({ offer_id: id })}
          />
          <ChannelSelector
            channel={form.channel}
            onSelectChannel={(ch) => updateForm({ channel: ch })}
            lang={form.lang}
            onSelectLang={(lang) => updateForm({ lang })}
          />
          <MessageEditor
            channel={form.channel}
            subject={form.subject || ''}
            onSubjectChange={(subject) => updateForm({ subject })}
            message={form.message}
            onMessageChange={(message) => updateForm({ message })}
            consent={form.consent}
            onConsentChange={(consent) => updateForm({ consent })}
            onSubmit={() => setIsModalOpen(true)}
            isSending={isSending}
          />
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <PreviewPanel preview={preview} isLoading={isPreviewLoading} />
          </div>
        </div>
      </div>

      <SendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSend}
        recipientCount={preview?.will_send || 0}
        isSending={isSending}
      />
    </div>
  );
};

