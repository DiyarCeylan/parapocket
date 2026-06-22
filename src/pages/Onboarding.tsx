import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setInitialBalance, setUserName, setOnboardingDone, setBudgets, getBudgets } from '../data/storage'
import { currentMonth } from '../utils/format'
import { expenseCategories } from '../data/categories'

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [quickBudgets, setQuickBudgets] = useState<{ cat: string; limit: string }[]>(
    expenseCategories.slice(0, 4).map(c => ({ cat: c.id, limit: '' }))
  )

  const finish = () => {
    if (name) setUserName(name)
    if (balance) setInitialBalance(parseFloat(balance))
    const validBudgets = quickBudgets
      .filter(b => b.limit && parseFloat(b.limit) > 0)
      .map(b => ({ category: b.cat, limit: parseFloat(b.limit), month: currentMonth() }))
    if (validBudgets.length > 0) {
      setBudgets([...getBudgets(), ...validBudgets])
    }
    setOnboardingDone()
    navigate('/', { replace: true })
  }

  const steps = [
    {
      title: 'ParaPocket\'a Hoş Geldin!',
      desc: 'Finansını kontrol altına almanın en kolay yolu. Tüm verilerin cihazında kalır, kimseyle paylaşılmaz.',
      content: (
        <div className="form-group">
          <label>Adın (isteğe bağlı)</label>
          <input placeholder="Adını gir..." value={name} onChange={e => setName(e.target.value)} />
        </div>
      ),
    },
    {
      title: 'Başlangıç Bakiyen',
      desc: 'Mevcut hesabında ne kadar para var? Bu, net değer takibinin başlangıç noktası olacak.',
      content: (
        <div className="form-group">
          <label>Bakiye (₺)</label>
          <input type="number" placeholder="0" value={balance} onChange={e => setBalance(e.target.value)} autoFocus />
        </div>
      ),
    },
    {
      title: 'Hızlı Bütçe Oluştur',
      desc: 'En sık harcama yaptığın kategoriler için aylık limit belirle. Dilersen sonra ayarlardan değiştirebilirsin.',
      content: (
        <div>
          {quickBudgets.map((b, i) => {
            const cat = expenseCategories.find(c => c.id === b.cat)
            return (
              <div key={b.cat} className="form-group" style={{ marginBottom: 10 }}>
                <label>{cat?.icon} {cat?.name} — Aylık Limit (₺)</label>
                <input type="number" placeholder="Limit gir..." value={b.limit}
                  onChange={e => {
                    const newB = [...quickBudgets]
                    newB[i] = { ...newB[i], limit: e.target.value }
                    setQuickBudgets(newB)
                  }} />
              </div>
            )
          })}
        </div>
      ),
    },
  ]

  const s = steps[step]

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      padding: 40,
      maxWidth: 400,
      margin: '0 auto',
      justifyContent: 'center',
    }}>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Adım {step + 1} / {steps.length}
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14, lineHeight: 1.5 }}>{s.desc}</p>

        <div style={{ animation: 'slideUp 0.3s ease' }}>
          {s.content}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
          {step < steps.length - 1 ? (
            <>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={finish}>Atla</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(step + 1)}>Devam</button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={finish}>Başla</button>
          )}
        </div>
      </div>
    </div>
  )
}
