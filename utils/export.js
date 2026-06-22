import { formatCurrency, formatDate } from './format.js';
import { generateId } from './sanitize.js';

export function exportCSV(transactions) {
  const rows = [['Tarih', 'Tür', 'Kategori', 'Tutar', 'Not']];
  for (const t of transactions) {
    rows.push([t.date, t.type === 'income' ? 'Gelir' : 'Gider', t.category, t.amount, t.note || '']);
  }
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const BOM = '\uFEFF';
  download(`${BOM}${csv}`, 'parapocket_verileri.csv', 'text/csv;charset=utf-8');
}

export function exportJSON(transactions) {
  const data = JSON.stringify(transactions, null, 2);
  download(data, 'parapocket_verileri.json', 'application/json');
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

export function importJSON(text) {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('Dizi bekleniyor');
    for (const item of data) {
      if (!['income', 'expense'].includes(item.type)) throw new Error('Geçersiz işlem türü');
      if (typeof item.amount !== 'number' || item.amount <= 0) throw new Error('Geçersiz tutar');
      if (typeof item.category !== 'string' || !item.category.trim()) throw new Error('Geçersiz kategori');
      item.id = generateId();
    }
    return data;
  } catch (e) {
    throw new Error(`Geçersiz dosya: ${e.message}`);
  }
}
