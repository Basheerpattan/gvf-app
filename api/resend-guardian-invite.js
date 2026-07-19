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

  try {
    const { data: existingProfile, error: lookupErr } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', email)
      .maybeSingle()

    if (lookupErr) {
      console.error('[resend-guardian-invite] profile lookup failed:', lookupErr)
      res.status(500).json({ error: 'Failed to look up guardian account' })
      return
    }

    if (!existingProfile || existingProfile.role !== 'guardian') {
      res.status(404).json({ error: 'No guardian account found for this email' })
      return
    }

    // Re-inviting an email that already has a *confirmed* account fails with
    // "already registered" — that's expected once the guardian has accepted
    // a previous invite, so surface it as a friendly message instead of an error.
    const { error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${redirectOrigin}/reset-password`,
    })

    if (inviteErr) {
      const alreadyActive = /already registered/i.test(inviteErr.message || '')
      res.status(alreadyActive ? 409 : 502).json({
        error: alreadyActive
          ? 'This guardian already has an active account. Ask them to use "Forgot password" on the login page instead.'
          : (inviteErr.message || 'Failed to resend invite'),
      })
      return
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[resend-guardian-invite] unexpected failure:', err)
    res.status(500).json({ error: 'Failed to resend invite' })
  }
}
