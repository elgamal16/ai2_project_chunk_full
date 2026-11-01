import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnalysis } from '../../../api/analysis';
import { useAnalysisContext } from '../../../app/AnalysisContext';
import type { AnalysisRecord } from '../../../api/types';

export function useAnalysis(id: string | undefined) {
  const { setActiveAnalysisId } = useAnalysisContext();

  const query = useQuery<AnalysisRecord, Error>({
    queryKey: ['analysis', id],
    queryFn: () => {
      if (!id) throw new Error('Analysis ID required');
      return getAnalysis(id);
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (id) {
      setActiveAnalysisId(id);
    }
  }, [id, setActiveAnalysisId]);

  return query;
}

