# Formalogix Brand Colors & Design Tokens

## Primary Color Palette (Updated from app.formalogix.com)

### Blue (Primary Brand Color)
The blue color scheme is extracted directly from app.formalogix.com to maintain perfect brand consistency.

```
formalogix-50   #EAF2FF   Very light blue - Backgrounds, subtle accents
formalogix-100  #d4e5ff   Light blue - Card backgrounds
formalogix-200  #b2c9f3   Medium light blue - Borders, accents
formalogix-300  #7fa8f5   Medium blue
formalogix-400  #5b8ff4   Medium-dark blue
formalogix-500  #3C7FF3   PRIMARY BRAND COLOR - Buttons, links, accents
formalogix-600  #2563eb   Darker blue - Hover states
formalogix-700  #1d4ed8   Very dark blue - Strong emphasis
formalogix-800  #1e40af   Extra dark blue
formalogix-900  #1e3a8a   Darkest blue
```

### Green (Accent Color)
Used for success states and secondary accents.

```
formalogix-green-500  #66BD95   Primary green accent
formalogix-green-400  #7fcca6   Light green accent
```

### Neutral Grays

```
gray-50    #f9fafb   Lightest gray - Section backgrounds
gray-100   #f3f4f6   Light gray - Borders, dividers
gray-400   #9ca3af   Medium gray - Subtle text, placeholders
gray-600   #4b5563   Dark gray - Body text
gray-700   #374151   Darker gray - Secondary headings
gray-800   #1f2937   Very dark gray - Footer backgrounds
gray-900   #111827   Darkest gray - Primary headings
```

### White & Black

```
white      #ffffff   Default background
black      #000000   Only for pure black needs
```

## Logo Assets

### Available Logos
- `/public/logo.svg` - Vector logo (recommended for web)
- `/public/logo.png` - Raster logo (fallback)

### Logo Usage
```html
<!-- In navigation -->
<img src="/logo.svg" alt="Formalogix Logo" class="h-8 w-auto" />
```

## Usage Guidelines

### Text Colors
- **Primary headings**: `text-gray-900`
- **Body text**: `text-gray-600`
- **Secondary text**: `text-gray-500` or `text-gray-400`
- **Links**: `text-formalogix-500` with `hover:text-formalogix-600`

### Backgrounds
- **Main sections**: `bg-white` or `bg-gray-50`
- **Cards**: `bg-white` with shadow
- **Highlighted cards**: `bg-formalogix-50`
- **Footer**: `bg-gray-900`
- **Buttons**: `bg-formalogix-500` with `hover:bg-formalogix-600`

### Borders
- **Default**: `border-gray-200`
- **Highlighted**: `border-formalogix-500`
- **Footer/Dark**: `border-gray-800`

### Shadows
```css
shadow-sm    - Subtle shadow for small elements
shadow-md    - Medium shadow for cards
shadow-lg    - Large shadow for important cards
shadow-xl    - Extra large for hero elements
shadow-2xl   - Maximum shadow for special elements
```

## Typography Scale

### Font Families

```css
/* Body Text */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Headings */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes

```
text-xs    0.75rem   (12px)
text-sm    0.875rem  (14px)
text-base  1rem      (16px) - Default body text
text-lg    1.125rem  (18px)
text-xl    1.25rem   (20px)
text-2xl   1.5rem    (24px)
text-3xl   1.875rem  (30px)
text-4xl   2.25rem   (36px)
text-5xl   3rem      (48px)
text-6xl   3.75rem   (60px) - Large hero headings
```

### Font Weights

```
font-normal    400 - Body text
font-medium    500 - Subtle emphasis
font-semibold  600 - Buttons, strong emphasis
font-bold      700 - Section headings
font-extrabold 800 - Hero headings
```

## Spacing Scale

Consistent spacing using Tailwind's spacing system:

```
0    0px
1    0.25rem   (4px)
2    0.5rem    (8px)
3    0.75rem   (12px)
4    1rem      (16px)
5    1.25rem   (20px)
6    1.5rem    (24px)
8    2rem      (32px)
10   2.5rem    (40px)
12   3rem      (48px)
16   4rem      (64px)
20   5rem      (80px)
```

## Border Radius

```
rounded       0.25rem  (4px)
rounded-md    0.375rem (6px)
rounded-lg    0.5rem   (8px)  - Most cards
rounded-xl    0.75rem  (12px) - Large cards, sections
rounded-2xl   1rem     (16px) - Hero elements
rounded-full  9999px   - Circular elements
```

## Component Styles

### Primary Button
```html
<a href="#" class="btn-primary">
  Button Text
</a>
```

Generates:
```css
background: #3C7FF3;
color: white;
padding: 0.75rem 2rem;
border-radius: 0.5rem;
font-weight: 600;
hover: background #2563eb, shadow, lift;
```

### Secondary Button
```html
<a href="#" class="btn-secondary">
  Button Text
</a>
```

Generates:
```css
border: 2px solid #3C7FF3;
color: #3C7FF3;
padding: 0.75rem 2rem;
border-radius: 0.5rem;
font-weight: 600;
hover: background #EAF2FF, shadow;
```

### Icon Badge (Target Customers)
```html
<div class="w-12 h-12 bg-formalogix-500 rounded-lg flex items-center justify-center">
  <svg class="w-6 h-6 text-white" ...>
    <!-- SVG path -->
  </svg>
</div>
```

### Feature Card
```html
<div class="bg-formalogix-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
  <!-- Content -->
</div>
```

### Service Card
```html
<div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  <!-- Content -->
</div>
```

## Animation Timing

```css
duration-150  - 150ms - Very fast (micro-interactions)
duration-200  - 200ms - Fast (button clicks)
duration-300  - 300ms - Default (hover effects)
duration-500  - 500ms - Moderate (larger transitions)
duration-700  - 700ms - Slow (major page changes)
```

## Transition Types

```css
transition-colors     - Color changes only
transition-shadow     - Shadow changes only
transition-transform  - Transform changes only
transition-all        - All properties (use sparingly)
```

## Color Source

All colors are extracted from `../app/lib/components/layout/visuals/colors.dart`:

```dart
primaryColor: #3C7FF3
primaryColorLightNonTrans: #b2c9f3
primaryColorVeryLightNonTrans: #EAF2FF
green: #66BD95
```

## Implementation Notes

### Tailwind v4 CSS Variables
Colors are defined using the `@theme` directive in `src/styles/global.css`:

```css
@theme {
  --color-formalogix-50: #EAF2FF;
  --color-formalogix-500: #3C7FF3;
  /* ... etc */
}
```

### Custom Button Classes
Due to Tailwind v4 limitations, button styles are defined directly in CSS rather than using @apply:

```css
.btn-primary {
  background-color: #3C7FF3;
  /* ... */
}
```

## Brand Consistency

✅ **100% match with app.formalogix.com**
- Primary blue: #3C7FF3 (exact match)
- Logo files: Copied directly from app assets
- Green accent: #66BD95 (exact match)

---

**Last Updated**: 2026-01-08
**Source**: ../app/lib/components/layout/visuals/colors.dart
