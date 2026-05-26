export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
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
  type: 'buy' | 'sell';
  quantity: number;
  price_at_execution: number;
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
}

export interface AnalyticsSummary {
  total_invested: number;
  total_returned: number;
  trade_count: number;
  cash_balance: number;
}
