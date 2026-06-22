import { renderDashboard } from './views/dashboard.js';
import { renderTransactions } from './views/transactions.js';
import { renderAdd } from './views/add.js';
import { renderBudgets } from './views/budgets.js';
import { renderSettings } from './views/settings.js';

let currentView = 'dashboard';

window.navigate = async function(view, data = null) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.view === view)
  );

  switch (view) {
    case 'dashboard': await renderDashboard(); break;
    case 'transactions': await renderTransactions(); break;
    case 'add': renderAdd(data); break;
    case 'budgets': await renderBudgets(); break;
    case 'settings': await renderSettings(); break;
  }

  window.scrollTo(0, 0);
};

window.showToast = function(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
};

async function init() {
  const savedTheme = localStorage.getItem('pp-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (e) { console.warn('SW registration failed:', e); }
  }

  navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
