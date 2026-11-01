import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { previewCampaign } from '../../../api/campaigns';
import type { CampaignIn, CampaignPreviewResponse } from '../../../api/types';

export function usePreview(formData: CampaignIn) {
  const [debouncedForm, setDebouncedForm] = useState<CampaignIn>(formData);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedForm(formData);
    }, 500);
    return () => clearTimeout(handler);
  }, [formData]);

  const canPreview = Boolean(
    debouncedForm.analysis_id &&
      (debouncedForm.audience === 'high_risk' || debouncedForm.customer_ids.length > 0)
  );

  return useQuery<CampaignPreviewResponse, Error>({
    queryKey: ['campaignPreview', debouncedForm],
    queryFn: () => previewCampaign(debouncedForm),
    enabled: canPreview,
    staleTime: 10 * 1000,
  });
}

