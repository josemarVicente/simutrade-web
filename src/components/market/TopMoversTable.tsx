'use client';

import { useMemo } from 'react';
import { Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import DataTable, { type DataTableColumn } from '@/components/ui/DataTable';
import Sparkline from '@/components/charts/Sparkline';
import { useTopMovers } from '@/hooks/useMarket';
import { formatCurrency } from '@/lib/utils';
import type { TopMoversResponse } from '@/hooks/useMarket';

function sign(v: number) {
  return v >= 0 ? '+' : '';
}

export default function TopMoversTable({ initialMovers }: { initialMovers?: TopMoversResponse }) {
  const moversQ = useTopMovers();
  const rows = moversQ.data?.items ?? initialMovers?.items ?? [];

  const columns = useMemo<DataTableColumn<(typeof rows)[number]>[]>(
    () => [
      {
        key: 'symbol',
        header: 'Instrument',
        align: 'left',
        cell: (r) => (
          <div className="min-w-0">
            <p className="font-mono font-semibold text-zinc-100">{r.symbol}</p>
            <p className="truncate text-xs text-zinc-500">{r.company_name}</p>
          </div>
        ),
      },
      {
        key: 'price',
        header: 'LTP',
        align: 'right',
        cell: (r) => <span className="font-mono tabular-nums text-zinc-200">{formatCurrency(r.price)}</span>,
      },
      {
        key: 'change_percent',
        header: '%',
        align: 'right',
        cell: (r) => {
          const positive = r.change_percent >= 0;
          return (
            <span className={`font-mono tabular-nums ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {sign(r.change_percent)}
              {r.change_percent.toFixed(2)}%
            </span>
          );
        },
      },
      {
        key: 'value',
        header: 'Value',
        align: 'right',
        cell: (r) => <span className="font-mono tabular-nums text-zinc-200">{formatCurrency(r.value)}</span>,
      },
      {
        key: 'volume',
        header: 'Volume',
        align: 'right',
        cell: (r) => <span className="font-mono tabular-nums text-zinc-200">{r.volume.toFixed(0)}</span>,
      },
      {
        key: 'spark',
        header: '',
        align: 'right',
        className: 'w-[120px]',
        cell: (r) => (
          <div className="min-w-[110px]">
            <Sparkline values={r.sparkline?.length ? r.sparkline : [0]} height={26} stroke={r.change_percent >= 0 ? '#10b981' : '#f43f5e'} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-300">Top value list</p>
          <p className="mt-1 text-xs text-zinc-500">Ranking por valor/atividade (mock + quotes do ticker).</p>
        </div>
        <Button variant="ghost" disabled loading={false} className="rounded-xl">
          <Filter size={14} className="mr-2" />
          Filters
        </Button>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={rows}
          rowKey={(r) => r.symbol}
          isLoading={moversQ.isLoading && !initialMovers}
          emptyState={<span className="text-zinc-500">Sem dados no momento.</span>}
        />
      </div>
    </Card>
  );
}

