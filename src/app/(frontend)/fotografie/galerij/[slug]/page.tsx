type Props = {
  params: Promise<{ slug: string }>
}

export default async function GalerijDetailPage({ params }: Props) {
  const { slug } = await params
  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-6 py-24 lg:px-10">
      <h1 className="text-4xl font-bold">{slug}</h1>
    </main>
  )
}
