import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useSiteSettings, DEFAULTS } from '../../hooks/useSiteSettings'
import toast from 'react-hot-toast'
import {
  Phone, Mail, MapPin, Clock, Save, Loader2, Eye, ExternalLink, CheckCircle
} from 'lucide-react'

const CONTACT_KEYS = [
  'contact_section_title',
  'contact_section_desc',
  'contact_phone',
  'contact_phone_sub',
  'contact_email',
  'contact_email_sub',
  'contact_address',
  'contact_address_sub',
  'contact_hours',
  'contact_hours_sub',
  'contact_map_url',
]

const inputCls = 'w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition-colors'

function Label({ children, hint }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {children}
      {hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  )
}

function Card({ icon: Icon, color, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-4 border-b border-slate-100 ${color}`}>
        <div className="w-9 h-9 bg-white/60 rounded-xl flex items-center justify-center">
          <Icon size={18} />
        </div>
        <h3 className="font-bold text-base">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

export function ContactSettings() {
  const { reload } = useSiteSettings()
  const [vals, setVals] = useState(() => {
    const obj = {}
    CONTACT_KEYS.forEach(k => { obj[k] = DEFAULTS[k] })
    return obj
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  /* Load existing values */
  useEffect(() => {
    supabase.from('site_settings')
      .select('key, value')
      .in('key', CONTACT_KEYS)
      .then(({ data }) => {
        if (data?.length) {
          setVals(prev => {
            const next = { ...prev }
            data.forEach(r => { next[r.key] = r.value ?? '' })
            return next
          })
        }
        setLoading(false)
      })
  }, [])

  const set = (key, val) => { setVals(prev => ({ ...prev, [key]: val })); setSaved(false) }
  const inp = key => ({
    value: vals[key] ?? '',
    onChange: e => set(key, e.target.value),
    className: inputCls,
  })

  const handleSave = async () => {
    setSaving(true)
    const rows = CONTACT_KEYS.map(key => ({ key, value: vals[key] ?? '' }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (error) { toast.error('Save failed: ' + error.message); return }
    await reload()
    setSaved(true)
    toast.success('Contact details saved! Changes are live on the website.')
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <Phone size={22} className="text-emerald-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Contact Us Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Edit all contact details shown on the public website. Click <strong>Save All</strong> when done.
          </p>
        </div>
        <a
          href="/#contact"
          target="_blank"
          rel="noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-800 font-medium border border-emerald-200 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
        >
          <ExternalLink size={13} /> Preview on Site
        </a>
      </div>

      {/* Section heading */}
      <Card icon={MapPin} color="bg-slate-50 text-slate-700" title="Section Heading (shown above contact cards)">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Heading</Label>
            <input {...inp('contact_section_title')} placeholder="Take the First Step Today" />
          </div>
          <div>
            <Label>Subtitle / Description</Label>
            <input {...inp('contact_section_desc')} placeholder="Short description below heading…" />
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        {/* Phone */}
        <Card icon={Phone} color="bg-emerald-50 text-emerald-800" title="Helpline / Phone">
          <div>
            <Label>Phone Number</Label>
            <input {...inp('contact_phone')} placeholder="+91 98765 43210" />
          </div>
          <div>
            <Label hint="small text shown below number">Sub-label</Label>
            <input {...inp('contact_phone_sub')} placeholder="e.g. 24/7 Crisis Support" />
          </div>
          {vals.contact_phone && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">
              <CheckCircle size={13} />
              <span>Will display as: <strong>{vals.contact_phone}</strong></span>
            </div>
          )}
        </Card>

        {/* Email */}
        <Card icon={Mail} color="bg-blue-50 text-blue-800" title="Email Address">
          <div>
            <Label>Email</Label>
            <input {...inp('contact_email')} type="email" placeholder="care@greenvalley.org" />
          </div>
          <div>
            <Label hint="small text shown below email">Sub-label</Label>
            <input {...inp('contact_email_sub')} placeholder="e.g. Respond within 4 hours" />
          </div>
          {vals.contact_email && (
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 rounded-xl px-3 py-2">
              <CheckCircle size={13} />
              <span>Will display as: <strong>{vals.contact_email}</strong></span>
            </div>
          )}
        </Card>

        {/* Address */}
        <Card icon={MapPin} color="bg-amber-50 text-amber-800" title="Physical Address">
          <div>
            <Label>Full Address</Label>
            <textarea
              value={vals.contact_address}
              onChange={e => set('contact_address', e.target.value)}
              className={inputCls}
              rows={2}
              placeholder="45, Green Valley Road, Hyderabad – 500 001"
            />
          </div>
          <div>
            <Label hint="city / state / country">Sub-label</Label>
            <input {...inp('contact_address_sub')} placeholder="e.g. Telangana, India" />
          </div>
        </Card>

        {/* Hours */}
        <Card icon={Clock} color="bg-purple-50 text-purple-800" title="Working Hours">
          <div>
            <Label>Hours Text</Label>
            <input {...inp('contact_hours')} placeholder="Open 24 Hours, 7 Days" />
          </div>
          <div>
            <Label hint="extra note below hours">Sub-label</Label>
            <input {...inp('contact_hours_sub')} placeholder="e.g. Including holidays" />
          </div>
          {vals.contact_hours && (
            <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 rounded-xl px-3 py-2">
              <CheckCircle size={13} />
              <span>Will display as: <strong>{vals.contact_hours}</strong></span>
            </div>
          )}
        </Card>
      </div>

      {/* Google Maps */}
      <div className="mt-5">
        <Card icon={MapPin} color="bg-rose-50 text-rose-800" title="Google Maps Embed">
          <div>
            <Label hint='paste only the src="…" URL from the Google Maps embed code'>
              Google Maps Embed URL
            </Label>
            <input
              {...inp('contact_map_url')}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          {/* Step-by-step guide */}
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-700 mb-2">How to get your Google Maps embed URL:</p>
            <p>1. Open <strong>maps.google.com</strong> and search for your address</p>
            <p>2. Click the <strong>Share</strong> button (or the ⋮ menu → Share)</p>
            <p>3. Choose <strong>"Embed a map"</strong> tab</p>
            <p>4. Click <strong>"Copy HTML"</strong></p>
            <p>5. From the copied code, extract only the URL inside <code className="bg-slate-200 px-1 rounded">src="…"</code></p>
            <p>6. Paste that URL in the field above</p>
          </div>

          {/* Live preview */}
          {vals.contact_map_url ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Eye size={12} /> Live Map Preview
                </p>
                <a
                  href={vals.contact_map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={11} /> Open in maps
                </a>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-64 shadow-sm">
                <iframe
                  src={vals.contact_map_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Preview"
                />
              </div>
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                <CheckCircle size={12} /> Map URL is set — it will show on the public Contact section.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-200 h-40 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
              <MapPin size={28} className="opacity-30" />
              <p>Enter a Google Maps embed URL above to see a live preview here</p>
            </div>
          )}
        </Card>
      </div>

      {/* Save bar — sticky at bottom */}
      <div className="sticky bottom-4 mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800 text-sm">Ready to publish?</p>
            <p className="text-xs text-slate-400 mt-0.5">Changes go live on the public website immediately after saving.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all text-sm shadow-lg disabled:opacity-60 ${
              saved
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5'
            }`}
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle size={16} /> Saved!</>
            ) : (
              <><Save size={16} /> Save All Contact Details</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
