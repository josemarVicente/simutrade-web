import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/axios';
import type { Stock, StockQuote } from '@/types';

export function useStockSearch() {
  const [query, setQuery] = useState('');

  const results = useStockSearchResults(query);

  return { query, setQuery, results };
}

export function useStockSearchResults(query: string) {
  return useQuery<Stock[]>({
    queryKey: ['stock-search', query],
    queryFn: () => api.get('/api/stocks/search', { params: { q: query } }).then((r) => r.data),
    enabled: query.trim().length >= 1,
    staleTime: 60_000,
  });
}

export function useStockQuote(symbol: string) {
  return useQuery<StockQuote>({
    queryKey: ['quote', symbol],
    queryFn: () => api.get(`/api/stocks/quote/${symbol}`).then((r) => r.data),
    refetchInterval: 30000,
    enabled: !!symbol,
  });
}
