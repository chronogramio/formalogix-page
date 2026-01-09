# Formalogix Landing Page

A modern, responsive landing page for Formalogix - converting handwritten forms into structured data (Excel, JSON, MySQL).

## 🚀 Features

- **Modern Tech Stack**: Built with Astro + Tailwind CSS + React
- **Static Site Generation**: Lightning-fast performance with pre-rendered HTML
- **Fully Responsive**: Works perfectly on all devices
- **Interactive Components**:
  - Contact form with file upload
  - Pricing calculator
  - Mobile menu
- **SEO Optimized**: Built with best practices for search engines
- **Easy to Deploy**: Can be deployed to Netlify, Vercel, Cloudflare Pages, etc.

## 📋 Sections Included

1. **Hero Section**: Value proposition with call-to-action
2. **Target Customers**: Who needs Formalogix
3. **Services**: Self-Service, Full-Service, and Enterprise solutions
4. **Use Cases**: Real-world examples (Insurance, Schools, Medical, Wholesale)
5. **Pricing**: Transparent pricing with interactive calculator
6. **Contact Form**: Lead generation with file upload
7. **Footer**: Links and information

## 🛠️ Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Available Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build static site to ./dist/
npm run preview      # Preview built site locally
npm run astro        # Run Astro CLI commands
```

## 🎨 Customization

### Colors

The site uses a green color scheme matching your app. To change colors:

1. Edit Tailwind classes in components
2. Main brand color: `green-600` (used throughout)
3. You can customize in `tailwind.config.mjs` if needed

### Content

**To update content:**

- **Main page**: Edit `/src/pages/index.astro`
- **Contact form**: Edit `/src/components/ContactForm.tsx`
- **Pricing calculator**: Edit `/src/components/PricingCalculator.tsx`

**To add the logo:**

1. Place your logo in `/public/logo.png` or `/public/logo.svg`
2. Update the navigation in `index.astro` to use `<img>` instead of text

### Form Submission

The contact form currently simulates submission. To connect to a backend:

**Option 1: Use a form service (easiest)**
- [Formspree](https://formspree.io/)
- [Web3Forms](https://web3forms.com/)
- [Netlify Forms](https://www.netlify.com/products/forms/)

**Option 2: Build your own API**
Update the `handleSubmit` function in `/src/components/ContactForm.tsx`:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('company', formData.company);
    formDataToSend.append('email', formData.email);
    // ... add other fields
    if (file) formDataToSend.append('file', file);

    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      setSubmitStatus('success');
    } else {
      setSubmitStatus('error');
    }
  } catch (error) {
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};
```

## 🚀 Deployment

### Option 1: Netlify (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 2: Vercel

```bash
npm install -g vercel
vercel --prod
```

### Option 3: Cloudflare Pages

1. Push code to GitHub
2. Connect to Cloudflare Pages
3. Build command: `npm run build`
4. Build output: `dist`

### Option 4: Any Static Host

Build the site and upload the `dist` folder:

```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

## 🔧 Environment Setup

If you need environment variables (for API keys, etc.):

Create `.env` file:

```env
PUBLIC_API_URL=https://your-api.com
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your-id
```

Access in Astro components:
```js
const apiUrl = import.meta.env.PUBLIC_API_URL;
```

Access in React components:
```tsx
const apiUrl = import.meta.env.PUBLIC_API_URL;
```

## 📱 Mobile Responsiveness

The site is fully responsive and tested on:
- Mobile (320px - 768px)
- Tablet (768px - 1024px)
- Desktop (1024px+)

## 🎯 SEO Optimization

To improve SEO:

1. **Add meta description**: Edit `/src/layouts/Layout.astro`
2. **Add sitemap**:
   ```bash
   npx astro add sitemap
   ```
3. **Add robots.txt**: Create `/public/robots.txt`
4. **Google Analytics**: Add to layout

## 📊 Analytics

To add Google Analytics:

1. Get your GA4 measurement ID
2. Add to `/src/layouts/Layout.astro` in the `<head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔒 Security Notes

- The form currently accepts file uploads (PDF, JPG, PNG)
- Implement server-side validation for production
- Consider file size limits
- Scan uploaded files for malware
- Use HTTPS in production

## 📝 TODO for Production

- [ ] Replace logo text with actual logo image
- [ ] Set up form submission backend/service
- [ ] Add privacy policy and terms of service
- [ ] Set up Google Analytics
- [ ] Add sitemap
- [ ] Configure custom domain
- [ ] Test all forms and links
- [ ] Add cookie consent banner (if needed)
- [ ] Optimize images (consider WebP format)
- [ ] Set up email notifications for form submissions

## 🆘 Support

For Astro documentation: https://docs.astro.build
For Tailwind CSS: https://tailwindcss.com/docs

## 📄 License

Proprietary - Formalogix 2026
