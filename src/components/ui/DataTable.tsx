'use client';

import { ReactNode } from 'react';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  className?: string;
  cell: (row: T) => ReactNode;
};

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  emptyState = 'Sem dados.',
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyState?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950 text-xs text-zinc-500">
            {columns.map((c) => (
              <th
                key={c.key}
                className={[
                  'py-3 font-medium',
                  c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left',
                  c.className ?? '',
                ].join(' ')}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-zinc-500">
                A carregar…
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-zinc-500">
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)} className="border-b border-zinc-900 last:border-0">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[
                      'py-3',
                      c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left',
                      c.align === 'right' ? 'font-mono tabular-nums text-zinc-200' : 'text-zinc-300',
                    ].join(' ')}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

