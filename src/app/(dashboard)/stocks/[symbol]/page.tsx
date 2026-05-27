'use client';

import { useMemo, useState } from 'react';
import { useStockQuote } from '@/hooks/useStockSearch';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useBuy, useSell } from '@/hooks/useTrade';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ConceptHelp from '@/components/learn/ConceptHelp';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/apiErrors';
import { formatCurrency, getPnlColor } from '@/lib/utils';

export default function StockPage({ params }: { params: { symbol: string } }) {
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  const toast = useToast();
  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: portfolio } = usePortfolio();
  const buy = useBuy();
  const sell = useSell();

  const ownedShares = useMemo(() => {
    const h = portfolio?.holdings?.find((x) => x.symbol === symbol);
    return h?.quantity ?? 0;
  }, [portfolio?.holdings, symbol]);

  const cash = portfolio?.cash_balance ?? 0;
  const price = quote?.price ?? 0;

  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [qty, setQty] = useState<string>('1');
  const quantity = Math.max(0, Math.floor(Number(qty || 0)));

  const orderValue = quantity * price;

  const clientError =
    quantity <= 0
      ? 'Quantidade inválida.'
      : tab === 'buy' && orderValue > cash
        ? 'Saldo insuficiente para essa compra.'
        : tab === 'sell' && quantity > ownedShares
          ? 'Não pode vender mais do que possui.'
          : null;

  const submitting = buy.isPending || sell.isPending;

  const onSubmit = () => {
    if (clientError) {
      toast.push({ variant: 'danger', title: 'Ordem bloqueada', description: clientError });
      return;
    }

    const payload = { symbol, quantity };
    const mutate = tab === 'buy' ? buy.mutate : sell.mutate;

    mutate(payload, {
      onSuccess: (res) => {
        toast.push({
          variant: 'success',
          title: 'Ordem executada',
          description: res?.message ?? `${tab.toUpperCase()} ${quantity} ${symbol}`,
        });
      },
      onError: (err) => {
        toast.push({
          variant: 'danger',
          title: 'Falha ao executar ordem',
          description: getApiErrorMessage(err, 'Não foi possível executar a ordem.'),
        });
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">
              <span className="font-mono">{symbol}</span>
              {quote?.company_name ? (
                <span className="ml-3 text-sm font-normal text-zinc-500">{quote.company_name}</span>
              ) : null}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Cotação ao vivo e dados do cache local.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Preço</p>
            <p className="text-2xl font-semibold text-zinc-100">
              {quoteLoading ? '—' : formatCurrency(price)}
            </p>
          </div>
        </div>

        <Card className="mt-4">
          <p className="text-sm font-medium text-zinc-300">Informação</p>
          <p className="mt-2 text-sm text-zinc-500">
            O backend expõe <span className="font-mono text-zinc-400">GET /api/stocks/quote/{symbol}</span>{' '}
            (sem histórico intraday). Os trades respeitam o middleware{' '}
            <span className="font-mono text-zinc-400">market.open</span>.
          </p>
        </Card>

        <Card className="mt-6">
          <p className="text-sm font-medium text-zinc-300">Dados da ação (stocks_cache)</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-4">
              <p className="text-xs text-zinc-500">Exchange</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.exchange ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-4">
              <p className="text-xs text-zinc-500">Sector</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.sector ?? '—'}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-4">
              <p className="text-xs text-zinc-500">Currency</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{quote?.currency ?? 'USD'}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-4">
        <Card className="sticky top-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-300">Trade</p>
            <Badge variant="neutral">
              owned <span className="ml-1 font-mono">{ownedShares}</span>
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
              Buy
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
              Sell
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-4">
              <p className="text-xs text-zinc-500">Cash</p>
              <p className="mt-1 font-mono text-sm text-zinc-100">{formatCurrency(cash)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-4">
              <p className="text-xs text-zinc-500">Order value</p>
              <p className={`mt-1 font-mono text-sm ${getPnlColor(tab === 'buy' ? -orderValue : orderValue)}`}>
                {formatCurrency(orderValue)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Input
              label="Quantidade"
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
            disabled={!!clientError || submitting || price <= 0}
            onClick={onSubmit}
          >
            {tab === 'buy' ? 'Comprar' : 'Vender'}
          </Button>

          <p className="mt-3 text-xs text-zinc-500">
            Trades via <span className="font-mono">POST /api/buy</span> e{' '}
            <span className="font-mono">POST /api/sell</span> (mercado fechado → HTTP 403).
          </p>
        </Card>
      </div>
    </div>
  );
}
