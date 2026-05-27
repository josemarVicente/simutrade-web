'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useStockQuote } from '@/hooks/useStockSearch';
import { formatCurrency } from '@/lib/utils';
import type { StockQuote } from '@/types';

function signPrefix(v: number) {
  return v >= 0 ? '+' : '';
}

export default function FeaturedQuoteCard({
  symbol,
  initialQuote,
}: {
  symbol: string;
  initialQuote?: StockQuote;
}) {
  const quoteQ = useStockQuote(symbol);

  const quote = quoteQ.data ?? initialQuote;

  const trend = quote?.change_percent;
  const positive = typeof trend === 'number' ? trend >= 0 : true;
  const trendClass = positive ? 'text-emerald-400' : 'text-rose-400';

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-zinc-400">Stock exchange</p>
          <p className="mt-2 font-mono text-2xl text-zinc-100">
            {quoteQ.isLoading ? (quote?.price != null ? formatCurrency(quote.price) : '—') : quote?.price != null ? formatCurrency(quote.price) : '—'}
          </p>
          {quote?.change_percent != null ? (
            <p className={`mt-1 font-mono text-sm ${trendClass}`}>
              {signPrefix(quote.change_percent)}
              {quote.change_percent.toFixed(2)}%
            </p>
          ) : null}
        </div>
        {quote && (quote as any).stale ? <Badge variant="neutral">stale</Badge> : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">Day open</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.open != null ? formatCurrency(quote.open) : '—'}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">Day high</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.high != null ? formatCurrency(quote.high) : '—'}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">Day low</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.low != null ? formatCurrency(quote.low) : '—'}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-xs text-zinc-500">52 week range</p>
          <p className="mt-1 font-mono text-sm text-zinc-100">
            {quote?.fifty_two_week_low != null && quote?.fifty_two_week_high != null
              ? `${formatCurrency(quote.fifty_two_week_low)} - ${formatCurrency(quote.fifty_two_week_high)}`
              : '—'}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
        <p className="text-xs text-zinc-500">Returns</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-500">6 Month</p>
            <p className="font-mono text-sm text-zinc-100">
              {quote?.returns?.six_month != null ? `${quote.returns.six_month.toFixed(2)}%` : '—'}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[11px] text-zinc-500">1 Year</p>
            <p className="font-mono text-sm text-zinc-100">
              {quote?.returns?.one_year != null ? `${quote.returns.one_year.toFixed(2)}%` : '—'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

