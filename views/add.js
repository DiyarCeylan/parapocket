import { addTransaction, updateTransaction } from '../db.js';
import { DEFAULT_CATEGORIES } from '../db.js';
import { todayISO } from '../utils/format.js';
import { htmlEscape, generateId } from '../utils/sanitize.js';

let editId = null;

export function renderAdd(editData = null) {
  editId = editData ? editData.id : null;
  const type = editData ? editData.type : 'expense';
  const cats = type === 'income' ? DEFAULT_CATEGORIES.income : DEFAULT_CATEGORIES.expense;

  document.getElementById('view').innerHTML = `
    <div class="list-header">
      <h3>${editData ? 'İşlemi Düzenle' : 'Yeni İşlem'}</h3>
    </div>

    <div class="type-toggle" id="typeToggle">
      <button class="type-btn expense ${type === 'expense' ? 'active' : ''}" data-type="expense" onclick="setAddType('expense')">Gider</button>
      <button class="type-btn income ${type === 'income' ? 'active' : ''}" data-type="income" onclick="setAddType('income')">Gelir</button>
    </div>

    <form id="addForm" onsubmit="return submitTx(event)">
      <div class="form-group">
        <label class="form-label">Tutar (₺)</label>
        <input class="form-input" type="number" id="txAmount" step="0.01" min="0.01" placeholder="0.00" value="${editData ? htmlEscape(editData.amount) : ''}" required autofocus>
      </div>

      <div class="form-group">
        <label class="form-label">Kategori</label>
        <select class="form-select" id="txCategory" required>
          ${cats.map(c => `<option value="${htmlEscape(c)}" ${editData && editData.category === c ? 'selected' : ''}>${htmlEscape(c)}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Tarih</label>
        <input class="form-input" type="date" id="txDate" value="${editData ? htmlEscape(editData.date) : todayISO()}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Not <span style="color:var(--text3);font-weight:400">(isteğe bağlı)</span></label>
        <textarea class="form-input" id="txNote" placeholder="Ne için?">${editData && editData.note ? htmlEscape(editData.note) : ''}</textarea>
      </div>

      <div style="display:flex;gap:10px;margin-top:8px">
        <button type="submit" class="btn btn-primary">${editData ? 'Güncelle' : 'Ekle'}</button>
        ${editData ? '<button type="button" class="btn btn-outline" onclick="navigate(\'transactions\')">İptal</button>' : ''}
      </div>
    </form>
  `;
}

window.setAddType = function(type) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  const cats = type === 'income' ? DEFAULT_CATEGORIES.income : DEFAULT_CATEGORIES.expense;
  const sel = document.getElementById('txCategory');
  sel.innerHTML = cats.map(c => `<option value="${htmlEscape(c)}">${htmlEscape(c)}</option>`).join('');
};

window.submitTx = async function(e) {
  e.preventDefault();

  const type = document.querySelector('.type-btn.active')?.dataset?.type || 'expense';
  const amount = parseFloat(document.getElementById('txAmount').value);
  const category = document.getElementById('txCategory').value;
  const date = document.getElementById('txDate').value;
  const note = document.getElementById('txNote').value.trim();

  if (!amount || amount <= 0) {
    showToast('Geçerli bir tutar girin');
    return false;
  }
  if (!category) {
    showToast('Kategori seçin');
    return false;
  }
  if (!date) {
    showToast('Tarih seçin');
    return false;
  }

  const tx = {
    id: editId || generateId(),
    type,
    amount,
    category,
    date,
    note,
    createdAt: new Date().toISOString()
  };

  try {
    if (editId) {
      await updateTransaction(tx);
    } else {
      await addTransaction(tx);
    }
    showToast(editId ? 'İşlem güncellendi' : 'İşlem eklendi');
    navigate('transactions');
  } catch (err) {
    showToast('Kaydedilirken hata oluştu');
  }
  return false;
};
