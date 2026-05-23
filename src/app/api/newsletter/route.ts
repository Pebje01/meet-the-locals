import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'E-mailadres is verplicht.' }, { status: 400 })
  }

  const apiKey = process.env.MAILERLITE_API_KEY
  if (!apiKey) {
    console.error('MAILERLITE_API_KEY is niet geconfigureerd')
    return NextResponse.json({ error: 'Serverconfiguratie ontbreekt.' }, { status: 500 })
  }

  const body: Record<string, unknown> = {
    email: email.trim().toLowerCase(),
    status: 'active',
  }

  if (name && typeof name === 'string' && name.trim()) {
    body.fields = { name: name.trim() }
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  // 200 = bestaande subscriber bijgewerkt, 201 = nieuw aangemeld
  if (response.ok) {
    return NextResponse.json({ success: true })
  }

  const errorData = await response.json().catch(() => ({}))
  console.error('MailerLite fout:', response.status, errorData)

  return NextResponse.json(
    { error: 'Aanmelden mislukt. Probeer het later opnieuw.' },
    { status: response.status },
  )
}
