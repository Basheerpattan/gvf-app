import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth }                from '../context/AuthContext'
import { PageLoader }             from '../components/ui/Loader'
import { AdminSidebar }           from '../components/admin/AdminSidebar'
import { SiteSettingsManager }    from '../components/admin/SiteSettingsManager'
import { DashboardHome }          from '../components/admin/DashboardHome'
import { GalleryManager }         from '../components/admin/GalleryManager'
import { StaffManager }           from '../components/admin/StaffManager'
import { FormBuilder }            from '../components/admin/FormBuilder'
import { FormSubmissions }        from '../components/admin/FormSubmissions'
import { EnquiriesManager }       from '../components/admin/EnquiriesManager'
import { ReviewsManager }         from '../components/admin/ReviewsManager'
import { AchievementsManager }    from '../components/admin/AchievementsManager'
import { CCTVDashboard }          from '../components/admin/CCTVDashboard'
import { ExternalLink }           from 'lucide-react'
import { Link }                   from 'react-router-dom'

function AdminTopbar() {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <span className="text-sm text-slate-500">Admin Panel</span>
      <Link to="/" target="_blank" className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
        <ExternalLink size={14} />
        View Public Site
      </Link>
    </header>
  )
}

export function AdminDashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (!user)   return <Navigate to="/admin" replace />

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<DashboardHome />} />
            <Route path="settings"     element={<SiteSettingsManager />} />
            <Route path="gallery"      element={<GalleryManager />} />
            <Route path="staff"        element={<StaffManager />} />
            <Route path="form-builder" element={<FormBuilder />} />
            <Route path="submissions"  element={<FormSubmissions />} />
            <Route path="enquiries"    element={<EnquiriesManager />} />
            <Route path="reviews"      element={<ReviewsManager />} />
            <Route path="achievements" element={<AchievementsManager />} />
            <Route path="cctv"         element={<CCTVDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
