export function Loader({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} ${className} animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader size="lg" className="mx-auto" />
        <p className="mt-4 text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}
