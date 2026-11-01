import { useQuery } from '@tanstack/react-query';
import { listAnalyses } from '../../../api/analysis';
import type { AnalysisRecord } from '../../../api/types';

export function useRecentAnalyses() {
  return useQuery<AnalysisRecord[], Error>({
    queryKey: ['analyses'],
    queryFn: listAnalyses,
  });
}

