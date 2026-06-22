import { expenseCategories, incomeCategories } from '../data/categories'

interface Props {
  type: 'income' | 'expense'
  selected: string
  onSelect: (id: string) => void
  onClose: () => void
}

export default function CategoryPicker({ type, selected, onSelect, onClose }: Props) {
  const cats = type === 'income' ? incomeCategories : expenseCategories

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 12 }}>Kategori Seç</h3>
        <div className="category-grid">
          {cats.map(c => (
            <button
              key={c.id}
              className={`category-btn ${selected === c.id ? 'selected' : ''}`}
              onClick={() => { onSelect(c.id); onClose() }}
            >
              <span className="icon">{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
