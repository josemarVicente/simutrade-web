'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BarChart3, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
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
import { useTranslation } from '@/providers/I18nProvider';

function getTrendColor(changePercent: number) {
  return changePercent >= 0 ? '#10b981' : '#f43f5e';
}

function buildChartPoints(
  points: MarketOverviewResponse['points'],
  sparkline: number[] | undefined,
  price: number | undefined
) {
  if (points.length >= 2) return points;
  if (sparkline && sparkline.length >= 2) {
    return sparkline.map((close, i) => ({
      time: `${i}`,
      close,
      volume: 0,
    }));
  }
  if (price != null && price > 0) {
    return [
      { time: '0', close: price, volume: 0 },
      { time: '1', close: price, volume: 0 },
    ];
  }
  return [];
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-1 flex-col gap-1 border-r border-zinc-800 px-4 py-3 last:border-r-0">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="font-mono text-sm text-zinc-100">{value}</p>
    </div>
  );
}

export default function MarketOverviewPanel({
  initialTickerItems,
  initialOverview,
}: {
  initialTickerItems?: MarketTickerItem[];
  initialOverview?: MarketOverviewResponse;
}) {
  const { t } = useTranslation();
  const tickerItems = initialTickerItems ?? [];
  const ticker = useMarketTicker({ enabled: !tickerItems.length });

  const items = ticker.data?.items ?? tickerItems;

  const tabs = useMemo(
    () =>
      items.map((it) => ({
        value: it.symbol,
        label: it.label,
      })),
    [items]
  );

  const [selected, setSelected] = useState<string>(initialOverview?.symbol ?? items[0]?.symbol ?? 'SPY');

  useEffect(() => {
    if (!selected && items[0]?.symbol) {
      setSelected(items[0].symbol);
    }
  }, [selected, items]);

  const overview = useMarketOverview(selected || undefined, {
    enabled: Boolean(selected),
  });

  const activeItem = items.find((it) => it.symbol === selected);
  const overviewData =
    overview.data && overview.data.symbol === selected
      ? overview.data
      : selected === initialOverview?.symbol
        ? initialOverview
        : overview.data;

  const price = overviewData?.price ?? activeItem?.price;
  const changePercent = overviewData?.change_percent ?? activeItem?.change_percent ?? 0;
  const trendColor = getTrendColor(changePercent);
  const chartData = buildChartPoints(
    overviewData?.points ?? [],
    activeItem?.sparkline,
    price
  );

  const summary = overviewData?.summary;
  const isStale = overviewData?.stale ?? ticker.data?.stale;

  return (
    <Card className="h-full">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{t('overview.title')}</p>
          {price != null ? (
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-mono text-2xl text-zinc-100">{formatCurrency(price)}</p>
              <p className={`font-mono text-sm ${changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {changePercent >= 0 ? '+' : ''}
                {changePercent.toFixed(2)}%
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {isStale ? <Badge variant="neutral">{t('overview.cached')}</Badge> : null}
          {selected ? (
            <Link
              href={`/stocks/${selected}`}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            >
              {t('overview.trade', { symbol: selected })}
              <ExternalLink size={12} />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {ticker.isLoading && !items.length ? (
          <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-800" />
        ) : tabs.length ? (
          <Tabs items={tabs.slice(0, 4)} value={selected} onValueChange={setSelected} />
        ) : null}
      </div>

      <div className="mt-4 h-[260px] min-w-0">
        {overview.isLoading && !overviewData ? (
          <div className="h-full animate-pulse rounded-xl bg-zinc-900" />
        ) : chartData.length < 2 ? (
          <EmptyState
            icon={<BarChart3 size={28} strokeWidth={1.5} />}
            title={t('overview.chartUnavailableTitle')}
            description={t('overview.chartUnavailableDesc')}
            action={{ label: t('overview.exploreAapl'), href: '/stocks/AAPL' }}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
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
                domain={['auto', 'auto']}
                tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
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

      <div className="mt-4 flex overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50">
        <StatCell label={t('overview.trades')} value={summary?.total_trade ?? t('common.dash')} />
        <StatCell label={t('overview.volume')} value={summary?.total_volume?.toLocaleString() ?? t('common.dash')} />
        <StatCell
          label={t('overview.totalValue')}
          value={
            summary?.total_value != null
              ? formatCurrency(Number(summary.total_value) * 1_000_000)
              : t('common.dash')
          }
        />
      </div>
    </Card>
  );
}
