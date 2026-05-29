'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { useStockQuote } from '@/hooks/useStockSearch';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useBuy, useSell } from '@/hooks/useTrade';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Sparkline from '@/components/charts/Sparkline';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/apiErrors';
import { useTranslation } from '@/providers/I18nProvider';
import { formatCurrency, getPnlColor } from '@/lib/utils';

function buildSparklineValues(price: number, changePercent: number, sparkline?: number[]) {
  if (sparkline && sparkline.length >= 2) return sparkline;
  if (price > 0) {
    const prev = price / (1 + (changePercent || 0) / 100);
    return [prev, price];
  }
  return [];
}

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = use(params);
  const symbol = decodeURIComponent(rawSymbol ?? '').trim().toUpperCase();

  const toast = useToast();
  const { t } = useTranslation();
  const { data: quote, isLoading: quoteLoading, isError, error } = useStockQuote(symbol);
  const { data: portfolio } = usePortfolio();
  const buy = useBuy();
  const sell = useSell();

  const ownedShares = useMemo(() => {
    const h = portfolio?.holdings?.find((x) => x.symbol === symbol);
    return h?.quantity ?? 0;
  }, [portfolio?.holdings, symbol]);

  const cash = portfolio?.cash_balance ?? 0;
  const price = quote?.price ?? 0;
  const changePercent = quote?.change_percent ?? 0;
  const positive = changePercent >= 0;

  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [qty, setQty] = useState<string>('1');
  const quantity = Math.max(0, Math.floor(Number(qty || 0)));

  const orderValue = quantity * price;

  const clientError =
    quantity <= 0
      ? t('stocks.invalidQty')
      : tab === 'buy' && orderValue > cash
        ? t('stocks.insufficientCash')
        : tab === 'sell' && quantity > ownedShares
          ? t('stocks.insufficientShares')
          : null;

  const submitting = buy.isPending || sell.isPending;

  const sparkValues = buildSparklineValues(price, changePercent, quote?.sparkline);
  const hasChart = sparkValues.length >= 2;

  const onSubmit = () => {
    if (clientError) {
      toast.push({ variant: 'danger', title: t('stocks.orderBlocked'), description: clientError });
      return;
    }

    const payload = { symbol, quantity };
    const mutate = tab === 'buy' ? buy.mutate : sell.mutate;

    mutate(payload, {
      onSuccess: (res) => {
        toast.push({
          variant: 'success',
          title: t('stocks.orderExecuted'),
          description: res?.message ?? `${tab.toUpperCase()} ${quantity} ${symbol}`,
        });
      },
      onError: (err) => {
        toast.push({
          variant: 'danger',
          title: t('stocks.orderFailed'),
          description: getApiErrorMessage(err, t('stocks.orderFailedDesc')),
        });
      },
    });
  };

  if (!symbol) {
    return (
      <EmptyState
        title={t('stocks.invalidSymbolTitle')}
        description={t('stocks.invalidSymbolDesc')}
        action={{ label: t('stocks.backDashboard'), href: '/dashboard' }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={14} />
          {t('stocks.backDashboard')}
        </Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-mono text-2xl font-semibold text-zinc-100">{symbol}</h1>
            {quote?.company_name ? (
              <p className="mt-1 truncate text-sm text-zinc-500">{quote.company_name}</p>
            ) : quoteLoading ? (
              <p className="mt-1 text-sm text-zinc-600">{t('stocks.loadingQuote')}</p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">{t('stocks.price')}</p>
            <p className="font-mono text-2xl font-semibold text-zinc-100">
              {quoteLoading ? t('common.dash') : price > 0 ? formatCurrency(price) : t('common.dash')}
            </p>
            {quote?.change_percent != null ? (
              <p className={`font-mono text-sm ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {positive ? '+' : ''}
                {changePercent.toFixed(2)}%
              </p>
            ) : null}
          </div>
        </div>

        <Card className="mt-4">
          {quoteLoading ? (
            <div className="h-[180px] animate-pulse rounded-xl bg-zinc-900" />
          ) : isError ? (
            <EmptyState
              icon={positive ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
              title={t('stocks.quoteUnavailableTitle')}
              description={getApiErrorMessage(error, t('stocks.quoteUnavailableDesc', { symbol }))}
              action={{ label: t('stocks.tryAapl'), href: '/stocks/AAPL' }}
            />
          ) : !hasChart ? (
            <EmptyState
              title={t('stocks.intradaySyncTitle')}
              description={t('stocks.intradaySyncDesc')}
            />
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs text-zinc-500">{t('stocks.sparklineLabel')}</p>
                {(quote as { stale?: boolean })?.stale ? (
                  <Badge variant="neutral">{t('common.cached')}</Badge>
                ) : null}
              </div>
              <Sparkline
                values={sparkValues}
                height={160}
                stroke={positive ? '#10b981' : '#f43f5e'}
              />
            </>
          )}
        </Card>

        <Card className="mt-6">
          <p className="text-sm font-medium text-zinc-300">{t('stocks.details')}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('stocks.exchange')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.exchange ?? t('common.dash')}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('stocks.sector')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.sector ?? t('common.dash')}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('stocks.currency')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.currency ?? 'USD'}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('featured.dayOpen')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">
                {quote?.open != null ? formatCurrency(quote.open) : t('common.dash')}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('featured.dayHigh')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">
                {quote?.high != null ? formatCurrency(quote.high) : t('common.dash')}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('featured.dayLow')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">
                {quote?.low != null ? formatCurrency(quote.low) : t('common.dash')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-4">
        <Card className="sticky top-28">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-300">{t('stocks.trade')}</p>
            <Badge variant="neutral">
              {t('stocks.owned')} <span className="ml-1 font-mono">{ownedShares}</span>
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTab('buy')}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                tab === 'buy'
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {t('stocks.buy')}
            </button>
            <button
              type="button"
              onClick={() => setTab('sell')}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                tab === 'sell'
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {t('stocks.sell')}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('stocks.cash')}</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{formatCurrency(cash)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-xs text-zinc-500">{t('stocks.orderValue')}</p>
              <p className={`mt-1 font-mono text-sm ${getPnlColor(tab === 'buy' ? -orderValue : orderValue)}`}>
                {formatCurrency(orderValue)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Input
              label={t('stocks.quantityLabel')}
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ''))}
              disabled={submitting}
              error={clientError ?? undefined}
            />
          </div>

          <Button
            type="button"
            className="mt-4 w-full"
            variant={tab === 'buy' ? 'primary' : 'danger'}
            loading={submitting}
            disabled={!!clientError || submitting || price <= 0 || quoteLoading}
            onClick={onSubmit}
          >
            {tab === 'buy' ? t('stocks.buyButton') : t('stocks.sellButton')}
          </Button>

          {price <= 0 && !quoteLoading ? (
            <p className="mt-3 text-xs text-amber-400/90">
              {t('stocks.waitQuote')}
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
