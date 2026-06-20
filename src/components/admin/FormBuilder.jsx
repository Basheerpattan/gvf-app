import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, GripVertical, Loader2, FileText } from 'lucide-react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useForm } from 'react-hook-form'

const FORM_TYPES = [
  { key: 'inpatient',  label: 'Inpatient Form',  color: 'bg-blue-100 text-blue-700' },
  { key: 'outpatient', label: 'Outpatient Form',  color: 'bg-emerald-100 text-emerald-700' },
  { key: 'followup',   label: 'Follow-up Form',   color: 'bg-purple-100 text-purple-700' },
]
const FIELD_TYPES = ['text', 'textarea', 'select', 'radio', 'checkbox', 'email', 'tel', 'number', 'date']

export function FormBuilder() {
  const [activeTab, setActiveTab] = useState('inpatient')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [optionsText, setOptionsText] = useState('')
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const fieldType = watch('field_type')
  const hasOptions = ['select', 'radio', 'checkbox'].includes(fieldType)

  const load = () => {
    setLoading(true)
    supabase.from('form_questions').select('*').eq('form_type', activeTab).order('display_order')
      .then(({ data }) => { setQuestions(data || []); setLoading(false) })
  }
  useEffect(load, [activeTab])

  const openAdd = () => {
    setEditing(null)
    setOptionsText('')
    reset({ field_type: 'text', required: false, display_order: questions.length })
    setModalOpen(true)
  }

  const openEdit = (q) => {
    setEditing(q)
    setOptionsText((q.options || []).join('\n'))
    reset({ question: q.question, field_type: q.field_type, required: q.required, display_order: q.display_order })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    const options = hasOptions ? optionsText.split('\n').map(s => s.trim()).filter(Boolean) : null
    const payload = { ...data, form_type: activeTab, options, required: !!data.required }

    let error
    if (editing) {
      ({ error } = await supabase.from('form_questions').update(payload).eq('id', editing.id))
    } else {
      ({ error } = await supabase.from('form_questions').insert(payload))
    }
    setSaving(false)
    if (error) { toast.error('Save failed'); return }
    toast.success(editing ? 'Question updated!' : 'Question added!')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('form_questions').delete().eq('id', deleteTarget.id)
    if (error) { toast.error('Delete failed'); return }
    toast.success('Question removed')
    setDeleteTarget(null)
    load()
  }

  const activeType = FORM_TYPES.find(t => t.key === activeTab)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Form Builder</h1>
          <p className="text-slate-500 mt-1">Dynamically configure questions for each form type</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Question</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
        {FORM_TYPES.map(type => (
          <button
            key={type.key}
            onClick={() => setActiveTab(type.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === type.key
                ? 'bg-white text-slate-800 shadow-md'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText size={40} className="mx-auto mb-4 opacity-30" />
            <p className="mb-4">No questions for this form yet.</p>
            <Button onClick={openAdd}><Plus size={16} /> Add First Question</Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center pt-1 text-slate-300">
                  <GripVertical size={18} />
                  <span className="text-xs font-mono ml-1 text-slate-400">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800">{q.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg capitalize">{q.field_type}</span>
                    {q.required && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-lg">Required</span>}
                    {q.options?.length > 0 && (
                      <span className="text-xs text-slate-400">{q.options.length} options</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(q)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(q)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Question' : `Add Question to ${activeType?.label}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Question Text <span className="text-red-500">*</span></label>
            <input {...register('question', { required: 'Required' })}
              placeholder="e.g. What is the patient's age?"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Field Type <span className="text-red-500">*</span></label>
            <select {...register('field_type', { required: true })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize">
              {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {hasOptions && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Options (one per line) <span className="text-red-500">*</span></label>
              <textarea
                value={optionsText}
                onChange={e => setOptionsText(e.target.value)}
                rows={5}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">{optionsText.split('\n').filter(s => s.trim()).length} options</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
              <input type="number" {...register('display_order', { valueAsNumber: true })} min={0}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('required')} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Required field</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? 'Update Question' : 'Add Question'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Question" size="sm">
        <p className="text-slate-600 mb-6">Delete this question from the form?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
