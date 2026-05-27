import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { StockQuote } from '@/types';
import type {
  MarketOverviewResponse,
  MarketStrengthResponse,
  MarketTickerResponse,
  MarketStatus,
  SectorsResponse,
  TopMoversResponse,
} from '@/hooks/useMarket';

export type DashboardPortfolioSummary = {
  cash_balance: string;
  holdings_count: number;
  stock_value: string;
  total_value: string;
};

export type DashboardInsightPayload = {
  ticker: MarketTickerResponse;
  overview: MarketOverviewResponse;
  strength: MarketStrengthResponse;
  top_movers: TopMoversResponse;
  sectors: SectorsResponse;
  featured: StockQuote & { symbol: string };
  portfolio: DashboardPortfolioSummary;
  status: MarketStatus;
};

export function useDashboardInsight() {
  return useQuery<DashboardInsightPayload>({
    queryKey: ['dashboard-insight'],
    queryFn: () => api.get('/api/dashboard').then((r) => r.data),
    staleTime: 30_000,
    retry: 0,
  });
}

