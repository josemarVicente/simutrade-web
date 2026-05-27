'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  LayoutDashboard,
  PieChart,
  Wallet,
  Search,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react';

const menuLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard', label: 'Market update', icon: Search, disabled: true },
  { href: '/dashboard', label: 'Interactive chart', icon: Sparkles, disabled: true },
  { href: '/dashboard', label: 'Mutual funds', icon: BarChart3, disabled: true },
];

const accountLinks = [
  { href: '/portfolio', label: 'Portfolio', icon: Wallet },
  { href: '/dashboard', label: 'Settings', icon: Settings, disabled: true },
  { href: '/portfolio', label: 'History', icon: Clock },
];

const moreLinks = [
  { href: '#', label: 'News', icon: BarChart3, disabled: true, badge: 'new' },
  { href: '#', label: 'Feedback', icon: BarChart3, disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-zinc-800 lg:bg-zinc-950 fixed top-0 left-0 h-screen">
      <div className="px-6 py-5 ">
        <div className="flex items-center gap-2">
          <PieChart className="text-emerald-400" size={18} />
          <span className="text-zinc-100 font-semibold tracking-tight">SimuTrade</span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Paper trading • modo educativo</p>
      </div>

      <nav className="flex-1 px-3 pb-6">
        <div className="pb-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Menu</p>
          <div className="space-y-1">
            {menuLinks.map(({ href, label, icon: Icon, disabled }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              if (disabled) {
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 opacity-60"
                    aria-disabled="true"
                  >
                    <Icon size={16} />
                    {label}
                  </div>
                );
              }

              return (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? 'bg-zinc-900 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pb-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Account</p>
          <div className="space-y-1">
            {accountLinks.map(({ href, label, icon: Icon, disabled }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              if (disabled) {
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 opacity-60"
                    aria-disabled="true"
                  >
                    <Icon size={16} />
                    {label}
                  </div>
                );
              }

              return (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? 'bg-zinc-900 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-zinc-800">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">More</p>
          <div className="space-y-1">
            {moreLinks.map(({ href, label, icon: Icon, disabled, badge }) => {
              if (disabled) {
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 opacity-60"
                    aria-disabled="true"
                  >
                    <Icon size={16} />
                    <span className="flex-1 truncate">{label}</span>
                    {badge ? (
                      <span className="text-[10px] rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-300">
                        {badge}
                      </span>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}

