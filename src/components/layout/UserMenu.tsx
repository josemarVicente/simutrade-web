'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react';
import { useUser, useLogout } from '@/hooks/useAuth';
import { useTranslation } from '@/providers/I18nProvider';
import { formatCurrency } from '@/lib/utils';

export default function UserMenu() {
  const { data: user } = useUser();
  const logout = useLogout();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const initials = (user?.name ?? t('common.user'))
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', onPointerDown);
    }
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 transition-colors hover:border-zinc-700"
      >
        <UserCircle2 className="text-zinc-400" size={20} />
        <span className="hidden lg:inline-flex text-xs text-zinc-300">{initials || t('common.user')}</span>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-800 bg-[#121212] shadow-xl"
        >
          <div className="border-b border-zinc-800 px-4 py-3">
            <p className="truncate text-sm font-medium text-zinc-100">
              {user?.name ?? t('userMenu.defaultName')}
            </p>
            <p className="truncate text-xs text-zinc-500">{user?.email ?? t('common.dash')}</p>
          </div>

          <div className="px-4 py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{t('userMenu.virtualBalance')}</span>
              <span className="font-mono text-emerald-400">
                {user ? formatCurrency(user.balance) : t('common.dash')}
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-800 p-2">
            <button
              type="button"
              role="menuitem"
              disabled={logout.isPending}
              onClick={() => {
                setOpen(false);
                logout.mutate();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
            >
              <LogOut size={16} />
              {logout.isPending ? t('userMenu.loggingOut') : t('userMenu.logout')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
