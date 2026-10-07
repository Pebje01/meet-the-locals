import Image from 'next/image'
import Link from 'next/link'

export type PostCardData = {
  title: string
  /** Volledig pad, want overzichten mengen reportages (/verhalen) en blogposts (/blog). */
  href: string
  image: string
  excerpt?: string | null
  /** Label boven de titel: categorie, bestemming of werelddeel. */
  category?: string
  /** Al opgemaakt via formatDate(date, 'short'). */
  date?: string
}

/**
 * Kaart voor een verhaal in een raster: foto, label en datum, titel, korte intro.
 * De tekst staat onder de foto, niet erop, zodat hij altijd leesbaar is.
 */
export function PostCard({
  post,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: {
  post: PostCardData
  sizes?: string
}) {
  return (
    <article>
      <Link href={post.href} className="group block card-lift">
        <div className="relative mb-5 aspect-[4/3] overflow-hidden organic-img img-zoom bg-cream-dark">
          {post.image && <Image src={post.image} alt={post.title} fill className="object-cover" sizes={sizes} />}
        </div>
        {(post.category || post.date) && (
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {post.category && <span className="t-meta font-semibold text-accent">{post.category}</span>}
            {post.category && post.date && <span aria-hidden className="text-text-muted/30">|</span>}
            {post.date && <span className="t-meta text-text-muted/70">{post.date}</span>}
          </div>
        )}
        <h3 className="t-card mb-2 text-forest transition-colors group-hover:text-accent">{post.title}</h3>
        {post.excerpt && <p className="t-body line-clamp-2 text-text-muted">{post.excerpt}</p>}
      </Link>
    </article>
  )
}
