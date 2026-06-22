import { getBudgets, setBudget, deleteBudget, getMonthlyTransactions } from '../db.js';
import { formatCurrency, currentMonth, formatMonth } from '../utils/format.js';
import { htmlEscape } from '../utils/sanitize.js';

export async function renderBudgets() {
  const budgets = await getBudgets();
  const month = currentMonth();
  const monthlyTx = await getMonthlyTransactions(
    parseInt(month.split('-')[0]),
    parseInt(month.split('-')[1])
  );

  const expenses = {};
  for (const t of monthlyTx.filter(t => t.type === 'expense')) {
    expenses[t.category] = (expenses[t.category] || 0) + t.amount;
  }

  document.getElementById('view').innerHTML = `
    <div class="list-header">
      <h3>Bütçeler</h3>
      <span style="font-size:13px;color:var(--text3)">${formatMonth(month)}</span>
    </div>

    <div id="budgetList"></div>

    <div style="margin-top:16px">
      <button class="btn btn-primary btn-sm" onclick="showAddBudget()">+ Bütçe Ekle</button>
    </div>
  `;

  const el = document.getElementById('budgetList');

  if (budgets.length === 0) {
    el.innerHTML = '<div class="empty-state" style="padding:24px"><h3>Henüz bütçe yok</h3><p>Harcama kategorilerine limit belirle</p></div>';
    return;
  }

  const monthlyBudgets = budgets.filter(b => b.month === month);

  if (monthlyBudgets.length === 0) {
    el.innerHTML = '<div class="empty-state" style="padding:24px"><p>Bu ay için bütçe belirlenmemiş</p></div>';
    return;
  }

  el.innerHTML = monthlyBudgets.map(b => {
    const spent = expenses[b.category] || 0;
    const pct = Math.min((spent / b.limit) * 100, 100);
    const status = pct <= 70 ? 'ok' : pct <= 90 ? 'warn' : 'over';

    return `<div class="budget-item">
      <div class="budget-header">
        <span class="budget-name">${htmlEscape(b.category)}</span>
        <span class="budget-numbers">
          <span class="used">${formatCurrency(spent)}</span> / ${formatCurrency(b.limit)}
        </span>
      </div>
      <div class="budget-bar">
        <div class="budget-fill ${status}" style="width:${pct}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <span style="font-size:11px;color:var(--text3)">${pct.toFixed(0)}% kullanıldı</span>
        <button class="header-btn remove-budget-btn" data-id="${htmlEscape(b.id)}" style="color:var(--rose)" title="Kaldır">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('.remove-budget-btn').forEach(btn => {
    btn.addEventListener('click', () => removeBudget(btn.dataset.id));
  });
}

window.showAddBudget = async function() {
  const budgets = await getBudgets();
  const month = currentMonth();

  const existingCats = new Set(
    budgets.filter(b => b.month === month).map(b => b.category)
  );

  const allCats = [...new Set(allCategories())].filter(c => !existingCats.has(c));

  if (allCats.length === 0) {
    showToast('Tüm kategorilere bütçe eklenmiş');
    return;
  }

  const catOptions = allCats.map(c => `<option value="${htmlEscape(c)}">${htmlEscape(c)}</option>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-handle"></div>
      <h3 style="margin-bottom:16px">Bütçe Ekle</h3>
      <div class="form-group">
        <label class="form-label">Kategori</label>
        <select class="form-select" id="budgetCat">${catOptions}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Aylık Limit (₺)</label>
        <input class="form-input" type="number" id="budgetLimit" step="0.01" min="1" placeholder="0.00" required autofocus>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" onclick="saveBudget()">Kaydet</button>
        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">İptal</button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
  setTimeout(() => document.getElementById('budgetLimit')?.focus(), 100);
};

window.saveBudget = async function() {
  const cat = document.getElementById('budgetCat').value;
  const limit = parseFloat(document.getElementById('budgetLimit').value);
  if (!limit || limit <= 0) { showToast('Geçerli limit girin'); return; }

  await setBudget({
    id: `${cat}_${currentMonth()}`,
    category: cat,
    limit,
    month: currentMonth()
  });

  document.querySelector('.modal-overlay')?.remove();
  showToast('Bütçe eklendi');
  await renderBudgets();
};

async function removeBudget(id) {
  if (!confirm('Bu bütçeyi kaldırmak istediğine emin misin?')) return;
  await deleteBudget(id);
  showToast('Bütçe kaldırıldı');
  await renderBudgets();
}

function allCategories() {
  return ['Yiyecek', 'Ulaşım', 'Fatura', 'Eğlence', 'Sağlık', 'Alışveriş', 'Eğitim', 'Diğer', 'Maaş', 'Freelance', 'Yatırım', 'Kira Geliri'];
}
