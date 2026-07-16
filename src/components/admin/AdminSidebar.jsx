import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Image, Users, FileText, MessageSquare, Mail,
  Video, Trophy, LogOut, Leaf, ChevronLeft, ChevronRight, Settings, Phone, CalendarCheck, IndianRupee, UserRound
} from 'lucide-react'

const navGroups = [
  { label: 'Overview', items: [{ to: '/admin/dashboard/dashboard', icon: LayoutDashboard, label: 'Dashboard' }] },
  {
    label: 'Content',
    items: [
      { to: '/admin/dashboard/settings', icon: Settings, label: 'Site Settings' },
      { to: '/admin/dashboard/contact', icon: Phone, label: 'Contact Details' },
      { to: '/admin/dashboard/gallery', icon: Image, label: 'Gallery' },
      { to: '/admin/dashboard/staff', icon: Users, label: 'Staff' },
      { to: '/admin/dashboard/patients', icon: UserRound, label: 'Patients' },
      { to: '/admin/dashboard/attendance', icon: IndianRupee, label: 'Attendance & Salary' },
      { to: '/admin/dashboard/achievements', icon: Trophy, label: 'Achievements' },
    ],
  },
  {
    label: 'Forms & Enquiries',
    items: [
      { to: '/admin/dashboard/form-builder', icon: FileText, label: 'Form Builder' },
      { to: '/admin/dashboard/submissions', icon: FileText, label: 'Submissions' },
      { to: '/admin/dashboard/enquiries', icon: Mail, label: 'Enquiries' },
      { to: '/admin/dashboard/appointments', icon: CalendarCheck, label: 'Appointments' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/admin/dashboard/reviews', icon: MessageSquare, label: 'Reviews' },
      { to: '/admin/dashboard/cctv', icon: Video, label: 'CCTV Monitor' },
    ],
  },
]

export function AdminSidebar({ isMobileOpen, setIsMobileOpen, collapsed, setCollapsed }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 bg-slate-900 flex flex-col transition-all duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
        <Leaf size={24} className="text-emerald-500" />
        {!collapsed && <span className="text-white font-bold">Green Valley</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-slate-400 lg:block hidden">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label} className="mb-2">
            {!collapsed && <p className="px-4 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">{group.label}</p>}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Icon size={17} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="shrink-0 px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}