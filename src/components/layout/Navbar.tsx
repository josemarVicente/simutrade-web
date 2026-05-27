'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

const links = [
  { href: '/dashboard',  label: 'Dashboard'  },
  { href: '/portfolio',  label: 'Portfolio'  },
  { href: '/analytics',  label: 'Analytics'  },
];

export default function Navbar() {
  const pathname     = usePathname();
  const { data: user } = useUser();
  const logout       = useLogout();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <span className="text-emerald-400 font-bold text-lg tracking-tight">SimuTrade</span>
          <div className="ml-2 flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {user && (
            <span className="text-sm text-zinc-400">
              <span className="text-zinc-500">Balance </span>
              <span className="text-emerald-400 font-medium">
                {formatCurrency(user.balance)}
              </span>
            </span>
          )}
          <button
            onClick={() => logout.mutate()}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
