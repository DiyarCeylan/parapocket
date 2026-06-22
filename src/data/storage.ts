import type { Transaction, Budget, Asset, Goal, ThemeMode, AppData } from '../types'

const STORAGE_KEY = 'parapocket_data'
const ONBOARDING_KEY = 'parapocket_onboarding'

function getData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { transactions: [], budgets: [], assets: [], goals: [], theme: 'dark', userName: '', initialBalance: 0, onboardingDone: false }
  return JSON.parse(raw)
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getTransactions(): Transaction[] {
  return getData().transactions
}

export function addTransaction(t: Transaction) {
  const data = getData()
  data.transactions.unshift(t)
  saveData(data)
  checkBudgetAlert(t)
}

export function updateTransaction(t: Transaction) {
  const data = getData()
  const idx = data.transactions.findIndex(x => x.id === t.id)
  if (idx !== -1) data.transactions[idx] = t
  saveData(data)
}

export function deleteTransaction(id: string) {
  const data = getData()
  data.transactions = data.transactions.filter(x => x.id !== id)
  saveData(data)
}

export function getBudgets(): Budget[] {
  return getData().budgets
}

export function setBudgets(budgets: Budget[]) {
  const data = getData()
  data.budgets = budgets
  saveData(data)
}

export function getAssets(): Asset[] {
  return getData().assets
}

export function setAssets(assets: Asset[]) {
  const data = getData()
  data.assets = assets
  saveData(data)
}

export function getGoals(): Goal[] {
  return getData().goals
}

export function setGoals(goals: Goal[]) {
  const data = getData()
  data.goals = goals
  saveData(data)
}

export function getTheme(): ThemeMode {
  return getData().theme || 'dark'
}

export function setTheme(t: ThemeMode) {
  const data = getData()
  data.theme = t
  saveData(data)
  applyTheme(t)
}

export function applyTheme(t: ThemeMode) {
  document.documentElement.setAttribute('data-theme', t)
}

export function getUserName(): string {
  return getData().userName
}

export function setUserName(n: string) {
  const data = getData()
  data.userName = n
  saveData(data)
}

export function getInitialBalance(): number {
  return getData().initialBalance
}

export function setInitialBalance(b: number) {
  const data = getData()
  data.initialBalance = b
  saveData(data)
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export function setOnboardingDone() {
  localStorage.setItem(ONBOARDING_KEY, 'true')
}

export function getMonthTransactions(month: string): Transaction[] {
  return getTransactions().filter(t => t.date.startsWith(month))
}

export function getMonthBalance(month: string): { income: number; expense: number } {
  const txns = getMonthTransactions(month)
  return {
    income: txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expense: txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
  }
}

export function getTotalBalance(): number {
  const data = getData()
  const txns = data.transactions
  const fromTxns = txns.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)
  const fromAssets = data.assets.reduce((s, a) => s + a.amount, 0)
  return data.initialBalance + fromTxns + fromAssets
}

export function getAllData(): AppData {
  return getData()
}

export function importData(data: AppData) {
  saveData(data)
}

export function checkBudgetAlert(t: Transaction) {
  if (t.type !== 'expense') return null
  const month = t.date.slice(0, 7)
  const budgets = getBudgets()
  const budget = budgets.find(b => b.category === t.category && b.month === month)
  if (!budget) return null
  const monthTxns = getMonthTransactions(month).filter(x => x.category === t.category)
  const total = monthTxns.reduce((s, x) => s + x.amount, 0)
  if (total > budget.limit) return { category: t.category, total, limit: budget.limit }
  return null
}

export function getBudgetAlerts(month: string): { category: string; total: number; limit: number }[] {
  const budgets = getBudgets().filter(b => b.month === month)
  const txns = getMonthTransactions(month).filter(t => t.type === 'expense')
  const result: { category: string; total: number; limit: number }[] = []
  for (const b of budgets) {
    const total = txns.filter(t => t.category === b.category).reduce((s, t) => s + t.amount, 0)
    if (total > b.limit) result.push({ category: b.category, total, limit: b.limit })
  }
  return result
}

export function processRecurring(): number {
  const data = getData()
  let added = 0
  const today = new Date()
  data.transactions = data.transactions.map(t => {
    if (!t.recurring) return t
    const next = new Date(t.recurring.nextDate + 'T00:00:00Z')
    if (next <= today) {
      const newTxn: Transaction = {
        ...t,
        id: generateId(),
        date: todayISO(),
        note: (t.note ? t.note + ' (otomatik) ' : '(otomatik) ').trim(),
      }
      data.transactions.unshift(newTxn)
      added++
      const nextDate = calcNextDate(t.recurring.nextDate, t.recurring.frequency)
      t.recurring.nextDate = nextDate
    }
    return t
  })
  if (added > 0) saveData(data)
  return added
}

function calcNextDate(from: string, freq: string): string {
  const d = new Date(from + 'T00:00:00Z')
  switch (freq) {
    case 'daily': d.setDate(d.getDate() + 1); break
    case 'weekly': d.setDate(d.getDate() + 7); break
    case 'monthly': d.setMonth(d.getMonth() + 1); break
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break
  }
  return d.toISOString().slice(0, 10)
}

function generateId(): string {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
