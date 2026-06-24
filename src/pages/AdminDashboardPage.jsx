import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/ui/Loader'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { DashboardHome } from '../components/admin/DashboardHome'
import { SiteSettingsManager } from '../components/admin/SiteSettingsManager'
import { ContactSettings } from '../components/admin/ContactSettings'
import { GalleryManager } from '../components/admin/GalleryManager'
import { StaffManager } from '../components/admin/StaffManager'
import { FormBuilder } from '../components/admin/FormBuilder'
import { FormSubmissions } from '../components/admin/FormSubmissions'
import { EnquiriesManager } from '../components/admin/EnquiriesManager'
import { ReviewsManager } from '../components/admin/ReviewsManager'
import { AchievementsManager } from '../components/admin/AchievementsManager'
import { CCTVDashboard } from '../components/admin/CCTVDashboard'
import { Menu, X, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AdminDashboardPage() {
  const { user, loading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/admin" replace />

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile backdrop — closes sidebar when clicking outside */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header raised to z-50 so hamburger is always above the sidebar */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-sm">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="text-sm font-medium text-slate-500 lg:block hidden">Admin Panel</span>
          <span className="text-sm font-medium text-slate-500 lg:hidden">Green Valley Admin</span>
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            <ExternalLink size={14} /> View Site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="settings" element={<SiteSettingsManager />} />
            <Route path="contact" element={<ContactSettings />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="staff" element={<StaffManager />} />
            <Route path="form-builder" element={<FormBuilder />} />
            <Route path="submissions" element={<FormSubmissions />} />
            <Route path="enquiries" element={<EnquiriesManager />} />
            <Route path="reviews" element={<ReviewsManager />} />
            <Route path="achievements" element={<AchievementsManager />} />
            <Route path="cctv" element={<CCTVDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}