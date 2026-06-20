import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Eye, Mail, Loader2, CheckCircle } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

export function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = () => {
    supabase.from('enquiries').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setEnquiries(data || []); setLoading(false) })
  }
  useEffect(load, [])

  const markRead = async (id) => {
    const { error } = await supabase.from('enquiries').update({ read: true }).eq('id', id)
    if (!error) { load(); toast.success('Marked as read') }
  }

  const typeColors = {
    inpatient: 'bg-blue-100 text-blue-700',
    outpatient: 'bg-emerald-100 text-emerald-700',
    followup: 'bg-purple-100 text-purple-700',
    general: 'bg-slate-100 text-slate-600',
  }

  const unread = enquiries.filter(e => !e.read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Enquiries</h1>
        <p className="text-slate-500 mt-1">{enquiries.length} total enquiries · {unread} unread</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Mail size={40} className="mx-auto mb-4 opacity-30" />
            <p>No enquiries received yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {enquiries.map(e => (
              <div key={e.id} className={`p-5 hover:bg-slate-50 transition-colors flex items-start gap-4 ${!e.read ? 'bg-emerald-50/30' : ''}`}>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 font-bold text-emerald-700 text-sm">
                  {e.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-800">{e.name}</span>
                    {!e.read && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
                    <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${typeColors[e.enquiry_type] || typeColors.general}`}>
                      {e.enquiry_type || 'General'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">{e.phone} {e.email && `· ${e.email}`}</div>
                  <p className="text-sm text-slate-600 mt-1 truncate">{e.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{new Date(e.created_at).toLocaleDateString()}</span>
                  <button onClick={() => setSelected(e)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-700 transition-colors shadow-sm">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Enquiry Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Name</div>
                <div className="font-medium text-slate-800">{selected.name}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Phone</div>
                <div className="font-medium text-slate-800">{selected.phone}</div>
              </div>
              {selected.email && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Email</div>
                  <div className="font-medium text-slate-800">{selected.email}</div>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Type</div>
                <div className="font-medium text-slate-800 capitalize">{selected.enquiry_type || 'General'}</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Message</div>
              <div className="text-slate-700 whitespace-pre-wrap">{selected.message}</div>
            </div>
            <div className="text-xs text-slate-400">Received: {new Date(selected.created_at).toLocaleString()}</div>
            {!selected.read && (
              <Button onClick={() => { markRead(selected.id); setSelected({ ...selected, read: true }) }} variant="ghost" size="sm">
                <CheckCircle size={14} /> Mark as Read
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
