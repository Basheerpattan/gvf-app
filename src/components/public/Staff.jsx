import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { User } from 'lucide-react'

export function Staff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('staff').select('*').order('display_order')
      .then(({ data }) => { setStaff(data || []); setLoading(false) })
  }, [])

  return (
    <section id="team" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-4">Our Team</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mb-4">
            Meet the Healers
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Our dedicated team of certified professionals brings compassion and expertise to every patient's journey.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <User size={48} className="mx-auto mb-4 opacity-30" />
            <p>Team information coming soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map(member => (
              <div key={member.id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-50 relative overflow-hidden">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-emerald-200 rounded-full flex items-center justify-center">
                        <User size={36} className="text-emerald-600" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-0.5">{member.name}</h3>
                  <p className="text-emerald-600 font-medium text-sm mb-3">{member.designation}</p>
                  {member.bio && <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
