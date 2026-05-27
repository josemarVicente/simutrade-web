import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { normalizePerformanceSnapshots } from '@/lib/performance';
import type { PerformanceSnapshot, AnalyticsSummary } from '@/types';

export function usePerformance(days = 30) {
  return useQuery<PerformanceSnapshot[]>({
    queryKey: ['performance', days],
    queryFn: () =>
      api
        .get('/api/analytics/performance', { params: { days } })
        .then((r) => normalizePerformanceSnapshots(r.data)),
  });
}

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics-summary'],
    queryFn: () => api.get('/api/analytics/summary').then((r) => r.data),
  });
}
