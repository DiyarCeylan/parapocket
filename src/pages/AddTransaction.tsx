import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addTransaction, updateTransaction, getTransactions, checkBudgetAlert } from '../data/storage'
import { generateId, todayISO } from '../utils/format'
import { getCategoryName, getCategoryIcon } from '../data/categories'
import CategoryPicker from '../components/CategoryPicker'
import { useToast } from '../components/Toast'
import type { Transaction } from '../types'

export default function AddTransaction() {
  const navigate = useNavigate()
  const { editId } = useParams()
  const { toast } = useToast()

  const existing = editId ? getTransactions().find(t => t.id === editId) : null

  const [type, setType] = useState<'income' | 'expense'>(existing?.type || 'expense')
  const [category, setCategory] = useState(existing?.category || '')
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '')
  const [date, setDate] = useState(existing?.date || todayISO())
  const [note, setNote] = useState(existing?.note || '')
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [recurring, setRecurring] = useState(!!existing?.recurring)
  const [frequency, setFrequency] = useState(existing?.recurring?.frequency || 'monthly')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(amount.replace(',', '.'))
    if (!category || !amt || amt <= 0) return

    const txn: Transaction = {
      id: existing?.id || generateId(),
      type,
      category,
      amount: amt,
      date,
      note,
      ...(recurring ? { recurring: { frequency, nextDate: date } } : {}),
    }

    if (existing) {
      updateTransaction(txn)
      toast('İşlem güncellendi', 'info')
    } else {
      addTransaction(txn)
      toast('İşlem eklendi', 'info')
      const alert = checkBudgetAlert(txn)
      if (alert) {
        toast(`${getCategoryName(alert.category)} bütçeniz aşıldı!`, 'warning')
      }
    }
    navigate(-1)
  }

  return (
    <div className="page" style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="icon-btn" onClick={() => navigate(-1)}>✕</button>
        <h2 style={{ fontSize: 20 }}>{existing ? 'İşlemi Düzenle' : 'Yeni İşlem'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="toggle-group" style={{ marginBottom: 20 }}>
          <button type="button" className={`toggle-btn ${type === 'expense' ? 'active' : ''}`} onClick={() => { setType('expense'); setCategory('') }}>
            Gider
          </button>
          <button type="button" className={`toggle-btn ${type === 'income' ? 'active' : ''}`} onClick={() => { setType('income'); setCategory('') }}>
            Gelir
          </button>
        </div>

        <div className="form-group">
          <label>Kategori</label>
          <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 14px' }}
            onClick={() => setShowCatPicker(true)}>
            {category ? `${getCategoryIcon(category)} ${getCategoryName(category)}` : 'Kategori seç...'}
          </button>
        </div>

        <div className="form-group">
          <label>Tutar (₺)</label>
          <input type="text" inputMode="decimal" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
        </div>

        <div className="form-group">
          <label>Tarih</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Not (isteğe bağlı)</label>
          <textarea rows={2} placeholder="Not ekle..." value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
            Tekrarlayan işlem
          </label>
        </div>

        {recurring && (
          <div className="form-group">
            <label>Tekrarlama Sıklığı</label>
            <div className="toggle-group">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(f => (
                <button type="button" key={f} className={`toggle-btn ${frequency === f ? 'active' : ''}`} onClick={() => setFrequency(f)}>
                  {f === 'daily' ? 'Günlük' : f === 'weekly' ? 'Haftalık' : f === 'monthly' ? 'Aylık' : 'Yıllık'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 8 }}>
          {existing ? 'Güncelle' : 'Ekle'}
        </button>
      </form>

      {showCatPicker && (
        <CategoryPicker type={type} selected={category} onSelect={setCategory} onClose={() => setShowCatPicker(false)} />
      )}
    </div>
  )
}
