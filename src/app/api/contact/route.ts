import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  const apiKey = process.env.AHASEND_API_KEY
  const accountId = process.env.AHASEND_ACCOUNT_ID

  if (!apiKey || !accountId) {
    return NextResponse.json({ error: 'Serverconfiguratie ontbreekt.' }, { status: 500 })
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Vul alle velden in.' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.ahasend.com/v2/accounts/${accountId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          email: 'hello@meetthelocals.nl',
          name: 'Meet the Locals',
        },
        recipients: [
          {
            email: 'hello@meetthelocals.nl',
            name: 'Daley Jansen',
          },
        ],
        subject: `Nieuw contactbericht van ${name}`,
        html_content: `
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Bericht:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text_content: `Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`,
      }),
    })

    if (response.status === 202 || response.ok) {
      return NextResponse.json({ success: true })
    }

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(
      { error: data.message ?? 'Versturen mislukt. Probeer het later opnieuw.' },
      { status: response.status },
    )
  } catch {
    return NextResponse.json({ error: 'Geen verbinding. Probeer het later opnieuw.' }, { status: 500 })
  }
}
