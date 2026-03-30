type Props = {
  params: Promise<{ slug: string }>
}

export default async function GalerijDetailPage({ params }: Props) {
  const { slug } = await params
  return (
    <main className="min-h-screen px-6 py-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold">{slug}</h1>
    </main>
  )
}
