import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTransactions, deleteTransaction } from '../data/storage'
import { formatCurrency, formatDate } from '../utils/format'
import { getCategoryName, getCategoryIcon } from '../data/categories'
import { exportCSV, exportJSON } from '../utils/export'
import EmptyState from '../components/EmptyState'

export default function Transactions() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [showExport, setShowExport] = useState(false)
  const [exportPeriod, setExportPeriod] = useState<'all' | 'month' | 'year'>('all')
  const [, update] = useState(0)

  let txns = getTransactions()

  if (filter !== 'all') txns = txns.filter(t => t.type === filter)
  if (search) {
    const q = search.toLowerCase()
    txns = txns.filter(t =>
      getCategoryName(t.category).toLowerCase().includes(q) ||
      (t.note || '').toLowerCase().includes(q)
    )
  }

  const handleExport = () => {
    let data = getTransactions()
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    if (exportPeriod === 'month') data = data.filter(t => t.date.startsWith(`${year}-${month}`))
    else if (exportPeriod === 'year') data = data.filter(t => t.date.startsWith(`${year}`))
    exportCSV(data)
    exportJSON(data)
    setShowExport(false)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--card)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-ghost" style={{ padding: '10px' }} onClick={() => setShowExport(!showExport)}>
          ⬇
        </button>
      </div>

      <div className="toggle-group" style={{ marginBottom: 16 }}>
        {(['all', 'expense', 'income'] as const).map(f => (
          <button key={f} className={`toggle-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Tümü' : f === 'expense' ? 'Gider' : 'Gelir'}
          </button>
        ))}
      </div>

      {showExport && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 12, fontSize: 14 }}>Dışa Aktar</h3>
          <div className="toggle-group" style={{ marginBottom: 12 }}>
            {(['all', 'month', 'year'] as const).map(p => (
              <button key={p} className={`toggle-btn ${exportPeriod === p ? 'active' : ''}`} onClick={() => setExportPeriod(p)}>
                {p === 'all' ? 'Tümü' : p === 'month' ? 'Bu Ay' : 'Bu Yıl'}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleExport}>
            ⬇ CSV + JSON İndir
          </button>
        </div>
      )}

      <div className="card">
        {txns.length > 0 ? (
          txns.map(t => (
            <div key={t.id} className="transaction-item" style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/add/${t.id}`)}>
              <div className="txn-icon" style={{ background: t.type === 'income' ? 'rgba(5,150,105,0.15)' : 'rgba(225,29,72,0.15)' }}>
                {getCategoryIcon(t.category)}
              </div>
              <div className="txn-info">
                <div className="txn-category">{getCategoryName(t.category)}</div>
                {t.note && <div className="txn-note">{t.note}</div>}
                <div className="txn-date">{formatDate(t.date)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`txn-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
                <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 11, marginTop: 4 }}
                  onClick={e => { e.stopPropagation(); if (confirm('Silmek istediğine emin misin?')) { deleteTransaction(t.id); update(n => n + 1) } }}>
                  Sil
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="📋" title="İşlem bulunamadı" desc={search ? 'Aramanla eşleşen işlem yok' : 'Henüz hiç işlem eklenmemiş'} />
        )}
      </div>
    </div>
  )
}
