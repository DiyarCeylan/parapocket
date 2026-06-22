import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getTheme, setTheme } from '../data/storage'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'Ana Sayfa', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/transactions', label: 'İşlemler', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { path: '/budgets', label: 'Bütçe', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { path: '/assets', label: 'Varlıklar', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/report', label: 'Rapor', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { path: '/goals', label: 'Hedefler', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [theme, setThemeState] = useState(getTheme())

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setThemeState(next)
    setTheme(next)
  }

  const pageTitles: Record<string, string> = {
    '/': 'ParaPocket',
    '/transactions': 'İşlemler',
    '/budgets': 'Bütçeler',
    '/assets': 'Varlıklar',
    '/report': 'Rapor',
    '/goals': 'Hedefler',
  }

  return (
    <>
      <div className="header">
        <h1>{pageTitles[location.pathname] || 'ParaPocket'}</h1>
        <div className="header-right">
          <button className="icon-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      <Outlet />
      <div className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <button className="fab" onClick={() => navigate('/add')}>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </>
  )
}
