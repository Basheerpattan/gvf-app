import { CheckCircle, Shield, Users, Heart } from 'lucide-react'

const values = [
  { icon: Heart,         title: 'Compassion First',     desc: 'Every individual is treated with dignity, empathy, and non-judgmental care.' },
  { icon: Shield,        title: 'Evidence-Based',        desc: 'Our programs are backed by clinical research and proven recovery methodologies.' },
  { icon: Users,         title: 'Family Involvement',   desc: 'We engage families throughout the recovery journey for lasting healing.' },
  { icon: CheckCircle,   title: 'Holistic Approach',    desc: 'Mind, body, and spirit wellness — yoga, counseling, and medical support.' },
]

export function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: image placeholder */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 aspect-[4/3]">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-300">
                <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-40">
                  <path fill="currentColor" d="M100,10 C60,10 20,50 20,100 C20,150 60,190 100,190 C140,190 180,150 180,100 C180,50 140,10 100,10 Z M100,30 C130,30 155,55 160,85 C145,75 125,70 100,75 C75,70 55,75 40,85 C45,55 70,30 100,30 Z" />
                </svg>
                <p className="text-emerald-500 font-medium mt-2 text-sm">Our Healing Center</p>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-emerald-50">
              <div className="text-3xl font-bold text-emerald-600 font-display">15+</div>
              <div className="text-slate-500 text-sm">Years of Excellence</div>
            </div>
            <div className="absolute -top-6 -left-6 bg-emerald-600 rounded-2xl shadow-xl p-5 text-white">
              <div className="text-3xl font-bold font-display">2000+</div>
              <div className="text-emerald-200 text-sm">Lives Transformed</div>
            </div>
          </div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-4">
              About Us
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mb-6 leading-tight">
              A Sanctuary of Healing &<br />
              <span className="text-emerald-600">Second Chances</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Founded in 2008, Green Valley Foundation has been at the forefront of addiction recovery
              in the region. We believe that addiction is not a moral failing — it is a medical condition
              that deserves compassionate, professional care.
            </p>
            <p className="text-slate-600 leading-relaxed mb-10">
              Our 7-acre serene campus provides a safe, structured environment where individuals can
              detox safely, rebuild their lives, and discover purpose. Our team of certified addiction
              specialists, counselors, psychiatrists, and yoga therapists work together to provide
              comprehensive, individualized care.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-slate-50 rounded-2xl p-4 hover:bg-emerald-50 transition-colors group">
                  <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <Icon size={20} className="text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
