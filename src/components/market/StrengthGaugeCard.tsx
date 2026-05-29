'use client';

import Card from '@/components/ui/Card';
import type { MarketStrengthResponse } from '@/hooks/useMarket';
import { useMarketStrength } from '@/hooks/useMarket';
import { useTranslation } from '@/providers/I18nProvider';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

export default function StrengthGaugeCard({ initialStrength }: { initialStrength?: MarketStrengthResponse }) {
  const { t } = useTranslation();
  const strengthQ = useMarketStrength({ enabled: !initialStrength });
  const strength = strengthQ.data ?? initialStrength;

  const value = strength?.value ?? 0;
  const positiveCount = strength?.positive_count ?? 0;
  const totalCount = strength?.total_count ?? 0;
  const negativeCount = Math.max(0, totalCount - positiveCount);

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{t('strength.title')}</p>
          {strengthQ.isLoading && !initialStrength ? (
            <p className="mt-1 font-mono text-lg text-zinc-500">{t('common.dash')}</p>
          ) : (
            <p className="mt-2 font-mono text-xl text-zinc-100">{value.toFixed(1)}%</p>
          )}
          <p className="mt-1 text-xs text-zinc-500">{t('strength.subtitle')}</p>
        </div>
      </div>

      <div className="mt-4 relative h-[190px]">
        {strengthQ.isLoading && !initialStrength ? (
          <div className="h-full w-full animate-pulse rounded-2xl bg-zinc-900/50" />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="95%"
              barSize={18}
              startAngle={180}
              endAngle={0}
              data={[{ name: 'strength', value }]}
            >
              <RadialBar
                background
                dataKey="value"
                fill={value >= 50 ? '#10b981' : '#f43f5e'}
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        )}

        {!strengthQ.isLoading ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-100">{t('strength.breadth')}</p>
              <p className="text-xs text-zinc-500">{t('strength.stocksCount', { count: totalCount })}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-[11px] text-zinc-500">{t('strength.positive')}</p>
          <p className="mt-1 font-mono text-sm text-emerald-400">{positiveCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
          <p className="text-[11px] text-zinc-500">{t('strength.negative')}</p>
          <p className="mt-1 font-mono text-sm text-rose-400">{negativeCount}</p>
        </div>
      </div>
    </Card>
  );
}
