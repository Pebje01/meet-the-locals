import type { Metadata } from 'next'
import { WerkInOpdrachtClient } from './WerkInOpdrachtClient'

export const metadata: Metadata = {
  title: 'Werk in opdracht',
  description:
    'Reis, content en fotografie in opdracht. Van contentreizen tot merkverhalen: een selectie van het werk dat ik voor klanten maak.',
  openGraph: {
    title: 'Werk in opdracht | Meet the Locals',
    description:
      'Reis, content en fotografie in opdracht. Van contentreizen tot merkverhalen: een selectie van het werk dat ik voor klanten maak.',
  },
  alternates: {
    canonical: '/werk-in-opdracht',
  },
}

export default function WerkInOpdrachtPage() {
  return <WerkInOpdrachtClient />
}
