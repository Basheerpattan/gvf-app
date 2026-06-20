import { ArrowDown, Phone, Heart } from 'lucide-react'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export function Hero() {
  const { settings } = useSiteSettings()

  const scrollTo = href => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  const stats = [
    { value: settings.hero_stat_1_value, label: settings.hero_stat_1_label },
    { value: settings.hero_stat_2_value, label: settings.hero_stat_2_label },
    { value: settings.hero_stat_3_value, label: settings.hero_stat_3_label },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: custom image or gradient */}
      {settings.hero_bg_image_url ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${settings.hero_bg_image_url})` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-slate-900/90" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900" />
      )}

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2 mb-8">
          <Heart size={14} className="text-emerald-400 fill-emerald-400" />
          <span className="text-emerald-300 text-sm font-medium">{settings.hero_badge}</span>
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-white leading-tight mb-6">
          {settings.hero_title}
          <br />
          <span className="text-emerald-400">{settings.hero_subtitle}</span>
        </h1>

        <p className="text-lg sm:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.hero_description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => scrollTo('#contact')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            <Phone size={20} />
            {settings.hero_cta_primary}
          </button>
          <button
            onClick={() => scrollTo('#about')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-lg border border-white/20 transition-all backdrop-blur-sm"
          >
            {settings.hero_cta_secondary}
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-white font-display">{stat.value}</div>
              <div className="text-emerald-300 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={28} />
      </button>
    </section>
  )
}
