'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export type MarketTickerItem = {
  label: string;
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  sparkline: number[];
};

export type MarketTickerResponse = {
  items: MarketTickerItem[];
  as_of: string;
  stale?: boolean;
};

export type MarketOverviewPoint = { time: string; close: number; volume: number };

export type MarketOverviewResponse = {
  symbol: string;
  label: string;
  points: MarketOverviewPoint[];
  price: number;
  change_percent: number;
  summary: {
    total_trade: number;
    total_volume: number;
    total_value: number;
  };
  stale?: boolean;
};

export type MarketStrengthResponse = {
  value: number;
  label: string;
  positive_count: number;
  total_count: number;
};

export type TopMoverItem = {
  symbol: string;
  company_name: string;
  price: number;
  change_percent: number;
  value: number;
  volume: number;
  sparkline: number[];
};

export type TopMoversResponse = {
  items: TopMoverItem[];
};

export type SectorItem = {
  name: string;
  value: number;
  weight_percent: number;
};

export type SectorsResponse = {
  sectors: SectorItem[];
};

export type MarketStatus = {
  is_open: boolean;
  exchange?: string;
  message?: string;
  timezone?: string;
  session?: string | null;
};

export function useMarketTicker() {
  return useQuery<MarketTickerResponse>({
    queryKey: ['market-ticker'],
    queryFn: () => api.get('/api/market/ticker').then((r) => r.data),
    staleTime: 30_000,
    retry: 0,
  });
}

export function useMarketOverview(symbol?: string) {
  return useQuery<MarketOverviewResponse>({
    queryKey: ['market-overview', symbol ?? 'default'],
    queryFn: () => {
      const s = symbol?.trim();
      return api
        .get('/api/market/overview', s ? { params: { symbol: s } } : undefined)
        .then((r) => r.data);
    },
    enabled: true,
    staleTime: 30_000,
    retry: 0,
  });
}

export function useMarketStrength() {
  return useQuery<MarketStrengthResponse>({
    queryKey: ['market-strength'],
    queryFn: () => api.get('/api/market/strength').then((r) => r.data),
    staleTime: 30_000,
    retry: 0,
  });
}

export function useTopMovers() {
  return useQuery<TopMoversResponse>({
    queryKey: ['market-top-movers'],
    queryFn: () => api.get('/api/market/top-movers').then((r) => r.data),
    staleTime: 30_000,
    retry: 0,
  });
}

export function useMarketSectors() {
  return useQuery<SectorsResponse>({
    queryKey: ['market-sectors'],
    queryFn: () => api.get('/api/market/sectors').then((r) => r.data),
    staleTime: 60_000,
    retry: 0,
  });
}

export function useMarketStatus() {
  return useQuery<MarketStatus>({
    queryKey: ['market-status'],
    queryFn: () => api.get('/api/market/status').then((r) => r.data),
    staleTime: 30_000,
    retry: 0,
  });
}
