import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Eye, FileText, Loader2 } from 'lucide-react'
import { Modal } from '../ui/Modal'

const FORM_TYPES = [
  { key: 'inpatient',  label: 'Inpatient' },
  { key: 'outpatient', label: 'Outpatient' },
  { key: 'followup',   label: 'Follow-up' },
]

export function FormSubmissions() {
  const [activeTab, setActiveTab] = useState('inpatient')
  const [submissions, setSubmissions] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase.from('form_submissions').select('*').eq('form_type', activeTab).order('submitted_at', { ascending: false }),
      supabase.from('form_questions').select('id, question').eq('form_type', activeTab),
    ]).then(([{ data: subs }, { data: qs }]) => {
      setSubmissions(subs || [])
      setQuestions(qs || [])
      setLoading(false)
    })
  }, [activeTab])

  const getQuestion = (id) => questions.find(q => q.id === id)?.question || id

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Form Submissions</h1>
        <p className="text-slate-500 mt-1">View all patient form submissions</p>
      </div>

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
        {FORM_TYPES.map(type => (
          <button
            key={type.key}
            onClick={() => setActiveTab(type.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === type.key ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText size={40} className="mx-auto mb-4 opacity-30" />
            <p>No submissions for this form yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-5 py-3.5 font-semibold text-slate-600">#</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Submitted At</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Preview</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => {
                  const firstAnswer = Object.values(sub.answers || {})[0]
                  return (
                    <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{i + 1}</td>
                      <td className="px-5 py-3.5 text-slate-700">{new Date(sub.submitted_at).toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-slate-500 truncate max-w-xs">{String(firstAnswer || '—').substring(0, 60)}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setSelected(sub)} className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-medium text-xs">
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Submission Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 mb-4">
              Submitted: {new Date(selected.submitted_at).toLocaleString()} · Type: {selected.form_type}
            </div>
            {Object.entries(selected.answers || {}).map(([key, value]) => (
              <div key={key} className="bg-slate-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-500 mb-1">{getQuestion(key)}</div>
                <div className="text-slate-800 text-sm">{Array.isArray(value) ? value.join(', ') : String(value)}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
