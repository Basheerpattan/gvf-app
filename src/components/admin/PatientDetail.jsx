import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { ArrowLeft, Loader2, Plus, Trash2, Check, X, Pencil, UserPlus, Mail } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

const STATUSES = ['active', 'discharged', 'relapsed']
const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  discharged: 'bg-slate-100 text-slate-600',
  relapsed: 'bg-red-100 text-red-700',
}
const typeColors = {
  inpatient: 'bg-blue-100 text-blue-700',
  outpatient: 'bg-emerald-100 text-emerald-700',
  followup: 'bg-purple-100 text-purple-700',
}
const NOTE_TYPES = ['progress', 'medical', 'counseling', 'incident', 'discharge']
const noteTypeColors = {
  progress: 'bg-emerald-100 text-emerald-700',
  medical: 'bg-blue-100 text-blue-700',
  counseling: 'bg-purple-100 text-purple-700',
  incident: 'bg-red-100 text-red-700',
  discharge: 'bg-slate-100 text-slate-600',
}
const VISIT_TYPES = ['family_visit', 'checkup', 'counseling_session']
const visitStatusColors = {
  scheduled: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  missed: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500',
}

export function PatientDetail() {
  const { id } = useParams()
  const { role, user } = useAuth()
  const isAdmin = role === 'admin'
  const canEdit = role === 'admin' || role === 'staff'
  const location = useLocation()
  const basePath = location.pathname.startsWith('/staff')
    ? '/staff/patients'
    : location.pathname.startsWith('/guardian')
      ? '/guardian/dashboard'
      : '/admin/dashboard/patients'

  const [patient, setPatient] = useState(null)
  const [notes, setNotes] = useState([])
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(false)

  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('progress')
  const [savingNote, setSavingNote] = useState(false)

  const [visitModalOpen, setVisitModalOpen] = useState(false)
  const [visitDate, setVisitDate] = useState('')
  const [visitType, setVisitType] = useState('family_visit')
  const [savingVisit, setSavingVisit] = useState(false)

  const [guardians, setGuardians] = useState([])
  const [guardianEmail, setGuardianEmail] = useState('')
  const [inviting, setInviting] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      supabase.from('patients').select('*').eq('id', id).maybeSingle(),
      supabase.from('case_notes').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
      supabase.from('patient_visits').select('*').eq('patient_id', id).order('scheduled_date', { ascending: false }),
    ]).then(([p, n, v]) => {
      setPatient(p.data)
      setNotes(n.data || [])
      setVisits(v.data || [])
      setLoading(false)
    })
  }
  useEffect(load, [id])

  const loadGuardians = () => {
    supabase.from('guardian_patients').select('id, guardian_id').eq('patient_id', id)
      .then(async ({ data: links }) => {
        if (!links || links.length === 0) { setGuardians([]); return }
        const { data: profiles } = await supabase.from('profiles').select('id, email').in('id', links.map(l => l.guardian_id))
        setGuardians(links.map(l => ({
          linkId: l.id,
          email: profiles?.find(p => p.id === l.guardian_id)?.email || 'Unknown',
        })))
      })
  }
  useEffect(() => { if (isAdmin) loadGuardians() }, [id, isAdmin])

  const inviteGuardian = async (e) => {
    e.preventDefault()
    if (!guardianEmail.trim()) return
    setInviting(true)
    try {
      const res = await fetch('/api/invite-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guardianEmail.trim(), patientId: id, redirectOrigin: window.location.origin }),
      })
      const raw = await res.text()
      let data
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        throw new Error(`Server returned a non-JSON response (status ${res.status}). If you're running "npm run dev", the /api functions only work when deployed to Vercel (or via "vercel dev") — plain Vite doesn't run them.`)
      }
      if (!res.ok || !data.success) throw new Error(data.error || `Invite failed (status ${res.status})`)
      toast.success('Guardian invited')
      setGuardianEmail('')
      loadGuardians()
    } catch (err) {
      toast.error(err.message)
    }
    setInviting(false)
  }

  const unlinkGuardian = async (linkId) => {
    const { error } = await supabase.from('guardian_patients').delete().eq('id', linkId)
    if (error) { toast.error('Failed to unlink'); return }
    toast.success('Guardian unlinked')
    loadGuardians()
  }

  const updateStatus = async (status) => {
    const payload = { status }
    if (status === 'discharged' && !patient.discharge_date) payload.discharge_date = new Date().toISOString().slice(0, 10)
    const { error } = await supabase.from('patients').update(payload).eq('id', id)
    if (error) { toast.error('Status update failed'); return }
    toast.success('Patient status updated')
    load()
  }

  const handleDeletePatient = async () => {
    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Patient record removed')
    window.location.href = basePath
  }

  const addNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return
    setSavingNote(true)
    const { error } = await supabase.from('case_notes').insert({
      patient_id: id, note: noteText.trim(), note_type: noteType, author_email: user?.email || null,
    })
    setSavingNote(false)
    if (error) { toast.error('Failed to add note'); return }
    setNoteText('')
    toast.success('Note added')
    load()
  }

  const scheduleVisit = async (e) => {
    e.preventDefault()
    if (!visitDate) { toast.error('Pick a date'); return }
    setSavingVisit(true)
    const { error } = await supabase.from('patient_visits').insert({
      patient_id: id, scheduled_date: visitDate, visit_type: visitType,
    })
    setSavingVisit(false)
    if (error) { toast.error('Failed to schedule visit'); return }
    setVisitModalOpen(false)
    setVisitDate('')
    toast.success('Visit scheduled')
    load()
  }

  const updateVisitStatus = async (visitId, status) => {
    const { error } = await supabase.from('patient_visits').update({ status }).eq('id', visitId)
    if (error) { toast.error('Update failed'); return }
    load()
  }

  const deleteVisit = async (visitId) => {
    const { error } = await supabase.from('patient_visits').delete().eq('id', visitId)
    if (error) { toast.error('Delete failed'); return }
    load()
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
  if (!patient) return <div className="text-center py-16 text-slate-400">Patient not found. <Link to={basePath} className="text-emerald-600 hover:underline">Back to list</Link></div>

  return (
    <div>
      <Link to={basePath} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft size={15} /> Back to Patients
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-slate-800 font-display">{patient.full_name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${typeColors[patient.admission_type] || 'bg-slate-100 text-slate-600'}`}>
              {patient.admission_type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${statusColors[patient.status]}`}>
              {patient.status}
            </span>
          </div>
          <p className="text-slate-500 text-sm">Admitted {new Date(patient.admission_date).toLocaleDateString()}</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link to={`${basePath}?edit=${patient.id}`} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              <Pencil size={14} /> Edit
            </Link>
            <button onClick={() => setDeleteTarget(true)} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Update Status</div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  patient.status === s ? statusColors[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Date of Birth" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '—'} />
          <Field label="Gender" value={patient.gender || '—'} />
          <Field label="Phone" value={patient.phone || '—'} />
          <Field label="Email" value={patient.email || '—'} />
          <Field label="Address" value={patient.address || '—'} />
          <Field label="Emergency Contact" value={patient.emergency_contact_name ? `${patient.emergency_contact_name} (${patient.emergency_contact_phone || '—'})` : '—'} />
        </div>
        {patient.treatment_plan && (
          <div className="mt-4 bg-slate-50 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Treatment Plan</div>
            <p className="text-slate-700 whitespace-pre-wrap text-sm">{patient.treatment_plan}</p>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-slate-800 mb-4">Guardians</h2>
          <form onSubmit={inviteGuardian} className="flex gap-2 mb-4 flex-wrap">
            <input
              type="email" required value={guardianEmail} onChange={e => setGuardianEmail(e.target.value)}
              placeholder="family.member@email.com"
              className="flex-1 min-w-[200px] px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button type="submit" size="sm" disabled={inviting}>
              {inviting ? <><Loader2 size={14} className="animate-spin" /> Inviting...</> : <><UserPlus size={14} /> Invite Guardian</>}
            </Button>
          </form>
          {guardians.length === 0 ? (
            <p className="text-slate-400 text-sm">No guardians linked yet.</p>
          ) : (
            <div className="space-y-2">
              {guardians.map(g => (
                <div key={g.linkId} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-slate-700 flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {g.email}</span>
                  <button onClick={() => unlinkGuardian(g.linkId)} className="text-xs text-red-500 hover:text-red-700 font-medium">Unlink</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Case Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4">Case Notes</h2>
          {canEdit && (
            <form onSubmit={addNote} className="mb-5 space-y-2">
              <div className="flex gap-2 flex-wrap">
                {NOTE_TYPES.map(t => (
                  <button type="button" key={t} onClick={() => setNoteType(t)}
                    className={`text-xs px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${noteType === t ? noteTypeColors[t] + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder="Add a progress note..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              <Button type="submit" size="sm" disabled={savingNote}>
                {savingNote ? <><Loader2 size={14} className="animate-spin" /> Adding...</> : <><Plus size={14} /> Add Note</>}
              </Button>
            </form>
          )}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No notes yet.</p>
            ) : notes.map(n => (
              <div key={n.id} className="bg-slate-50 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                  <span className={`text-[11px] px-2 py-0.5 rounded-lg capitalize font-medium ${noteTypeColors[n.note_type]}`}>{n.note_type}</span>
                  <span className="text-[11px] text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{n.note}</p>
                {n.author_email && <p className="text-[11px] text-slate-400 mt-1.5">— {n.author_email}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Visiting Schedule */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Visiting Schedule</h2>
            {canEdit && <Button size="sm" onClick={() => setVisitModalOpen(true)}><Plus size={14} /> Schedule</Button>}
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {visits.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No visits scheduled.</p>
            ) : visits.map(v => (
              <div key={v.id} className="bg-slate-50 rounded-xl p-3.5 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-medium text-slate-800">{new Date(v.scheduled_date).toLocaleDateString()}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-200 text-slate-600 capitalize">{v.visit_type.replace('_', ' ')}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-lg capitalize ${visitStatusColors[v.status]}`}>{v.status}</span>
                    {v.reminder_sent && (
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-sky-100 text-sky-700">Reminder sent</span>
                    )}
                  </div>
                  {v.notes && <p className="text-xs text-slate-500">{v.notes}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  {canEdit && v.status === 'scheduled' && (
                    <button onClick={() => updateVisitStatus(v.id, 'completed')} title="Mark completed" className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600">
                      <Check size={14} />
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      {v.status === 'scheduled' && (
                        <button onClick={() => updateVisitStatus(v.id, 'cancelled')} title="Cancel" className="p-1.5 hover:bg-amber-50 rounded-lg text-amber-600">
                          <X size={14} />
                        </button>
                      )}
                      <button onClick={() => deleteVisit(v.id)} title="Delete" className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={visitModalOpen} onClose={() => setVisitModalOpen(false)} title="Schedule Visit" size="sm">
        <form onSubmit={scheduleVisit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Visit Type</label>
            <select value={visitType} onChange={e => setVisitType(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {VISIT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={savingVisit} className="flex-1">
              {savingVisit ? <><Loader2 size={14} className="animate-spin" /> Scheduling...</> : 'Schedule Visit'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setVisitModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(false)} title="Remove Patient Record" size="sm">
        <p className="text-slate-600 mb-6">Permanently remove <strong>{patient.full_name}</strong>'s record, including all case notes and visits?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeletePatient}>Remove</Button>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="text-xs font-semibold text-slate-400 uppercase mb-1">{label}</div>
      <div className="font-medium text-slate-800 text-sm">{value}</div>
    </div>
  )
}
