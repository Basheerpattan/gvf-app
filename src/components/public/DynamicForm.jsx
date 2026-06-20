import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Loader } from '../ui/Loader'
import { Send, CheckCircle } from 'lucide-react'

export function DynamicForm({ formType, title, description }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    supabase.from('form_questions')
      .select('*').eq('form_type', formType).order('display_order')
      .then(({ data }) => { setQuestions(data || []); setLoading(false) })
  }, [formType])

  const onSubmit = async (data) => {
    setSubmitting(true)
    const { error } = await supabase.from('form_submissions').insert({
      form_type: formType,
      answers: data,
    })
    setSubmitting(false)
    if (error) { toast.error('Submission failed. Please try again.'); return }
    toast.success('Form submitted successfully!')
    setSubmitted(true)
    reset()
  }

  if (loading) return <div className="flex justify-center py-12"><Loader /></div>

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Submission Received!</h3>
        <p className="text-slate-500 mb-6">Our team will contact you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="text-emerald-600 font-medium hover:underline">Submit another response</button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p>This form is currently being configured. Please check back soon or call us directly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {questions.map(q => (
        <div key={q.id}>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {q.question}
            {q.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {q.field_type === 'textarea' && (
            <textarea
              {...register(q.id, { required: q.required && 'This field is required' })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              placeholder={q.question}
            />
          )}

          {q.field_type === 'select' && (
            <select
              {...register(q.id, { required: q.required && 'Please select an option' })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              <option value="">Select an option</option>
              {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          )}

          {q.field_type === 'radio' && (
            <div className="flex flex-wrap gap-4">
              {(q.options || []).map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={opt}
                    {...register(q.id, { required: q.required && 'Please select one' })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.field_type === 'checkbox' && (
            <div className="flex flex-wrap gap-4">
              {(q.options || []).map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={opt}
                    {...register(q.id)}
                    className="text-emerald-600 focus:ring-emerald-500 rounded"
                  />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {!['textarea','select','radio','checkbox'].includes(q.field_type) && (
            <input
              type={q.field_type}
              {...register(q.id, { required: q.required && 'This field is required' })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder={q.question}
            />
          )}

          {errors[q.id] && <p className="text-red-500 text-xs mt-1">{errors[q.id].message}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-base shadow-lg"
      >
        <Send size={18} />
        {submitting ? 'Submitting...' : 'Submit Form'}
      </button>
    </form>
  )
}
