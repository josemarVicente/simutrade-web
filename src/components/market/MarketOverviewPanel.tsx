'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import type { MarketOverviewResponse, MarketTickerItem } from '@/hooks/useMarket';
import { useMarketOverview, useMarketTicker } from '@/hooks/useMarket';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

function getTrendColor(changePercent: number) {
  return changePercent >= 0 ? '#10b981' : '#f43f5e';
}

export default function MarketOverviewPanel({
  initialTickerItems,
  initialOverview,
}: {
  initialTickerItems?: MarketTickerItem[];
  initialOverview?: MarketOverviewResponse;
}) {
  const ticker = useMarketTicker();
  const tabs = useMemo(
    () =>
      (ticker.data?.items ?? initialTickerItems ?? []).map((it) => ({
        value: it.symbol,
        label: it.label,
      })),
    [ticker.data?.items, initialTickerItems]
  );

  const [selected, setSelected] = useState<string>(initialOverview?.symbol ?? '');

  useEffect(() => {
    if (!selected && ticker.data?.items?.[0]?.symbol) {
      setSelected(ticker.data.items[0].symbol);
    }
  }, [selected, ticker.data?.items]);

  const overview = useMarketOverview(selected || undefined);

  const chartData = overview.data?.points ?? initialOverview?.points ?? [];
  const changePercent = overview.data?.change_percent ?? initialOverview?.change_percent ?? 0;
  const trendColor = getTrendColor(changePercent);

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-zinc-400">Market overview</p>
          <div className="mt-2">
            {ticker.isLoading ? (
              <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-800" />
            ) : tabs.length ? (
              <Tabs items={tabs.slice(0, 4)} value={selected} onValueChange={setSelected} />
            ) : null}
          </div>
        </div>
        {overview.data?.stale ?? initialOverview?.stale ? <Badge variant="neutral">stale</Badge> : null}
      </div>

      <div className="mt-4 h-[260px]">
        {overview.isLoading && !initialOverview ? (
          <div className="h-full animate-pulse rounded-xl bg-zinc-900" />
        ) : chartData.length < 2 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Sem dados suficientes.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid stroke="rgba(148,163,184,0.10)" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#71717a', fontSize: 12 }}
                itemStyle={{ color: '#e4e4e7' }}
                formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Close']}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={trendColor}
                fill={trendColor}
                fillOpacity={0.12}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">Trades</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">
            {overview.data?.summary.total_trade ?? initialOverview?.summary.total_trade ?? '—'}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">Volume</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">
            {overview.data?.summary.total_volume ?? initialOverview?.summary.total_volume ?? '—'}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">Total value</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">
            {(overview.data?.summary.total_value ?? initialOverview?.summary.total_value) != null
              ? formatCurrency(
                  Number(overview.data?.summary.total_value ?? initialOverview?.summary.total_value) * 1_000_000
                )
              : '—'}
          </p>
        </div>
      </div>
    </Card>
  );
}

