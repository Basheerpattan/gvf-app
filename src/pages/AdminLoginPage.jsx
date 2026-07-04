import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Leaf, Loader2, ArrowLeft } from 'lucide-react'

export function AdminLoginPage() {
  const { signIn, user, role, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { register, handleSubmit } = useForm()
  const forgotPasswordForm = useForm()

  if (!authLoading && user && role) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/staff/forms'} replace />
  }

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    const { data, error } = await signIn(email, password)

    if (error) {
      setLoading(false)
      toast.error('Invalid credentials. Please try again.')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    setLoading(false)

    if (profile?.role === 'admin') navigate('/admin/dashboard')
    else if (profile?.role === 'staff') navigate('/staff/forms')
    else toast.error('No role assigned to this account.')
  }

  const onForgotPasswordSubmit = async ({ email }) => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message || 'Could not send reset email. Please try again.')
      return
    }

    toast.success('If an account exists for that email, a reset link has been sent.')
    setShowForgotPassword(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Staff & Admin Portal</h1>
          <p className="text-slate-500 text-sm mt-1">
            {showForgotPassword ? 'Reset your password' : 'Green Valley Foundation — sign in to continue'}
          </p>
        </div>

        {showForgotPassword ? (
          <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                {...forgotPasswordForm.register('email', { required: true })}
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-60 shadow-lg shadow-emerald-200 text-sm"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium py-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to sign in
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  {...register('password', { required: true })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-60 shadow-lg shadow-emerald-200 text-sm"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              Admin accounts are redirected to the dashboard.<br />
              Staff accounts are redirected to patient forms.
            </p>
          </>
        )}
      </div>
    </div>
  )
}