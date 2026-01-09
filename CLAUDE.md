# Formalogix Landing Page - Project Context

## Project Overview

**Formalogix**: B2B SaaS landing page for AI-powered form digitization
- **Service**: Converts handwritten/digital forms to structured data
- **Accuracy**: 99.8% (hybrid AI + human verification)
- **Target**: German-speaking EU businesses (Insurance, Education, Healthcare, Wholesale)
- **Pricing**: €0.10-€0.60 per page

## Architecture

### Stack
- **Astro 5.16.7** - Static site generation
- **React 18.3.1** - Interactive components (form, calculator, menu)
- **TypeScript** - React components
- **Tailwind CSS 4.1.18** - Styling
- **Express.js** - Backend API on VPS (contact form only)

### Deployment
- **Frontend**: Cloudflare Pages (static) → `dist/`
- **Backend**: VPS (Express.js API)
- **Build**: `npm run build` → outputs static files

## ⚠️ CRITICAL: Static Site Requirement

**This site MUST be fully static with no server-side rendering at runtime.**

### Why Static?
- Cloudflare Pages deployment
- No Node.js runtime needed
- Maximum performance + reliability
- CDN-friendly, lower costs

### What Gets Built
```bash
npm run build  # Outputs to dist/
```
- Static HTML (pre-rendered)
- Client-side JS (React hydration)
- Processed CSS (Tailwind)
- Assets (images, fonts)

### Client-Side Features (localStorage + React)

**Currency Switching (EUR ↔ CHF)**
- Saves to localStorage
- Dispatches `currencyChanged` event
- Components listen and update instantly
- **No page reload**

**Language Switching (DE ↔ EN)**
- Saves to localStorage
- Redirects to `/en/` prefix
- Static pages pre-built

**Implementation:**
```typescript
// Dispatch event (SimpleLocaleSwitcher.tsx)
localStorage.setItem('formalogix-region', newRegion);
window.dispatchEvent(new CustomEvent('currencyChanged', {detail: {region}}));

// Listen for updates (pricing components)
useEffect(() => {
  const handler = (e: CustomEvent) => setRegion(e.detail.region);
  window.addEventListener('currencyChanged', handler);
  return () => window.removeEventListener('currencyChanged', handler);
}, []);
```

**Key Files:**
- `src/components/SimpleLocaleSwitcher.tsx` - Dispatches event
- `src/components/DynamicPricingSection.tsx` - Homepage pricing
- `src/components/SimplePricingCalculator.tsx` - Calculator

### Rules
❌ No server-side APIs at runtime (except contact form)
❌ No databases
❌ No server sessions/cookies
✅ Build-time data only
✅ localStorage for preferences
✅ Client-side React for interactivity

## Component Architecture

**Astro Components (.astro)**
- Static content, SEO-critical pages, layouts
- `src/pages/`, `src/components/sections/`, `src/layouts/`

**React Components (.tsx)**
- Interactive: forms, calculators, menus
- `src/components/` (root level)
- Must use `client:load` directive

**Key React Components:**
- `ContactForm.tsx` - File upload, form submission
- `SimplePricingCalculator.tsx` - Interactive pricing
- `DynamicPricingSection.tsx` - Homepage pricing
- `SimpleLocaleSwitcher.tsx` - Language/currency switcher
- `MobileMenu.tsx` - Mobile navigation

## Internationalization

### Languages
- **German (de)** - Default, primary market
- **English (en)** - Secondary, `/en/` prefix
- Files: `src/i18n/de.ts`, `src/i18n/en.ts`

### Regional Pricing
`src/config/pricing.ts`:
- **EU**: EUR (€0.10, €0.60, €0.30)
- **CH**: CHF (CHF 0.12, CHF 0.70, CHF 0.35)

### Content Rules
- Primarily German
- Formal tone ("Sie" not "Du")
- Don't mix languages in same section

## Styling

### Tailwind First
- Mobile-first: `sm:`, `md:`, `lg:`, `xl:`
- Custom colors: `formalogix-blue-{50-900}`
- Custom classes in `src/styles/global.css`: `.btn-primary`, `.scroll-reveal`

## File Organization

- `src/pages/` - Routes (index, pricing, use-cases)
- `src/components/` - React components (root)
- `src/components/sections/` - Astro sections
- `src/layouts/` - Layout wrappers
- `src/config/` - Pricing config
- `src/i18n/` - Translations
- `src/styles/` - Global CSS
- `public/` - Static assets
- `api-server/` - Express backend

## API Integration

**Contact Form Only**
- Endpoint: `PUBLIC_API_URL` (env var)
- Method: POST multipart/form-data
- Files: PDF, PNG, JPG, JPEG
- Backend: `api-server/server.js` (VPS)

## Development

```bash
npm install
npm run dev      # Dev server (port 4321)
npm run build    # Production build
npm run preview  # Preview build

# Backend (separate terminal)
cd api-server && npm run dev
```

### Environment Variables
- Frontend: `.env` with `PUBLIC_API_URL`
- Backend: `api-server/.env` with Gmail credentials

## Common Tasks

**Add New Page:**
1. Create `.astro` in `src/pages/`
2. Use `Layout.astro` wrapper
3. Update navigation if needed

**Add Interactive Component:**
1. Create `.tsx` in `src/components/`
2. Use TypeScript interfaces
3. Import with `client:load`

**Update Pricing:**
1. Edit `src/config/pricing.ts`
2. Update both EU and CH rates

## Key Don'ts

❌ Create new files unnecessarily
❌ Add Redux/Context (not needed)
❌ Mix German/English in UI
❌ Skip `client:load` for React
❌ Hardcode API endpoints
❌ Skip legal pages (Impressum/Datenschutz required in Germany)
❌ Add runtime server dependencies
❌ Use informal German ("Du")

## SEO & Legal

- Structured Data: JSON-LD in `Layout.astro`
- Open Graph tags for sharing
- Sitemap: Auto-generated
- **Legal**: Datenschutz + Impressum required (Germany)

## Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] `npm run preview` works locally
- [ ] No JavaScript errors
- [ ] Currency switching works
- [ ] Language switching works
- [ ] localStorage functional
- [ ] Only contact form makes runtime API calls

## Key Files

- `astro.config.mjs` - Astro config, i18n
- `src/config/pricing.ts` - Regional pricing
- `src/i18n/de.ts`, `src/i18n/en.ts` - Translations
- `src/layouts/Layout.astro` - Master layout + SEO
- `src/components/ContactForm.tsx` - Lead capture
- `api-server/server.js` - Backend API

## Recent Updates (2026-01-09)

- Added i18n: German/English with EUR/CHF
- Currency switcher with real-time updates (no reload)
- Event-driven architecture for price updates
- All components work client-side (static build)

---

**Last Updated**: 2026-01-09
