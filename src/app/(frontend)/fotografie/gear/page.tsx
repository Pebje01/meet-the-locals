import type { Metadata } from 'next'

// Placeholderpagina: noindex tot er echte content staat
export const metadata: Metadata = {
  title: 'Gear | Meet the Locals',
  robots: { index: false, follow: true },
  alternates: { canonical: '/fotografie/gear' },
}

export default function GearPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-6 py-24 lg:px-10">
      <h1 className="text-4xl font-bold">Gear</h1>
      <p className="mt-4 text-gray-600">Mijn camera-uitrusting en aanbevelingen.</p>
    </main>
  )
}
