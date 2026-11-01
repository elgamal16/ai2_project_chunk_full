import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { validateFile, analyzeFile } from '../../../api/analysis';
import { useAnalysisContext } from '../../../app/AnalysisContext';
import type { AnalyzeResponse, ValidationResult } from '../../../api/types';

export function useValidate() {
  const navigate = useNavigate();
  const { file, setActiveAnalysisId } = useAnalysisContext();

  const validationQuery = useQuery<ValidationResult, Error>({
    queryKey: ['validate', file?.name, file?.size, file?.lastModified],
    queryFn: () => {
      if (!file) throw new Error('No file provided');
      return validateFile(file);
    },
    enabled: Boolean(file),
    retry: false,
  });

  const analyzeMutation = useMutation<AnalyzeResponse, Error>({
    mutationFn: () => {
      if (!file) throw new Error('No file provided');
      return analyzeFile(file);
    },
    onSuccess: (data) => {
      setActiveAnalysisId(data.analysis_id);
      navigate(`/results/${data.analysis_id}`);
    },
  });

  return {
    file,
    validation: validationQuery.data,
    isLoading: validationQuery.isLoading,
    error: validationQuery.error,
    refetchValidation: validationQuery.refetch,
    runAnalysis: () => analyzeMutation.mutate(),
    isAnalyzing: analyzeMutation.isPending,
    analyzeError: analyzeMutation.error,
  };
}

