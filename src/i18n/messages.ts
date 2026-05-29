import en from '@/i18n/locales/en.json';
import pt from '@/i18n/locales/pt.json';
import type { Locale, TranslationParams } from '@/i18n/types';

const catalogs: Record<Locale, Record<string, unknown>> = {
  en,
  pt,
};

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  return typeof value === 'string' ? value : undefined;
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams
): string {
  const message = getNested(catalogs[locale], key) ?? getNested(catalogs.en, key) ?? key;

  if (!params) return message;

  return Object.entries(params).reduce(
    (text, [param, value]) => text.replaceAll(`{${param}}`, String(value)),
    message
  );
}
