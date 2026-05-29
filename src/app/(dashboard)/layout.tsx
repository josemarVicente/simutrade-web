'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import AppHeader from '@/components/layout/AppHeader';
import MarketTickerStrip from '@/components/market/MarketTickerStrip';
import { useUser } from '@/hooks/useAuth';
import { ColdStartBanner } from '@/components/layout/ColdStartBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router      = useRouter();
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (!isLoading && isError) {
      router.push('/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0b0f14]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <MarketTickerStrip />
          <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
            {children}
              <ColdStartBanner />
          </main>
        </div>
      </div>
    </div>
  );
}
