import type { Metadata } from 'next'
import { WerkInOpdrachtClient } from './WerkInOpdrachtClient'

export const metadata: Metadata = {
  title: 'Werk in opdracht | Meet the Locals',
  description:
    'Reis, content en fotografie in opdracht. Van contentreizen tot merkverhalen: een selectie van het werk dat ik voor klanten maak.',
}

export default function WerkInOpdrachtPage() {
  return <WerkInOpdrachtClient />
}
