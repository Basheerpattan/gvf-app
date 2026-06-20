import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Leaf } from 'lucide-react'

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isHome = location.pathname === '/'

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-emerald-700 transition-colors">
            <Leaf size={20} className="text-white" />
          </div>
          <span className={`font-display font-bold text-lg leading-tight transition-colors ${scrolled || !isHome ? 'text-slate-800' : 'text-white'}`}>
            Green Valley<br /><span className="text-emerald-500 font-semibold text-sm">Foundation</span>
          </span>
        </Link>

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

        <div className="flex items-center gap-3">
          {isHome && (
            <a
              href="#contact"
              onClick={e => scrollTo(e, '#contact')}
              className="hidden lg:inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
            >
              Get Help Now
            </a>
          )}
          <Link
            to="/admin"
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${scrolled || !isHome ? 'text-slate-400 hover:text-slate-700' : 'text-white/40 hover:text-white/70'}`}
          >
            Admin
          </Link>
          {isHome && (
            <button onClick={() => setOpen(!open)} className={`lg:hidden p-2 rounded-xl ${scrolled ? 'text-slate-700' : 'text-white'}`}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </nav>

      {open && isHome && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => scrollTo(e, link.href)}
              className="block px-6 py-3.5 text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 border-b border-slate-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={e => scrollTo(e, '#contact')} className="block mx-4 my-3 px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl text-center">
            Get Help Now
          </a>
        </div>
      )}
    </header>
  )
}
