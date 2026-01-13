# i18n Quick Reference Card

## 🚀 Quick Start

### 1. Add New Translation

**File**: `src/i18n/de.ts` or `src/i18n/en.ts`

```typescript
export default {
  // Add new section
  mySection: {
    title: 'My Title',
    subtitle: 'My subtitle',
    cta: 'Call to Action',
  },
}
```

### 2. Use in Astro Component

```astro
---
import { getLocaleFromPath, getTranslations } from '../i18n';

const locale = getLocaleFromPath(Astro.url.pathname);
const t = getTranslations(locale);
---

<h1>{t.mySection.title}</h1>
<p>{t.mySection.subtitle}</p>
<button>{t.mySection.cta}</button>
```

### 3. Use in React Component

```tsx
import { useLocale } from '../context/LocaleContext';

export default function MyComponent() {
  const { translations: t, pricing, formatPrice } = useLocale();

  return (
    <div>
      <h1>{t.mySection.title}</h1>
      <p>{formatPrice(pricing.analysis)}</p>
    </div>
  );
}
```

### 4. Wrap React Component in Astro

```astro
---
import LocaleProviderWrapper from '../components/LocaleProviderWrapper.astro';
import MyReactComponent from '../components/MyReactComponent';
---

<LocaleProviderWrapper>
  <MyReactComponent client:load />
</LocaleProviderWrapper>
```

## 📁 File Quick Reference

| Task | File |
|------|------|
| Add translations | `src/i18n/de.ts`, `src/i18n/en.ts` |
| Change prices | `src/config/pricing.ts` |
| Update navigation | `src/components/Navigation.astro` |
| Locale detection | `src/utils/locale-detection.ts` |
| Currency switcher | `src/components/LocaleSwitcher.tsx` |

## 💰 Pricing

### Get Regional Pricing

```astro
---
import { getPricingByRegion, getRegionFromLocale } from '../config/pricing';

const region = getRegionFromLocale(locale);
const pricing = getPricingByRegion(region);
---

<p>Analysis: {pricing.analysis}</p>  <!-- 0.10 for EU, 0.12 for CH -->
```

### Format Currency

```astro
---
import { formatCurrency } from '../config/pricing';

const formatted = formatCurrency(0.10, 'EUR', 'de-DE');
// Result: "0,10 €"
---
```

### In React Components

```tsx
const { pricing, formatPrice } = useLocale();

// pricing.analysis = 0.10 (EU) or 0.12 (CH)
// pricing.currency = 'EUR' or 'CHF'
// formatPrice(0.10) = "0,10 €" or "CHF 0.10"
```

## 🌐 URL Structure

| Locale | URL | Example |
|--------|-----|---------|
| German (default) | `/` | `formalogix.com/` |
| English | `/en/` | `formalogix.com/en/` |
| German pricing | `/pricing` | `formalogix.com/pricing` |
| English pricing | `/en/pricing` | `formalogix.com/en/pricing` |

## 🔗 Creating Locale-Aware Links

```astro
---
function getLink(path: string, locale: Locale) {
  return locale === 'en' ? `/en${path}` : path;
}
---

<a href={getLink('/pricing', locale)}>Pricing</a>
```

## 🧪 Testing Commands

```bash
# Start dev server
npm run dev

# Test URLs
open http://localhost:4321        # German
open http://localhost:4321/en     # English

# Clear localStorage (reset preferences)
# In browser console:
localStorage.clear()

# Check current settings
# In browser console:
localStorage.getItem('formalogix-locale')
localStorage.getItem('formalogix-region')
```

## 🎨 Component Pattern

### Astro Component Template

```astro
---
import { getLocaleFromPath, getTranslations } from '../../i18n';
import { getPricingByRegion, getRegionFromLocale, formatCurrency } from '../../config/pricing';

const locale = getLocaleFromPath(Astro.url.pathname);
const region = getRegionFromLocale(locale);
const t = getTranslations(locale);
const pricing = getPricingByRegion(region);

const formatPrice = (amount: number) =>
  formatCurrency(amount, pricing.currency, t.locale);

function getLink(path: string) {
  return locale === 'en' ? `/en${path}` : path;
}
---

<section>
  <h2>{t.mySection.title}</h2>
  <p>{t.mySection.description}</p>
  <span>{formatPrice(pricing.analysis)}</span>
  <a href={getLink('/contact')}>{t.common.contactUs}</a>
</section>
```

### React Component Template

```tsx
import { useLocale } from '../context/LocaleContext';

export default function MyComponent() {
  const {
    translations: t,
    pricing,
    formatPrice,
    currency,
    setCurrency
  } = useLocale();

  return (
    <div>
      <h2>{t.mySection.title}</h2>
      <p>{formatPrice(pricing.analysis)}</p>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="EUR">EUR</option>
        <option value="CHF">CHF</option>
      </select>
    </div>
  );
}
```

## 🔍 Common Patterns

### Conditional Content by Locale

```astro
{locale === 'de' ? (
  <p>Deutsche Version</p>
) : (
  <p>English Version</p>
)}
```

### Currency-Specific Content

```tsx
{currency === 'CHF' && (
  <p>Special Swiss offer!</p>
)}
```

### Region-Specific Pricing Message

```astro
{region === 'CH' ? (
  <p>Preise in Schweizer Franken</p>
) : (
  <p>Preise in Euro</p>
)}
```

## ⚡ Common Tasks

### Add a New Section Translation

1. Open `src/i18n/de.ts`
2. Add your new section:
   ```typescript
   newSection: {
     title: 'Titel',
     content: 'Inhalt',
   },
   ```
3. Open `src/i18n/en.ts`
4. Add English version:
   ```typescript
   newSection: {
     title: 'Title',
     content: 'Content',
   },
   ```
5. Use in component: `{t.newSection.title}`

### Change Swiss Prices

1. Open `src/config/pricing.ts`
2. Update the `CH` object:
   ```typescript
   CH: {
     currency: 'CHF',
     analysis: 0.15,      // Your new price
     verification: 0.80,   // Your new price
     scanning: 0.40,       // Your new price
   },
   ```

### Create English Page

1. Create directory: `src/pages/en/`
2. Copy German page to English directory
3. Update page title (Layout component handles locale automatically)

### Add New Language

1. Update `astro.config.mjs`:
   ```javascript
   locales: ['de', 'en', 'fr'],
   ```
2. Create `src/i18n/fr.ts`
3. Update types in `src/i18n/index.ts`
4. Create `src/pages/fr/` directory
5. Add to LocaleSwitcher component

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Switcher not visible | Add LocaleProviderWrapper around component |
| Translations not working | Check translation key exists in both de.ts and en.ts |
| Prices not updating | Wrap React component with LocaleProviderWrapper |
| 404 on /en/ | Create src/pages/en/index.astro |
| Wrong currency | Clear localStorage and test auto-detection |

## 📚 Full Documentation

See `I18N_IMPLEMENTATION_GUIDE.md` for complete details.

## 🎯 Next Steps

1. ✅ Update Swiss pricing in `src/config/pricing.ts`
2. ✅ Create English pages in `src/pages/en/`
3. ✅ Update all components with translations
4. ✅ Test language switching
5. ✅ Test currency switching
6. ✅ Deploy and monitor
