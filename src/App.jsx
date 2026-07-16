import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { FormsPage } from './pages/FormsPage'
import { PatientsPage } from './pages/PatientsPage'
import { GuardianLoginPage } from './pages/GuardianLoginPage'
import { GuardianDashboardPage } from './pages/GuardianDashboardPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/admin/dashboard/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/staff/forms" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <FormsPage />
        </ProtectedRoute>
      } />
      <Route path="/staff/patients" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <PatientsPage />
        </ProtectedRoute>
      } />
      <Route path="/staff/patients/:id" element={
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
          <PatientsPage />
        </ProtectedRoute>
      } />
      <Route path="/guardian" element={<GuardianLoginPage />} />
      <Route path="/guardian/dashboard" element={
        <ProtectedRoute allowedRoles={['guardian']} loginPath="/guardian">
          <GuardianDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/guardian/dashboard/:id" element={
        <ProtectedRoute allowedRoles={['guardian']} loginPath="/guardian">
          <GuardianDashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}