'use client';

import { useRouter } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Sparkline from '@/components/charts/Sparkline';
import { useTopMovers } from '@/hooks/useMarket';
import { useTranslation } from '@/providers/I18nProvider';
import { formatCurrency } from '@/lib/utils';
import type { TopMoversResponse } from '@/hooks/useMarket';

function sign(v: number) {
  return v >= 0 ? '+' : '';
}

export default function TopMoversTable({ initialMovers }: { initialMovers?: TopMoversResponse }) {
  const router = useRouter();
  const { t } = useTranslation();
  const moversQ = useTopMovers({ enabled: !initialMovers?.items?.length });
  const rows = moversQ.data?.items ?? initialMovers?.items ?? [];

  return (
    <Card className="h-full">
      <div>
        <p className="text-sm font-medium text-zinc-300">{t('topMovers.title')}</p>
        <p className="mt-1 text-xs text-zinc-500">{t('topMovers.subtitle')}</p>
      </div>

      <div className="mt-4">
        {moversQ.isLoading && !initialMovers ? (
          <div className="py-10 text-center text-sm text-zinc-500">{t('topMovers.loading')}</div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<TrendingUp size={28} strokeWidth={1.5} />}
            title={t('topMovers.emptyTitle')}
            description={t('topMovers.emptyDesc')}
            action={{ label: t('topMovers.exploreNvda'), href: '/stocks/NVDA' }}
          />
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => {
              const positive = r.change_percent >= 0;
              const sparkValues =
                r.sparkline?.length >= 2 ? r.sparkline : [r.price, r.price * (1 + r.change_percent / 100)];

              return (
                <li key={r.symbol}>
                  <button
                    type="button"
                    onClick={() => router.push(`/stocks/${r.symbol}`)}
                    className="flex w-full flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-900/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold text-zinc-100">{r.symbol}</p>
                        <p className="truncate text-[11px] text-zinc-500">{r.company_name}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm text-zinc-200">{formatCurrency(r.price)}</p>
                        <p className={`font-mono text-xs ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {sign(r.change_percent)}
                          {r.change_percent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <Sparkline
                      values={sparkValues}
                      height={28}
                      stroke={positive ? '#10b981' : '#f43f5e'}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
