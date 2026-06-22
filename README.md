# ParaPocket — Personal Budget Tracker PWA

[![MIT](https://img.shields.io/badge/license-MIT-teal)](LICENSE)

A fully client-side Progressive Web App for tracking income and expenses, managing budgets, and visualizing your financial health. All data stays on your device via IndexedDB — no accounts, no cloud sync.

## Quick Start

```bash
git clone https://github.com/DiyarCeylan/parapocket.git
cd parapocket
npx serve .
```

Open `http://localhost:3000` in your browser. No build tools or dependencies required.

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Monthly balance, income/expense summary, daily chart, category breakdown |
| **Transactions** | Full list with search and type filtering |
| **Add/Edit** | Quick entry with date, category, amount, and notes |
| **Budgets** | Per-category monthly limits with visual progress bars |
| **Settings** | Dark/light theme, CSV/JSON export, JSON backup restore |
| **PWA** | Installable on mobile/desktop, works offline |
| **Privacy** | No accounts, no cloud, stays on your device |

## Design

- **Color palette** — Teal (`#0d9488`), Amber (`#d97706`), Emerald (`#059669`), Rose (`#e11d48`)
- **Typography** — Premium system font stack with uppercase labels
- **Icons** — Hand-crafted SVGs (no icon library dependencies)
- **Theme** — Dark/light mode with smooth CSS transitions
- **Layout** — Mobile-first responsive with fixed bottom navigation

## Tech Stack

- **Vanilla JS** (ES Modules) — no frameworks, no build step
- **IndexedDB** — offline-first data persistence
- **SVG Charts** — hand-drawn bar and category charts
- **Service Worker** — full offline support with dynamic path detection
- **GoatCounter** — privacy-friendly optional analytics

## Deployment (GitHub Pages)

1. Push the repo to GitHub
2. Go to **Settings → Pages**, set **Branch** to `main` and folder to `/ (root)`
3. Click **Save**

The Service Worker auto-detects both local and GitHub Pages environments.

## Roadmap

- [ ] Monthly PDF report export
- [ ] Recurring transactions (subscriptions)
- [ ] Multi-currency support
- [ ] Account/balance management
