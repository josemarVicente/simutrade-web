'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ConceptHelp from '@/components/learn/ConceptHelp';
import { useAnalyticsSummary, usePerformance } from '@/hooks/useAnalytics';
import { useTransactions } from '@/hooks/usePortfolio';
import { formatCurrency, formatDate } from '@/lib/utils';
import { isBuyTransaction } from '@/lib/transactions';
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export default function AnalyticsPage() {
  const summary = useAnalyticsSummary();
  const perf = usePerformance(180);
  const tx = useTransactions();

  const txItems = useMemo(() => tx.data?.data ?? [], [tx.data]);

  const buyCount = txItems.filter((t) => isBuyTransaction(t.type)).length;
  const sellCount = txItems.filter((t) => !isBuyTransaction(t.type)).length;

  const buyTotal = txItems
    .filter((t) => isBuyTransaction(t.type))
    .reduce((acc, t) => acc + Number(t.total_value || 0), 0);
  const sellTotal = txItems
    .filter((t) => !isBuyTransaction(t.type))
    .reduce((acc, t) => acc + Number(t.total_value || 0), 0);

  const drawdownSeries = useMemo(() => {
    const pts = perf.data ?? [];
    let peak = -Infinity;
    return pts.map((p) => {
      peak = Math.max(peak, p.value);
      const dd = peak > 0 ? ((p.value - peak) / peak) * 100 : 0;
      return { date: p.date, drawdown: dd, value: p.value };
    });
  }, [perf.data]);

  const maxDrawdown = useMemo(() => {
    if (!drawdownSeries.length) return 0;
    return Math.min(...drawdownSeries.map((p) => p.drawdown));
  }, [drawdownSeries]);

  const distribution = useMemo(
    () => [
      { name: 'Buy', value: buyCount, color: '#10b981' },
      { name: 'Sell', value: sellCount, color: '#f43f5e' },
    ],
    [buyCount, sellCount]
  );

  const bars = useMemo(
    () => [
      { name: 'Total buy', value: buyTotal, color: '#10b981' },
      { name: 'Total sell', value: sellTotal, color: '#f43f5e' },
    ],
    [buyTotal, sellTotal]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Analytics</h1>
          <p className="mt-1 text-sm text-zinc-500">Insights de performance e comportamento de trades.</p>
        </div>
        <Badge variant="neutral">{summary.data?.trade_count ?? 0} trades</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-zinc-500 mb-1">Total invested</p>
          <p className="text-2xl font-semibold text-zinc-100">{formatCurrency(summary.data?.total_invested ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-xs text-zinc-500 mb-1">Total returned</p>
          <p className="text-2xl font-semibold text-zinc-100">{formatCurrency(summary.data?.total_returned ?? 0)}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            Max drawdown <ConceptHelp conceptKey="drawdown" />
          </div>
          <p className="text-2xl font-semibold text-rose-300">{maxDrawdown.toFixed(2)}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-300">Drawdown (180d)</p>
            {perf.isLoading ? <Badge variant="neutral">a carregar…</Badge> : null}
          </div>
          <div className="mt-4 h-[240px]">
            {!drawdownSeries.length ? (
              <div className="h-full flex items-center justify-center text-sm text-zinc-500">Sem dados suficientes.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownSeries}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => formatDate(d)}
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#71717a', fontSize: 12 }}
                    itemStyle={{ color: '#fca5a5' }}
                    formatter={(v) => [`${Number(v ?? 0).toFixed(2)}%`, 'Drawdown']}
                    labelFormatter={(label) => formatDate(label as string)}
                  />
                  <Area type="monotone" dataKey="drawdown" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium text-zinc-300">Win/Loss distribution</p>
          <p className="mt-1 text-xs text-zinc-500">
            Aqui mostramos uma proxy simples (buy vs sell). Se o backend fornecer PnL por trade, dá para evoluir para win/loss real.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribution} dataKey="value" nameKey="name" outerRadius={80} innerRadius={45} stroke="none">
                    {distribution.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#71717a', fontSize: 12 }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bars}>
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#71717a', fontSize: 12 }}
                    itemStyle={{ color: '#e4e4e7' }}
                    formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Total']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {bars.map((b) => (
                      <Cell key={b.name} fill={b.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
