import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

const contacts = [
  { icon: Phone,   label: 'Helpline',  value: '+91 98765 43210', sub: '24/7 Crisis Support' },
  { icon: Mail,    label: 'Email',     value: 'care@greenvalley.org', sub: 'Respond within 4 hours' },
  { icon: MapPin,  label: 'Address',   value: '45, Green Valley Road, Hyderabad – 500 001', sub: 'Telangana, India' },
  { icon: Clock,   label: 'Hours',     value: 'Open 24 Hours, 7 Days', sub: 'Including holidays' },
]

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setSubmitting(true)
    const { error } = await supabase.from('enquiries').insert(data)
    setSubmitting(false)
    if (error) { toast.error('Failed to send message. Please try again.'); return }
    toast.success('Message sent! We will contact you soon.')
    setSubmitted(true)
    reset()
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-4">Contact Us</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mb-4">
            Take the First Step Today
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Reaching out is the bravest thing you can do. Our team is here to help, 24/7, with complete confidentiality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {contacts.map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="bg-slate-50 rounded-2xl p-5 hover:bg-emerald-50 transition-colors group">
                  <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <Icon size={20} className="text-emerald-700" />
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{label}</div>
                  <div className="text-slate-800 font-medium text-sm leading-tight">{value}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* Google Maps embed placeholder */}
            <div className="bg-slate-100 rounded-2xl overflow-hidden h-64 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <MapPin size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Interactive map will load here</p>
                <p className="text-xs mt-1">45, Green Valley Road, Hyderabad</p>
              </div>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl p-8">
            <h3 className="font-display font-bold text-xl text-slate-800 mb-6">Send an Enquiry</h3>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Message Received!</h4>
                <p className="text-slate-500 text-sm mb-6">Our team will call you within 2 hours.</p>
                <button onClick={() => setSubmitted(false)} className="text-emerald-600 font-medium text-sm hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      {...register('name', { required: 'Required' })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type of Enquiry</label>
                  <select
                    {...register('enquiry_type')}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="">Select enquiry type</option>
                    <option value="inpatient">Inpatient Admission</option>
                    <option value="outpatient">Outpatient Treatment</option>
                    <option value="followup">Follow-up Care</option>
                    <option value="general">General Information</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Message <span className="text-red-500">*</span></label>
                  <textarea
                    {...register('message', { required: 'Please describe your enquiry', minLength: { value: 10, message: 'At least 10 characters' } })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Tell us how we can help..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-200 disabled:opacity-60 text-sm"
                >
                  <Send size={16} />
                  {submitting ? 'Sending...' : 'Send Enquiry'}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Your information is kept strictly confidential. We will never share your details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
