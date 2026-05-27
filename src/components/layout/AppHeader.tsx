'use client';

import { Bell, Settings, UserCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser, useLogout } from '@/hooks/useAuth';
import StockSearch from '@/components/layout/StockSearch';
import MarketStatusIndicator from '@/components/layout/MarketStatusIndicator';
import { formatCurrency } from '@/lib/utils';

function getTitle(pathname: string) {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/portfolio')) return 'Portfolio';
  if (pathname.startsWith('/analytics')) return 'Analytics';
  if (pathname.startsWith('/stocks/')) return 'Trade desk';
  return 'SimuTrade';
}

export default function AppHeader() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const { data: user } = useUser();
  const logout = useLogout();

  const initials = (user?.name ?? 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <header className="border-b border-zinc-800 bg-[#0b0f14]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="min-w-[170px]">
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        </div>

        <div className="flex-1">
          <StockSearch />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex">
            <MarketStatusIndicator />
          </div>

          <button type="button" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200">
            <Bell size={16} />
          </button>
          <button type="button" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200">
            <Settings size={16} />
          </button>

          <div className="hidden md:flex flex-col items-end leading-tight">
            {user ? (
              <span className="text-xs text-zinc-500">
                Balance <span className="text-emerald-400">{formatCurrency(user.balance)}</span>
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => logout.mutate()}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2"
          >
            <UserCircle2 className="text-zinc-400" size={20} />
            <span className="hidden lg:inline-flex text-xs text-zinc-300">{initials || 'User'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

