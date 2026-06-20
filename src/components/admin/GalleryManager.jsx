import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Upload, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export function GalleryManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const load = () => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setImages(data || []); setLoading(false) })
  }
  useEffect(load, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setPreview({ file, url: URL.createObjectURL(file) })
  }

  const handleUpload = async () => {
    if (!preview?.file) { toast.error('Please select an image'); return }
    setUploading(true)
    const ext = preview.file.name.split('.').pop()
    const path = `gallery/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('images').upload(path, preview.file)
    if (upErr) { toast.error('Upload failed: ' + upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    const { error: dbErr } = await supabase.from('gallery').insert({ url: publicUrl, caption })
    if (dbErr) { toast.error('Failed to save image record'); setUploading(false); return }
    toast.success('Image uploaded!')
    setPreview(null)
    setCaption('')
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const urlParts = deleteTarget.url.split('/images/')
    if (urlParts[1]) {
      await supabase.storage.from('images').remove([urlParts[1]])
    }
    const { error } = await supabase.from('gallery').delete().eq('id', deleteTarget.id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Image deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Gallery Manager</h1>
          <p className="text-slate-500 mt-1">{images.length} images in gallery</p>
        </div>
      </div>

      {/* Upload card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <h2 className="font-semibold text-slate-800 mb-4">Upload New Image</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full sm:w-48 h-36 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
          >
            {preview ? (
              <img src={preview.url} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <>
                <Upload size={24} className="text-slate-400 group-hover:text-emerald-500 mb-2 transition-colors" />
                <span className="text-sm text-slate-400 group-hover:text-emerald-600">Click to upload</span>
                <span className="text-xs text-slate-300">PNG, JPG up to 5MB</span>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <div className="flex-1 space-y-3">
            <input
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={uploading || !preview} className="flex items-center gap-2">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {preview && (
                <Button variant="ghost" onClick={() => { setPreview(null); setCaption(''); if (fileRef.current) fileRef.current.value = '' }}>
                  <X size={16} /> Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p>No images yet. Upload your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-md bg-slate-100">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setDeleteTarget(img)}
                  className="bg-red-600 text-white p-2.5 rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Image" size="sm">
        <p className="text-slate-600 mb-6">Are you sure you want to delete this image? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Image</Button>
        </div>
      </Modal>
    </div>
  )
}
