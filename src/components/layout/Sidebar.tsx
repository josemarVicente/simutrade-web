'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, LayoutDashboard, PieChart, Wallet } from 'lucide-react';
import { useTranslation } from '@/providers/I18nProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/portfolio', label: t('nav.portfolio'), icon: Wallet },
    { href: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-zinc-800 lg:bg-zinc-950 fixed top-0 left-0 h-screen z-30">
      <div className="px-6 py-5">
        <div className="flex items-center gap-2">
          <PieChart className="text-emerald-400" size={18} />
          <span className="text-zinc-100 font-semibold tracking-tight">{t('common.appName')}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">{t('common.tagline')}</p>
      </div>

      <nav className="flex-1 px-3 pb-6">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {t('common.menu')}
        </p>
        <div className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-zinc-900 text-[#c6f432]' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
