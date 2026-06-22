import { useState } from 'react'
import { getAssets, setAssets, getTotalBalance } from '../data/storage'
import { formatCurrency, generateId } from '../utils/format'
import EmptyState from '../components/EmptyState'
import { useToast } from '../components/Toast'
import type { Asset } from '../types'

const assetTypes = [
  { id: 'bank', label: 'Banka', icon: '🏦' },
  { id: 'cash', label: 'Nakit', icon: '💵' },
  { id: 'investment', label: 'Yatırım', icon: '📈' },
  { id: 'crypto', label: 'Kripto', icon: '₿' },
] as const

export default function Assets() {
  const [assets, setLocal] = useState<Asset[]>(getAssets())
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<Asset['type']>('bank')
  const [amount, setAmount] = useState('')
  const { toast } = useToast()
  const [, update] = useState(0)

  const netWorth = getTotalBalance()

  const save = (newAssets: Asset[]) => {
    setAssets(newAssets)
    setLocal(newAssets)
    update(n => n + 1)
    toast('Varlık kaydedildi', 'info')
  }

  const handleAdd = () => {
    if (!name || !amount) return
    const newAssets = [...assets, { id: generateId(), name, type, amount: parseFloat(amount) }]
    save(newAssets)
    setShowAdd(false)
    setName('')
    setAmount('')
  }

  const handleDelete = (id: string) => {
    save(assets.filter(a => a.id !== id))
  }

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Net Değer
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, color: netWorth >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {formatCurrency(netWorth)}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Varlıklar</h2>
        <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setShowAdd(true)}>+ Ekle</button>
      </div>

      {assets.length > 0 ? (
        assets.map(a => {
          const t = assetTypes.find(at => at.id === a.type)
          return (
            <div key={a.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{t?.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t?.label}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(a.amount)}</span>
                  <button className="icon-btn" style={{ fontSize: 14 }} onClick={() => handleDelete(a.id)}>✕</button>
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <EmptyState icon="🏦" title="Henüz varlık eklenmemiş" desc="Bankadaki para, nakit, yatırım veya kripto varlıklarını ekle" />
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Varlık Ekle</h3>
            <div className="form-group">
              <label>Ad</label>
              <input placeholder="Örn: Ziraat Vadesiz" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tür</label>
              <div className="radio-group">
                {assetTypes.map(t => (
                  <label key={t.id} className="radio-item">
                    <input type="radio" name="assetType" checked={type === t.id} onChange={() => setType(t.id)} />
                    <span>{t.icon} {t.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Tutar (₺)</label>
              <input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAdd}>Ekle</button>
          </div>
        </div>
      )}
    </div>
  )
}
