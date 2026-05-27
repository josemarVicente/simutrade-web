'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useDashboardInsight } from '@/hooks/useDashboard';
import MarketOverviewPanel from '@/components/market/MarketOverviewPanel';
import FeaturedQuoteCard from '@/components/market/FeaturedQuoteCard';
import StrengthGaugeCard from '@/components/market/StrengthGaugeCard';
import TopMoversTable from '@/components/market/TopMoversTable';
import SectorBreakdown from '@/components/market/SectorBreakdown';

export default function DashboardPage() {
  const { data: portfolio, isLoading } = usePortfolio();
  const dash = useDashboardInsight();

  const featuredSymbol = useMemo(() => {
    const holdings = portfolio?.holdings ?? [];
    const top = holdings.slice().sort((a, b) => b.quantity - a.quantity)[0];
    return dash.data?.featured?.symbol ?? top?.symbol ?? 'SPY';
  }, [portfolio?.holdings, dash.data?.featured?.symbol]);

  return (
    <div className="space-y-4">
      {isLoading || dash.isLoading ? (
        <div className="text-sm text-zinc-500">A carregar dashboard…</div>
      ) : null}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <MarketOverviewPanel
            initialTickerItems={dash.data?.ticker.items}
            initialOverview={dash.data?.overview}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <FeaturedQuoteCard symbol={featuredSymbol} initialQuote={dash.data?.featured} />
          <StrengthGaugeCard initialStrength={dash.data?.strength} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <TopMoversTable initialMovers={dash.data?.top_movers} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <SectorBreakdown initialSectors={dash.data?.sectors} />
        </div>
      </div>
    </div>
  );
}
