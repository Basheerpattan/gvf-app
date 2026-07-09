const TYPE_LABELS = {
  inpatient: 'Inpatient Admission',
  outpatient: 'Outpatient Treatment',
  followup: 'Follow-up Care',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { email, name, appointmentType } = req.body || {}

  if (!email || !name) {
    res.status(400).json({ error: 'Missing email or name' })
    return
  }

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'Green Valley Foundation'

  if (!apiKey || !senderEmail) {
    console.error('[send-email] missing config:', { hasApiKey: !!apiKey, hasSenderEmail: !!senderEmail })
    res.status(500).json({ error: 'Email is not configured' })
    return
  }

  const label = TYPE_LABELS[appointmentType] || 'appointment'
  const subject = 'Your appointment is confirmed — Green Valley Foundation'
  const htmlContent = `
    <p>Hi ${name},</p>
    <p>Your <strong>${label}</strong> appointment at <strong>Green Valley Foundation</strong> has been confirmed.</p>
    <p>Our team will contact you shortly with further details.</p>
    <p>Thank you for reaching out to us.</p>
  `

  try {
    const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email, name }],
        subject,
        htmlContent,
      }),
    })

    const data = await emailRes.json()
    if (!emailRes.ok) {
      console.error('[send-email] Brevo API error:', { status: emailRes.status, data })
      res.status(502).json({ error: data.message || 'Email provider error' })
      return
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[send-email] request failed:', err)
    res.status(500).json({ error: 'Failed to reach email provider' })
  }
}
