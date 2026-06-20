import { useState } from 'react'
import { Navbar }       from '../components/public/Navbar'
import { Footer }       from '../components/public/Footer'
import { DynamicForm }  from '../components/public/DynamicForm'
import { FileText }     from 'lucide-react'

const FORMS = [
  { key: 'inpatient',  label: 'Inpatient Admission',  desc: 'For patients seeking residential treatment and detoxification.' },
  { key: 'outpatient', label: 'Outpatient Enrollment', desc: 'For patients who will attend sessions while living at home.' },
  { key: 'followup',   label: 'Follow-up Assessment',  desc: 'For patients who have completed treatment and are in recovery.' },
]

export function FormsPage() {
  const [activeForm, setActiveForm] = useState('inpatient')
  const form = FORMS.find(f => f.key === activeForm)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-emerald-700" />
            </div>
            <h1 className="font-display font-bold text-3xl text-slate-800 mb-2">Patient Forms</h1>
            <p className="text-slate-500">Please complete the relevant form. All information is kept strictly confidential.</p>
          </div>

          {/* Form type selector */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {FORMS.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveForm(f.key)}
                className={`flex-1 px-4 py-3 rounded-2xl border-2 text-left transition-all ${
                  activeForm === f.key
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                }`}
              >
                <div className="font-semibold text-sm mb-0.5">{f.label}</div>
                <div className="text-xs opacity-70">{f.desc}</div>
              </button>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="mb-6">
              <h2 className="font-display font-bold text-xl text-slate-800">{form.label}</h2>
              <p className="text-slate-500 text-sm mt-1">{form.desc}</p>
            </div>
            <DynamicForm formType={activeForm} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
