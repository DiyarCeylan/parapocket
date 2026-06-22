export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  date: string
  note: string
  recurring?: RecurringConfig
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  nextDate: string
  endDate?: string
}

export interface Budget {
  category: string
  limit: number
  month: string
}

export interface Asset {
  id: string
  name: string
  type: 'bank' | 'cash' | 'investment' | 'crypto'
  amount: number
}

export interface Goal {
  id: string
  name: string
  target: number
  saved: number
  deadline: string
  icon: string
}

export interface CategoryDef {
  id: string
  name: string
  icon: string
  type: 'income' | 'expense'
}

export type ThemeMode = 'dark' | 'light'

export interface AppData {
  transactions: Transaction[]
  budgets: Budget[]
  assets: Asset[]
  goals: Goal[]
  theme: ThemeMode
  userName: string
  initialBalance: number
  onboardingDone: boolean
}
