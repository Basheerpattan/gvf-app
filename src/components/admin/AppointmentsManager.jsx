import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Eye, CalendarCheck, Loader2, Check, X } from 'lucide-react'
import { Modal } from '../ui/Modal'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed']
const statusLabels = { pending: 'pending', confirmed: 'Accept', cancelled: 'Reject', completed: 'completed' }

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-slate-100 text-slate-600',
}

const typeColors = {
  inpatient: 'bg-blue-100 text-blue-700',
  outpatient: 'bg-emerald-100 text-emerald-700',
  followup: 'bg-purple-100 text-purple-700',
}

export function AppointmentsManager() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const load = () => {
    supabase.from('appointments').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[AppointmentsManager] load failed:', error)
        setAppointments(data || [])
        setLoading(false)
      })
  }
  useEffect(load, [])

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) {
      console.error('[AppointmentsManager] status update failed:', { id, status, ...error })
      toast.error('Failed to update status')
    } else {
      load()
      setSelected(s => s && s.id === id ? { ...s, status } : s)
    }
    return !error
  }

  const notifyEmail = async (appointment) => {
    if (!appointment.email) {
      toast('No email on file — patient was not notified.', { icon: '⚠️' })
      return
    }
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: appointment.email,
          name: appointment.name,
          appointmentType: appointment.appointment_type,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Email failed')
      toast.success('Confirmation email sent to patient')
    } catch (err) {
      console.error('[AppointmentsManager] send-email failed:', err)
      toast.error('Status updated, but confirmation email could not be sent')
    }
  }

  const handleAccept = async (appointment) => {
    const ok = await updateStatus(appointment.id, 'confirmed')
    if (ok) await notifyEmail(appointment)
  }

  const handleReject = async (appointment) => {
    await updateStatus(appointment.id, 'cancelled')
  }

  const pending = appointments.filter(a => a.status === 'pending').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Appointments</h1>
        <p className="text-slate-500 mt-1">{appointments.length} total requests · {pending} pending</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <CalendarCheck size={40} className="mx-auto mb-4 opacity-30" />
            <p>No appointment requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map(a => (
              <div key={a.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 font-bold text-emerald-700 text-sm">
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-slate-800">{a.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${typeColors[a.appointment_type] || 'bg-slate-100 text-slate-600'}`}>
                      {a.appointment_type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {a.phone}{a.email && ` · ${a.email}`}
                    {a.preferred_date && ` · Preferred: ${new Date(a.preferred_date).toLocaleDateString()}`}
                  </div>
                  {a.notes && <p className="text-sm text-slate-600 mt-1 truncate">{a.notes}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString()}</span>
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => handleAccept(a)} title="Accept" className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-colors shadow-sm">
                        <Check size={16} />
                      </button>
                      <button onClick={() => handleReject(a)} title="Reject" className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors shadow-sm">
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setSelected(a)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-700 transition-colors shadow-sm">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Appointment Details">
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
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Type</div>
                <div className="font-medium text-slate-800 capitalize">{selected.appointment_type}</div>
              </div>
              {selected.email && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Email</div>
                  <div className="font-medium text-slate-800">{selected.email}</div>
                </div>
              )}
              {selected.preferred_date && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Preferred Date</div>
                  <div className="font-medium text-slate-800">{new Date(selected.preferred_date).toLocaleDateString()}</div>
                </div>
              )}
            </div>
            {selected.notes && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Notes</div>
                <div className="text-slate-700 whitespace-pre-wrap">{selected.notes}</div>
              </div>
            )}
            <div className="text-xs text-slate-400">Received: {new Date(selected.created_at).toLocaleString()}</div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Update Status</div>
              <div className="flex gap-2 flex-wrap">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      if (s === 'confirmed') handleAccept(selected)
                      else if (s === 'cancelled') handleReject(selected)
                      else updateStatus(selected.id, s)
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                      selected.status === s ? statusColors[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
