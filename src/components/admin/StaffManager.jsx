import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, User, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useForm } from 'react-hook-form'

const emptyForm = { name: '', designation: '', bio: '', display_order: 0, monthly_salary: 0 }

export function StaffManager() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    supabase.from('staff').select('*').order('display_order')
      .then(({ data }) => { setStaff(data || []); setLoading(false) })
  }
  useEffect(load, [])

  const openAdd = () => {
    setEditing(null)
    setPhotoPreview(null)
    setPhotoFile(null)
    reset(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditing(member)
    setPhotoPreview(member.photo_url || null)
    setPhotoFile(null)
    reset({ name: member.name, designation: member.designation, bio: member.bio || '', display_order: member.display_order || 0, monthly_salary: member.monthly_salary || 0 })
    setModalOpen(true)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2MB'); return }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setSaving(true)
    let photo_url = editing?.photo_url || null

    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `staff/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('images').upload(path, photoFile)
      if (upErr) { toast.error('Photo upload failed'); setSaving(false); return }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
      photo_url = publicUrl
    }

    const payload = { ...data, photo_url }
    let error
    if (editing) {
      ({ error } = await supabase.from('staff').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('staff').insert(payload))
    }

    setSaving(false)
    if (error) { toast.error('Save failed: ' + error.message); return }
    toast.success(editing ? 'Staff member updated!' : 'Staff member added!')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('staff').delete().eq('id', deleteTarget.id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Staff member removed')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Staff Manager</h1>
          <p className="text-slate-500 mt-1">{staff.length} team members</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} /> Add Staff
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-slate-100 h-40 rounded-2xl animate-pulse" />)}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <User size={48} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No staff added yet.</p>
          <Button onClick={openAdd}><Plus size={16} /> Add First Member</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(member => (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-xl bg-emerald-50 overflow-hidden shrink-0">
                {member.photo_url
                  ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-emerald-400" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                <p className="text-emerald-600 text-sm font-medium">{member.designation}</p>
                {member.bio && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{member.bio}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(member)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteTarget(member)} className="p-2 hover:bg-red-50 rounded-xl text-slate-500 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Staff Member' : 'Add Staff Member'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Photo upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-dashed border-slate-300 flex items-center justify-center"
              >
                {photoPreview
                  ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  : <User size={28} className="text-slate-400" />
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-emerald-600 hover:underline">
                {photoPreview ? 'Change photo' : 'Upload photo'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input {...register('name', { required: 'Required' })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
            <input {...register('designation', { required: 'Required' })}
              placeholder="e.g. Senior Counselor, Medical Director"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea {...register('bio')} rows={3} placeholder="Brief biography..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
              <input type="number" {...register('display_order', { valueAsNumber: true })} min={0}
                className="w-24 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Salary (₹)</label>
              <input type="number" {...register('monthly_salary', { valueAsNumber: true })} min={0} step="0.01"
                placeholder="e.g. 25000"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? 'Update Member' : 'Add Member'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Staff Member" size="sm">
        <p className="text-slate-600 mb-6">Remove <strong>{deleteTarget?.name}</strong> from the team?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Remove</Button>
        </div>
      </Modal>
    </div>
  )
}
