# Image Optimization Guide

## Required Images

### 1. Open Graph Image (`/public/og-image.png`)
**Required**: Yes
**Dimensions**: 1200x630px
**Format**: PNG or JPG
**Purpose**: Social media sharing (Facebook, Twitter, LinkedIn)

Create this image with:
- Formalogix logo
- Tagline: "Handschriftliche Formulare in strukturierte Daten"
- Professional background with brand colors (green-600: #16a34a)

### 2. Apple Touch Icon (`/public/apple-touch-icon.png`)
**Required**: Optional but recommended
**Dimensions**: 180x180px
**Format**: PNG
**Purpose**: iOS home screen icon

### 3. Logo Files
**Recommended locations**:
- `/public/logo.png` - PNG version for light backgrounds
- `/public/logo.svg` - SVG version (scalable, preferred)
- `/public/logo-dark.png` - Version for dark backgrounds

## Current Images

### `/public/formalogix-process.png`
- Already included
- Used in hero section
- Shows the conversion process from handwritten forms to structured data
- **Recommendation**: Optimize this image
  - Convert to WebP format for better compression
  - Create responsive versions (small, medium, large)
  - Add proper dimensions in HTML to prevent layout shift

## Image Optimization Steps

### 1. Install Image Optimization Tool
```bash
npm install sharp
```

### 2. Convert to WebP
```bash
npx sharp-cli -i public/formalogix-process.png -o public/formalogix-process.webp
```

### 3. Create Responsive Versions
```bash
# Create 400w version
npx sharp-cli -i public/formalogix-process.png --resize 400 -o public/formalogix-process-400w.webp

# Create 800w version
npx sharp-cli -i public/formalogix-process.png --resize 800 -o public/formalogix-process-800w.webp

# Create 1200w version
npx sharp-cli -i public/formalogix-process.png --resize 1200 -o public/formalogix-process-1200w.webp
```

### 4. Use Picture Element
Update the hero section image to:

```html
<picture>
  <source
    srcset="/formalogix-process-400w.webp 400w,
            /formalogix-process-800w.webp 800w,
            /formalogix-process-1200w.webp 1200w"
    sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
    type="image/webp"
  />
  <img
    src="/formalogix-process.png"
    alt="Formalogix Process - Von handschriftlichen Formularen zu strukturierten Daten"
    width="1200"
    height="800"
    loading="eager"
    class="w-full rounded-lg"
  />
</picture>
```

## Lazy Loading Strategy

- **Hero images**: Use `loading="eager"` (already implemented)
- **Below-the-fold images**: Use `loading="lazy"`
- Add explicit `width` and `height` attributes to prevent layout shift

## Alt Text Best Practices

All images already have descriptive alt text. For icons and decorative elements, use empty alt (`alt=""`) to improve accessibility.

## Future Additions

1. **Customer logos** - Create a "Trusted by" section with client logos
2. **Team photos** - Add an "About Us" section with team members
3. **Process diagrams** - Visual explanations of how the service works
4. **Screenshot samples** - Show the app interface and results

All future images should follow these optimization practices:
- Use WebP format with PNG/JPG fallback
- Implement responsive images with srcset
- Add proper alt text
- Include width/height attributes
- Compress images (aim for < 100KB per image)
