import { Routes, Route } from 'react-router-dom'
import { HomePage }           from './pages/HomePage'
import { FormsPage }          from './pages/FormsPage'
import { AdminLoginPage }     from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<HomePage />} />
      <Route path="/forms"   element={<FormsPage />} />
      <Route path="/admin"   element={<AdminLoginPage />} />
      <Route path="/admin/*" element={<AdminDashboardPage />} />
    </Routes>
  )
}
