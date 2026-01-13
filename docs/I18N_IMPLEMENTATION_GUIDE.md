# Internationalization (i18n) Implementation Guide

## Overview

Your site now supports **German** and **English** languages with **EUR** and **CHF** currency options, optimized for the DACH region (Germany, Austria, Switzerland) with potential for European expansion.

## Features Implemented

### ✅ Core Infrastructure

1. **Multi-language Support (DE/EN)**
   - Astro i18n routing configured
   - Translation files for German and English
   - URL-based locale detection (`/` for German, `/en/` for English)

2. **Multi-currency Support (EUR/CHF)**
   - Regional pricing configuration (EU vs CH)
   - Different prices for Swiss market
   - Currency formatting per locale

3. **Auto-detection with Manual Override**
   - Browser language detection
   - Region/currency auto-detection (timezone-based)
   - LocalStorage persistence for user preferences
   - Manual switcher in navigation

## File Structure

```
src/
├── config/
│   └── pricing.ts                    # Regional pricing configuration (EU/CH)
├── i18n/
│   ├── index.ts                      # i18n utilities and helpers
│   ├── de.ts                         # German translations
│   └── en.ts                         # English translations
├── context/
│   └── LocaleContext.tsx             # React context for locale/currency
├── utils/
│   └── locale-detection.ts           # Auto-detection logic
├── components/
│   ├── LocaleSwitcher.tsx            # Language & currency switcher
│   ├── LocaleProviderWrapper.astro   # Wrapper for React components
│   ├── Navigation.astro              # Updated nav with switcher
│   ├── PricingCalculator.tsx         # Updated with i18n support
│   └── sections/
│       └── PricingSimplifiedI18n.astro # Example i18n component
└── layouts/
    └── Layout.astro                  # Updated with locale detection
```

## Configuration Files

### Pricing Configuration (`src/config/pricing.ts`)

```typescript
export const PRICING_CONFIG: Record<Region, RegionalPricing> = {
  EU: {
    currency: 'EUR',
    analysis: 0.10,
    verification: 0.60,
    scanning: 0.30,
  },
  CH: {
    currency: 'CHF',
    analysis: 0.12,      // 👈 Update these for Swiss market
    verification: 0.70,
    scanning: 0.35,
  },
};
```

**To customize Swiss pricing:**
- Edit `src/config/pricing.ts`
- Update the CHF prices to reflect your Swiss market pricing

### Translation Files

- **German**: `src/i18n/de.ts`
- **English**: `src/i18n/en.ts`

Both files have the same structure. Add new translations as needed:

```typescript
export default {
  lang: 'de',
  locale: 'de-DE',

  nav: {
    solutions: 'Lösungen',
    pricing: 'Preise',
    // Add more nav items...
  },

  pricing: {
    title: 'Preise',
    // Add more pricing text...
  },

  // Add more sections...
}
```

## Usage Guide

### 1. Using in Astro Components

```astro
---
import { getLocaleFromPath, getTranslations } from '../i18n';
import { getPricingByRegion, getRegionFromLocale, formatCurrency } from '../config/pricing';

// Detect current locale from URL
const locale = getLocaleFromPath(Astro.url.pathname);
const region = getRegionFromLocale(locale);

// Get translations and pricing
const t = getTranslations(locale);
const pricing = getPricingByRegion(region);

// Format prices
const formattedPrice = formatCurrency(pricing.analysis, pricing.currency, t.locale);
---

<h1>{t.pricing.title}</h1>
<p>{t.pricing.subtitle}</p>
<span>{formattedPrice} / {t.pricing.services.analysis.unit}</span>
```

### 2. Using in React Components

Wrap your React component with `LocaleProviderWrapper`:

```astro
---
import LocaleProviderWrapper from '../components/LocaleProviderWrapper.astro';
import MyReactComponent from '../components/MyReactComponent';
---

<LocaleProviderWrapper>
  <MyReactComponent client:load />
</LocaleProviderWrapper>
```

Inside the React component:

```tsx
import { useLocale } from '../context/LocaleContext';

export default function MyComponent() {
  const { pricing, formatPrice, translations: t, currency, setCurrency } = useLocale();

  return (
    <div>
      <h2>{t.calculator.title}</h2>
      <p>{formatPrice(pricing.analysis)}</p>
      <p>Current currency: {currency}</p>
    </div>
  );
}
```

### 3. Creating Locale-Aware Links

```typescript
// Helper function for links
function getLink(path: string, locale: Locale) {
  if (locale === 'en') {
    return `/en${path}`;
  }
  return path;
}

// Usage
<a href={getLink('/pricing', locale)}>Pricing</a>
```

## Page Structure for i18n

### URL Structure

- **German (default)**: `https://formalogix.com/`
- **English**: `https://formalogix.com/en/`

All pages need to be duplicated for each language:

```
src/pages/
├── index.astro                    # German homepage
├── en/
│   └── index.astro                # English homepage
├── pricing.astro                  # German pricing
├── en/
│   └── pricing.astro              # English pricing
└── use-cases/
    ├── versicherungen.astro       # German use case
    └── en/
        └── insurance.astro        # English use case (note: can rename slug)
```

### Example: Creating English Pages

1. **Create `/src/pages/en/` directory**
2. **Duplicate your existing pages into `/en/`**
3. **The Layout.astro will automatically detect the locale from the URL**

Example `src/pages/en/index.astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import Navigation from '../../components/Navigation.astro';
import Hero from '../../components/sections/Hero.astro';  // Will need i18n updates
// ... other imports
---

<Layout title="Digitize Handwritten Forms | 99.8% Accuracy in 24-48h | Formalogix">
  <Navigation />
  <Hero />
  <!-- ... other sections ... -->
</Layout>
```

## Components to Update

### Priority 1: High-Impact Components

1. **Hero Section** (`src/components/sections/Hero.astro`)
   - Main headline and CTA buttons
   - Use the pattern from `PricingSimplifiedI18n.astro`

2. **Navigation** (DONE ✅)
   - Already updated in `src/components/Navigation.astro`
   - Includes locale switcher

3. **PricingCalculator** (DONE ✅)
   - Already updated with regional pricing

4. **Pricing Sections** (Example created ✅)
   - See `PricingSimplifiedI18n.astro` for reference

### Priority 2: Content Sections

Update these sections by:
1. Extracting all text strings
2. Adding them to `de.ts` and `en.ts`
3. Using translations in the component

**Components to update:**
- `src/components/sections/FAQ.astro`
- `src/components/sections/Contact.astro`
- `src/components/sections/Footer.astro`
- `src/components/sections/ServiceTiers.astro`
- `src/components/sections/HowItWorks.astro`
- All other section components

## Testing

### 1. Test Language Switching

1. Visit `http://localhost:4321/`
2. Click the language switcher (🇩🇪 DE | EUR dropdown)
3. Select "English"
4. Should navigate to `/en/`

### 2. Test Currency Switching

1. Click the currency option in the switcher
2. Select "CHF"
3. Check that prices update on PricingCalculator
4. Verify Swiss prices are displayed (CHF 0.12 instead of EUR 0.10)

### 3. Test Auto-Detection

1. Clear localStorage: `localStorage.clear()`
2. Change browser language to English
3. Reload page - should detect English
4. If in Switzerland timezone, should detect CHF currency

### 4. Test Persistence

1. Select English and CHF
2. Navigate to different pages
3. Reload page
4. Preferences should persist (saved in localStorage)

## Next Steps

### Immediate Tasks

1. **Update Swiss Pricing** in `src/config/pricing.ts`
   - Replace placeholder CHF prices with actual values

2. **Create English Pages**
   - Create `src/pages/en/` directory
   - Duplicate all pages from `src/pages/`
   - Test each page

3. **Expand Translation Files**
   - Add translations for all sections
   - Update `de.ts` and `en.ts` with complete translations

4. **Update All Components**
   - Follow the pattern from `PricingSimplifiedI18n.astro`
   - Update each section component to use translations

### Future Enhancements

1. **Add More Languages**
   - French (`fr`) for Swiss Romandy
   - Italian (`it`) for Ticino
   - Add to `astro.config.mjs` locales array
   - Create translation files

2. **IP-Based Detection**
   - Implement server-side IP geolocation
   - More accurate region detection than timezone

3. **Dynamic Currency Conversion**
   - Integrate exchange rate API
   - Real-time currency conversion (if needed)

## Troubleshooting

### Issue: Language switcher not appearing

**Solution:** Make sure the Navigation component includes the LocaleProviderWrapper:

```astro
<LocaleProviderWrapper>
  <LocaleSwitcher client:load />
</LocaleProviderWrapper>
```

### Issue: Prices not updating when changing currency

**Solution:** Ensure the component is wrapped with LocaleProviderWrapper and using `useLocale()` hook.

### Issue: 404 on English pages

**Solution:** Create the corresponding page in `src/pages/en/` directory.

### Issue: Translations not showing

**Solution:**
1. Check that the translation key exists in both `de.ts` and `en.ts`
2. Verify you're calling `getTranslations(locale)` correctly
3. Check browser console for errors

## Support

For questions or issues with the i18n implementation:
1. Check this guide
2. Review the example components (PricingSimplifiedI18n.astro, PricingCalculator.tsx)
3. Inspect `src/i18n/index.ts` for utility functions

## Summary

You now have a complete i18n infrastructure that:
- ✅ Supports German and English
- ✅ Handles EUR and CHF currencies with regional pricing
- ✅ Auto-detects user preferences
- ✅ Provides manual language/currency switcher
- ✅ Persists user preferences
- ✅ Is SEO-friendly with proper URL structure
- ✅ Ready for expansion to more languages/regions

**Next**: Start by updating Swiss pricing, then create English pages, then update components one by one.
