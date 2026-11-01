import { useQuery } from '@tanstack/react-query';
import { getModelMetrics, getModelFactors } from '../../../api/model';
import type { ModelFactor, ModelMetrics } from '../../../api/types';

export function useModel() {
  const metricsQuery = useQuery<ModelMetrics, Error>({
    queryKey: ['modelMetrics'],
    queryFn: getModelMetrics,
  });

  const factorsQuery = useQuery<ModelFactor[], Error>({
    queryKey: ['modelFactors'],
    queryFn: getModelFactors,
  });

  return {
    metrics: metricsQuery.data,
    isMetricsLoading: metricsQuery.isLoading,
    metricsError: metricsQuery.error,
    factors: factorsQuery.data || [],
    isFactorsLoading: factorsQuery.isLoading,
    factorsError: factorsQuery.error,
  };
}

