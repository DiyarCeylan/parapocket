import type { CategoryDef } from '../types'

export const expenseCategories: CategoryDef[] = [
  { id: 'food', name: 'Yiyecek', icon: '🍔', type: 'expense' },
  { id: 'transport', name: 'Ulaşım', icon: '🚌', type: 'expense' },
  { id: 'rent', name: 'Kira', icon: '🏠', type: 'expense' },
  { id: 'health', name: 'Sağlık', icon: '💊', type: 'expense' },
  { id: 'entertainment', name: 'Eğlence', icon: '🎮', type: 'expense' },
  { id: 'clothing', name: 'Giyim', icon: '👕', type: 'expense' },
  { id: 'education', name: 'Eğitim', icon: '📚', type: 'expense' },
  { id: 'bills', name: 'Faturalar', icon: '💡', type: 'expense' },
  { id: 'groceries', name: 'Market', icon: '🛒', type: 'expense' },
  { id: 'travel', name: 'Seyahat', icon: '✈️', type: 'expense' },
  { id: 'other-expense', name: 'Diğer', icon: '➕', type: 'expense' },
]

export const incomeCategories: CategoryDef[] = [
  { id: 'salary', name: 'Maaş', icon: '💼', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💰', type: 'income' },
  { id: 'investment', name: 'Yatırım', icon: '📈', type: 'income' },
  { id: 'gift', name: 'Hediye', icon: '🎁', type: 'income' },
  { id: 'other-income', name: 'Diğer', icon: '➕', type: 'income' },
]

export function getCategory(id: string): CategoryDef | undefined {
  return [...expenseCategories, ...incomeCategories].find(c => c.id === id)
}

export function getCategoryName(id: string): string {
  return getCategory(id)?.name ?? id
}

export function getCategoryIcon(id: string): string {
  return getCategory(id)?.icon ?? '📌'
}
