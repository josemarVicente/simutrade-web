'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useDashboardInsight } from '@/hooks/useDashboard';
import MarketOverviewPanel from '@/components/market/MarketOverviewPanel';
import FeaturedQuoteCard from '@/components/market/FeaturedQuoteCard';
import StrengthGaugeCard from '@/components/market/StrengthGaugeCard';
import TopMoversTable from '@/components/market/TopMoversTable';
import SectorBreakdown from '@/components/market/SectorBreakdown';

import { useTranslation } from '@/providers/I18nProvider';

export default function DashboardPage() {
  const { data: portfolio, isLoading } = usePortfolio();
  const dash = useDashboardInsight();
  const { t } = useTranslation();

  const featuredSymbol = useMemo(() => {
    const holdings = portfolio?.holdings ?? [];
    const top = holdings.slice().sort((a, b) => b.quantity - a.quantity)[0];
    return dash.data?.featured?.symbol ?? top?.symbol ?? 'SPY';
  }, [portfolio?.holdings, dash.data?.featured?.symbol]);

  return (
    <div className="space-y-4">
      {isLoading || dash.isLoading ? (
        <div className="text-sm text-zinc-500">{t('dashboard.loading')}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-4 lg:col-span-6 xl:col-span-6">
          <MarketOverviewPanel
            initialTickerItems={dash.data?.ticker.items}
            initialOverview={dash.data?.overview}
          />
          <SectorBreakdown initialSectors={dash.data?.sectors} />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-3 xl:col-span-3">
          <FeaturedQuoteCard symbol={featuredSymbol} initialQuote={dash.data?.featured} />
          <StrengthGaugeCard initialStrength={dash.data?.strength} />
        </div>

        <div className="lg:col-span-3 xl:col-span-3 lg:sticky lg:top-28 lg:self-start">
          <TopMoversTable initialMovers={dash.data?.top_movers} />
        </div>
      </div>
    </div>
  );
}
