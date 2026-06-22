import { useState } from 'react'
import { getGoals, setGoals } from '../data/storage'
import { formatCurrency, generateId } from '../utils/format'
import EmptyState from '../components/EmptyState'
import { useToast } from '../components/Toast'
import type { Goal } from '../types'

const goalIcons = ['🏠', '🚗', '✈️', '🎓', '💻', '🏋️', '🎮', '💍', '🏡', '🚀']

export default function Goals() {
  const [goals, setLocal] = useState<Goal[]>(getGoals())
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [icon, setIcon] = useState(goalIcons[0])
  const [showContribute, setShowContribute] = useState<string | null>(null)
  const [contributeAmt, setContributeAmt] = useState('')
  const { toast } = useToast()
  const [, update] = useState(0)

  const save = (newGoals: Goal[]) => {
    setGoals(newGoals)
    setLocal(newGoals)
    update(n => n + 1)
  }

  const handleAdd = () => {
    if (!name || !target) return
    const newGoals = [...goals, { id: generateId(), name, target: parseFloat(target), saved: 0, deadline, icon }]
    save(newGoals)
    toast('Hedef eklendi', 'info')
    setShowAdd(false)
    setName('')
    setTarget('')
    setDeadline('')
  }

  const handleContribute = (id: string) => {
    const amt = parseFloat(contributeAmt)
    if (!amt || amt <= 0) return
    save(goals.map(g => g.id === id ? { ...g, saved: g.saved + amt } : g))
    toast('Hedefe para eklendi', 'info')
    setShowContribute(null)
    setContributeAmt('')
  }

  const handleDelete = (id: string) => {
    save(goals.filter(g => g.id !== id))
  }

  const estimateCompletion = (g: Goal): string => {
    if (g.saved <= 0 || g.target <= g.saved) return 'Hedefe ulaşıldı!'
    return `${((g.saved / g.target) * 100).toFixed(0)}% tamamlandı`
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Hedefler</h2>
        <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setShowAdd(true)}>+ Ekle</button>
      </div>

      {goals.length > 0 ? (
        goals.map(g => {
          const pct = g.target > 0 ? Math.min((g.saved / g.target) * 100, 100) : 0
          const remaining = g.target - g.saved
          return (
            <div key={g.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{g.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {formatCurrency(g.saved)} / {formatCurrency(g.target)}
                    </div>
                  </div>
                </div>
                <button className="icon-btn" style={{ fontSize: 14 }} onClick={() => handleDelete(g.id)}>✕</button>
              </div>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? 'var(--success)' : 'var(--accent)',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13 }}>
                <span style={{ color: 'var(--accent)' }}>{estimateCompletion(g)}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(remaining)} kaldı</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 10, padding: '8px' }}
                onClick={() => setShowContribute(g.id)}>
                Bu Hedefe Para Ekle
              </button>
            </div>
          )
        })
      ) : (
        <EmptyState icon="🎯" title="Henüz hedef yok" desc="Birikim hedefleri belirle ve ilerlemeyi takip et" />
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Yeni Hedef</h3>
            <div className="form-group">
              <label>Hedef Adı</label>
              <input placeholder="Örn: Araba" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hedef Tutar (₺)</label>
              <input type="number" placeholder="0" value={target} onChange={e => setTarget(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hedef Tarihi</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
            <div className="form-group">
              <label>İkon</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {goalIcons.map(ico => (
                  <button key={ico} className={`category-btn ${icon === ico ? 'selected' : ''}`}
                    onClick={() => setIcon(ico)} style={{ padding: '8px', fontSize: 20 }}>
                    {ico}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAdd}>Oluştur</button>
          </div>
        </div>
      )}

      {showContribute && (
        <div className="modal-overlay" onClick={() => setShowContribute(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Hedefe Para Ekle</h3>
            <div className="form-group">
              <label>Tutar (₺)</label>
              <input type="number" placeholder="0" value={contributeAmt} onChange={e => setContributeAmt(e.target.value)} autoFocus />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleContribute(showContribute)}>Ekle</button>
          </div>
        </div>
      )}
    </div>
  )
}
