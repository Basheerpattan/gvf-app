import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { CheckCircle, Trash2, MessageSquare, Loader2 } from 'lucide-react'
import { StarRating } from '../ui/StarRating'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export function ReviewsManager() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => {
    supabase.from('reviews').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false) })
  }
  useEffect(load, [])

  const approve = async (id) => {
    const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', id)
    if (error) { toast.error('Failed to approve'); return }
    toast.success('Review approved!')
    load()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('reviews').delete().eq('id', deleteTarget.id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Review deleted')
    setDeleteTarget(null)
    load()
  }

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.approved === (filter === 'approved'))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Reviews Manager</h1>
        <p className="text-slate-500 mt-1">{reviews.filter(r => !r.approved).length} pending approval</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'approved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f} {f === 'all' ? `(${reviews.length})` : f === 'pending' ? `(${reviews.filter(r => !r.approved).length})` : `(${reviews.filter(r => r.approved).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
          <p>No reviews here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <div key={review.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!review.approved ? 'border-amber-200' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{review.name}</div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    {!review.approved && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg">Pending</span>
                    )}
                    {review.approved && (
                      <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg">Published</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">"{review.review}"</p>
                  <p className="text-slate-400 text-xs mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!review.approved && (
                    <button onClick={() => approve(review.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors">
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(review)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Review" size="sm">
        <p className="text-slate-600 mb-6">Delete this review by <strong>{deleteTarget?.name}</strong>?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
