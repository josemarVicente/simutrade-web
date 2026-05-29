'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from '@/providers/I18nProvider';
import type { Locale } from '@/i18n/types';
import { LOCALES } from '@/i18n/types';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
};

export default function LocaleSelector() {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
        aria-haspopup="listbox"
        aria-label={t('locale.label')}
        className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-300 transition-colors hover:border-zinc-700"
      >
        <Languages size={14} className="text-zinc-500" />
        <span className="font-medium">{localeLabels[locale]}</span>
        <ChevronDown size={12} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t('locale.label')}
          className="absolute right-0 z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-zinc-800 bg-[#121212] py-1 shadow-xl"
        >
          {LOCALES.map((code) => {
            const active = code === locale;
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? 'bg-zinc-900 text-[#c6f432]'
                      : 'text-zinc-300 hover:bg-zinc-900/70'
                  }`}
                >
                  <span>{t(`locale.${code}`)}</span>
                  <span className="text-xs text-zinc-500">{localeLabels[code]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
