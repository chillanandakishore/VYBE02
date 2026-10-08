# VYBE Platform Architecture

> "Find your people. Share your world."

VYBE is architected as a modern, high-performance social ecosystem uniting interest-first communities, 4K vertical media, autonomous AI creator tools, and real-time interaction.

---

## 1. Architectural Principles

1. **Dark-First, Sensory Visuals**: Minimal latency, glassmorphism, subtle glowing gradients, and zero clunky layout shift.
2. **Interest-First Graph (The VYBE System)**: Content routing is centered around topic nodes (VYBES) rather than generic engagement-baiting algorithms.
3. **Modular Service Decoupling**: Database adapters, AI inference engines, real-time message brokers, and payment providers are designed with clean interfaces so backend engines can be swapped without frontend rewrites.
4. **Instant Developer & User Experience**: Out-of-the-box runtime with pre-seeded demo accounts alongside production-ready PostgreSQL Prisma schema.

---

## 2. System Layers

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 16)                │
│  React 19 Server & Client Components + Tailwind CSS 4 │
├────────────────────────────────────────────────────────┤
│                      Layout Shell                      │
│   Desktop Sidebar | Dynamic Topbar | Mobile Touch Nav  │
├────────────────────────────────────────────────────────┤
│                   State & Context Hook                 │
│         AuthProvider | useTheme | useToast             │
├────────────────────────────────────────────────────────┤
│                   Next.js Route Handlers               │
│      /api/auth/*  |  /api/posts/*  |  /api/vybes/*     │
├────────────────────────────────────────────────────────┤
│                    Service Abstraction                 │
│         aiService  |  userService  |  authService      │
├────────────────────────────────────────────────────────┤
│                   Persistence Layer                    │
│   Prisma ORM (PostgreSQL)  +  In-Memory Dev Fallback   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Core Database Models (Prisma)

The platform models 23 core entities in `database/schema.prisma`:
- **Identity & Accounts**: `User`, `Profile`, `Follow`
- **Content**: `Post`, `Comment`, `Like`, `Save`, `Reel`, `Story`
- **Communities**: `Community` (VYBE), `CommunityMember`
- **Competitions & Gatherings**: `Challenge`, `ChallengeEntry`, `Event`, `EventParticipant`
- **Communications**: `Message`, `Notification`
- **Creator Economy**: `Product`, `Order`, `Subscription`
- **Trust & Safety**: `Report`, `Achievement`, `UserAchievement`

---

## 4. Authentication Strategy

- **Credentials**: Email or username + bcrypt salt hashing (10 rounds).
- **Session Tokens**: Signed JWTs with 7-day expiration, transported via HTTP-only, secure, `SameSite=Lax` cookies.
- **Client Session**: Monitored via `/api/auth/me` with state synchronization across tabs.
- **OAuth Ready**: Google OAuth architecture prepared with pre-configured endpoints.
- **Onboarding Pipeline**: Two-step registration enforcing username validation and interest category tagging.
