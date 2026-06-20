import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DEFAULTS, useSiteSettings } from '../../hooks/useSiteSettings'
import toast from 'react-hot-toast'
import {
  Settings, Monitor, Info, LayoutGrid, Phone, Globe,
  Upload, Eye, X, Loader2, Image as ImageIcon, Save
} from 'lucide-react'

/* ─── Which setting keys belong to each tab ─────────────────────── */
const TAB_KEYS = {
  brand:    k => k.startsWith('navbar_') || k.startsWith('footer_'),
  hero:     k => k.startsWith('hero_'),
  about:    k => k.startsWith('about_'),
  sections: k => k.startsWith('achievements_') || k.startsWith('gallery_') || k.startsWith('staff_') || k.startsWith('reviews_'),
  contact:  k => k.startsWith('contact_'),
}

const TABS = [
  { key: 'brand',    label: 'Brand & Footer',    icon: Globe },
  { key: 'hero',     label: 'Hero Section',       icon: Monitor },
  { key: 'about',    label: 'About Us',           icon: Info },
  { key: 'sections', label: 'Section Headings',   icon: LayoutGrid },
  { key: 'contact',  label: 'Contact & Map',      icon: Phone },
]

const VALUE_ICONS = ['Heart', 'Shield', 'Users', 'CheckCircle', 'Award', 'Star', 'Clock', 'Trophy']

/* ─── Shared field components ───────────────────────────────────── */
const inputCls = 'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white'
const areaCls  = inputCls + ' resize-none'

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function SectionDivider({ title, desc }) {
  return (
    <div className="pt-2 pb-1 border-b border-slate-100">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
    </div>
  )
}

function ImageField({ label, hint, settingKey, value, onChange }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setUploading(true)
    const path = `settings/${settingKey}_${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed: ' + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path)
    onChange(publicUrl)
    setUploading(false)
    toast.success('Image uploaded!')
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-3 items-start">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-28 h-18 min-h-[72px] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all shrink-0 group"
        >
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <ImageIcon size={18} className="text-slate-300 group-hover:text-emerald-400 mx-auto mb-1 transition-colors" />
              <span className="text-xs text-slate-400">Upload</span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={inputCls}
            placeholder="Paste URL or upload →"
          />
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition-colors">
              {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            {value && (
              <>
                <a href={value} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5">
                  <Eye size={11} /> Preview
                </a>
                <button type="button" onClick={() => onChange('')}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-2 py-1.5">
                  <X size={11} /> Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Field>
  )
}

/* ─── Main component ────────────────────────────────────────────── */
export function SiteSettingsManager() {
  const { reload } = useSiteSettings()
  const [activeTab, setActiveTab] = useState('brand')
  const [vals, setVals] = useState({ ...DEFAULTS })
  const [saving, setSaving] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (data?.length) {
        const flat = { ...DEFAULTS }
        data.forEach(r => { if (r.key in DEFAULTS) flat[r.key] = r.value ?? '' })
        setVals(flat)
      }
      setInitialLoad(false)
    })
  }, [])

  const set = (key, val) => setVals(prev => ({ ...prev, [key]: val }))
  const inp = key => ({ value: vals[key] ?? '', onChange: e => set(key, e.target.value), className: inputCls })
  const area = (key, rows = 3) => ({ value: vals[key] ?? '', onChange: e => set(key, e.target.value), rows, className: areaCls })
  const sel = key => ({ value: vals[key] ?? '', onChange: e => set(key, e.target.value), className: inputCls })

  const save = async () => {
    setSaving(true)
    const filter = TAB_KEYS[activeTab]
    const rows = Object.keys(DEFAULTS).filter(filter).map(key => ({ key, value: vals[key] ?? '' }))
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (error) { toast.error('Save failed: ' + error.message); return }
    await reload()
    toast.success('Settings saved — changes are now live!')
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 size={28} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  const activeTabInfo = TABS.find(t => t.key === activeTab)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Settings size={20} className="text-emerald-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Site Settings</h1>
          <p className="text-slate-500 text-sm">Edit every section of the public website — changes go live instantly</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-8 bg-slate-100 p-1.5 rounded-2xl flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === key ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">

        {/* ══════════════ BRAND & FOOTER TAB ══════════════ */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <SectionDivider title="Navbar" desc="Logo text displayed in the top navigation bar." />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Organisation Name">
                <input {...inp('navbar_org_name')} placeholder="Green Valley" />
              </Field>
              <Field label="Tagline" hint="shown in green below name">
                <input {...inp('navbar_tagline')} placeholder="Foundation" />
              </Field>
              <Field label="CTA Button Text">
                <input {...inp('navbar_cta_text')} placeholder="Get Help Now" />
              </Field>
            </div>

            <SectionDivider title="Footer Brand" desc="The bottom of every page." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Organisation Name">
                <input {...inp('footer_org_name')} placeholder="Green Valley Foundation" />
              </Field>
              <Field label="Tagline" hint="shown next to the heart icon">
                <input {...inp('footer_tagline')} placeholder="Healing with Heart" />
              </Field>
            </div>
            <Field label="About Text" hint="Short description below logo">
              <textarea {...area('footer_about_text', 2)} placeholder="A trusted NGO providing…" />
            </Field>

            <SectionDivider title="Footer Programs List" desc="One program per line — renders as a bullet list." />
            <Field label="Programs" hint="one per line">
              <textarea {...area('footer_programs', 7)} placeholder={'Inpatient Detoxification\nOutpatient Counseling\n…'} />
            </Field>

            <SectionDivider title="Footer Bottom Bar" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Copyright Text" hint='year is added automatically'>
                <input {...inp('footer_copyright')} placeholder="Green Valley Foundation. All rights reserved." />
              </Field>
              <Field label="Registration / Accreditation">
                <input {...inp('footer_registration')} placeholder="Registered NGO · FCRA Approved · 80G Tax Exemption" />
              </Field>
            </div>
          </div>
        )}

        {/* ══════════════ HERO TAB ══════════════ */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <SectionDivider title="Hero Background" desc="Full-screen banner at the top of the homepage." />
            <ImageField
              label="Background Image"
              hint="Recommended 1920×1080px. Leave empty to use the default green gradient."
              settingKey="hero_bg_image_url"
              value={vals.hero_bg_image_url}
              onChange={v => set('hero_bg_image_url', v)}
            />

            <SectionDivider title="Hero Text" />
            <Field label="Badge / Pill Label">
              <input {...inp('hero_badge')} placeholder="Compassionate Care Since 2008" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading Line 1">
                <input {...inp('hero_title')} placeholder="Healing Lives," />
              </Field>
              <Field label="Heading Line 2" hint="displayed in emerald green">
                <input {...inp('hero_subtitle')} placeholder="Restoring Hope" />
              </Field>
            </div>
            <Field label="Description Paragraph">
              <textarea {...area('hero_description', 3)} placeholder="Short paragraph below the heading…" />
            </Field>

            <SectionDivider title="CTA Buttons" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Primary Button" hint="links to #contact">
                <input {...inp('hero_cta_primary')} placeholder="Get Help Today" />
              </Field>
              <Field label="Secondary Button" hint="links to #about">
                <input {...inp('hero_cta_secondary')} placeholder="Learn More" />
              </Field>
            </div>

            <SectionDivider title="Quick Stats" desc="3 stat boxes at the bottom of the hero." />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stat {n}</p>
                  <input {...inp(`hero_stat_${n}_value`)} placeholder="e.g. 2000+" />
                  <input {...inp(`hero_stat_${n}_label`)} placeholder="e.g. Lives Recovered" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ ABOUT TAB ══════════════ */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <SectionDivider title="About Section Image" desc="The photo shown in the left panel of the About Us section." />
            <ImageField
              label="About Image"
              hint="Recommended 800×600px. Leave empty for the default green illustration."
              settingKey="about_image_url"
              value={vals.about_image_url}
              onChange={v => set('about_image_url', v)}
            />

            <SectionDivider title="Section Headings" />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Section Badge">
                <input {...inp('about_section_badge')} placeholder="About Us" />
              </Field>
              <Field label="Heading Line 1">
                <input {...inp('about_title')} placeholder="A Sanctuary of Healing &" />
              </Field>
              <Field label="Heading Line 2" hint="in emerald green">
                <input {...inp('about_subtitle')} placeholder="Second Chances" />
              </Field>
            </div>

            <SectionDivider title="Description Paragraphs" />
            <Field label="First Paragraph">
              <textarea {...area('about_description_1', 4)} placeholder="Introduction paragraph…" />
            </Field>
            <Field label="Second Paragraph">
              <textarea {...area('about_description_2', 4)} placeholder="Facility & team paragraph…" />
            </Field>

            <SectionDivider title="Floating Stat Cards" desc="The two overlay cards on the image." />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-emerald-700 uppercase">Top-left card (green bg)</p>
                <input {...inp('about_patients_value')} placeholder="2000+" />
                <input {...inp('about_patients_label')} placeholder="Lives Transformed" />
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase">Bottom-right card (white bg)</p>
                <input {...inp('about_stat_years_value')} placeholder="15+" />
                <input {...inp('about_stat_years_label')} placeholder="Years of Excellence" />
              </div>
            </div>

            <SectionDivider title="Value Cards" desc="The 4 feature cards at the bottom of the About section." />
            <div className="grid sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Card {n}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Icon</p>
                      <select {...sel(`about_value_${n}_icon`)} className={inputCls}>
                        {VALUE_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Title</p>
                      <input {...inp(`about_value_${n}_title`)} placeholder="Title" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Description</p>
                    <textarea {...area(`about_value_${n}_desc`, 2)} placeholder="Short description…" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ SECTION HEADINGS TAB ══════════════ */}
        {activeTab === 'sections' && (
          <div className="space-y-6">

            {/* Achievements */}
            <SectionDivider title="Achievements / Milestones Section" desc="The dark green banner with animated stats." />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Badge Label">
                <input {...inp('achievements_badge')} placeholder="Our Impact" />
              </Field>
              <Field label="Heading">
                <input {...inp('achievements_title')} placeholder="Milestones That Matter" />
              </Field>
              <Field label="Subtitle">
                <input {...inp('achievements_desc')} placeholder="Short description…" />
              </Field>
            </div>

            {/* Gallery */}
            <SectionDivider title="Gallery Section" desc="The photo grid section." />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Badge Label">
                <input {...inp('gallery_badge')} placeholder="Gallery" />
              </Field>
              <Field label="Heading">
                <input {...inp('gallery_title')} placeholder="Our Campus & Activities" />
              </Field>
              <Field label="Subtitle">
                <input {...inp('gallery_desc')} placeholder="Short description…" />
              </Field>
            </div>

            {/* Staff */}
            <SectionDivider title="Team / Staff Section" desc="The staff member cards section." />
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Badge Label">
                <input {...inp('staff_badge')} placeholder="Our Team" />
              </Field>
              <Field label="Heading">
                <input {...inp('staff_title')} placeholder="Meet the Healers" />
              </Field>
              <Field label="Subtitle">
                <input {...inp('staff_desc')} placeholder="Short description…" />
              </Field>
            </div>

            {/* Reviews */}
            <SectionDivider title="Reviews / Testimonials Section" desc="The patient reviews section." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Badge Label">
                <input {...inp('reviews_badge')} placeholder="Testimonials" />
              </Field>
              <Field label="Heading">
                <input {...inp('reviews_title')} placeholder="What Families Say" />
              </Field>
              <Field label="Subtitle">
                <input {...inp('reviews_desc')} placeholder="Short description…" />
              </Field>
              <Field label="Review Form Title">
                <input {...inp('reviews_form_title')} placeholder="Share Your Experience" />
              </Field>
            </div>
          </div>
        )}

        {/* ══════════════ CONTACT TAB ══════════════ */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <SectionDivider title="Section Heading" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Heading">
                <input {...inp('contact_section_title')} placeholder="Take the First Step Today" />
              </Field>
              <Field label="Subtitle">
                <input {...inp('contact_section_desc')} placeholder="Short description…" />
              </Field>
            </div>

            <SectionDivider title="Contact Info Cards" desc="The 4 info boxes shown above the map." />
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key: 'phone',   label: 'Helpline / Phone' },
                { key: 'email',   label: 'Email' },
                { key: 'address', label: 'Address' },
                { key: 'hours',   label: 'Hours' },
              ].map(({ key, label }) => (
                <div key={key} className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                  <input {...inp(`contact_${key}`)} placeholder={`${label} value`} />
                  <input {...inp(`contact_${key}_sub`)} placeholder="Sub-label (e.g. 24/7 Crisis Support)" />
                </div>
              ))}
            </div>

            <SectionDivider title="Google Maps Embed" />
            <Field
              label="Google Maps Embed URL"
              hint='From Google Maps → Share → Embed a map → copy the src="…" URL'
            >
              <input {...inp('contact_map_url')} placeholder="https://www.google.com/maps/embed?pb=..." />
            </Field>
            {vals.contact_map_url ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 h-52">
                <iframe src={vals.contact_map_url} width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy" title="Map preview" />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 h-36 flex items-center justify-center text-slate-400 text-sm">
                <div className="text-center">
                  <Phone size={22} className="mx-auto mb-2 opacity-30" />
                  Map preview appears here once you enter a URL
                </div>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
              <strong>How to get the embed URL:</strong> Google Maps → search your location → Share → Embed a map →
              copy the URL inside <code className="bg-blue-100 px-1 rounded">src="..."</code> of the iframe code.
            </div>
          </div>
        )}

        {/* ── Save bar ── */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-slate-400">
            Saving updates only the <strong>{activeTabInfo?.label}</strong> tab. Switch tabs to edit other sections.
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-60 text-sm"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : `Save ${activeTabInfo?.label}`}
          </button>
        </div>
      </div>
    </div>
  )
}
