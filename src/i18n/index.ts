import de from './de';
import en from './en';

export type Locale = 'de' | 'en';
export type Translations = typeof de;

export const translations: Record<Locale, Translations> = {
  de,
  en,
};

export const defaultLocale: Locale = 'de';

// Get translations for a specific locale
export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}

// Helper to get locale from URL path
export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment === 'en') {
    return 'en';
  }

  return 'de';
}

// Get the correct path with locale prefix
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // If default locale (de), don't add prefix
  if (locale === 'de') {
    return `/${cleanPath}`;
  }

  // For other locales, add prefix
  return `/${locale}/${cleanPath}`;
}

// Get all available locales
export function getAvailableLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}
