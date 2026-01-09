# Formalogix Landing Page - Requirements

## Project Overview

Create a modern landing page for Formalogix, a venture focused on converting handwritten texts from documents into structured formats like Excel, JSON, and MySQL.

**Domain:** formalogix.com

## Business Description

Formalogix converts large volumes of handwritten and digital forms automatically into structured data formats:
- Excel spreadsheets
- JSON
- MySQL databases
- Other custom formats

The solution uses AI-based analysis with optional human verification for quality assurance.

## Technical Requirements

### Platform
- **Static site generation** - Must compile to static HTML/CSS/JS
- **Modern framework** - Use current best practices
- **Extensible** - Should be easy to add features in the future (blog, documentation, etc.)
- **Fast performance** - Optimized for speed and SEO

### Design
- **Modern aesthetic** - Clean, professional business design
- **Color scheme** - Match existing app at https://app.formalogix.com/#/login
- **Language** - Primary content in German
- **Responsive** - Mobile-first, works on all devices
- **Process visualization** - Include the provided image showing form → structured data conversion

## Content Requirements

### 1. Target Customer Criteria ("Wer braucht uns?")

Display who needs our services:
- Große Mengen an Formularen können verarbeitet werden
- Wiederkehrende einheitliche Formulare
- Egal ob papierbasiert (physisch), eingescannt oder Foto
- Handschriftlich (oder auch digital ausgefüllt)
- Formularfelder (Boxen, Unterschriften, Felder)
- ggf. Zeitdruck
- Benötigt auswertbare Daten (z. B. Tabelle)
- Sucht einen Fullservice

### 2. Service Offerings

Three service tiers:

#### Self-Service
- Users upload documents themselves
- AI analyzes the forms
- Users verify results themselves
- Lowest cost option
- Full control over process

#### Full-Service (Most Popular)
- We handle everything:
  - Scanning physical documents
  - Uploading to platform
  - AI analysis
  - Human verification
  - Data delivery in requested format
- Complete solution with minimal customer effort

#### Enterprise Solutions
- Custom integrations into existing systems
- API integration
- On-premise deployment options
- Tailored solutions for specific needs
- Dedicated support

### 3. Pricing Structure

**Base Services:**
- Analysieren: €0.10 pro Seite
- Durch Menschen verifizieren: ab €0.60 pro Seite
- Scannen: €0.30 pro Seite

**Additional Services:**
- Datenbearbeitung: Auf Anfrage
- Datenüberführung in spezielle Formate: Auf Anfrage
- API-Integration: Auf Anfrage
- Custom development: Auf Anfrage

**Features:**
- Interactive pricing calculator on the page
- Bulk discounts available for large projects (10,000+ pages)

### 4. Use Cases / Customer Stories

Include real-world examples showing:
- **Challenge** - What problem the customer faced
- **Solution** - How Formalogix solved it
- **Results** - Quantifiable outcomes

**Example domains:**
- Insurance applications (Versicherungsanträge)
- School examinations (Schulprüfungen)
- Patient questionnaires (Patientenfragebögen)
- Order forms (Bestellformulare)

Each use case should include:
- Industry/context
- Volume of forms processed
- Specific challenges
- Implementation approach
- Measurable results (time saved, accuracy improvements, etc.)

### 5. Contact Form Requirements

**Primary Goal:** Capture leads from potential customers

**Required Fields:**
- Firma (Company) - Required
- Homepage - Optional
- Name - Required
- E-Mail - Required
- Anzahl Formulare (Number of forms) - Required
  - Dropdown: 50, 1000, 100000, "Andere Anzahl"
- Ihre Nachricht (Message) - Required text area

**File Upload:**
- Beispiel des Formulars hochladen (Upload example form)
- Accept: PDF, JPG, PNG
- Optional but encouraged

**Submission:**
- Clear success/error messages
- Should send notification email to Formalogix team
- Respond within 24 hours commitment message

## Navigation Structure

**Main Sections:**
1. Hero - Value proposition and CTA
2. Services - Three service tiers
3. Use Cases - Customer success stories
4. Pricing - Calculator and pricing table
5. Contact - Lead generation form

**Header:**
- Logo/Brand name
- Navigation menu (desktop)
- Hamburger menu (mobile)
- "Zur App" button linking to https://app.formalogix.com

**Footer:**
- Service links
- Resource links
- Contact information
- Copyright notice

## Assets Provided

- Process visualization image: Screenshot showing form → digitization → structured data flow
- Reference design: https://app.formalogix.com/#/login

## Success Criteria

1. ✅ Static site that loads quickly (<2 seconds)
2. ✅ Mobile-responsive design
3. ✅ Clear value proposition immediately visible
4. ✅ All three service tiers explained
5. ✅ Pricing calculator functional
6. ✅ Contact form with file upload working
7. ✅ Professional, modern design
8. ✅ Easy to deploy and maintain
9. ✅ Extensible for future features
10. ✅ SEO-optimized structure

## Future Extensibility

The site should be built with these potential additions in mind:
- Blog/news section
- Customer testimonials
- Case study detail pages
- Documentation/help center
- Multi-language support (English, other languages)
- Integration examples
- API documentation
- Customer login area

## Deployment

- Should be deployable to modern hosting platforms (Netlify, Vercel, Cloudflare Pages)
- Custom domain: formalogix.com
- HTTPS required
- CDN for global performance

## Analytics & Tracking

- Google Analytics integration capability
- Form submission tracking
- Conversion tracking ready
