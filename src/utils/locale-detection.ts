import type { Locale } from '../i18n';
import type { Region } from '../config/pricing';

/**
 * Detect the user's preferred locale from browser settings
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'de';
  }

  const browserLang = navigator.language.toLowerCase();

  // Check for exact matches first
  if (browserLang === 'en' || browserLang.startsWith('en-')) {
    return 'en';
  }

  // Default to German for any other language
  return 'de';
}

/**
 * Detect the user's region based on locale or timezone
 */
export function detectUserRegion(): Region {
  if (typeof window === 'undefined') {
    return 'EU';
  }

  const browserLang = navigator.language.toUpperCase();

  // Check if the user is from Switzerland based on locale
  if (browserLang.includes('CH')) {
    return 'CH';
  }

  // Check timezone (Switzerland uses Europe/Zurich)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone === 'Europe/Zurich') {
      return 'CH';
    }
  } catch (e) {
    // Ignore timezone detection errors
  }

  // Default to EU
  return 'EU';
}

/**
 * Get the initial locale and region for the application
 * Checks localStorage first, then falls back to detection
 */
export function getInitialSettings(): { locale: Locale; region: Region } {
  // Check localStorage first
  const savedLocale = typeof window !== 'undefined'
    ? localStorage.getItem('formalogix-locale') as Locale | null
    : null;

  const savedRegion = typeof window !== 'undefined'
    ? localStorage.getItem('formalogix-region') as Region | null
    : null;

  // Use saved values if available, otherwise detect
  const locale = savedLocale || detectBrowserLocale();
  const region = savedRegion || detectUserRegion();

  return { locale, region };
}
