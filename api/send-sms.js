const TYPE_LABELS = {
  inpatient: 'Inpatient Admission',
  outpatient: 'Outpatient Treatment',
  followup: 'Follow-up Care',
}

function normalizeIndianMobile(raw) {
  const digits = String(raw).replace(/[^\d]/g, '')
  return digits.slice(-10)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { phone, name, appointmentType } = req.body || {}

  if (!phone || !name) {
    res.status(400).json({ error: 'Missing phone or name' })
    return
  }

  const apiKey = process.env.FAST2SMS_API_KEY

  if (!apiKey) {
    console.error('[send-sms] missing config: FAST2SMS_API_KEY not set')
    res.status(500).json({ error: 'SMS is not configured' })
    return
  }

  const label = TYPE_LABELS[appointmentType] || 'appointment'
  const number = normalizeIndianMobile(phone)
  const message = `Hi ${name}, your ${label} appointment at Green Valley Foundation has been confirmed. Our team will contact you shortly.`

  try {
    const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message,
        language: 'english',
        flash: 0,
        numbers: number,
      }),
    })

    const data = await smsRes.json()
    if (!smsRes.ok || data.return !== true) {
      console.error('[send-sms] Fast2SMS API error:', { status: smsRes.status, data })
      res.status(502).json({ error: data.message?.[0] || 'SMS provider error' })
      return
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[send-sms] request failed:', err)
    res.status(500).json({ error: 'Failed to reach SMS provider' })
  }
}
