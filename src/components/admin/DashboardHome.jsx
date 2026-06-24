import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Image, Users, Mail, MessageSquare, FileText, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardHome() {
  const [stats, setStats] = useState({ gallery: 0, staff: 0, enquiries: 0, reviews: 0, submissions: 0 })
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [g, s, e, r, sub] = await Promise.all([
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('staff').select('id', { count: 'exact', head: true }),
        supabase.from('enquiries').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        gallery: g.count || 0,
        staff: s.count || 0,
        enquiries: e.count || 0,
        reviews: r.count || 0,
        submissions: sub.count || 0,
      })
      const { data: recent } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(5)
      setRecentEnquiries(recent || [])
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Gallery Images',     value: stats.gallery,     icon: Image,          color: 'bg-blue-50 text-blue-700',       link: '/admin/dashboard/gallery' },
    { label: 'Staff Members',      value: stats.staff,       icon: Users,          color: 'bg-emerald-50 text-emerald-700', link: '/admin/dashboard/staff' },
    { label: 'Enquiries',          value: stats.enquiries,   icon: Mail,           color: 'bg-amber-50 text-amber-700',     link: '/admin/dashboard/enquiries' },
    { label: 'Reviews',            value: stats.reviews,     icon: MessageSquare,  color: 'bg-purple-50 text-purple-700',   link: '/admin/dashboard/reviews' },
    { label: 'Form Submissions',   value: stats.submissions, icon: FileText,       color: 'bg-rose-50 text-rose-700',       link: '/admin/dashboard/submissions' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin. Here's an overview of your site.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-slate-800 font-display">{loading ? '—' : value}</div>
            <div className="text-slate-500 text-sm mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            Recent Enquiries
          </h2>
          <Link to="/admin/dashboard/enquiries" className="text-sm text-emerald-600 hover:underline">View all</Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No enquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-3 font-semibold text-slate-600">Name</th>
                  <th className="pb-3 font-semibold text-slate-600">Phone</th>
                  <th className="pb-3 font-semibold text-slate-600">Type</th>
                  <th className="pb-3 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map(e => (
                  <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-800">{e.name}</td>
                    <td className="py-3 text-slate-600">{e.phone}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs capitalize">
                        {e.enquiry_type || 'General'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(e.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
