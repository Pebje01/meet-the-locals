import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Over Meet the Locals',
  description:
    'Leer mij kennen: wie ik ben, waarom ik reis en hoe Meet the Locals is ontstaan. Een blog over reizen, fotografie en de mensen die je onderweg tegenkomt.',
  openGraph: {
    title: 'Over Meet the Locals',
    description:
      'Wie ik ben, waarom ik reis en hoe Meet the Locals is ontstaan. Een blog over reizen, fotografie en de mensen die je onderweg tegenkomt.',
    images: [{ url: '/media/about-hero-img-1.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/over',
  },
}

export default function OverPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold">Over Meet the Locals</h1>
    </main>
  )
}
