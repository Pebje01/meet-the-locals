import type { Metadata } from 'next'

// Placeholderpagina: noindex tot er echte content staat
export const metadata: Metadata = {
  title: 'Fotografie Blog | Meet the Locals',
  robots: { index: false, follow: true },
  alternates: { canonical: '/fotografie/blog' },
}

export default function FotografieBlogPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-6 py-24 lg:px-10">
      <h1 className="text-4xl font-bold">Fotografie Blog</h1>
      <p className="mt-4 text-gray-600">Tips, tutorials en gear reviews.</p>
    </main>
  )
}
