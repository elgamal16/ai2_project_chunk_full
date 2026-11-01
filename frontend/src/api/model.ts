import { apiClient } from './client';
import type { ModelFactor, ModelMetrics } from './types';

export async function getModelMetrics(): Promise<ModelMetrics> {
  return apiClient<ModelMetrics>('/api/model');
}

export async function getModelFactors(): Promise<ModelFactor[]> {
  return apiClient<ModelFactor[]>('/api/model/factors');
}

