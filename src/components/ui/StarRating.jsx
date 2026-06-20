import { Star } from 'lucide-react'

export function StarRating({ rating, max = 5, interactive = false, onChange, size = 20 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onChange?.(i + 1)}
        />
      ))}
    </div>
  )
}
