import { Leaf, Heart, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">Green Valley</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              A trusted NGO providing compassionate, evidence-based alcohol and drug de-addiction care since 2008.
            </p>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <Heart size={14} className="fill-emerald-400" />
              <span>Healing with Heart</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {['#home', '#about', '#achievements', '#gallery', '#team', '#reviews', '#contact'].map(href => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={e => { e.preventDefault(); scrollTo(href) }}
                    className="text-sm hover:text-emerald-400 transition-colors capitalize"
                  >
                    {href.replace('#', '').replace('-', ' ') || 'Home'}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-white mb-4">Programs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>Inpatient Detoxification</li>
              <li>Outpatient Counseling</li>
              <li>Family Therapy</li>
              <li>Yoga & Meditation</li>
              <li>Vocational Rehabilitation</li>
              <li>Aftercare & Follow-up</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <Phone size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>+91 98765 43210<br /><span className="text-xs text-slate-500">24/7 Helpline</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Mail size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>care@greenvalley.org</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>45, Green Valley Road,<br />Hyderabad – 500 001, Telangana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Green Valley Foundation. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Registered NGO · FCRA Approved · 80G Tax Exemption</p>
        </div>
      </div>
    </footer>
  )
}
