import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getTransactions, getMonthBalance, getTotalBalance, getBudgetAlerts } from '../data/storage'
import { formatCurrency, formatMonth } from '../utils/format'
import { getCategoryName, getCategoryIcon } from '../data/categories'
import EmptyState from '../components/EmptyState'

const COLORS = ['#2DD4BF', '#059669', '#d97706', '#e11d48', '#8b5cf6', '#f59e0b', '#06b6d4', '#84cc16', '#ec4899', '#14b8a6', '#f97316']

export default function Dashboard() {
  const navigate = useNavigate()
  const txns = getTransactions()
  const today = new Date()
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

  const totalBalance = getTotalBalance()
  const monthData = getMonthBalance(currentMonthStr)

  const last6Months = useMemo(() => {
    const months: { name: string; gelir: number; gider: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const bal = getMonthBalance(m)
      months.push({ name: formatMonth(m).split(' ')[0].slice(0, 3), gelir: bal.income, gider: bal.expense })
    }
    return months
  }, [txns.length])

  const categoryData = useMemo(() => {
    const map = new Map<string, number>()
    txns.filter(t => t.type === 'expense' && t.date.startsWith(currentMonthStr)).forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount)
    })
    return Array.from(map.entries())
      .map(([k, v]) => ({ name: getCategoryName(k), icon: getCategoryIcon(k), value: v }))
      .sort((a, b) => b.value - a.value)
  }, [txns.length])

  const recentTxns = txns.slice(0, 5)

  const budgetsOverLimit = getBudgetAlerts(currentMonthStr)

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Net Değer
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, color: totalBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formatCurrency(totalBalance)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="stat-card">
          <div className="label">Gelir</div>
          <div className="value positive">{formatCurrency(monthData.income)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Gider</div>
          <div className="value negative">{formatCurrency(monthData.expense)}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15 }}>Aylık Dağılım (Son 6 Ay)</h3>
        {last6Months.some(m => m.gelir > 0 || m.gider > 0) ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last6Months}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                formatter={(value: unknown) => formatCurrency(Number(value))}
              />
              <Bar dataKey="gelir" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gider" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon="📊" title="Henüz veri yok" desc="İşlem ekledikçe grafikler görünecek" />
        )}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12, fontSize: 15 }}>Bu Ay Kategori Dağılımı (Giderler)</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: unknown) => formatCurrency(Number(value))} />
              <Legend
                formatter={(value: string) => <span style={{ color: 'var(--text)', fontSize: 12 }}>{value}</span>}
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon="🥧" title="Bu ay gider yok" desc="Gider ekledikçe grafik dolacak" />
        )}
      </div>

      {budgetsOverLimit.length > 0 && (
        <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid var(--danger)' }}>
          <h3 style={{ marginBottom: 8, fontSize: 14, color: 'var(--danger)' }}>🚨 Bütçe Aşımları</h3>
          {budgetsOverLimit.map(b => (
            <div key={b.category} style={{ fontSize: 13, marginBottom: 4 }}>
              {getCategoryIcon(b.category)} {getCategoryName(b.category)}: limit {formatCurrency(b.limit)} → {formatCurrency(b.total)}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15 }}>Son İşlemler</h3>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => navigate('/transactions')}>
            Tümü
          </button>
        </div>
        {recentTxns.length > 0 ? (
          recentTxns.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="txn-icon" style={{ background: t.type === 'income' ? 'rgba(5,150,105,0.15)' : 'rgba(225,29,72,0.15)' }}>
                {getCategoryIcon(t.category)}
              </div>
              <div className="txn-info">
                <div className="txn-category">{getCategoryName(t.category)}</div>
                {t.note && <div className="txn-note">{t.note}</div>}
              </div>
              <div className={`txn-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="💸" title="Henüz işlem yok" desc="Sağ alttaki + butonuyla ekleyebilirsin" />
        )}
      </div>
    </div>
  )
}
