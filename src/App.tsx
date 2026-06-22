import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Budgets from './pages/Budgets'
import Assets from './pages/Assets'
import Report from './pages/Report'
import Goals from './pages/Goals'
import Onboarding from './pages/Onboarding'
import { getTheme, applyTheme, isOnboardingDone, processRecurring } from './data/storage'
import { useToast } from './components/Toast'

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    applyTheme(getTheme())
  }, [])

  useEffect(() => {
    if (!isOnboardingDone() && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    const added = processRecurring()
    if (added > 0) {
      toast(`Bu ay ${added} tekrarlanan işlem otomatik eklendi`, 'info')
    }
  }, [])

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/report" element={<Report />} />
        <Route path="/goals" element={<Goals />} />
      </Route>
      <Route path="/add" element={<AddTransaction />} />
      <Route path="/add/:editId" element={<AddTransaction />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
