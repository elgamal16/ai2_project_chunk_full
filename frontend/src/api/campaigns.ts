import { apiClient } from './client';
import type {
  CampaignDetailResponse,
  CampaignIn,
  CampaignPreviewResponse,
  CampaignSendResponse,
  CampaignSummaryRecord,
} from './types';

export async function previewCampaign(
  input: CampaignIn
): Promise<CampaignPreviewResponse> {
  return apiClient<CampaignPreviewResponse>('/api/campaigns/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function sendCampaign(
  input: CampaignIn
): Promise<CampaignSendResponse> {
  return apiClient<CampaignSendResponse>('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function getCampaigns(): Promise<CampaignSummaryRecord[]> {
  return apiClient<CampaignSummaryRecord[]>('/api/campaigns');
}

export async function getCampaignDetail(
  id: string,
  page = 1,
  pageSize = 50
): Promise<CampaignDetailResponse> {
  return apiClient<CampaignDetailResponse>(
    `/api/campaigns/${encodeURIComponent(id)}?page=${page}&page_size=${pageSize}`
  );
}

export async function unsubscribe(address: string): Promise<{ unsubscribed: string }> {
  return apiClient<{ unsubscribed: string }>('/api/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
}

