export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avg_buy_price: number;
  current_price: number;
  current_value: number;
  unrealized_pnl: number;
}

export interface Portfolio {
  cash_balance: number;
  total_value: number;
  holdings: Holding[];
}

export interface Transaction {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  execution_price: number;
  total_value: number;
  created_at: string;
}

export interface Stock {
  symbol: string;
  company_name: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change?: number;
  change_percent?: number;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  prev_close?: number | null;
  fifty_two_week_high?: number | null;
  fifty_two_week_low?: number | null;
  volume?: number | null;
  sparkline?: number[];
  returns?: {
    six_month?: number | null;
    one_year?: number | null;
  };
  company_name?: string;
  sector?: string | null;
  exchange?: string | null;
  currency?: string;
  logo_url?: string | null;
}

export interface TradePayload {
  symbol: string;
  quantity: number;
}

export interface TradeResult {
  message: string;
  symbol: string;
  quantity: number;
  price: number;
  total_spent?: number;
  total_earned?: number;
  new_balance: number;
}

export interface PerformanceSnapshot {
  date: string;
  value: number;
  cash_balance: number;
  stock_value?: number;
}

export interface AnalyticsSummary {
  total_invested: number;
  total_returned: number;
  trade_count: number;
  cash_balance: number;
}
