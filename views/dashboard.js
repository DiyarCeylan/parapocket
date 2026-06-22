import { getAllTransactions, getMonthlyTransactions } from '../db.js';
import { formatCurrency, formatDate, getCategoryIcon, currentMonth, formatMonth } from '../utils/format.js';
import { htmlEscape } from '../utils/sanitize.js';

export async function renderDashboard() {
  const all = await getAllTransactions();
  const now = new Date();
  const monthly = await getMonthlyTransactions(now.getFullYear(), now.getMonth() + 1);

  const totalIncome = monthly.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthly.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const allIncome = all.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const allExpense = all.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  document.getElementById('view').innerHTML = `
    <div class="balance-card">
      <div class="balance-label">Toplam Bakiye</div>
      <div class="balance-amount">${formatCurrency(balance < 0 ? 0 : balance)}</div>
      <div class="balance-row">
        <div class="balance-item">
          <div class="balance-item-label">Bu Ay Gelir</div>
          <div class="balance-item-amount income">+${formatCurrency(totalIncome)}</div>
        </div>
        <div class="balance-item">
          <div class="balance-item-label">Bu Ay Gider</div>
          <div class="balance-item-amount expense">-${formatCurrency(totalExpense)}</div>
        </div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-card-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Toplam Gelir</div>
        <div class="summary-card-value" style="color:var(--green)">${formatCurrency(allIncome)}</div>
        <div class="summary-card-label">Tüm zamanlar</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Toplam Gider</div>
        <div class="summary-card-value" style="color:var(--red)">${formatCurrency(allExpense)}</div>
        <div class="summary-card-label">Tüm zamanlar</div>
      </div>
    </div>

    <div class="chart-wrap" id="chartMonth"></div>

    <div class="chart-wrap" id="chartCategory"></div>

    <div class="list-header">
      <h3>Son İşlemler</h3>
      <a onclick="navigate('transactions')">Tümü</a>
    </div>
    <div id="recentList"></div>
  `;

  renderMonthChart(monthly);
  renderCategoryChart(monthly);
  renderRecentList(monthly.slice(0, 10));
}

function renderMonthChart(transactions) {
  const days = {};
  for (const t of transactions) {
    const day = t.date.slice(8, 10);
    if (!days[day]) days[day] = { income: 0, expense: 0 };
    days[day][t.type] += t.amount;
  }

  const labels = Object.keys(days).sort();
  const incomeData = labels.map(d => days[d].income);
  const expenseData = labels.map(d => days[d].expense);

  if (labels.length === 0) {
    document.getElementById('chartMonth').innerHTML = '<h3>Aylık Dağılım</h3><div class="empty-state" style="padding:24px"><p>Bu ay işlem yok</p></div>';
    return;
  }

  const max = Math.max(...incomeData, ...expenseData, 1);
  const pad = 4;
  const w = Math.max(labels.length * 30, 280);
  const h = 160;
  const bw = Math.min(10, (w - pad * 2) / labels.length / 2 - 2);

  const toX = i => pad + i * (w - pad * 2) / labels.length;
  const toH = v => (v / max) * (h - 30);

  const bars = labels.map((d, i) => {
    const x = toX(i);
    const ih = toH(incomeData[i]);
    const eh = toH(expenseData[i]);
    return `
      <g>
        <text x="${x}" y="${h - 4}" text-anchor="middle" font-size="9" fill="var(--text3)">${htmlEscape(d)}</text>
        <rect x="${x - bw - 1}" y="${h - 16 - ih}" width="${bw}" height="${ih}" rx="2" fill="var(--green)" opacity=".8"/>
        <rect x="${x + 1}" y="${h - 16 - eh}" width="${bw}" height="${eh}" rx="2" fill="var(--red)" opacity=".8"/>
      </g>`;
  }).join('');

  document.getElementById('chartMonth').innerHTML = `
    <h3>Aylık Dağılım</h3>
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px">
      <line x1="0" y1="${h - 16}" x2="${w}" y2="${h - 16}" stroke="var(--border)" stroke-width="1"/>
      ${bars}
    </svg>
    <div style="display:flex;gap:16px;justify-content:center;margin-top:8px;font-size:12px;color:var(--text2)">
      <span><span style="color:var(--green)">●</span> Gelir</span>
      <span><span style="color:var(--red)">●</span> Gider</span>
    </div>`;
}

function renderCategoryChart(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const cats = {};
  for (const t of expenses) {
    cats[t.category] = (cats[t.category] || 0) + t.amount;
  }

  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    document.getElementById('chartCategory').innerHTML = '<h3>Kategori Dağılımı</h3><p style="text-align:center;padding:24px;color:var(--text3);font-size:13px">Bu ay gider yok</p>';
    return;
  }

  const total = entries.reduce((s, [, v]) => s + v, 0);
  const colors = ['#6C5CE7', '#00b894', '#fdcb6e', '#ff6b6b', '#74b9ff', '#a29bfe', '#55efc4', '#fab1a0'];

  const list = entries.map(([cat, amount], i) => {
    const pct = (amount / total * 100).toFixed(1);
    return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px">
      <span style="width:10px;height:10px;border-radius:3px;background:${colors[i % colors.length]};flex-shrink:0"></span>
      <span style="display:flex;flex:1;justify-content:space-between"><span>${htmlEscape(cat)}</span><span style="color:var(--text2)">${formatCurrency(amount)} (${pct}%)</span></span>
    </div>`;
  }).join('');

  document.getElementById('chartCategory').innerHTML = `
    <h3>Kategori Dağılımı (Gider)</h3>
    ${list}`;
}

function renderRecentList(transactions) {
  const el = document.getElementById('recentList');
  if (transactions.length === 0) {
    el.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><h3>Henüz işlem yok</h3><p>İlk işlemini eklemek için + butonuna tıkla</p></div>';
    return;
  }

  el.innerHTML = transactions.map(t => {
    const icon = getCategoryIcon(t.category);
    return `<div class="transaction-item">
      <div class="tx-icon ${t.type}">${icon}</div>
      <div class="tx-info">
        <div class="tx-category">${htmlEscape(t.category)}</div>
        <div class="tx-note"><span class="tx-date">${formatDate(t.date)}</span>${t.note ? ' · ' + htmlEscape(t.note) : ''}</div>
      </div>
      <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</div>
    </div>`;
  }).join('');
}
