import { useMemo, useState } from 'react'
import { getTransactions, getMonthBalance } from '../data/storage'
import { formatCurrency, formatMonth } from '../utils/format'
import { getCategoryName, getCategoryIcon } from '../data/categories'
import EmptyState from '../components/EmptyState'

export default function Report() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const prevMonth = month === 0 ? `${year - 1}-12` : `${year}-${String(month).padStart(2, '0')}`

  const current = getMonthBalance(monthStr)
  const previous = getMonthBalance(prevMonth)

  const topCategories = useMemo(() => {
    const txns = getTransactions().filter(t => t.type === 'expense' && t.date.startsWith(monthStr))
    const map = new Map<string, number>()
    txns.forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount))
    return Array.from(map.entries())
      .map(([k, v]) => ({ category: k, amount: v }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
  }, [monthStr])

  const savings = current.income - current.expense

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dailyAvg = current.expense / daysInMonth

  const compareExpense = previous.expense > 0
    ? ((current.expense - previous.expense) / previous.expense * 100)
    : 0

  const navigateMonth = (dir: number) => {
    const newMonth = month + dir
    if (newMonth < 0) { setYear(year - 1); setMonth(11) }
    else if (newMonth > 11) { setYear(year + 1); setMonth(0) }
    else setMonth(newMonth)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="icon-btn" onClick={() => navigateMonth(-1)}>◀</button>
        <h2 style={{ fontSize: 18 }}>{formatMonth(monthStr)}</h2>
        <button className="icon-btn" onClick={() => navigateMonth(1)}>▶</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div className="stat-card">
          <div className="label">Gelir</div>
          <div className="value positive" style={{ fontSize: 16 }}>{formatCurrency(current.income)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Gider</div>
          <div className="value negative" style={{ fontSize: 16 }}>{formatCurrency(current.expense)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Tasarruf</div>
          <div className="value" style={{ fontSize: 16, color: savings >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatCurrency(savings)}
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 10 }}>En Çok Harcanan 3 Kategori</h3>
          {topCategories.map((c, i) => {
            const pct = current.expense > 0 ? (c.amount / current.expense * 100) : 0
            return (
              <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)', width: 20 }}>{i + 1}.</span>
                <span>{getCategoryIcon(c.category)}</span>
                <span style={{ flex: 1 }}>{getCategoryName(c.category)}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(c.amount)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>%{pct.toFixed(0)}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, marginBottom: 10 }}>Günlük Ortalama</h3>
        <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, color: 'var(--danger)' }}>
          {formatCurrency(dailyAvg)}
        </div>
      </div>

      {previous.income > 0 || previous.expense > 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Geçen Aya Göre Karşılaştırma</h3>
          <div style={{ fontSize: 16 }}>
            {compareExpense < 0 ? (
              <span style={{ color: 'var(--success)' }}>
                🎉 Geçen aya göre %{Math.abs(compareExpense).toFixed(0)} daha az harcadın
              </span>
            ) : compareExpense > 0 ? (
              <span style={{ color: 'var(--danger)' }}>
                ⚠️ Geçen aya göre %{compareExpense.toFixed(0)} daha fazla harcadın
              </span>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>
                Geçen ay ile aynı seviyedesin
              </span>
            )}
          </div>
        </div>
      ) : (
        <EmptyState icon="📊" title="Karşılaştırma için henüz veri yok" desc="Geçen aydan veri olunca burada göreceksin" />
      )}
    </div>
  )
}
