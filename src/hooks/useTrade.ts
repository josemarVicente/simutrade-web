import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { TradePayload, TradeResult } from '@/types';

export function useBuy() {
  const queryClient = useQueryClient();

  return useMutation<TradeResult, Error, TradePayload>({
    mutationFn: (data) => api.post('/api/buy', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['performance'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });
}

export function useSell() {
  const queryClient = useQueryClient();

  return useMutation<TradeResult, Error, TradePayload>({
    mutationFn: (data) => api.post('/api/sell', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['performance'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });
}
