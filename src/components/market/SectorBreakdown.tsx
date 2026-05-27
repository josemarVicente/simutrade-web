'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { SectorsResponse } from '@/hooks/useMarket';
import { useMarketSectors } from '@/hooks/useMarket';

export default function SectorBreakdown({ initialSectors }: { initialSectors?: SectorsResponse }) {
  const sectorsQ = useMarketSectors();
  const items = useMemo(
    () => sectorsQ.data?.sectors ?? (initialSectors?.sectors ?? []),
    [sectorsQ.data?.sectors, initialSectors?.sectors]
  );

  const max = useMemo(
    () => (items.length ? Math.max(...items.map((s) => s.weight_percent)) : 1),
    [items]
  );

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-300">Today&apos;s Value</p>
          <p className="mt-1 text-xs text-zinc-500">Breakdown por sector (peso aproximado).</p>
        </div>
        <Button variant="ghost" disabled className="rounded-xl">
          …
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {sectorsQ.isLoading && !initialSectors ? (
          Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3 animate-pulse">
              <div className="h-3 w-24 rounded bg-zinc-800" />
              <div className="mt-3 h-2 w-full rounded bg-zinc-800" />
            </div>
          ))
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500 py-6 text-center">Sem dados no momento.</p>
        ) : (
          items.slice(0, 10).map((s) => {
            const width = max > 0 ? (s.weight_percent / max) * 100 : 0;
            return (
              <div key={s.name} className="rounded-xl border border-zinc-800 bg-[#121212]/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-zinc-100">{s.name}</p>
                  <Badge variant="neutral">{s.weight_percent.toFixed(2)}%</Badge>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#c6f432]"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

