import { useParams, useNavigate, Link } from 'react-router-dom'
import { PatientsManager } from '../components/admin/PatientsManager'
import { PatientDetail } from '../components/admin/PatientDetail'
import { useAuth } from '../context/AuthContext'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { LogOut, Leaf, FileText, UserRound } from 'lucide-react'

export function PatientsPage() {
  const { id } = useParams()
  const { signOut, user } = useAuth()
  const { settings } = useSiteSettings()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Leaf size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-800 text-sm sm:text-base">
                {settings.navbar_org_name}
              </span>
              <span className="hidden sm:inline text-[11px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Staff Portal
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <Link to="/staff/forms" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors">
              <FileText size={14} /> <span className="hidden sm:inline">Intake Forms</span>
            </Link>
            <Link to="/staff/patients" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl transition-colors">
              <UserRound size={14} /> <span className="hidden sm:inline">Patients</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <span className="hidden md:block text-xs text-slate-400 truncate max-w-[180px]">
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors border border-slate-200 hover:border-red-200"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {id ? <PatientDetail /> : <PatientsManager />}
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-100 bg-white mt-auto">
        © {new Date().getFullYear()} {settings.footer_org_name} · Staff Portal · All records are confidential
      </footer>
    </div>
  )
}
