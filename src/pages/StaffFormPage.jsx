import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export function StaffFormPage({ formType = 'inpatient' }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('form_questions')
      .select('*')
      .eq('form_type', formType)
      .order('display_order')
      .then(({ data }) => {
        setQuestions(data || [])
        setLoading(false)
      })
  }, [formType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('form_submissions').insert({
      form_type: formType,
      answers: answers
    })
    if (error) toast.error('Failed to submit')
    else { toast.success('Form Submitted!'); setAnswers({}) }
  }

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></div>

  return (
    <div className="pt-24 max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 capitalize">{formType} Form</h2>
        {questions.map((q) => (
          <div key={q.id} className="mb-5">
            <label className="block text-sm font-medium mb-2">{q.question}</label>
            <input 
              className="w-full p-3 border rounded-xl"
              onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
              value={answers[q.id] || ''}
            />
          </div>
        ))}
        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Submit</button>
      </form>
    </div>
  )
}