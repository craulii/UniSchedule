import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import useAuthStore from './stores/authStore'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SubjectsPage from './pages/SubjectsPage'
import SubjectDetailPage from './pages/SubjectDetailPage'
import SchedulePage from './pages/SchedulePage'
import EvaluationsPage from './pages/EvaluationsPage'
import GradesPage from './pages/GradesPage'
import CalendarPage from './pages/CalendarPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const initialize = useAuthStore(s => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:id" element={<SubjectDetailPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/evaluations" element={<EvaluationsPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  )
}
