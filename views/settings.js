import { clearAllData, getAllTransactions, bulkImport } from '../db.js';
import { exportCSV, exportJSON, importJSON } from '../utils/export.js';

export async function renderSettings() {
  const all = await getAllTransactions();
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  document.getElementById('view').innerHTML = `
    <div class="list-header">
      <h3>Ayarlar</h3>
    </div>

    <div class="settings-group">
      <div class="settings-item">
        <div>
          <div class="settings-label">Karanlık Tema</div>
          <div class="settings-desc">Gece modu</div>
        </div>
        <div class="toggle ${isDark ? 'on' : ''}" id="themeToggle" onclick="toggleTheme()"></div>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-label">Toplam İşlem</div>
          <div class="settings-desc">${all.length} kayıt</div>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-item">
        <div>
          <div class="settings-label">CSV Dışa Aktar</div>
          <div class="settings-desc">Excel ile açılabilir</div>
        </div>
        <button class="btn-outline btn-sm" onclick="exportData('csv')">İndir</button>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-label">JSON Dışa Aktar</div>
          <div class="settings-desc">Tüm veri yedekleme</div>
        </div>
        <button class="btn-outline btn-sm" onclick="exportData('json')">İndir</button>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-label">JSON İçe Aktar</div>
          <div class="settings-desc">Yedekten geri yükle</div>
        </div>
        <button class="btn-outline btn-sm" onclick="importData()">Yükle</button>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-item">
        <div>
          <div class="settings-label" style="color:var(--rose)">Tüm Verileri Sil</div>
          <div class="settings-desc">Bu işlem geri alınamaz</div>
        </div>
        <button class="btn-outline btn-sm" style="border-color:var(--rose);color:var(--rose)" onclick="clearData()">Sil</button>
      </div>
    </div>

    <div class="app-footer">ParaPocket v1.0 · Tüm veriler cihazında saklanır</div>
  `;
}

window.toggleTheme = function() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const theme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pp-theme', theme);
  document.getElementById('themeToggle')?.classList.toggle('on', theme !== 'light');
};

window.exportData = async function(format) {
  const all = await getAllTransactions();
  if (all.length === 0) { showToast('Dışa aktarılacak veri yok'); return; }

  if (format === 'csv') exportCSV(all);
  else exportJSON(all);
  showToast('Dosya indiriliyor');
};

window.clearData = async function() {
  if (!confirm('Tüm veriler silinecek! Emin misin?')) return;
  if (!confirm('Bu işlem geri alınamaz. Devam edilsin mi?')) return;
  await clearAllData();
  showToast('Tüm veriler silindi');
  navigate('dashboard');
};

window.importData = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = importJSON(text);
      await bulkImport(data);
      showToast(`${data.length} işlem içe aktarıldı`);
      navigate('dashboard');
    } catch (err) {
      showToast(err.message);
    }
  };
  input.click();
};
