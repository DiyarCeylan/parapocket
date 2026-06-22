const DB_NAME = 'parapocket';
const DB_VER = 1;

export const DEFAULT_CATEGORIES = {
  income: ['Maaş', 'Freelance', 'Yatırım', 'Kira Geliri', 'Diğer'],
  expense: ['Yiyecek', 'Ulaşım', 'Fatura', 'Eğlence', 'Sağlık', 'Alışveriş', 'Eğitim', 'Diğer']
};

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('budgets')) {
        const store = db.createObjectStore('budgets', { keyPath: 'id' });
        store.createIndex('month', 'month', { unique: false });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function withDB(mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('transactions', mode);
    const store = tx.objectStore('transactions');
    const result = callback(store, tx);
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = e => { db.close(); reject(e.target.error); };
  });
}

async function withBudgetDB(mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('budgets', mode);
    const store = tx.objectStore('budgets');
    const result = callback(store, tx);
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = e => { db.close(); reject(e.target.error); };
  });
}

export async function addTransaction(txData) {
  return withDB('readwrite', (store, tx) => {
    store.add(txData);
    return tx;
  });
}

export async function getAllTransactions() {
  return withDB('readonly', store => {
    const cursor = store.index('date').openCursor(null, 'prev');
    const items = [];
    return new Promise((resolve, reject) => {
      cursor.onsuccess = e => {
        const c = e.target.result;
        if (c) { items.push(c.value); c.continue(); }
        else resolve(items);
      };
      cursor.onerror = e => reject(e.target.error);
    });
  });
}

export async function deleteTransaction(id) {
  return withDB('readwrite', store => {
    store.delete(id);
  });
}

export async function updateTransaction(txData) {
  return withDB('readwrite', store => {
    store.put(txData);
  });
}

export async function getMonthlyTransactions(year, month) {
  const pad = String(month).padStart(2, '0');
  const start = `${year}-${pad}-01`;
  const endNum = new Date(year, month, 0).getDate();
  const end = `${year}-${pad}-${String(endNum).padStart(2, '0')}`;

  return withDB('readonly', store => {
    const range = IDBKeyRange.bound(start, end);
    const cursor = store.index('date').openCursor(range, 'prev');
    const items = [];
    return new Promise((resolve, reject) => {
      cursor.onsuccess = e => {
        const c = e.target.result;
        if (c) { items.push(c.value); c.continue(); }
        else resolve(items);
      };
      cursor.onerror = e => reject(e.target.error);
    });
  });
}

export async function getBudgets() {
  return withBudgetDB('readonly', store => {
    const cursor = store.openCursor();
    const items = [];
    return new Promise((resolve, reject) => {
      cursor.onsuccess = e => {
        const c = e.target.result;
        if (c) { items.push(c.value); c.continue(); }
        else resolve(items);
      };
      cursor.onerror = e => reject(e.target.error);
    });
  });
}

export async function setBudget(budget) {
  return withBudgetDB('readwrite', store => {
    store.put(budget);
  });
}

export async function deleteBudget(id) {
  return withBudgetDB('readwrite', store => {
    store.delete(id);
  });
}

export async function clearAllData() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['transactions', 'budgets'], 'readwrite');
    tx.objectStore('transactions').clear();
    tx.objectStore('budgets').clear();
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = e => { db.close(); reject(e.target.error); };
  });
}

export async function bulkImport(items) {
  return withDB('readwrite', store => {
    for (const item of items) {
      store.put(item);
    }
  });
}
