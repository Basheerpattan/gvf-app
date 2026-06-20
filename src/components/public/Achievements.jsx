import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Trophy, Users, Clock, Heart, Award, Star } from 'lucide-react'

const iconMap = { Trophy, Users, Clock, Heart, Award, Star }

const defaultAchievements = [
  { icon: 'Users',  value: '2000+', title: 'Patients Treated',      description: 'Individuals successfully treated across all programs' },
  { icon: 'Clock',  value: '15+',   title: 'Years of Service',       description: 'Consistently delivering quality addiction care' },
  { icon: 'Heart',  value: '98%',   title: 'Recovery Success Rate',  description: 'Of our patients maintain sobriety after 1 year' },
  { icon: 'Award',  value: '12',    title: 'Awards Won',             description: 'Regional and national recognition for excellence' },
  { icon: 'Users',  value: '50+',   title: 'Expert Staff',           description: 'Certified counselors, doctors and therapists' },
  { icon: 'Star',   value: '4.9/5', title: 'Patient Satisfaction',   description: 'Average rating from patient feedback surveys' },
]

function Counter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const numeric = parseFloat(target)
    if (isNaN(numeric)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 2000
        const steps = 60
        const increment = numeric / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= numeric) {
            setCount(numeric)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  const suffix = target.replace(/[\d.]/g, '')
  return <span ref={ref}>{count}{suffix}</span>
}

export function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('achievements').select('*').order('display_order')
      .then(({ data }) => {
        setAchievements(data?.length ? data : defaultAchievements)
        setLoading(false)
      })
      .catch(() => { setAchievements(defaultAchievements); setLoading(false) })
  }, [])

  const items = achievements.length ? achievements : defaultAchievements

  return (
    <section id="achievements" className="py-20 lg:py-28 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2px, transparent 0)`,
        backgroundSize: '100px 100px'
      }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-400 font-semibold text-sm tracking-widest uppercase mb-4">
            Our Impact
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Milestones That Matter
          </h2>
          <p className="text-emerald-200/70 max-w-xl mx-auto">
            Every number represents a life changed, a family restored, and a future reclaimed.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon] || Trophy
            return (
              <div
                key={i}
                className="group bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/50 transition-colors">
                  <Icon size={24} className="text-emerald-300" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white font-display mb-2">
                  <Counter target={item.value} />
                </div>
                <div className="text-emerald-300 font-semibold mb-1">{item.title}</div>
                <div className="text-emerald-200/60 text-sm leading-relaxed">{item.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
