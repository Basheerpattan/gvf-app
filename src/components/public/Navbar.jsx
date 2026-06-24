import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Leaf } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Gallery',      href: '#gallery' },
  { label: 'Our Team',     href: '#team' },
  { label: 'Reviews',      href: '#reviews' },
  { label: 'Contact',      href: '#contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { settings } = useSiteSettings()
  const { user, role, signOut } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const isHome = location.pathname === '/'
  const dashboardPath = role === 'admin' ? '/admin/dashboard' : '/staff/forms'

  const isSolid = scrolled || !isHome || open

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${isSolid ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">

        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-emerald-700 transition-colors">
            <Leaf size={20} className="text-white" />
          </div>
          <span className={`font-display font-bold text-lg leading-tight transition-colors ${isSolid ? 'text-slate-800' : 'text-white'}`}>
            {settings.navbar_org_name}
            <br />
            <span className="text-emerald-500 font-semibold text-sm">{settings.navbar_tagline}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {isHome && (
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => scrollTo(e, link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-emerald-50 hover:text-emerald-700 ${scrolled ? 'text-slate-600' : 'text-white/90 hover:text-emerald-600'}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isHome && (
            <a
              href="#contact"
              onClick={e => scrollTo(e, '#contact')}
              className="hidden lg:inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
            >
              {settings.navbar_cta_text}
            </a>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={dashboardPath}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${isSolid ? 'text-emerald-600 hover:bg-emerald-50' : 'text-white hover:bg-white/10'}`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isSolid ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/admin"
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isSolid ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              Login
            </Link>
          )}

          {isHome && (
            <button
              onClick={() => setOpen(o => !o)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${isSolid ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile nav dropdown ── */}
      {isHome && open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => scrollTo(e, link.href)}
                className="flex items-center px-4 py-3 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1 border-t border-slate-100 mt-2">
              <a
                href="#contact"
                onClick={e => scrollTo(e, '#contact')}
                className="flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-200"
              >
                {settings.navbar_cta_text}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}