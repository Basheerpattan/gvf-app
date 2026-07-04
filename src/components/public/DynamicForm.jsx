import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Loader } from '../ui/Loader'
import { Send, CheckCircle, Printer } from 'lucide-react'

const FORM_TITLES = {
  inpatient: 'Inpatient Admission Form',
  outpatient: 'Outpatient Enrollment Form',
  followup: 'Follow-up Assessment Form',
}

function PrintableForm({ title, questions, answers }) {
  return (
    <div className="hidden print:block p-8">
      <h1 className="text-xl font-bold mb-1">{title}</h1>
      <p className="text-sm text-slate-500 mb-6">Printed on {new Date().toLocaleString()}</p>
      <div className="space-y-4">
        {questions.map(q => {
          const value = answers?.[q.id]
          const display = Array.isArray(value) ? value.join(', ') : (value ?? '')
          return (
            <div key={q.id} className="border-b border-slate-300 pb-2">
              <div className="text-sm font-semibold text-slate-700">{q.question}</div>
              <div className="text-sm text-slate-900 mt-1">{display || '—'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DynamicForm({ formType, title, description }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedAnswers, setSubmittedAnswers] = useState(null)
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const liveAnswers = watch()

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
    setSubmittedAnswers(data)
    setSubmitted(true)
    reset()
  }

  const printTitle = title || FORM_TITLES[formType] || 'Patient Form'
  const handlePrint = () => window.print()

  if (loading) return <div className="flex justify-center py-12"><Loader /></div>

  if (submitted) {
    return (
      <>
        <div className="text-center py-12 print:hidden">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Submission Received!</h3>
          <p className="text-slate-500 mb-6">Our team will contact you within 24 hours.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setSubmitted(false)} className="text-emerald-600 font-medium hover:underline">Submit another response</button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
        <PrintableForm title={printTitle} questions={questions} answers={submittedAnswers} />
      </>
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
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 print:hidden">
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

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-base shadow-lg"
        >
          <Send size={18} />
          {submitting ? 'Submitting...' : 'Submit Form'}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-base"
        >
          <Printer size={18} />
          Print
        </button>
      </div>
    </form>
    <PrintableForm title={printTitle} questions={questions} answers={liveAnswers} />
    </>
  )
}
