import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { MessageCircle, X, Send, Bot, BedDouble, Stethoscope, CalendarClock, CheckCircle2 } from 'lucide-react'

const APPOINTMENT_TYPES = [
  { value: 'inpatient', label: 'Inpatient Admission', icon: BedDouble },
  { value: 'outpatient', label: 'Outpatient Treatment', icon: Stethoscope },
  { value: 'followup', label: 'Follow-up Care', icon: CalendarClock },
]

const GREETING = "Hi there! 👋 I'm the Green Valley Assistant. I can help you book an inpatient, outpatient, or follow-up appointment. Which one do you need?"

const initialMessages = [{ from: 'bot', text: GREETING }]

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [step, setStep] = useState('type')
  const [form, setForm] = useState({ appointment_type: '', name: '', phone: '', email: '', preferred_date: '', notes: '' })
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const say = (text) => setMessages(m => [...m, { from: 'bot', text }])
  const reply = (text) => setMessages(m => [...m, { from: 'user', text }])

  const reset = () => {
    setMessages(initialMessages)
    setStep('type')
    setForm({ appointment_type: '', name: '', phone: '', email: '', preferred_date: '', notes: '' })
    setInput('')
  }

  const chooseType = (type) => {
    setForm(f => ({ ...f, appointment_type: type.value }))
    reply(type.label)
    say("Great choice. What's your full name?")
    setStep('name')
  }

  const submitText = (e) => {
    e.preventDefault()
    const value = input.trim()
    if (!value) return

    if (step === 'name') {
      setForm(f => ({ ...f, name: value }))
      reply(value)
      say('Thanks! What phone number can our team reach you on?')
      setStep('phone')
    } else if (step === 'phone') {
      setForm(f => ({ ...f, phone: value }))
      reply(value)
      say('What email address can we send your booking confirmation to? (Optional — you can type "skip")')
      setStep('email')
    } else if (step === 'email') {
      const email = value.toLowerCase() === 'skip' ? '' : value
      setForm(f => ({ ...f, email }))
      reply(value)
      say('Do you have a preferred date for the appointment?')
      setStep('date')
    } else if (step === 'notes') {
      const notes = value.toLowerCase() === 'skip' ? '' : value
      setForm(f => ({ ...f, notes }))
      reply(value)
      showSummary({ ...form, notes })
      setStep('confirm')
    }
    setInput('')
  }

  const showSummary = (data) => {
    const typeLabel = APPOINTMENT_TYPES.find(t => t.value === data.appointment_type)?.label
    say(
      `Please confirm your booking request:\n\n` +
      `Type: ${typeLabel}\n` +
      `Name: ${data.name}\n` +
      `Phone: ${data.phone}` +
      (data.email ? `\nEmail: ${data.email}` : '') +
      (data.preferred_date ? `\nPreferred date: ${data.preferred_date}` : '') +
      (data.notes ? `\nNotes: ${data.notes}` : '')
    )
  }

  const pickDate = (dateValue) => {
    setForm(f => ({ ...f, preferred_date: dateValue }))
    reply(dateValue ? new Date(dateValue).toLocaleDateString() : 'No preference')
    say('Anything else we should know? (Optional — you can type "skip")')
    setStep('notes')
  }

  const confirmBooking = async () => {
    setSubmitting(true)
    const { error } = await supabase.from('appointments').insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      appointment_type: form.appointment_type,
      preferred_date: form.preferred_date || null,
      notes: form.notes || null,
    })
    setSubmitting(false)

    if (error) {
      console.error('[ChatbotWidget] appointment insert failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      toast.error('Failed to submit your request. Please try again.')
      return
    }
    reply('Confirm booking')
    say("You're all set! ✅ Our team will call you shortly to confirm your appointment. Thank you for reaching out to Green Valley.")
    setStep('done')
    toast.success('Appointment request sent!')
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat to book an appointment'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20 flex items-center justify-center transition-all hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[70vh] overflow-hidden">
          <div className="bg-emerald-600 text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <Bot size={19} />
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight">Green Valley Assistant</div>
              <div className="text-emerald-100 text-xs">Book an appointment</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 text-sm whitespace-pre-line rounded-2xl ${
                  m.from === 'bot'
                    ? 'bg-white text-slate-700 rounded-bl-sm shadow-sm'
                    : 'bg-emerald-600 text-white rounded-br-sm ml-auto'
                }`}
              >
                {m.text}
              </div>
            ))}

            {step === 'type' && (
              <div className="flex flex-col gap-2 pt-1">
                {APPOINTMENT_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => chooseType(type)}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl text-sm font-medium text-slate-700 transition-colors text-left"
                  >
                    <type.icon size={16} className="text-emerald-600 shrink-0" />
                    {type.label}
                  </button>
                ))}
              </div>
            )}

            {step === 'date' && (
              <div className="flex flex-col gap-2 pt-1">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => pickDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => pickDate('')}
                  className="self-start text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  No preference
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={confirmBooking}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                >
                  <CheckCircle2 size={16} />
                  {submitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            )}

            {step === 'done' && (
              <button
                onClick={reset}
                className="text-emerald-600 text-sm font-medium hover:underline pt-1"
              >
                Book another appointment
              </button>
            )}
          </div>

          {(step === 'name' || step === 'phone' || step === 'email' || step === 'notes') && (
            <form onSubmit={submitText} className="border-t border-slate-100 p-3 flex gap-2 shrink-0">
              <input
                autoFocus
                type={step === 'phone' ? 'tel' : 'text'}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={
                  step === 'name' ? 'Your full name'
                    : step === 'phone' ? 'Mobile number'
                    : step === 'email' ? 'Email address (or "skip")'
                    : 'Optional notes...'
                }
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="w-11 h-11 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-colors"
                aria-label="Send"
              >
                <Send size={17} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
