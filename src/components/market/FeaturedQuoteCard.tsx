'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useStockQuote } from '@/hooks/useStockSearch';
import { useTranslation } from '@/providers/I18nProvider';
import { formatCurrency } from '@/lib/utils';
import type { StockQuote } from '@/types';

function signPrefix(v: number) {
  return v >= 0 ? '+' : '';
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2.5">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-sm text-zinc-100">{value}</p>
    </div>
  );
}

export default function FeaturedQuoteCard({
  symbol,
  initialQuote,
}: {
  symbol: string;
  initialQuote?: StockQuote;
}) {
  const { t } = useTranslation();
  const quoteQ = useStockQuote(symbol, { enabled: !initialQuote });
  const quote = quoteQ.data ?? initialQuote;
  const dash = t('common.dash');

  const trend = quote?.change_percent;
  const positive = typeof trend === 'number' ? trend >= 0 : true;
  const trendClass = positive ? 'text-emerald-400' : 'text-rose-400';

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{t('featured.title')}</p>
          <Link
            href={`/stocks/${symbol}`}
            className="mt-1 inline-flex items-center gap-1 font-mono text-lg text-zinc-100 transition-colors hover:text-[#c6f432]"
          >
            {symbol}
            <ExternalLink size={14} className="text-zinc-500" />
          </Link>
          {quote?.company_name ? (
            <p className="truncate text-xs text-zinc-500">{quote.company_name}</p>
          ) : null}
          <p className="mt-2 font-mono text-2xl text-zinc-100">
            {quote?.price != null ? formatCurrency(quote.price) : quoteQ.isLoading ? '…' : dash}
          </p>
          {quote?.change_percent != null ? (
            <p className={`mt-1 font-mono text-sm ${trendClass}`}>
              {signPrefix(quote.change_percent)}
              {quote.change_percent.toFixed(2)}%
            </p>
          ) : null}
        </div>
        {quote && (quote as StockQuote & { stale?: boolean }).stale ? (
          <Badge variant="neutral">{t('common.cached')}</Badge>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric label={t('featured.dayOpen')} value={quote?.open != null ? formatCurrency(quote.open) : dash} />
        <Metric label={t('featured.dayHigh')} value={quote?.high != null ? formatCurrency(quote.high) : dash} />
        <Metric label={t('featured.dayLow')} value={quote?.low != null ? formatCurrency(quote.low) : dash} />
        <Metric
          label={t('featured.weekRange')}
          value={
            quote?.fifty_two_week_low != null && quote?.fifty_two_week_high != null
              ? `${formatCurrency(quote.fifty_two_week_low)} – ${formatCurrency(quote.fifty_two_week_high)}`
              : dash
          }
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric
          label={t('featured.sixMonth')}
          value={quote?.returns?.six_month != null ? `${quote.returns.six_month.toFixed(2)}%` : dash}
        />
        <Metric
          label={t('featured.oneYear')}
          value={quote?.returns?.one_year != null ? `${quote.returns.one_year.toFixed(2)}%` : dash}
        />
      </div>

      <Link
        href={`/stocks/${symbol}`}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#c6f432] px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b5ea22]"
      >
        {t('featured.tradeCta')}
      </Link>
    </Card>
  );
}
