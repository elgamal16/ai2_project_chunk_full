import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../../../api/analysis';
import type { CustomerRecord, PaginatedResponse } from '../../../api/types';
import type { FilterState } from '../ResultsPage.types';

export function useCustomers(analysisId: string | undefined) {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    page_size: 50,
    risk: undefined,
    prediction: undefined,
    contract: undefined,
    contact: undefined,
    q: '',
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.q || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.q || '');
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.q]);

  const queryParams = {
    ...filters,
    q: debouncedSearch || undefined,
  };

  const query = useQuery<PaginatedResponse<CustomerRecord>, Error>({
    queryKey: ['customers', analysisId, queryParams],
    queryFn: () => {
      if (!analysisId) throw new Error('Analysis ID required');
      return getCustomers(analysisId, queryParams);
    },
    enabled: Boolean(analysisId),
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // reset page if filters change
    }));
  };

  return {
    ...query,
    filters,
    updateFilters,
  };
}

