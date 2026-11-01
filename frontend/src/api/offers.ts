import { apiClient } from './client';
import { downloadFileFromUrl } from '../lib/download';
import type { Offer } from './types';

export async function getOffers(): Promise<Offer[]> {
  return apiClient<Offer[]>('/api/offers');
}

export function getSampleFileUrl(): string {
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/api/sample`;
}

export async function downloadSampleFile(): Promise<void> {
  return downloadFileFromUrl(getSampleFileUrl(), 'sample_customers.csv');
}

