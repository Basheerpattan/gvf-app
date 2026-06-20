import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { StarRating } from '../ui/StarRating'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MessageSquare, Send } from 'lucide-react'

const fallbackReviews = [
  { id: 1, name: 'Rajesh Kumar', rating: 5, review: 'Green Valley Foundation gave my son a second chance at life. The staff are incredibly caring and the program is very structured. We are forever grateful.' },
  { id: 2, name: 'Priya Sharma', rating: 5, review: 'My husband completed the inpatient program 2 years ago and has been sober ever since. The counselors here are world-class. Highly recommended.' },
  { id: 3, name: 'Anand Reddy',  rating: 5, review: 'The holistic approach — combining medical treatment with yoga and counseling — made all the difference. A truly life-changing place.' },
]

export function Reviews() {
  const { settings } = useSiteSettings()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false) })
  }, [])

  const onSubmit = async (data) => {
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert({ ...data, rating, approved: false })
    setSubmitting(false)
    if (error) { toast.error('Failed to submit. Please try again.'); return }
    toast.success('Thank you! Your review will appear after approval.')
    setSubmitted(true)
    reset()
    setRating(5)
  }

  const displayReviews = reviews.length ? reviews : fallbackReviews

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-4">
            {settings.reviews_badge}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mb-4">
            {settings.reviews_title}
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">{settings.reviews_desc}</p>
        </div>

        {/* Reviews grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayReviews.map((r, i) => (
            <div key={r.id || i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 text-sm">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{r.name}</div>
                  <StarRating rating={r.rating} size={14} />
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">"{r.review}"</p>
            </div>
          ))}
        </div>

        {/* Leave a review */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} className="text-emerald-700" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-800">{settings.reviews_form_title}</h3>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-emerald-600" />
              </div>
              <p className="text-slate-700 font-semibold mb-2">Thank you for your review!</p>
              <p className="text-slate-500 text-sm">It will appear here once approved by our team.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                <StarRating rating={rating} interactive onChange={setRating} size={28} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                <textarea
                  {...register('review', { required: 'Review is required', minLength: { value: 20, message: 'At least 20 characters' } })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                  placeholder="Share your experience with Green Valley Foundation..."
                />
                {errors.review && <p className="text-red-500 text-xs mt-1">{errors.review.message}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                <Send size={16} />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
