'use client';

import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConceptHelp from '@/components/learn/ConceptHelp';
import { usePortfolio, useTransactionsPage } from '@/hooks/usePortfolio';
import { formatCurrency, formatDate, formatPercent, getPnlColor } from '@/lib/utils';
import { getExecutionPrice, isBuyTransaction } from '@/lib/transactions';
import type { Transaction } from '@/types';

export default function PortfolioPage() {
  const { data: portfolio, isLoading } = usePortfolio();
  const [page, setPage] = useState(1);
  const tx = useTransactionsPage(page, 10);

  const holdings = useMemo(() => portfolio?.holdings ?? [], [portfolio?.holdings]);
  const txItems = useMemo(() => tx.data?.data ?? [], [tx.data]);
  const currentPage = tx.data?.current_page ?? page;
  const lastPage = tx.data?.last_page ?? page;

  if (isLoading) return <div className="text-zinc-500 text-sm">A carregar portfolio…</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Portfolio</h1>
          <p className="mt-1 text-sm text-zinc-500">As suas posições e histórico de transações.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Net value</p>
          <p className="text-lg font-semibold text-zinc-100">{formatCurrency(portfolio?.total_value ?? 0)}</p>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-300">Holdings</p>
          <Badge variant="neutral">{holdings.length} posições</Badge>
        </div>

        {holdings.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Ainda não tem holdings. Use a pesquisa para encontrar uma ação.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="py-3 text-left font-medium">Símbolo</th>
                  <th className="py-3 text-right font-medium">Shares</th>
                  <th className="py-3 text-right font-medium">
                    Avg buy price <ConceptHelp conceptKey="average_buy_price" className="ml-1 align-middle" />
                  </th>
                  <th className="py-3 text-right font-medium">Preço atual</th>
                  <th className="py-3 text-right font-medium">Valor</th>
                  <th className="py-3 text-right font-medium">
                    Unrealized PnL <ConceptHelp conceptKey="unrealized_pnl" className="ml-1 align-middle" />
                  </th>
                  <th className="py-3 text-right font-medium">PnL %</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const pnlPct = h.avg_buy_price > 0 ? ((h.current_price - h.avg_buy_price) / h.avg_buy_price) * 100 : 0;
                  return (
                    <tr key={h.symbol} className="border-b border-zinc-900 last:border-0">
                      <td className="py-3">
                        <span className="font-mono font-semibold text-zinc-100">{h.symbol}</span>
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-200">{h.quantity}</td>
                      <td className="py-3 text-right font-mono text-zinc-200">{formatCurrency(h.avg_buy_price)}</td>
                      <td className="py-3 text-right font-mono text-zinc-200">{formatCurrency(h.current_price)}</td>
                      <td className="py-3 text-right font-mono text-zinc-100">{formatCurrency(h.current_value)}</td>
                      <td className={`py-3 text-right font-mono ${getPnlColor(h.unrealized_pnl)}`}>
                        {h.unrealized_pnl >= 0 ? '+' : ''}
                        {formatCurrency(h.unrealized_pnl)}
                      </td>
                      <td className={`py-3 text-right font-mono ${getPnlColor(pnlPct)}`}>{formatPercent(pnlPct)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-300">Transactions</p>
            <p className="mt-1 text-xs text-zinc-500">Compras e vendas executadas (paginação).</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              disabled={currentPage <= 1 || tx.isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span className="text-xs text-zinc-500 font-mono">
              {currentPage}
              {tx.data?.last_page ? ` / ${tx.data.last_page}` : ''}
            </span>
            <Button
              variant="ghost"
              disabled={txItems.length === 0 || currentPage >= lastPage || tx.isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="py-3 text-left font-medium">Data</th>
                <th className="py-3 text-left font-medium">Símbolo</th>
                <th className="py-3 text-left font-medium">Tipo</th>
                <th className="py-3 text-right font-medium">Qty</th>
                <th className="py-3 text-right font-medium">Preço</th>
                <th className="py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {tx.isLoading ? (
                <tr>
                  <td className="py-6 text-sm text-zinc-500" colSpan={6}>
                    A carregar transações…
                  </td>
                </tr>
              ) : txItems.length === 0 ? (
                <tr>
                  <td className="py-6 text-sm text-zinc-500" colSpan={6}>
                    Sem transações ainda.
                  </td>
                </tr>
              ) : (
                txItems.map((t: Transaction) => (
                  <tr key={t.id} className="border-b border-zinc-900 last:border-0">
                    <td className="py-3 text-zinc-400">{formatDate(t.created_at)}</td>
                    <td className="py-3 font-mono font-semibold text-zinc-100">{t.symbol}</td>
                    <td className="py-3">
                      <Badge variant={isBuyTransaction(t.type) ? 'success' : 'danger'}>
                        {t.type}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-mono text-zinc-200">{t.quantity}</td>
                    <td className="py-3 text-right font-mono text-zinc-200">{formatCurrency(getExecutionPrice(t))}</td>
                    <td className="py-3 text-right font-mono text-zinc-100">{formatCurrency(t.total_value)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
