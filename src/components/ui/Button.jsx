export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-lg hover:shadow-emerald-200 hover:shadow-xl',
    secondary: 'bg-white text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:     'bg-transparent text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    dark:      'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
