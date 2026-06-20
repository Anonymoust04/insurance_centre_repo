# SecureLife Insurance — Protect Your Future With Confidence

A professional insurance company website and agent portal, built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Packaged as an Android APK via Capacitor.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 11 |
| Icons | @tabler/icons-react v3 |
| Font | Inter (next/font/google) |
| Mobile | Capacitor 7 (Android) |

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
| `/login` | Customer sign-in page |
| `/signup` | Customer account creation |
| `/agent/login` | Agent portal login |
| `/agent/dashboard` | Agent dashboard (welcome, stats, mini leaderboard, customers) |
| `/agent/dashboard/leaderboard` | Top 10 agent leaderboard with trophy podium |
| `/agent/dashboard/customers` | Agent's customer list with policy details |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                       # Root layout, Inter font, metadata
│   ├── page.tsx                         # Homepage
│   ├── globals.css                      # Tailwind v4 + dark mode
│   ├── login/page.tsx                   # Customer login route
│   ├── signup/page.tsx                  # Customer signup route
│   └── agent/
│       ├── login/page.tsx               # Agent portal login
│       └── dashboard/
│           ├── layout.tsx               # Shared sidebar layout
│           ├── page.tsx                 # Dashboard overview
│           ├── leaderboard/page.tsx     # Top 10 agent leaderboard
│           └── customers/page.tsx       # Customer management
├── components/
│   ├── agent/                           # AgentSidebar, AgentHeader, AgentStatCard,
│   │                                    #   AgentLeaderboardCard, AgentLeaderboardTable,
│   │                                    #   CustomerCard, CustomerStats,
│   │                                    #   AgentLoginForm, MotivationalBanner
│   ├── auth/                            # AuthCard, LoginForm, SignupForm
│   ├── layout/                          # Navbar, Footer
│   ├── sections/                        # HeroSection, PlansSection, WhyChooseSection,
│   │                                    #   StatsSection, TestimonialsSection, CtaSection
│   └── ui/                              # Button, Card, Container, Input, SectionTitle
├── data/
│   ├── insurance.ts                     # Homepage content (nav, plans, stats, testimonials)
│   ├── getAgent.json                    # 10 agent performance records
│   └── getProfile.json                  # Customer profile records
├── types/
│   ├── index.ts                         # Shared TypeScript interfaces
│   └── agent.ts                         # AgentPerformance, CustomerProfile interfaces
└── utils/
    └── cn.ts                            # Class merging utility
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
npm run dev          # Turbopack dev server
npm run build        # Static export → /out
npm run lint         # ESLint
npm run cap:sync     # Build + sync /out into Android project
npm run android      # Build + sync + open Android Studio
```

## Android / APK

Prerequisites: Android Studio installed with the Android SDK.

```bash
# One-time setup (already done)
npm install
npx cap add android

# Every build cycle
npm run android      # builds, syncs, opens Android Studio
# Then in Android Studio: Build → Build Bundle(s)/APK(s) → Build APK(s)
```

The static export (`/out`) is copied to `android/app/src/main/assets/public/` by Capacitor. No server is required — the app runs fully offline from the device filesystem.

### Capacitor config

| Key | Value |
|---|---|
| appId | `com.securelife.app` |
| appName | `SecureLife` |
| webDir | `out` |

## Running the APK

### Option 1 — Install on a physical Android device

1. Build the APK in Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**
2. The APK is saved to:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Connect your Android phone via USB and enable **USB Debugging**
   - Settings → About Phone → tap **Build Number** 7 times to unlock Developer Options
   - Settings → Developer Options → turn on **USB Debugging**
4. Transfer and install — choose one method:

   **Via ADB (recommended):**
   ```bash
   adb devices                          # confirm device is listed
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

   **Via file transfer:**
   - Copy `app-debug.apk` to your phone (USB, Google Drive, email, etc.)
   - Open the file on your phone → tap **Install**
   - If prompted, enable **Install from unknown sources** in Settings → Security

### Option 2 — Run on an Android emulator

1. In Android Studio open **Device Manager** (right toolbar) and create a virtual device (AVD) if you don't have one
2. Start the emulator, then run directly from Android Studio: **Run → Run 'app'**

   Or via ADB after the emulator is booted:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Option 3 — Live reload during development

```bash
npm run cap:sync        # rebuild + sync latest web assets
# Then press Run in Android Studio, or:
npx cap run android     # deploys directly to connected device/emulator
```

### ADB quick reference

```bash
adb devices                   # list connected devices
adb install path/to/app.apk   # install APK
adb uninstall com.securelife.app  # uninstall the app
adb logcat                    # stream device logs for debugging
```

> **Note:** ADB is included with Android Studio. Add it to your PATH:
> `export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools`
