# Dynamic

**The art of doing science and engineering.**

Part of the [12 Cities](https://github.com/abduljaleel) venture ecosystem.

## What it does

Dynamic is an experiment design and evaluation platform for technical teams. It enforces the scientific method on product and engineering decisions — hypothesis first, measurement always.

### Core Features

- **Experiment Design Wizard** — Multi-step flow: hypothesis, metrics, variants, sample size calculator, and review checklist
- **Statistical Results Analysis** — Per-variant metrics with confidence intervals, p-values, and significance badges
- **Sample Size Calculator** — Power analysis with configurable baseline rate, minimum detectable effect, and significance level
- **Methodology Playbook** — Templates for A/B testing, before/after analysis, multivariate testing, survey design, and qualitative research
- **Experiment Library** — Archive of concluded experiments with outcomes and key learnings for institutional memory

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Auth & Database:** Supabase (Auth, Postgres, RLS)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 12 Cities Role

**Domain:** dynamic.fi | **Tier:** 2 (Depth) | **Layer:** Intelligence

## License

Private — 12 Cities Venture System
