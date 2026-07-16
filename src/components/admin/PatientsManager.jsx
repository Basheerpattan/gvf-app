import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, UserRound, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useForm } from 'react-hook-form'

const emptyForm = {
  full_name: '', date_of_birth: '', gender: '', phone: '', email: '', address: '',
  admission_type: 'inpatient', admission_date: new Date().toISOString().slice(0, 10),
  treatment_plan: '', emergency_contact_name: '', emergency_contact_phone: '',
}

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

export function PatientsManager() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const location = useLocation()
  const basePath = location.pathname.startsWith('/staff')
    ? '/staff/patients'
    : location.pathname.startsWith('/guardian')
      ? '/guardian/dashboard'
      : '/admin/dashboard/patients'
  const [searchParams, setSearchParams] = useSearchParams()

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [openAppointments, setOpenAppointments] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: emptyForm })

  const load = () => {
    supabase.from('patients').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[PatientsManager] load failed:', error)
        setPatients(data || [])
        setLoading(false)
      })
  }
  useEffect(load, [])

  useEffect(() => {
    if (role !== 'admin') return
    supabase.from('appointments').select('*').in('status', ['pending', 'confirmed']).order('created_at', { ascending: false })
      .then(({ data }) => setOpenAppointments(data || []))
  }, [role])

  const openAdd = () => {
    setEditing(null)
    reset(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (patient) => {
    setEditing(patient)
    reset({
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      admission_type: patient.admission_type,
      admission_date: patient.admission_date,
      treatment_plan: patient.treatment_plan || '',
      emergency_contact_name: patient.emergency_contact_name || '',
      emergency_contact_phone: patient.emergency_contact_phone || '',
    })
    setModalOpen(true)
  }

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (!editId || !isAdmin) return
    const target = patients.find(p => p.id === editId)
    if (target) {
      openEdit(target)
      setSearchParams({}, { replace: true })
    }
  }, [patients, searchParams, isAdmin])

  const applyAppointment = (appointmentId) => {
    const appt = openAppointments.find(a => a.id === appointmentId)
    if (!appt) return
    setValue('full_name', appt.name)
    setValue('phone', appt.phone)
    setValue('email', appt.email || '')
    setValue('admission_type', appt.appointment_type)
  }

  const onSubmit = async (data, appointmentId) => {
    setSaving(true)
    const payload = { ...data, appointment_id: appointmentId || editing?.appointment_id || null }
    let error
    if (editing) {
      ({ error } = await supabase.from('patients').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('patients').insert(payload))
    }
    setSaving(false)
    if (error) { toast.error('Save failed: ' + error.message); return }
    toast.success(editing ? 'Patient updated!' : 'Patient added!')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('patients').delete().eq('id', deleteTarget.id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Patient record removed')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Patients</h1>
          <p className="text-slate-500 mt-1">{patients.length} patient records</p>
        </div>
        {isAdmin && (
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Patient
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <UserRound size={40} className="mx-auto mb-4 opacity-30" />
            <p>No patient records yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {patients.map(p => (
              <div key={p.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 font-bold text-emerald-700 text-sm">
                  {p.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-slate-800">{p.full_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${typeColors[p.admission_type] || 'bg-slate-100 text-slate-600'}`}>
                      {p.admission_type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg capitalize ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {p.phone}{p.email && ` · ${p.email}`} · Admitted: {new Date(p.admission_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isAdmin && (
                    <>
                      <button onClick={() => openEdit(p)} title="Edit" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} title="Delete" className="p-2 hover:bg-red-50 rounded-xl text-slate-500 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  <Link to={`${basePath}/${p.id}`} title="View" className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-700 transition-colors shadow-sm">
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Patient' : 'Add Patient'} size="lg">
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
          {!editing && openAppointments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Link an Appointment (optional)</label>
              <select
                onChange={(e) => applyAppointment(e.target.value)}
                defaultValue=""
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">— None —</option>
                {openAppointments.map(a => (
                  <option key={a.id} value={a.id}>{a.name} · {a.phone} · {a.appointment_type}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input {...register('full_name', { required: 'Required' })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
              <input type="date" {...register('date_of_birth')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select {...register('gender')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">—</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input {...register('phone')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" {...register('email')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input {...register('address')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Admission Type</label>
              <select {...register('admission_type')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="inpatient">Inpatient</option>
                <option value="outpatient">Outpatient</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Admission Date</label>
              <input type="date" {...register('admission_date', { required: 'Required' })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Emergency Contact Name</label>
              <input {...register('emergency_contact_name')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Emergency Contact Phone</label>
              <input {...register('emergency_contact_phone')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Treatment Plan</label>
              <textarea {...register('treatment_plan')} rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? 'Update Patient' : 'Add Patient'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Patient Record" size="sm">
        <p className="text-slate-600 mb-6">Permanently remove <strong>{deleteTarget?.full_name}</strong>'s record, including all case notes and visits?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Remove</Button>
        </div>
      </Modal>
    </div>
  )
}
