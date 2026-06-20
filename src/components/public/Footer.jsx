import { Leaf, Heart, Phone, Mail, MapPin } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export function Footer() {
  const { settings } = useSiteSettings()

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const programs = (settings.footer_programs || '').split('\n').map(s => s.trim()).filter(Boolean)

  const navLinks = [
    { href: '#home',         label: 'Home' },
    { href: '#about',        label: 'About Us' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#gallery',      label: 'Gallery' },
    { href: '#team',         label: 'Our Team' },
    { href: '#reviews',      label: 'Reviews' },
    { href: '#contact',      label: 'Contact' },
  ]

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
              <span className="font-display font-bold text-white text-lg">{settings.footer_org_name}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">{settings.footer_about_text}</p>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <Heart size={14} className="fill-emerald-400" />
              <span>{settings.footer_tagline}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={e => { e.preventDefault(); scrollTo(href) }}
                    className="text-sm hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-white mb-4">Programs</h4>
            <ul className="space-y-2.5 text-sm">
              {programs.length > 0
                ? programs.map((p, i) => <li key={i}>{p}</li>)
                : <li className="text-slate-500">Programs coming soon</li>
              }
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <Phone size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  {settings.contact_phone}
                  <br />
                  <span className="text-xs text-slate-500">{settings.contact_phone_sub}</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Mail size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>{settings.contact_email}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  {settings.contact_address}
                  <br />
                  <span className="text-xs text-slate-500">{settings.contact_address_sub}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {settings.footer_copyright}
          </p>
          <p className="text-xs text-slate-600">{settings.footer_registration}</p>
        </div>
      </div>
    </footer>
  )
}
