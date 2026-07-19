import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Leaf, Loader2 } from 'lucide-react'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [validLink, setValidLink] = useState(false)
  const [linkError, setLinkError] = useState(null)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  useEffect(() => {
    // Supabase appends either a session (#access_token=...) or an error
    // (#error=access_denied&error_code=...) to the URL hash after the
    // invite/recovery link is verified. Surface the real reason instead of
    // just saying "invalid or expired".
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const errorCode = hashParams.get('error_code')
    const errorDescription = hashParams.get('error_description')
    if (hashParams.get('error')) {
      console.error('[reset-password] Supabase link error', {
        error: hashParams.get('error'),
        errorCode,
        errorDescription,
      })
      setLinkError(
        errorCode === 'otp_expired'
          ? 'This invite link has already been used or has expired.'
          : errorDescription?.replace(/\+/g, ' ') || 'This link is invalid.'
      )
    }

    // Supabase fires PASSWORD_RECOVERY for type=recovery links and SIGNED_IN
    // for type=invite links, so both events indicate a valid link.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setValidLink(true)
        setReady(true)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidLink(true)
      }
      setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const onSubmit = async ({ password }) => {
    setLoading(true)
    const { data, error } = await supabase.auth.updateUser({ password })

    if (error) {
      setLoading(false)
      toast.error(error.message || 'Could not update password. Please try again.')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()

    setLoading(false)
    toast.success('Password updated. Please sign in with your new password.')
    await supabase.auth.signOut()
    navigate(profile?.role === 'guardian' ? '/guardian' : '/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Set a New Password</h1>
          <p className="text-slate-500 text-sm mt-1">Green Valley Foundation</p>
        </div>

        {!ready ? (
          <div className="flex justify-center p-6 text-slate-500 text-sm">Loading…</div>
        ) : !validLink ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              {linkError || 'This reset link is invalid or has expired.'} Please ask your admin to send a new invite, or request a new one from the login page.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: true,
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message || 'Passwords do not match'}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-60 shadow-lg shadow-emerald-200 text-sm"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Updating…</> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
