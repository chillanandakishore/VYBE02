# VYBE — Find your people. Share your world.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**VYBE** is a next-generation social ecosystem designed for creators, students, photographers, video editors, musicians, developers, gamers, travelers, and thinkers.

Instead of copying legacy social networks or relying on addictive dopamine loops, VYBE organizes discovery around **interest-based communities (VYBES)**, high-fidelity 4K media, community challenges, and modular AI creator acceleration.

---

## 🌟 Key Highlights (Phase 1 Foundation)

- **Dark-First Modern Aesthetic**: Built with a deep cinematic palette, subtle neon gradients, micro-interactions, glassmorphic cards, and an instant light mode toggle with zero layout shift or flash.
- **The VYBE System**: 15 curated interest niches (Video Editing, Photography, AI & ML, Coding, Gaming, Cars, Travel, Fitness, Art, Fashion, Study, Movies, Food, Music, Technology).
- **Personalized Onboarding**: 2-step registration with interactive interest selection that shapes initial community feeds.
- **1-Click Demo Accounts**: Instant evaluation as either **Alex Rivers** (Pro Filmmaker) or **Maya Patel** (AI & Systems Engineer) without requiring email verification.
- **Responsive Multi-Device Shell**: Adaptive desktop sidebar, dynamic global search topbar, and tactile bottom navigation for mobile & tablet screens.
- **Normalized PostgreSQL Schema**: 23 core entities modeled in Prisma with foreign keys, indexes, cascades, and role constraints (`database/schema.prisma`).
- **Modular AI Creator Studio**: Production-ready interfaces for multi-style caption generation, 30-second viral reel scripts, and niche hashtag clouds.
- **Zero-Setup Runtime**: Ready to run immediately with pre-configured dev storage fallback while preserving 100% compatibility with production PostgreSQL.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router & Route Handlers) |
| **Frontend** | React 19, TypeScript, Lucide Icons |
| **Styling** | Tailwind CSS 4, CSS Custom Properties, Glassmorphism |
| **Authentication** | Bcrypt (10 rounds), Signed JWTs, HTTP-only secure cookies |
| **Database ORM** | Prisma with PostgreSQL schema (23 normalized models) |
| **AI Layer** | Modular AI service layer (`services/ai-service.ts`) |
| **State** | React Context (`AuthProvider`), custom hooks (`useAuth`, `useTheme`, `useToast`) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ (Tested on Node v24)
- **Package Manager**: `npm` (or `pnpm` / `bun`)

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/vybe.git
cd vybe
npm install
```

### 3. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env.local
```

Default values in `.env.example` allow the app to run immediately without configuring third-party services.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials (1-Click Login Available)

On the login page, use the **1-Click Demo Mode** buttons or sign in with:

| Account Type | Email / Username | Password | Profile |
|---|---|---|---|
| **Creator** | `creator@vybe.social` or `alex_rivers` | `vybe123` | Pro Filmmaker & Colorist |
| **Engineer/Student** | `coder@vybe.social` or `maya_dev` | `vybe123` | AI & Fullstack Developer |

You can also create a new account using the 2-step registration with custom interest tags.

---

## 🗄️ Database Setup (Production PostgreSQL)

The full production schema is located in `database/schema.prisma`. To synchronize with your PostgreSQL database:

```bash
# Push schema to PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio visual browser
npx prisma studio
```

---

## 📁 Project Structure

```
vybe/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx         # Auth wrapper with ambient glow
│   │   ├── login/page.tsx     # Login page with demo buttons
│   │   └── signup/page.tsx    # 2-step registration page
│   ├── (dashboard)/
│   │   ├── layout.tsx         # Dashboard shell wrapper
│   │   ├── feed/page.tsx      # Personalized community feed
│   │   ├── explore/page.tsx   # Search, tags & discovery grid
│   │   ├── vybes/page.tsx     # Interest-based communities hub
│   │   ├── reels/page.tsx     # Vertical short-form video player
│   │   ├── messages/page.tsx  # Direct & group messaging shell
│   │   ├── notifications/page.tsx # Notification center
│   │   ├── challenges/page.tsx# 30-day community challenges
│   │   ├── events/page.tsx    # Workshops & meetups RSVP
│   │   ├── studio/page.tsx    # VYBE AI Creator Studio
│   │   └── profile/page.tsx   # User profile with edit modal
│   ├── api/auth/
│   │   ├── signup/route.ts    # User registration endpoint
│   │   ├── login/route.ts     # Credentials authentication
│   │   ├── logout/route.ts    # Session invalidation
│   │   └── me/route.ts        # Current session verification
│   ├── globals.css            # Dark/light theme & glassmorphic utilities
│   ├── layout.tsx             # Root layout with AuthProvider & Toast
│   ├── page.tsx               # Public landing page
│   ├── loading.tsx            # Global pulse loading state
│   ├── error.tsx              # Error boundary with reset action
│   └── not-found.tsx          # 404 universe screen
├── components/
│   ├── auth/                  # LoginForm, SignupForm, InterestSelector
│   ├── landing/               # Hero, Features, VybePreview, CreatorSpotlight, CTA, Footer
│   ├── layout/                # Navbar, Sidebar, Topbar, MobileNav, DashboardShell
│   ├── providers/             # AuthProvider with demo logins
│   └── ui/                    # Button, Input, Modal, Card, Badge, Avatar, Tabs, Toast, ThemeToggle
├── database/
│   └── schema.prisma          # Complete 23-model PostgreSQL schema
├── docs/
│   ├── ARCHITECTURE.md        # Technical architecture document
│   ├── ROADMAP.md             # 12-phase development roadmap
│   └── API.md                 # API reference documentation
├── hooks/
│   ├── use-auth.ts            # Client authentication hook
│   ├── use-theme.ts           # Dark/light theme toggle
│   └── use-toast.ts           # Lightweight toast dispatcher
├── lib/
│   ├── auth.ts                # Bcrypt & JWT verification helpers
│   ├── db.ts                  # Database abstraction & mock seed store
│   └── utils.ts               # Classnames merge & formatters
├── services/
│   └── ai-service.ts          # Modular AI service adapter interface
├── types/                     # TypeScript definitions for User, Auth, Interests
├── .env.example               # Environment variables template
└── package.json               # Scripts & dependencies
```

---

## 🛠️ Development & Build Commands

```bash
# Run local dev server
npm run dev

# Run TypeScript check & build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## 🗺️ Incremental Development Roadmap

VYBE follows an incremental 12-Phase release cadence:

- [x] **Phase 1**: Authentication + Database Schema + Responsive Layout (Completed)
- [x] **Phase 2**: Profiles + Posts + Likes + Comments + Media & Polls (Completed)
- [ ] **Phase 3**: Follow Graph + Personalized Feed Filtering (Next)
- [ ] **Phase 4**: Global Search + Realtime Notifications
- [ ] **Phase 5**: Reels Audio Engine + 24h Stories & Highlights
- [ ] **Phase 6**: VYBES Channels + 30-Day Challenge Submissions
- [ ] **Phase 7**: WebSockets Realtime Messaging & Voice Notes
- [ ] **Phase 8**: Creator Mode Analytics & Audience Retention
- [ ] **Phase 9**: Google Gemini 2.0 AI Studio Integration
- [ ] **Phase 10**: Marketplace + Presets + Subscriptions
- [ ] **Phase 11**: Safety, Moderation Queue & Admin Console
- [ ] **Phase 12**: Edge Caching, Dockerization & Production Cloud Deploy

---

## 📄 License

Proprietary — Developed for VYBE Social Platform Inc. All rights reserved.
