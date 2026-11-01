import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCampaigns, getCampaignDetail } from '../../../api/campaigns';
import type { CampaignDetailResponse, CampaignSummaryRecord } from '../../../api/types';

export function useCampaigns() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const campaignsQuery = useQuery<CampaignSummaryRecord[], Error>({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
  });

  const detailQuery = useQuery<CampaignDetailResponse, Error>({
    queryKey: ['campaignDetail', selectedId],
    queryFn: () => {
      if (!selectedId) throw new Error('Campaign ID required');
      return getCampaignDetail(selectedId);
    },
    enabled: Boolean(selectedId),
  });

  return {
    campaigns: campaignsQuery.data || [],
    isLoading: campaignsQuery.isLoading,
    error: campaignsQuery.error,
    selectedId,
    setSelectedId,
    detail: detailQuery.data,
    isDetailLoading: detailQuery.isLoading,
    detailError: detailQuery.error,
  };
}

