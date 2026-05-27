import { keepPreviousData, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Portfolio, Transaction } from '@/types';

function normalizeTransactionsResponse(raw: unknown): PaginatedTransactions {
  if (Array.isArray(raw)) {
    return {
      data: raw as Transaction[],
      current_page: 1,
      last_page: 1,
      per_page: raw.length,
      total: raw.length,
    };
  }

  const page = raw as PaginatedTransactions;
  return {
    data: page.data ?? [],
    current_page: page.current_page ?? 1,
    last_page: page.last_page ?? 1,
    per_page: page.per_page ?? 10,
    total: page.total ?? page.data?.length ?? 0,
  };
}

export function usePortfolio() {
  return useQuery<Portfolio>({
    queryKey: ['portfolio'],
    queryFn: () => api.get('/api/portfolio').then((r) => r.data),
    refetchInterval: 30000,
  });
}

export function useTransactions() {
  return useQuery<PaginatedTransactions>({
    queryKey: ['transactions'],
    queryFn: () =>
      api.get('/api/portfolio/transactions').then((r) => normalizeTransactionsResponse(r.data)),
  });
}

/** Paginação padrão do Laravel (`LengthAwarePaginator`). */
export type PaginatedTransactions = {
  data: Transaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function useTransactionsPage(page: number, perPage = 10) {
  return useQuery<PaginatedTransactions>({
    queryKey: ['transactions', page, perPage],
    queryFn: () =>
      api
        .get('/api/portfolio/transactions', { params: { page, per_page: perPage } })
        .then((r) => normalizeTransactionsResponse(r.data)),
    placeholderData: keepPreviousData,
  });
}
