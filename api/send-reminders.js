import { createClient } from '@supabase/supabase-js'

const TYPE_LABELS = {
  inpatient: 'Inpatient Admission',
  outpatient: 'Outpatient Treatment',
  followup: 'Follow-up Care',
}
const VISIT_LABELS = {
  family_visit: 'family visit',
  checkup: 'checkup',
  counseling_session: 'counseling session',
}

// Existing phone numbers are free-text with no country code (e.g. "9876543210").
// This is an India-based NGO, so bare 10-digit numbers are assumed to be Indian
// mobile numbers; anything longer is assumed to already include a country code.
function toE164India(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  return digits
}

function tomorrowDateString() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const brevoApiKey = process.env.BREVO_API_KEY
  const brevoSender = process.env.BREVO_SENDER_EMAIL
  const brevoSenderName = process.env.BREVO_SENDER_NAME || 'Green Valley Foundation'
  const brevoSmsSender = process.env.BREVO_SMS_SENDER

  if (!supabaseUrl || !serviceRoleKey || !brevoApiKey || !brevoSender) {
    console.error('[send-reminders] missing config')
    res.status(500).json({ error: 'Reminders are not configured' })
    return
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const tomorrow = tomorrowDateString()

  const sendSms = async (phone, content) => {
    if (!phone || !brevoSmsSender) return
    try {
      const r = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
        method: 'POST',
        headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ sender: brevoSmsSender, recipient: toE164India(phone), content, type: 'transactional' }),
      })
      if (!r.ok) console.error('[send-reminders] SMS failed:', await r.text())
    } catch (err) {
      console.error('[send-reminders] SMS request failed:', err)
    }
  }

  const sendEmail = async (email, name, subject, htmlContent) => {
    if (!email) return
    try {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { email: brevoSender, name: brevoSenderName },
          to: [{ email, name: name || email }],
          subject,
          htmlContent,
        }),
      })
      if (!r.ok) console.error('[send-reminders] email failed:', await r.text())
    } catch (err) {
      console.error('[send-reminders] email request failed:', err)
    }
  }

  let appointmentsReminded = 0
  let visitsReminded = 0

  try {
    const { data: appointments, error: apptErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'confirmed')
      .eq('preferred_date', tomorrow)
      .eq('reminder_sent', false)

    if (apptErr) console.error('[send-reminders] appointments query failed:', apptErr)

    for (const appt of appointments || []) {
      const label = TYPE_LABELS[appt.appointment_type] || 'appointment'
      await sendSms(appt.phone, `Reminder: Your ${label} appointment at Green Valley Foundation is tomorrow (${tomorrow}). Contact us if you need to reschedule.`)
      await sendEmail(
        appt.email, appt.name,
        'Reminder: Your appointment is tomorrow — Green Valley Foundation',
        `<p>Hi ${appt.name},</p><p>This is a reminder that your <strong>${label}</strong> appointment at <strong>Green Valley Foundation</strong> is scheduled for tomorrow, ${tomorrow}.</p><p>Please contact us if you need to reschedule.</p>`
      )
      await supabase.from('appointments').update({ reminder_sent: true }).eq('id', appt.id)
      appointmentsReminded++
    }

    const { data: visits, error: visitErr } = await supabase
      .from('patient_visits')
      .select('*, patients(full_name, phone, email)')
      .eq('status', 'scheduled')
      .eq('scheduled_date', tomorrow)
      .eq('reminder_sent', false)

    if (visitErr) console.error('[send-reminders] visits query failed:', visitErr)

    for (const visit of visits || []) {
      const patient = visit.patients
      const visitLabel = VISIT_LABELS[visit.visit_type] || 'visit'

      if (patient?.phone) {
        await sendSms(patient.phone, `Reminder: A ${visitLabel} for ${patient.full_name} is scheduled for tomorrow (${tomorrow}) at Green Valley Foundation.`)
      }

      const { data: links } = await supabase.from('guardian_patients').select('guardian_id').eq('patient_id', visit.patient_id)
      if (links && links.length > 0) {
        const { data: guardianProfiles } = await supabase.from('profiles').select('email').in('id', links.map(l => l.guardian_id))
        for (const g of guardianProfiles || []) {
          await sendEmail(
            g.email, null,
            'Reminder: Upcoming visit tomorrow — Green Valley Foundation',
            `<p>Hello,</p><p>This is a reminder that a <strong>${visitLabel}</strong> for <strong>${patient?.full_name || 'your family member'}</strong> is scheduled for tomorrow, ${tomorrow}, at Green Valley Foundation.</p>`
          )
        }
      }

      await supabase.from('patient_visits').update({ reminder_sent: true }).eq('id', visit.id)
      visitsReminded++
    }

    res.status(200).json({ success: true, appointmentsReminded, visitsReminded })
  } catch (err) {
    console.error('[send-reminders] unexpected failure:', err)
    res.status(500).json({ error: 'Failed to send reminders' })
  }
}
