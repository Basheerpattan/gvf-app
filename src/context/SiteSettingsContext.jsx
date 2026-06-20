import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/* ─── ALL editable site content (used as fallback defaults) ─────── */
export const DEFAULTS = {
  // Navbar
  navbar_org_name:  'Green Valley',
  navbar_tagline:   'Foundation',
  navbar_cta_text:  'Get Help Now',

  // Hero
  hero_badge:           'Compassionate Care Since 2008',
  hero_title:           'Healing Lives,',
  hero_subtitle:        'Restoring Hope',
  hero_description:     'Green Valley Foundation is a trusted NGO center for alcohol and drug de-addiction, offering evidence-based treatment, counseling, and lifelong support to rebuild lives.',
  hero_cta_primary:     'Get Help Today',
  hero_cta_secondary:   'Learn More',
  hero_stat_1_value:    '2000+',
  hero_stat_1_label:    'Lives Recovered',
  hero_stat_2_value:    '15+',
  hero_stat_2_label:    'Years of Service',
  hero_stat_3_value:    '98%',
  hero_stat_3_label:    'Success Rate',
  hero_bg_image_url:    '',

  // About
  about_section_badge:  'About Us',
  about_title:          'A Sanctuary of Healing &',
  about_subtitle:       'Second Chances',
  about_description_1:  'Founded in 2008, Green Valley Foundation has been at the forefront of addiction recovery in the region. We believe that addiction is not a moral failing — it is a medical condition that deserves compassionate, professional care.',
  about_description_2:  'Our 7-acre serene campus provides a safe, structured environment where individuals can detox safely, rebuild their lives, and discover purpose. Our team of certified addiction specialists, counselors, psychiatrists, and yoga therapists work together to provide comprehensive, individualized care.',
  about_stat_years_value:  '15+',
  about_stat_years_label:  'Years of Excellence',
  about_patients_value:    '2000+',
  about_patients_label:    'Lives Transformed',
  about_image_url:         '',
  about_value_1_icon:   'Heart',
  about_value_1_title:  'Compassion First',
  about_value_1_desc:   'Every individual is treated with dignity, empathy, and non-judgmental care.',
  about_value_2_icon:   'Shield',
  about_value_2_title:  'Evidence-Based',
  about_value_2_desc:   'Our programs are backed by clinical research and proven recovery methodologies.',
  about_value_3_icon:   'Users',
  about_value_3_title:  'Family Involvement',
  about_value_3_desc:   'We engage families throughout the recovery journey for lasting healing.',
  about_value_4_icon:   'CheckCircle',
  about_value_4_title:  'Holistic Approach',
  about_value_4_desc:   'Mind, body, and spirit wellness — yoga, counseling, and medical support.',

  // Achievements section headings
  achievements_badge:  'Our Impact',
  achievements_title:  'Milestones That Matter',
  achievements_desc:   'Every number represents a life changed, a family restored, and a future reclaimed.',

  // Gallery section headings
  gallery_badge:  'Gallery',
  gallery_title:  'Our Campus & Activities',
  gallery_desc:   'A glimpse into the serene spaces and meaningful moments at Green Valley Foundation.',

  // Staff section headings
  staff_badge:  'Our Team',
  staff_title:  'Meet the Healers',
  staff_desc:   "Our dedicated team of certified professionals brings compassion and expertise to every patient's journey.",

  // Reviews section headings
  reviews_badge:       'Testimonials',
  reviews_title:       'What Families Say',
  reviews_desc:        'Real stories from patients and families who trusted Green Valley Foundation with their recovery.',
  reviews_form_title:  'Share Your Experience',

  // Contact
  contact_section_title:  'Take the First Step Today',
  contact_section_desc:   'Reaching out is the bravest thing you can do. Our team is here to help, 24/7, with complete confidentiality.',
  contact_phone:          '+91 98765 43210',
  contact_phone_sub:      '24/7 Crisis Support',
  contact_email:          'care@greenvalley.org',
  contact_email_sub:      'Respond within 4 hours',
  contact_address:        '45, Green Valley Road, Hyderabad – 500 001',
  contact_address_sub:    'Telangana, India',
  contact_hours:          'Open 24 Hours, 7 Days',
  contact_hours_sub:      'Including holidays',
  contact_map_url:        '',

  // Footer
  footer_org_name:     'Green Valley Foundation',
  footer_tagline:      'Healing with Heart',
  footer_about_text:   'A trusted NGO providing compassionate, evidence-based alcohol and drug de-addiction care since 2008.',
  footer_programs:     'Inpatient Detoxification\nOutpatient Counseling\nFamily Therapy\nYoga & Meditation\nVocational Rehabilitation\nAftercare & Follow-up',
  footer_copyright:    'Green Valley Foundation. All rights reserved.',
  footer_registration: 'Registered NGO · FCRA Approved · 80G Tax Exemption',
}

/* ─── Context ───────────────────────────────────────────────────── */
const SiteSettingsContext = createContext({ settings: DEFAULTS, loading: true, reload: async () => {} })

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const { data } = await supabase.from('site_settings').select('key, value')
    if (data?.length) {
      const flat = { ...DEFAULTS }
      data.forEach(r => { if (r.key in DEFAULTS) flat[r.key] = r.value ?? '' })
      setSettings(flat)
    }
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, reload }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
