# SecureLife Insurance — Protect Your Future With Confidence

A professional insurance company website built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 11 |
| Icons | @tabler/icons-react v3 |
| Font | Inter (next/font/google) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|---|---|
| `/` | Homepage (all sections) |
| `/login` | Sign-in page |
| `/signup` | Account creation page |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout, Inter font, metadata
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Tailwind v4 + dark mode
│   ├── login/page.tsx       # Login route
│   └── signup/page.tsx      # Signup route
├── components/
│   ├── auth/                # AuthCard, LoginForm, SignupForm
│   ├── layout/              # Navbar, Footer
│   ├── sections/            # HeroSection, PlansSection, WhyChooseSection,
│   │                        #   StatsSection, TestimonialsSection, CtaSection
│   └── ui/                  # Button, Card, Container, Input, SectionTitle
├── data/
│   └── insurance.ts         # All page content (nav, plans, stats, testimonials)
├── types/
│   └── index.ts             # Shared TypeScript interfaces
└── utils/
    └── cn.ts                # Class merging utility
```

## Homepage Sections

1. **Navbar** — Fixed, scroll-blur, dark mode toggle, mobile menu
2. **Hero** — Headline, CTAs, trust badges, quick-stat strip
3. **Plans** — 6 insurance categories (Life, Health, Family, Retirement, Savings, Claims)
4. **Why Choose Us** — 4 differentiators with icons
5. **Statistics** — Blue gradient band: 15K+ clients, 98% satisfaction, 24/7 support, 10+ years
6. **Testimonials** — 3 real-customer-style quotes
7. **CTA** — Book a Free Consultation
8. **Footer** — Brand, contact details, link columns

## Forms

Login and Signup are UI-only — no backend. Both include:
- Client-side validation (required fields, email format, password length, match check)
- Show/hide password toggle
- Inline error messages
- Terms & privacy checkbox (signup)

## Dark Mode

Class-based via `@custom-variant dark` (Tailwind v4). Toggle via the moon/sun icon in the Navbar — adds/removes `.dark` on `<html>`.

## Scripts

```bash
npm run dev      # Turbopack dev server
npm run build    # Production build
npm run lint     # ESLint
```
