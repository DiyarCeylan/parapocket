import { useState } from 'react'
import { getBudgets, setBudgets, getMonthTransactions, getMonthBalance } from '../data/storage'
import { formatCurrency, currentMonth } from '../utils/format'
import { expenseCategories, getCategoryIcon, getCategoryName } from '../data/categories'
import EmptyState from '../components/EmptyState'
import type { Budget } from '../types'

export default function Budgets() {
  const month = currentMonth()
  const [budgets, setLocal] = useState<Budget[]>(getBudgets())
  const [showAdd, setShowAdd] = useState(false)
  const [editCat, setEditCat] = useState('')
  const [editLimit, setEditLimit] = useState('')
  const [, update] = useState(0)

  const currentBudgets = budgets.filter(b => b.month === month)
  const monthData = getMonthBalance(month)

  const save = (newBudgets: Budget[]) => {
    setBudgets(newBudgets)
    setLocal(newBudgets)
    update(n => n + 1)
  }

  const handleAdd = () => {
    if (!editCat || !editLimit) return
    const existing = budgets.findIndex(b => b.category === editCat && b.month === month)
    let newBudgets = [...budgets]
    if (existing !== -1) {
      newBudgets[existing] = { ...newBudgets[existing], limit: parseFloat(editLimit) }
    } else {
      newBudgets.push({ category: editCat, limit: parseFloat(editLimit), month })
    }
    save(newBudgets)
    setShowAdd(false)
    setEditCat('')
    setEditLimit('')
  }

  const handleDelete = (cat: string) => {
    save(budgets.filter(b => !(b.category === cat && b.month === month)))
  }

  const getSpent = (cat: string) => {
    const txns = getMonthTransactions(month).filter(t => t.type === 'expense' && t.category === cat)
    return txns.reduce((s, t) => s + t.amount, 0)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Bütçeler</h2>
        <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setShowAdd(true)}>+ Ekle</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="stat-card">
          <div className="label">Toplam Bütçe</div>
          <div className="value" style={{ fontSize: 18, color: 'var(--accent)' }}>
            {formatCurrency(currentBudgets.reduce((s, b) => s + b.limit, 0))}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Harcanan</div>
          <div className="value negative" style={{ fontSize: 18 }}>{formatCurrency(monthData.expense)}</div>
        </div>
      </div>

      {currentBudgets.length > 0 ? (
        currentBudgets.map(b => {
          const spent = getSpent(b.category)
          const pct = Math.min((spent / b.limit) * 100, 100)
          const isWarning = pct >= 75 && pct < 100
          const isOver = pct >= 100

          return (
            <div key={b.category} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{getCategoryIcon(b.category)}</span>
                  <span style={{ fontWeight: 600 }}>{getCategoryName(b.category)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isWarning && <span style={{ fontSize: 12, color: 'var(--warning)' }}>⚠️ Dikkat</span>}
                  {isOver && <span style={{ fontSize: 12, color: 'var(--danger)' }}>🚨 Aşıldı</span>}
                  <button className="icon-btn" style={{ fontSize: 14 }} onClick={() => handleDelete(b.category)}>✕</button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(spent)} harcandı</span>
                <span>{formatCurrency(b.limit)} limit</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)',
                }} />
              </div>
            </div>
          )
        })
      ) : (
        <EmptyState icon="🎯" title="Henüz bütçe yok" desc="Kategori bazlı bütçe eklemek için + Ekle butonunu kullan" />
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Bütçe Ekle</h3>
            <div className="form-group">
              <label>Kategori</label>
              <select value={editCat} onChange={e => setEditCat(e.target.value)}>
                <option value="">Seç...</option>
                {expenseCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Aylık Limit (₺)</label>
              <input type="number" placeholder="0" value={editLimit} onChange={e => setEditLimit(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAdd}>Kaydet</button>
          </div>
        </div>
      )}
    </div>
  )
}
