# InsureQuest — Gamified Insurance Agent Portal

A gamified insurance platform with a member-facing site and an agent advisor portal, built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Packaged as an Android APK via Capacitor.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.9 (App Router, static export) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (`@theme inline` custom tokens) |
| Animation | Framer Motion v11 |
| Icons | @tabler/icons-react v3 |
| Font | Inter (next/font/google) |
| AI | @google/generative-ai v0.24.1 — `gemini-2.0-flash` |
| Mobile | Capacitor 7 (Android) |

### Design tokens (Tailwind v4)

| Token | Usage |
|---|---|
| `bg-pastel-yellow` | Page backgrounds |
| `bg-card-cream` | Card surfaces |
| `border-sketch` / `border-card-outline` | All card borders |
| `font-handwriting` | Display / heading text |
| `text-game-purple` / `text-game-pink` | Brand accent colours |
| `bg-pastel-lavender` / `bg-game-mint` | Soft fill states |

## Routes

| Route | Description |
|---|---|
| `/` | Member homepage (all sections) |
| `/login` | Member sign-in — includes Agent Portal Login button |
| `/signup` | Member account creation |
| `/agent/` | Redirects → `/agent/dashboard` |
| `/agent/login` | Agent portal login |
| `/agent/dashboard` | Agent dashboard — stats, morning brief, today pipeline |
| `/agent/dashboard/missions` | Daily missions — earn XP, track completion |
| `/agent/dashboard/leaderboard` | Top 10 agent leaderboard with trophy podium |
| `/agent/dashboard/customers` | Agent's customer list with policy details |
| `/agent/dashboard/ai-tools` | 5 AI advisor productivity tools |
| `*` (unmatched) | Custom 404 — Pokémon-style card with Framer Motion animations |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                        # Root layout, Inter font, metadata
│   ├── page.tsx                          # Member homepage
│   ├── globals.css                       # Tailwind v4 + design tokens
│   ├── not-found.tsx                     # Custom 404 — Pokémon card theme + animations
│   ├── login/page.tsx                    # Member login
│   ├── signup/page.tsx                   # Member signup
│   ├── api/
│   │   └── ai/
│   │       ├── morning-brief/route.ts    # POST — Gemini morning brief
│   │       ├── followup-draft/route.ts   # POST — Gemini WhatsApp drafts
│   │       ├── protection-gap/route.ts   # POST — Gemini gap analysis
│   │       ├── meeting-prep/route.ts     # POST — Gemini meeting brief
│   │       └── renewal-radar/route.ts    # POST — Gemini renewal insights
│   └── agent/
│       ├── page.tsx                      # Server redirect → /agent/dashboard
│       ├── login/page.tsx                # Agent portal login
│       └── dashboard/
│           ├── layout.tsx                # Shared sidebar layout
│           ├── page.tsx                  # Dashboard overview
│           ├── missions/page.tsx         # Daily missions page
│           ├── leaderboard/page.tsx      # Top 10 leaderboard
│           ├── customers/page.tsx        # Customer management
│           └── ai-tools/page.tsx         # 5 AI advisor tools
├── components/
│   ├── agent/
│   │   ├── AgentSidebar.tsx             # Nav: Dashboard, AI Tools, Missions, Leaderboard, Customers
│   │   ├── AgentHeader.tsx
│   │   ├── AgentStatCard.tsx
│   │   ├── AgentLeaderboardCard.tsx
│   │   ├── AgentLeaderboardTable.tsx
│   │   ├── AgentMissions.tsx            # XP missions system with Framer Motion progress bar
│   │   ├── CustomerCard.tsx
│   │   ├── MorningBrief.tsx             # Paginated (4/page) brief cards with draft sheet
│   │   ├── TodayPipeline.tsx
│   │   ├── FollowUpModal.tsx
│   │   ├── AgentLoginForm.tsx
│   │   └── ai-tools/
│   │       ├── AiToolCard.tsx
│   │       ├── ClientSelect.tsx         # Custom themed dropdown (replaces native <select>)
│   │       ├── SmartMorningBrief.tsx    # Gemini AI morning brief
│   │       ├── FollowUpDraftGenerator.tsx # Gemini — 3 WA draft options, manual send only
│   │       ├── ProtectionGapExplainer.tsx # Gemini — coverage gap analysis + talking points
│   │       ├── MeetingPrepCard.tsx      # Gemini — pre-meeting brief
│   │       ├── RenewalRadar.tsx         # Local scoring engine + optional Gemini insights
│   │       └── LifeEventSignal.tsx      # Local life-event detection only (no AI)
│   ├── auth/                            # AuthCard, LoginForm (+ Agent Portal Login link), SignupForm
│   ├── card-builder/                    # UploadPanel (base64 FileReader, no blob URLs)
│   ├── layout/                          # Navbar, Footer
│   ├── sections/                        # HeroSection, PlansSection, WhyChooseSection,
│   │                                    #   StatsSection, TestimonialsSection, CtaSection
│   └── ui/                              # Button, Card, Container, Input, SectionTitle
├── data/
│   ├── insurance.ts                     # Homepage content (nav, plans, stats, testimonials)
│   ├── getAgent.json                    # 10 agent performance records
│   ├── getProfile.json                  # 12 customer profiles (all phones: +60 17-848 3620)
│   └── getMorningBrief.json             # Pre-generated morning brief items
├── lib/
│   ├── gemini.ts                        # generateAIText / generateAIJSON — server-side only
│   └── ai-prompts.ts                    # Prompt builders for all 5 AI advisor tools
├── types/
│   ├── index.ts                         # Shared TypeScript interfaces
│   └── agent.ts                         # AgentPerformance, CustomerProfile, AI output types
└── utils/
    └── cn.ts                            # Class merging utility
```

## Homepage Sections

1. **Navbar** — Fixed, scroll-blur, dark mode toggle, mobile menu
2. **Hero** — Headline, CTAs, trust badges, quick-stat strip
3. **Plans** — 6 insurance categories (Life, Health, Family, Retirement, Savings, Claims)
4. **Why Choose Us** — 4 differentiators with icons
5. **Statistics** — 15K+ clients, 98% satisfaction, 24/7 support, 10+ years
6. **Testimonials** — 3 client-style quotes
7. **CTA** — Book a Free Consultation
8. **Footer** — Brand, contact details, link columns

## Agent Portal

Accessed via `/agent/login`. Layout: collapsible sidebar + `AgentHeader` + main content area.

### Daily Missions (`/agent/dashboard/missions`)

6 XP missions per day. Framer Motion progress bar. "Mark as done" → `AnimatePresence` swap to "Mission complete! ⭐". XP counter + completion percentage tracked locally.

| Mission | XP |
|---|---|
| Generate morning brief | +30 |
| Contact 3 clients | +50 |
| Send 2 WA drafts | +40 |
| Review lapsed client | +80 |
| Run protection gap check | +40 |
| Close 1 policy | +150 |

### Morning Brief (`/agent/dashboard`)

Paginated — 3 cards per page with `<` `>` navigation. Cards sorted by priority (urgent → medium → low). Each card: HP bar, last contact age, suggested timing, confidence score, WA draft sheet (mobile app + web links, manual send only).

## AI Advisor Tools (`/agent/dashboard/ai-tools`)

5 tools. Gemini calls are **server-side only** via `/app/api/ai/*` routes — `GEMINI_API_KEY` is never exposed to the browser. All outputs are labelled "Advisor reviews before taking action."

| Tool | Engine | Description |
|---|---|---|
| **Morning Brief** | Gemini | Ranks clients by urgency; generates a warm, concise daily brief |
| **Follow-up Draft Generator** | Gemini | Select client + tone → 3 editable WA drafts. Copy or open WA manually. Never auto-sends |
| **Protection Gap Explainer** | Gemini | Plain-English gap summary + 3 advisor talking points from `coverageDeck` / `missingCoverage` |
| **Meeting Prep Card** | Gemini | Pre-meeting brief: life stage, HP, energy type, boosters, opener sentence, 3 insights |
| **Renewal Radar** | Local + Gemini | Scores 10 signals per client (lapsed, HP, inactivity, satisfaction…). Tiers: Critical / Attention / Watch / Stable. Optional "Run AI Radar Analysis" sends top-tier clients to Gemini |
| **Life Event Signal** | Local only | Detects 8 life-event categories (newborn, engagement, pre-retirement…) from profile updates. Auto-synced from member app — no AI, no API |

> All advisor actions are manual. No message is ever sent automatically.

## Forms

Login and Signup are UI-only — no backend. Both include:
- Client-side validation (required fields, email format, password length, match check)
- Show/hide password toggle
- Inline error messages
- Terms & privacy checkbox (signup)

## Dark Mode

Class-based via `@custom-variant dark` (Tailwind v4). Toggle via the moon/sun icon in Navbar — adds/removes `.dark` on `<html>`.

## Environment Variables

```bash
GEMINI_API_KEY=your_key_here   # required for all 5 Gemini-powered tools
GEMINI_MODEL=gemini-2.0-flash  # optional override, defaults to gemini-2.0-flash
```

> Never expose `GEMINI_API_KEY` in client components. All Gemini calls go through `/app/api/ai/*` server routes.

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

The static export (`/out`) is copied to `android/app/src/main/assets/public/` by Capacitor. No server required — the app runs fully offline from the device filesystem.

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
adb devices                       # list connected devices
adb install path/to/app.apk       # install APK
adb uninstall com.securelife.app  # uninstall the app
adb logcat                        # stream device logs for debugging
```

> **Note:** ADB is included with Android Studio. Add it to your PATH:
> `export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools`
