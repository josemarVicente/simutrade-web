<!-- BEGIN:nextjs-agent-rules -->
# AI Agent Instructions: SimuTrade - Educational Stock Trading Simulator Frontend

You are an expert Frontend Engineer specializing in Next.js (App Router), TypeScript, Tailwind CSS, and TanStack Query. Your task is to build out the user interface and utility features for an educational stock trading simulator, integrating seamlessly with a running Laravel backend API.

---

## 1. System Context & Architecture

### Frontend Layout Tree (`app/` directory)
```text
├── app/
│   ├── layout.tsx                 # Root layout, TanStack QueryClient provider, global styles
│   ├── page.tsx                   # Auth checker: redirects to /dashboard or /login
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Login form with client/server validation
│   │   └── register/
│   │       └── page.tsx           # Register form (onboarding virtual cash portfolio)
│   └── (dashboard)/
│       ├── layout.tsx             # Protected layout: Sidebar navigation, Global Debounced Search, Market Status indicator
│       ├── dashboard/
│       │   └── page.tsx           # Core Hub: Portfolio aggregate value, interactive performance chart, watchlist
│       ├── portfolio/
│       │   └── page.tsx           # Asset breakdown: Holdings matrix table, paginated transaction histories
│       ├── stocks/
│       │   └── [symbol]/
│       │       └── page.tsx       # Trading desk: Historical stock chart, company metrics, Buy/Sell trade execution card
│       └── analytics/
│           └── page.tsx           # Performance metrics: Win/Loss ratio cards, historical drawdown tracking
<!-- END:nextjs-agent-rules -->
