export interface AnalysisSummary {
  total: number;
  will_leave: number;
  will_stay: number;
  churn_rate: number;
  risk_levels: {
    low: number;
    medium: number;
    high: number;
  };
  by_contract: Record<string, { total: number; will_leave: number }>;
  high_risk_reachable: {
    sms: number;
    email: number;
    unreachable: number;
  };
  skipped_rows?: number;
}

export interface ValidationProblem {
  row: number | null;
  column: string | null;
  issue: string;
  level?: 'error' | 'warning';
}

export interface ContactsSummary {
  phone_only: number;
  email_only: number;
  both: number;
  neither: number;
  invalid_phone: number;
  invalid_email: number;
}

export interface ValidationResult {
  rows: number;
  columns_found: string[];
  missing_columns: string[];
  has_phone_column: boolean;
  has_email_column: boolean;
  problems: ValidationProblem[];
  contacts: ContactsSummary;
  blocking_rows?: number;
  ok: boolean;
}

export interface AnalyzeResponse {
  analysis_id: string;
  summary: AnalysisSummary;
  contacts: ContactsSummary;
  problem_count: number;
  problems: ValidationProblem[];
}

export interface AnalysisRecord {
  id: string;
  created: string;
  filename: string;
  summary?: AnalysisSummary;
  total?: number;
  will_leave?: number;
}

export interface CustomerReason {
  code: string;
  text: string;
  impact: number;
}

export interface CustomerRecord {
  customer_id: string;
  name?: string;
  phone: string;
  email: string;
  contract: string;
  tenure: number;
  monthly_charges: number;
  internet: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  prediction: 'will_leave' | 'will_stay';
  reasons: CustomerReason[];
  main_reason: string;
  suggested_offer: string | null;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

export interface Offer {
  id: string;
  title: string;
  title_ar?: string;
  when: string[];
}

export interface CampaignIn {
  analysis_id: string;
  audience: 'high_risk' | 'selected';
  customer_ids: string[];
  channel: 'whatsapp' | 'email' | 'smart';
  offer_id?: string | null;
  lang: 'en' | 'ar';
  subject?: string;
  message: string;
  consent: boolean;
}

export interface CampaignPreviewExample {
  customer_id: string;
  channel: string;
  to: string;
  body: string;
}

export interface CampaignPreviewResponse {
  will_send: number;
  by_channel: Record<string, number>;
  skipped: number;
  skipped_examples?: Array<{ customer_id: string; reason: string }>;
  examples: CampaignPreviewExample[];
}

export interface CampaignSendResponse {
  campaign_id: string;
  mode: 'dryrun' | 'live';
  recipients: number;
  sent: number;
  failed: number;
  skipped: number;
  by_channel: Record<string, number>;
  note: string;
}

export interface CampaignSummaryRecord {
  id: string;
  created: string;
  analysis_id?: string;
  offer_id: string;
  channel: string;
  mode: 'dryrun' | 'live';
  recipients: number;
  sent: number;
  failed: number;
  skipped: number;
  by_channel: Record<string, number>;
}

export interface CampaignMessage {
  customer_id: string;
  channel: string;
  to_addr: string;
  status: 'sent' | 'failed';
  detail: string;
  body?: string;
}

export interface CampaignDetailResponse extends CampaignSummaryRecord {
  messages: CampaignMessage[];
}

export interface ModelMetrics {
  train_accuracy: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  confusion_matrix: [[number, number], [number, number]];
  n_train: number;
  n_test: number;
}

export interface ModelFactor {
  name: string;
  direction: 'churn' | 'retain';
  strength: number;
}

