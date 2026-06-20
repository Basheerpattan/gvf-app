import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Image as ImageIcon } from 'lucide-react'

export function Gallery() {
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setImages(data || []); setLoading(false) })
  }, [])

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-4">Gallery</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 mb-4">
            Our Campus & Activities
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A glimpse into the serene spaces and meaningful moments at Green Valley Foundation.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
            <p>Gallery images coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => (
              <div
                key={img.id}
                onClick={() => setSelected(img)}
                className="group aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-slate-200"
              >
                <img
                  src={img.url}
                  alt={img.caption || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.caption} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            {selected.caption && (
              <p className="text-white/70 text-center mt-4">{selected.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
