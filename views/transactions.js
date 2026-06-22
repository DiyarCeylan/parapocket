import { getAllTransactions, deleteTransaction } from '../db.js';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/format.js';
import { htmlEscape } from '../utils/sanitize.js';

let currentFilter = 'all';
let searchQuery = '';

export async function renderTransactions() {
  const all = await getAllTransactions();

  document.getElementById('view').innerHTML = `
    <div class="list-header">
      <h3>Tüm İşlemler</h3>
      <span style="font-size:13px;color:var(--text3)">${all.length} işlem</span>
    </div>

    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input class="form-input" id="txSearch" placeholder="Ara..." oninput="filterTransactions(this.value)">
    </div>

    <div class="filter-bar" id="txFilters">
      <div class="filter-chip active" data-filter="all" onclick="setTxFilter('all')">Tümü</div>
      <div class="filter-chip income" data-filter="income" onclick="setTxFilter('income')">Gelir</div>
      <div class="filter-chip expense" data-filter="expense" onclick="setTxFilter('expense')">Gider</div>
    </div>

    <div id="txList"></div>
  `;

  renderList(all);
}

export function setTxFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('#txFilters .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === filter));
  getAllTransactions().then(renderList);
}

window.setTxFilter = setTxFilter;

export function filterTransactions(q) {
  searchQuery = q.toLowerCase();
  getAllTransactions().then(renderList);
}

window.filterTransactions = filterTransactions;

async function renderList(all) {
  let filtered = all;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(t => t.type === currentFilter);
  }

  if (searchQuery) {
    filtered = filtered.filter(t =>
      t.category.toLowerCase().includes(searchQuery) ||
      (t.note || '').toLowerCase().includes(searchQuery) ||
      t.amount.toString().includes(searchQuery)
    );
  }

  const el = document.getElementById('txList');
  if (filtered.length === 0) {
    el.innerHTML = '<div class="empty-state" style="padding:32px"><h3>İşlem bulunamadı</h3></div>';
    return;
  }

  // Group by date
  const groups = {};
  for (const t of filtered) {
    const key = t.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const dates = Object.keys(groups).sort().reverse();
  el.innerHTML = dates.map(date => `
    <div style="font-size:12px;font-weight:600;color:var(--text3);padding:12px 0 6px">${formatDate(date)}</div>
    ${groups[date].map(t => {
      const icon = getCategoryIcon(t.category);
      return `<div class="transaction-item" data-id="${htmlEscape(t.id)}">
        <div class="tx-icon ${t.type}">${icon}</div>
        <div class="tx-info">
          <div class="tx-category">${htmlEscape(t.category)}</div>
          <div class="tx-note">${t.note ? htmlEscape(t.note) : ''}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</div>
        </div>
        <button class="header-btn delete-tx-btn" data-id="${htmlEscape(t.id)}" style="flex-shrink:0;color:var(--red)" title="Sil">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>`;
    }).join('')}
  `).join('');

  el.querySelectorAll('.delete-tx-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteTx(btn.dataset.id));
  });
}

async function deleteTx(id) {
  if (!confirm('Bu işlemi silmek istediğine emin misin?')) return;
  await deleteTransaction(id);
  const all = await getAllTransactions();
  renderList(all);
}
