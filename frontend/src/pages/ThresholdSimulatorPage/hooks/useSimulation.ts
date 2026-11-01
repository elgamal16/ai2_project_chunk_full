import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../../../api/analysis';
import type { CustomerRecord } from '../../../api/types';

export function useSimulation(analysisId: string | undefined) {
  const [threshold, setThreshold] = useState<number>(50);
  const [costPerMessage, setCostPerMessage] = useState<number>(0.1);

  const query = useQuery<CustomerRecord[], Error>({
    queryKey: ['allCustomers', analysisId],
    queryFn: async () => {
      if (!analysisId) throw new Error('Analysis ID required');
      const firstPage = await getCustomers(analysisId, { page: 1, page_size: 200 });
      const total = firstPage.total;
      let allItems = [...firstPage.items];
      const totalPages = Math.ceil(total / 200);

      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(getCustomers(analysisId, { page: p, page_size: 200 }));
        }
        const results = await Promise.all(promises);
        results.forEach((res) => {
          allItems = allItems.concat(res.items);
        });
      }
      return allItems;
    },
    enabled: Boolean(analysisId),
    staleTime: 5 * 60 * 1000,
  });

  const stats = useMemo(() => {
    const customers = query.data || [];
    const defaultFlagged = customers.filter((c) => c.risk_score >= 50).length;
    const simulatedCustomers = customers.filter((c) => c.risk_score >= threshold);
    const simulatedFlagged = simulatedCustomers.length;
    const delta = simulatedFlagged - defaultFlagged;

    let phoneOnly = 0;
    let emailOnly = 0;
    let both = 0;
    let neither = 0;

    for (const c of simulatedCustomers) {
      const hasPhone = Boolean(c.phone && c.phone.trim());
      const hasEmail = Boolean(c.email && c.email.trim());
      if (hasPhone && hasEmail) both++;
      else if (hasPhone) phoneOnly++;
      else if (hasEmail) emailOnly++;
      else neither++;
    }

    const reachableTotal = phoneOnly + emailOnly + both;
    const totalCost = reachableTotal * (costPerMessage || 0);

    return {
      defaultFlagged,
      simulatedFlagged,
      delta,
      reachability: { phoneOnly, emailOnly, both, neither, reachableTotal },
      totalCost,
    };
  }, [query.data, threshold, costPerMessage]);

  return {
    isLoading: query.isLoading,
    error: query.error,
    threshold,
    setThreshold,
    costPerMessage,
    setCostPerMessage,
    stats,
  };
}

