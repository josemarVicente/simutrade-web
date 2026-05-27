import type { PerformanceSnapshot } from '@/types';

/** Normaliza snapshots do Laravel (`portfolio_snapshots`) para o formato dos gráficos. */
export function normalizePerformanceSnapshots(raw: unknown): PerformanceSnapshot[] {
  const rows = Array.isArray(raw) ? raw : [];
  return rows.map((p: Record<string, unknown>) => ({
    date: String(p.snapshot_date ?? p.date ?? ''),
    value: Number(p.total_value ?? p.value ?? 0),
    cash_balance: Number(p.cash_balance ?? 0),
    stock_value: Number(p.stock_value ?? 0),
  }));
}
