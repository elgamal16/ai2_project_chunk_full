import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOffers } from '../../../api/offers';
import { sendCampaign } from '../../../api/campaigns';
import { useAnalysisContext } from '../../../app/AnalysisContext';
import type { Offer, CampaignSendResponse } from '../../../api/types';
import type { CampaignFormData } from '../CampaignStudioPage.types';

export function useCampaignForm() {
  const { i18n } = useTranslation();
  const { activeAnalysisId, selectedCustomerIds } = useAnalysisContext();

  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const isAr = currentLang === 'ar';

  const [form, setForm] = useState<CampaignFormData>({
    analysis_id: activeAnalysisId || '',
    audience: selectedCustomerIds.length > 0 ? 'selected' : 'high_risk',
    customer_ids: selectedCustomerIds,
    channel: 'smart',
    offer_id: null,
    lang: currentLang,
    subject: isAr ? 'عرض خاص لك من شركتنا 🎁' : 'A special offer for you',
    message: isAr
      ? 'مرحباً {name}، يسعدنا وجودك معنا ونقدر ثقتك دائماً. نقدم لك هذا العرض الحصري: {offer}.'
      : 'Hello {name}, we value you. Enjoy this offer: {offer}.',
    consent: false,
  });

  const offersQuery = useQuery<Offer[], Error>({
    queryKey: ['offers'],
    queryFn: getOffers,
  });

  const sendMutation = useMutation<CampaignSendResponse, Error, CampaignFormData>({
    mutationFn: (data) => sendCampaign(data),
  });

  const updateForm = (patch: Partial<CampaignFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  return {
    form,
    updateForm,
    offers: offersQuery.data || [],
    isOffersLoading: offersQuery.isLoading,
    sendCampaign: (data: CampaignFormData) => sendMutation.mutateAsync(data),
    isSending: sendMutation.isPending,
    sendError: sendMutation.error,
    sendResult: sendMutation.data,
  };
}

