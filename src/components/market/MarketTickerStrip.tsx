'use client';

import { useEffect, useMemo } from 'react';
import { useToast } from '@/components/ui/Toast';
import { getApiErrorMessage } from '@/lib/apiErrors';
import { useMarketTicker } from '@/hooks/useMarket';
import Sparkline from '@/components/charts/Sparkline';
import Badge from '@/components/ui/Badge';

export default function MarketTickerStrip() {
  const toast = useToast();
  const ticker = useMarketTicker();

  useEffect(() => {
    if (ticker.isError) {
      toast.push({
        variant: 'danger',
        title: 'Erro ao carregar ticker',
        description: getApiErrorMessage(ticker.error, 'Não foi possível carregar o mercado.'),
      });
    }
  }, [ticker.isError, ticker.error, toast]);

  const items = useMemo(() => ticker.data?.items ?? [], [ticker.data?.items]);

  return (
    <section className="border-b border-zinc-800 bg-[#0b0f14]">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        {ticker.data?.stale ? (
          <div className="mb-2">
            <Badge variant="neutral">stale quotes</Badge>
          </div>
        ) : null}
        <div className="flex items-stretch gap-3 overflow-x-auto">
          {ticker.isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  className="min-w-[190px] animate-pulse rounded-2xl border border-zinc-800 bg-[#121212]/70 p-4"
                >
                  <div className="h-3 w-20 rounded bg-zinc-700" />
                  <div className="mt-3 h-7 w-28 rounded bg-zinc-800" />
                  <div className="mt-2 h-8 w-full rounded bg-zinc-800" />
                </div>
              ))}
            </>
          ) : items.length === 0 ? (
            <div className="text-sm text-zinc-500 py-2">Sem dados para o ticker.</div>
          ) : (
            items.map((it) => {
              const positive = it.change_percent >= 0;
              const trendClass = positive ? 'text-emerald-400' : 'text-rose-400';
              return (
                <div
                  key={it.symbol}
                  className="min-w-[190px] rounded-2xl border border-zinc-800 bg-[#121212]/70 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-zinc-400">{it.label}</p>
                      <p className="mt-1 font-mono text-lg text-zinc-100">{it.symbol}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="font-mono text-lg text-zinc-100">{it.price.toFixed(2)}</p>
                    <p className={`font-mono text-sm ${trendClass}`}>
                      {positive ? '+' : ''}
                      {it.change_percent.toFixed(2)}%
                    </p>
                  </div>

                  <div className="mt-2">
                    <Sparkline values={it.sparkline} stroke={positive ? '#10b981' : '#f43f5e'} height={34} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

