import type { CampaignIn } from '../../api/types';

export type CampaignFormData = CampaignIn;

export interface SendResultState {
  campaignId: string;
  mode: 'dryrun' | 'live';
  recipients: number;
  sent: number;
  failed: number;
  skipped: number;
  by_channel: Record<string, number>;
  note: string;
}

