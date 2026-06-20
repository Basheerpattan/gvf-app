import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Image, Users, FileText, MessageSquare, Mail,
  Video, Trophy, LogOut, Leaf, ChevronLeft, ChevronRight, Settings
} from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/settings',      icon: Settings,        label: 'Site Settings' },
  { to: '/admin/gallery',       icon: Image,           label: 'Gallery' },
  { to: '/admin/staff',         icon: Users,           label: 'Staff' },
  { to: '/admin/form-builder',  icon: FileText,        label: 'Form Builder' },
  { to: '/admin/submissions',   icon: FileText,        label: 'Submissions' },
  { to: '/admin/enquiries',     icon: Mail,            label: 'Enquiries' },
  { to: '/admin/reviews',       icon: MessageSquare,   label: 'Reviews' },
  { to: '/admin/achievements',  icon: Trophy,          label: 'Achievements' },
  { to: '/admin/cctv',          icon: Video,           label: 'CCTV Monitor' },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/admin')
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900 min-h-screen flex flex-col transition-all duration-300 shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
        <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <Leaf size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm font-display leading-tight">Green Valley</div>
            <div className="text-emerald-400 text-xs">Admin Panel</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/20 transition-all text-sm font-medium"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
