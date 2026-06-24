import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DynamicForm } from '../components/public/DynamicForm'
import { useAuth } from '../context/AuthContext'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { FileText, LogOut, Leaf, ClipboardList, Users, RefreshCw } from 'lucide-react'

const FORMS = [
  {
    key: 'inpatient',
    label: 'Inpatient Admission',
    desc: 'For patients seeking residential treatment and detoxification.',
    icon: Users,
    color: 'border-blue-500 bg-blue-50 text-blue-900',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'outpatient',
    label: 'Outpatient Enrollment',
    desc: 'For patients attending sessions while living at home.',
    icon: ClipboardList,
    color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'followup',
    label: 'Follow-up Assessment',
    desc: 'For patients who have completed treatment and are in recovery.',
    icon: RefreshCw,
    color: 'border-purple-500 bg-purple-50 text-purple-900',
    badge: 'bg-purple-100 text-purple-700',
  },
]

export function FormsPage() {
  const [activeForm, setActiveForm] = useState('inpatient')
  const [formKey, setFormKey] = useState(0)
  const { signOut, user } = useAuth()
  const { settings } = useSiteSettings()
  const navigate = useNavigate()

  const form = FORMS.find(f => f.key === activeForm)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const switchForm = (key) => {
    setActiveForm(key)
    setFormKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Staff Portal Header ── */}
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

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* Page title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FileText size={26} className="text-emerald-700" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 mb-2">
            Patient Forms
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Select a form type below, fill in the patient details, and submit.
            All information is kept strictly confidential.
          </p>
        </div>

        {/* Form type selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {FORMS.map(f => {
            const Icon = f.icon
            const isActive = activeForm === f.key
            return (
              <button
                key={f.key}
                onClick={() => switchForm(f.key)}
                className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                  isActive
                    ? f.color + ' shadow-md'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isActive ? f.badge : 'bg-slate-100'}`}>
                  <Icon size={18} className={isActive ? '' : 'text-slate-500'} />
                </div>
                <div>
                  <div className="font-bold text-sm mb-0.5">{f.label}</div>
                  <div className={`text-xs leading-relaxed ${isActive ? 'opacity-70' : 'text-slate-400'}`}>
                    {f.desc}
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current opacity-60" />
                )}
              </button>
            )
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Form header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${form.badge}`}>
              <form.icon size={16} />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-800">{form.label}</h2>
              <p className="text-slate-400 text-xs">{form.desc}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* key prop forces DynamicForm to re-mount (reset) when switching form types */}
            <DynamicForm key={`${activeForm}-${formKey}`} formType={activeForm} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-100 bg-white mt-auto">
        © {new Date().getFullYear()} {settings.footer_org_name} · Staff Portal · All records are confidential
      </footer>
    </div>
  )
}
