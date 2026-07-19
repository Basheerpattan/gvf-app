import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { email, patientId, redirectOrigin } = req.body || {}

  if (!email || !patientId || !redirectOrigin) {
    res.status(400).json({ error: 'Missing email, patientId, or redirectOrigin' })
    return
  }

  console.log('[invite-guardian] start', { email, patientId, redirectOrigin })

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[invite-guardian] missing config:', { hasUrl: !!supabaseUrl, hasKey: !!serviceRoleKey })
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
      console.error('[invite-guardian] profile lookup failed:', lookupErr)
      res.status(500).json({ error: 'Failed to look up existing account' })
      return
    }

    if (existingProfile && existingProfile.role !== 'guardian') {
      console.warn('[invite-guardian] blocked: email belongs to staff/admin account', { email })
      res.status(400).json({ error: 'This email already has a staff/admin account' })
      return
    }

    let guardianId = existingProfile?.id

    if (!guardianId) {
      console.log('[invite-guardian] no existing profile, sending Supabase invite email', { email })
      const { data: invited, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${redirectOrigin}/reset-password`,
      })
      if (inviteErr) {
        console.error('[invite-guardian] inviteUserByEmail failed:', { email, message: inviteErr.message, status: inviteErr.status })
        res.status(502).json({ error: inviteErr.message || 'Failed to send invite' })
        return
      }

      guardianId = invited.user.id
      console.log('[invite-guardian] invite email sent by Supabase', { email, guardianId, invitedAt: invited.user.invited_at })

      const { error: profileErr } = await supabaseAdmin
        .from('profiles')
        .insert({ id: guardianId, role: 'guardian', email })
      if (profileErr) {
        console.error('[invite-guardian] profile insert failed:', { email, guardianId, message: profileErr.message })
        res.status(500).json({ error: 'Invite sent, but failed to set up the guardian account' })
        return
      }
      console.log('[invite-guardian] profile row created', { guardianId })
    } else {
      console.log('[invite-guardian] guardian profile already exists, skipping invite email, just linking patient', { email, guardianId })
    }

    const { error: linkErr } = await supabaseAdmin
      .from('guardian_patients')
      .insert({ guardian_id: guardianId, patient_id: patientId })

    if (linkErr && linkErr.code !== '23505') {
      console.error('[invite-guardian] guardian_patients link insert failed:', { guardianId, patientId, message: linkErr.message })
      res.status(500).json({ error: 'Failed to link guardian to patient' })
      return
    }

    console.log('[invite-guardian] done', { email, guardianId, patientId })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[invite-guardian] unexpected failure:', err)
    res.status(500).json({ error: 'Failed to invite guardian' })
  }
}
