import { apiClient } from './client';
import type {
  AnalysisRecord,
  AnalyzeResponse,
  CustomerRecord,
  PaginatedResponse,
  ValidationResult,
} from './types';

export async function validateFile(file: File): Promise<ValidationResult> {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient<ValidationResult>('/api/validate', {
    method: 'POST',
    body: formData,
  });
}

export async function analyzeFile(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient<AnalyzeResponse>('/api/analyze', {
    method: 'POST',
    body: formData,
  });
}

export async function listAnalyses(): Promise<AnalysisRecord[]> {
  return apiClient<AnalysisRecord[]>('/api/analyses');
}

export async function getAnalysis(id: string): Promise<AnalysisRecord> {
  return apiClient<AnalysisRecord>(`/api/analyses/${encodeURIComponent(id)}`);
}

export interface CustomerQueryParams {
  risk?: 'low' | 'medium' | 'high';
  prediction?: 'will_leave' | 'will_stay';
  contract?: string;
  contact?: 'phone' | 'email' | 'both' | 'none';
  q?: string;
  page?: number;
  page_size?: number;
}

export async function getCustomers(
  id: string,
  params: CustomerQueryParams = {}
): Promise<PaginatedResponse<CustomerRecord>> {
  const searchParams = new URLSearchParams();
  if (params.risk) searchParams.set('risk', params.risk);
  if (params.prediction) searchParams.set('prediction', params.prediction);
  if (params.contract) searchParams.set('contract', params.contract);
  if (params.contact) searchParams.set('contact', params.contact);
  if (params.q) searchParams.set('q', params.q);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));

  const query = searchParams.toString();
  const endpoint = `/api/analyses/${encodeURIComponent(id)}/customers${query ? `?${query}` : ''}`;
  return apiClient<PaginatedResponse<CustomerRecord>>(endpoint);
}

export function getExportCsvUrl(id: string, prediction?: string): string {
  const base = import.meta.env.VITE_API_URL || '';
  const param = prediction ? `?prediction=${encodeURIComponent(prediction)}` : '';
  return `${base}/api/analyses/${encodeURIComponent(id)}/export.csv${param}`;
}

