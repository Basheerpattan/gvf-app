import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { email, redirectOrigin } = req.body || {}

  if (!email || !redirectOrigin) {
    res.status(400).json({ error: 'Missing email or redirectOrigin' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[resend-guardian-invite] missing config:', { hasUrl: !!supabaseUrl, hasKey: !!serviceRoleKey })
    res.status(500).json({ error: 'Guardian invites are not configured' })
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  console.log('[resend-guardian-invite] start', { email, redirectOrigin })

  try {
    const { data: existingProfile, error: lookupErr } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', email)
      .maybeSingle()

    if (lookupErr) {
      console.error('[resend-guardian-invite] profile lookup failed:', { email, message: lookupErr.message })
      res.status(500).json({ error: 'Failed to look up guardian account' })
      return
    }

    if (!existingProfile || existingProfile.role !== 'guardian') {
      console.warn('[resend-guardian-invite] no guardian profile found', { email, found: existingProfile })
      res.status(404).json({ error: 'No guardian account found for this email' })
      return
    }

    console.log('[resend-guardian-invite] guardian profile found, sending recovery email', { email, guardianId: existingProfile.id })

    // The first invite already created this email's auth account, so
    // inviteUserByEmail() would always fail with "already registered" on
    // resend. Use the password-recovery flow instead — it works for any
    // existing account (confirmed or not) and lands on the same
    // /reset-password page to let the guardian set a password.
    const { error: resendErr } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectOrigin}/reset-password`,
    })

    if (resendErr) {
      console.error('[resend-guardian-invite] resetPasswordForEmail failed:', { email, message: resendErr.message, status: resendErr.status })
      res.status(502).json({ error: resendErr.message || 'Failed to resend invite' })
      return
    }

    console.log('[resend-guardian-invite] done, recovery email sent', { email, guardianId: existingProfile.id })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[resend-guardian-invite] unexpected failure:', err)
    res.status(500).json({ error: 'Failed to resend invite' })
  }
}
