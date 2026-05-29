'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useStockSearchResults } from '@/hooks/useStockSearch';
import { getApiErrorMessage } from '@/lib/apiErrors';
import { useToast } from '@/components/ui/Toast';
import { useTranslation } from '@/providers/I18nProvider';

export default function StockSearch() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value.trim()), 200);
    return () => window.clearTimeout(id);
  }, [value]);

  const results = useStockSearchResults(debounced);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (results.isError) {
      toast.push({
        variant: 'danger',
        title: t('search.unavailableTitle'),
        description: getApiErrorMessage(results.error, t('search.unavailableDesc')),
      });
    }
  }, [results.isError, results.error, toast, t]);

  const items = useMemo(() => results.data ?? [], [results.data]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <Search size={16} />
        </div>
        <Input
          aria-label={t('search.ariaLabel')}
          placeholder={t('search.placeholder')}
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          className="pl-9"
        />
      </div>

      {open && debounced.length >= 1 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl">
          <div className="max-h-[320px] overflow-auto">
            {results.isLoading ? (
              <div className="px-4 py-3 text-sm text-zinc-500">{t('search.searching')}</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-3 text-sm text-zinc-500">
                {t('search.noResults', { query: debounced })}
              </div>
            ) : (
              <ul className="divide-y divide-zinc-900">
                {items.map((s) => (
                  <li key={s.symbol}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push(`/stocks/${encodeURIComponent(s.symbol)}`);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-900"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold text-zinc-100">{s.symbol}</p>
                        <p className="truncate text-sm text-zinc-500">{s.company_name}</p>
                      </div>
                      <Badge variant="neutral">{t('common.view')}</Badge>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
