import React from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

export interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientCount: number;
  isSending: boolean;
}

export const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipientCount,
  isSending,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('campaign.sendModalTitle')}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSending}>
            {t('ui.cancel')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isSending}
          >
            <Send className="w-4 h-4 me-1.5" />
            {t('campaign.confirmSend')}
          </Button>
        </>
      }
    >
      <div className="space-y-3 py-2 text-sm text-on-surface">
        <p>{t('campaign.sendModalDesc', { count: recipientCount })}</p>
        <p className="text-xs text-on-surface-variant">
          Messages will be routed through the configured communication provider.
        </p>
      </div>
    </Modal>
  );
};

