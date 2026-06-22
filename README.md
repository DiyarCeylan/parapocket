# ParaPocket — Personal Budget Tracker PWA

A fully client-side Progressive Web App for tracking income and expenses, managing budgets, and visualizing your financial health. All data stays on your device via IndexedDB.

## Features

- **Dashboard** — Monthly balance, income/expense summary, daily charts, category breakdown, recent transactions
- **Transactions** — Full list with search and type filtering (income/expense)
- **Add/Edit** — Add or edit income/expense transactions with date, category, amount, and notes
- **Budgets** — Set monthly spending limits per category with visual progress bars
- **Settings** — Dark/light theme toggle, CSV and JSON export, JSON import/backup
- **PWA** — Installable on mobile/desktop, works offline via Service Worker
- **Privacy-first** — No accounts, no cloud sync, no data leaves your device

## Tech Stack

- **Vanilla JS** (ES Modules) — no frameworks, no build step
- **IndexedDB** — offline-first data persistence
- **SVG Charts** — hand-drawn bar charts and category breakdowns
- **Service Worker** — full offline support
- **GoatCounter** — privacy-friendly analytics (optional, no cookies)

## Usage

Open the app and start adding transactions. All data is stored locally in your browser's IndexedDB.

### Export/Import

Go to Settings to:
- **Export CSV** — open in Excel or Google Sheets
- **Export JSON** — full backup of all data
- **Import JSON** — restore from a previous backup

## Development

No build tools required. Serve the `parapocket/` directory with any static server:

```bash
npx serve parapocket/
```

## License

MIT
