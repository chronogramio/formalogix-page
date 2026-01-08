# Quick Start Guide - Formalogix Landing Page

## 🚀 Get Started in 2 Minutes

### 1. Start the Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:4321`

### 2. Make Changes

All content is in these files:

- **Main page**: `src/pages/index.astro`
- **Contact form**: `src/components/ContactForm.tsx`
- **Pricing calculator**: `src/components/PricingCalculator.tsx`

Changes are reflected instantly in the browser!

### 3. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with your static site.

### 4. Preview Production Build

```bash
npm run preview
```

## 📝 Quick Customizations

### Add Your Logo

1. Place logo in `public/logo.svg` or `public/logo.png`
2. In `src/pages/index.astro`, find line ~14:
   ```html
   <a href="/" class="text-2xl font-bold text-green-600">formalogix</a>
   ```
3. Replace with:
   ```html
   <a href="/" class="flex items-center">
     <img src="/logo.svg" alt="Formalogix" class="h-8" />
   </a>
   ```

### Update Contact Email

In `src/pages/index.astro`, find line ~480 and update:
```html
<a href="mailto:info@formalogix.com">info@formalogix.com</a>
```

### Connect Contact Form

The form currently simulates submission. To connect it:

**Using Formspree (Free & Easy):**

1. Sign up at https://formspree.io
2. Create a new form
3. Get your form endpoint (e.g., `https://formspree.io/f/xyzabc123`)
4. In `src/components/ContactForm.tsx`, update line ~26:

```tsx
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

## 🚀 Deploy to Netlify (Easiest)

### Method 1: Deploy from GitHub

1. Push this code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify auto-detects Astro settings
6. Click "Deploy"
7. Done! Your site is live

### Method 2: Drag & Drop

1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder
4. Done!

### Add Custom Domain on Netlify

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter `formalogix.com`
4. Follow DNS instructions to point domain to Netlify

## 🌍 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect via GitHub at https://vercel.com

## 🎨 Change Brand Colors

The site uses green (`green-600`) as the main color. To change:

1. Search and replace `green-600` with your color (e.g., `blue-600`)
2. Search and replace `green-700` with darker shade (e.g., `blue-700`)
3. Search and replace `green-50` with lighter shade (e.g., `blue-50`)

Common Tailwind colors: `blue`, `purple`, `red`, `indigo`, `pink`, `yellow`, `teal`

## 📊 Add Google Analytics

1. Get your GA4 Measurement ID from Google Analytics
2. Open `src/layouts/Layout.astro`
3. Add before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🐛 Common Issues

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Build failing?**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

**TypeScript errors?**
Most can be ignored during development. The build will still work.

## 📚 Learn More

- Full README: See `README_FORMALOGIX.md`
- Astro docs: https://docs.astro.build
- Tailwind docs: https://tailwindcss.com

## 🆘 Need Help?

Common tasks documented in `README_FORMALOGIX.md`
