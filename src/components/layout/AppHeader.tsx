'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useAuth';
import { useTranslation } from '@/providers/I18nProvider';
import StockSearch from '@/components/layout/StockSearch';
import MarketStatusIndicator from '@/components/layout/MarketStatusIndicator';
import UserMenu from '@/components/layout/UserMenu';
import LocaleSelector from '@/components/layout/LocaleSelector';
import { formatCurrency } from '@/lib/utils';

function usePageTitle() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (pathname.startsWith('/dashboard')) return t('nav.dashboard');
  if (pathname.startsWith('/portfolio')) return t('nav.portfolio');
  if (pathname.startsWith('/analytics')) return t('nav.analytics');
  if (pathname.startsWith('/stocks/')) return t('nav.tradeDesk');
  return t('common.appName');
}

export default function AppHeader() {
  const title = usePageTitle();
  const { data: user } = useUser();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#0b0f14]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="min-w-[120px]">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        </div>

        <div className="flex-1 max-w-xl">
          <StockSearch />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex">
            <MarketStatusIndicator />
          </div>

          <div className="hidden md:flex flex-col items-end leading-tight">
            {user ? (
              <span className="text-xs text-zinc-500">
                {t('header.balance')}{' '}
                <span className="text-emerald-400">{formatCurrency(user.balance)}</span>
              </span>
            ) : null}
          </div>

          <LocaleSelector />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
