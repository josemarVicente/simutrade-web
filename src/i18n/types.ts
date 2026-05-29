export type Locale = 'en' | 'pt';

export const LOCALES: Locale[] = ['en', 'pt'];

export const LOCALE_STORAGE_KEY = 'simutrade-locale';

export type TranslationParams = Record<string, string | number>;
