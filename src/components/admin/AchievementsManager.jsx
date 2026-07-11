import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Trophy, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useForm } from 'react-hook-form'

const ICONS = ['Trophy', 'Users', 'Clock', 'Heart', 'Award', 'Star']

export function AchievementsManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileRef = useRef()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    supabase.from('achievements').select('*').order('display_order')
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }
  useEffect(load, [])

  const openAdd = () => {
    setEditing(null)
    setImagePreview(null)
    setImageFile(null)
    reset({ icon: 'Trophy', display_order: items.length })
    setModalOpen(true)
  }
  const openEdit = (item) => {
    setEditing(item)
    setImagePreview(item.image_url || null)
    setImageFile(null)
    reset(item)
    setModalOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setSaving(true)
    let image_url = editing?.image_url || null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `achievements/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('images').upload(path, imageFile)
      if (upErr) { toast.error('Image upload failed'); setSaving(false); return }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
      image_url = publicUrl
    }

    const payload = { ...data, image_url }
    let error
    if (editing) {
      ({ error } = await supabase.from('achievements').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('achievements').insert(payload))
    }
    setSaving(false)
    if (error) { toast.error('Save failed'); return }
    toast.success(editing ? 'Updated!' : 'Added!')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('achievements').delete().eq('id', deleteTarget.id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Achievements Manager</h1>
          <p className="text-slate-500 mt-1">These appear in the public milestones section</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Achievement</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                {item.image_url && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-3xl font-bold text-emerald-600 font-display mb-1">{item.value}</div>
                  <div className="font-semibold text-slate-800">{item.title}</div>
                  <div className="text-slate-400 text-sm mt-1">{item.description}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">Icon: {item.icon} · Order: {item.display_order}</div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400">
              <Trophy size={40} className="mx-auto mb-4 opacity-30" />
              <p className="mb-4">No achievements yet.</p>
              <Button onClick={openAdd}><Plus size={16} /> Add First Achievement</Button>
            </div>
          )}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Achievement' : 'Add Achievement'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Image (optional)</label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-dashed border-slate-300 flex items-center justify-center"
              >
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  : <ImageIcon size={24} className="text-slate-400" />
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-emerald-600 hover:underline">
                {imagePreview ? 'Change image' : 'Upload image'}
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Value <span className="text-red-500">*</span></label>
              <input {...register('value', { required: 'Required' })} placeholder="e.g. 2000+" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon</label>
              <select {...register('icon')} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input {...register('title', { required: 'Required' })} placeholder="e.g. Patients Treated" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <input {...register('description')} placeholder="Short description" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
            <input type="number" {...register('display_order', { valueAsNumber: true })} min={0} className="w-24 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Achievement" size="sm">
        <p className="text-slate-600 mb-6">Delete <strong>{deleteTarget?.title}</strong>?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
