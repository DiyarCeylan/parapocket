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
- **Service Worker** — full offline support with dynamic path detection
- **GoatCounter** — privacy-friendly analytics (optional, no cookies)

## Design

- **Color palette** — Teal (`#0d9488`), Amber (`#d97706`), Emerald (`#059669`), Rose (`#e11d48`)
- **Typography** — Premium system font stack with uppercase labels and generous spacing
- **Icons** — Hand-crafted SVG icons (no icon library dependencies)
- **Theme** — Dark/light mode with smooth CSS transitions
- **Layout** — Mobile-first responsive with fixed bottom navigation

## Usage

Open the app and start adding transactions. All data is stored locally in your browser's IndexedDB.

### Export/Import

Go to Settings to:
- **Export CSV** — open in Excel or Google Sheets
- **Export JSON** — full backup of all data
- **Import JSON** — restore from a previous backup

## Development

No build tools required. Serve the directory with any static server:

```bash
# Clone the repo
git clone https://github.com/DiyarCeylan/parapocket.git
cd parapocket

# Start local server
npx serve .
```

Then open `http://localhost:3000` in your browser.

### Hard Refresh

If you see cached assets after updates, do a hard refresh:
- **Windows/Linux**: `Ctrl+Shift+R`
- **macOS**: `Cmd+Shift+R`

Or clear site data via DevTools → Application → Clear site data.

## Deployment (GitHub Pages)

1. Push the `parapocket/` directory to a GitHub repo
2. Go to **Settings → Pages**
3. Under **Branch**, select `main` and folder `/ (root)`
4. Click **Save**
5. Your app will be live at `https://<username>.github.io/<repo>/`

The Service Worker automatically detects the correct base path for both local and GitHub Pages environments.

## License

MIT
