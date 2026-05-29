'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from '@/i18n/messages';
import type { Locale, TranslationParams } from '@/i18n/types';
import { LOCALE_STORAGE_KEY, LOCALES } from '@/i18n/types';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'en' || stored === 'pt') return stored;

  const browser = window.navigator.language.toLowerCase();
  return browser.startsWith('pt') ? 'pt' : 'en';
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (!LOCALES.includes(next)) return;
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    if (ready) {
      document.documentElement.lang = locale;
    }
  }, [locale, ready]);

  const t = useCallback(
    (key: string, params?: TranslationParams) => translate(locale, key, params),
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}

export function useTranslation() {
  const { t, locale, setLocale } = useI18n();
  return { t, locale, setLocale };
}
