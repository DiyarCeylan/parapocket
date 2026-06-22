const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const CATEGORY_ICONS = {
  'Maaş': '💰', 'Freelance': '💻', 'Yatırım': '📈', 'Kira Geliri': '🏠',
  'Yiyecek': '🍕', 'Ulaşım': '🚗', 'Fatura': '📄', 'Eğlence': '🎮',
  'Sağlık': '💊', 'Alışveriş': '🛍️', 'Eğitim': '📚', 'Diğer': '📌',
  'Diğer Gelir': '📌'
};

export function formatAmount(n) {
  return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrency(n) {
  return `₺${formatAmount(n)}`;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.includes('T') ? '' : 'T00:00:00Z'));
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'Az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${d.getFullYear()}`;
}

export function formatMonth(ym) {
  const [y, m] = ym.split('-');
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

export function getCategoryIcon(cat) {
  return CATEGORY_ICONS[cat] || '📌';
}

export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
