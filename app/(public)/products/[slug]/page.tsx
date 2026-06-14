import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { stockLabel, siteConfig } from '@/lib/site-config'
import { getProducts, getProductBySlug } from '@/lib/products'
import { waProduct } from '@/lib/whatsapp'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyWhatsApp } from '@/components/layout/StickyWhatsApp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

interface Props {
  params: Promise<{ slug: string }>
}

const badgeClass: Record<string, string> = {
  available: 'badge-available',
  limited: 'badge-limited',
  out_of_stock: 'badge-out',
}

export const revalidate = 3600

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produk tidak ditemukan' }

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jefendispice.my.id'
  const imgUrl = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`
  const title = `${product.name_en} Supplier Indonesia — ${siteConfig.name}`
  const description = `${product.blurb_id} MOQ: ${product.moq}. Ekspor dari Sumatera Utara. Hubungi JefendiSpice untuk harga & stok terkini.`

  return {
    title,
    description,
    keywords: [
      `${product.name_en.toLowerCase()} exporter indonesia`,
      `${product.name_en.toLowerCase()} supplier`,
      `buy ${product.name_en.toLowerCase()} wholesale`,
      `${product.name_id.toLowerCase()} ekspor`,
      `${product.scientific} supplier`,
      'indonesian spice exporter',
      'north sumatra exporter',
    ],
    openGraph: {
      title,
      description,
      images: [{ url: imgUrl, width: 800, height: 600, alt: `${product.name_en} — JefendiSpice` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imgUrl],
    },
    alternates: { canonical: `/products/${slug}` },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const all = await getProducts()
  const related = all.filter((p) => p.slug !== slug)

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jefendispice.my.id'
  const imgUrl = product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_en,
    alternateName: product.name_id,
    description: product.blurb_id,
    image: imgUrl,
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      availability:
        product.stock === 'available'
          ? 'https://schema.org/InStock'
          : product.stock === 'limited'
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: BASE_URL,
      },
      areaServed: ['IN', 'PK', 'BD', 'AE', 'SA', 'ID'],
      description: `MOQ: ${product.moq}. Kapasitas: ${product.capacity}.`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Header />
      <main className="bg-cream">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-8 pb-2">
          <nav className="text-sm text-ink-muted flex items-center gap-2">
            <a href="/" className="hover:text-primary">Beranda</a>
            <span>/</span>
            <a href="/#produk" className="hover:text-primary">Produk</a>
            <span>/</span>
            <span className="text-ink font-medium">{product.name_id}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 pb-20 pt-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Galeri */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 bg-secondary-100 rounded-3xl overflow-hidden shadow-card-sm">
                <Image
                  src={product.image}
                  alt={`${product.name_id} — ${product.name_en}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4">
                  <span className={badgeClass[product.stock]}>{stockLabel[product.stock]}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.gallery.map((src, i) => (
                  <div key={i} className="relative aspect-square bg-secondary-100 rounded-xl overflow-hidden">
                    <Image src={src} alt={`${product.name_id} ${i + 1}`} fill sizes="33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div className="lg:py-2">
              <p className="text-secondary-600 font-semibold text-sm uppercase tracking-[0.2em]">
                {product.name_en}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mt-2 leading-tight">
                {product.name_id}
              </h1>
              <p className="text-ink-muted italic mt-2">{product.scientific}</p>
              <span className="karung-underline mt-5" />

              <p className="text-ink/80 mt-6 leading-relaxed">{product.longDesc_id}</p>

              {/* Spesifikasi */}
              <div className="mt-8 bg-surface rounded-2xl border border-secondary-100 overflow-hidden">
                <div className="px-5 py-3 bg-primary-50 border-b border-secondary-100">
                  <h2 className="font-display font-semibold text-primary-900">Spesifikasi</h2>
                </div>
                <dl className="divide-y divide-secondary-100">
                  {product.specs.map((s) => (
                    <div key={s.label_id} className="grid grid-cols-2 gap-4 px-5 py-3 text-sm">
                      <dt className="text-ink-muted">{s.label_id}</dt>
                      <dd className="text-ink font-medium text-right">{s.value}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4 px-5 py-3 text-sm">
                    <dt className="text-ink-muted">MOQ</dt>
                    <dd className="text-ink font-medium text-right">{product.moq}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-5 py-3 text-sm">
                    <dt className="text-ink-muted">Kapasitas</dt>
                    <dd className="text-ink font-medium text-right">{product.capacity}</dd>
                  </div>
                </dl>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={waProduct(`${product.name_id} (${product.name_en})`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1 text-base"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Tanya Stok &amp; Harga
                </a>
                <a href="/#kontak" className="btn-secondary">Form Permintaan</a>
              </div>
              <p className="text-ink-muted text-xs mt-3 text-center sm:text-left">
                {siteConfig.stats.responseTime_id} · {siteConfig.stats.languages_id}
              </p>
            </div>
          </div>

          {/* Produk lain */}
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold text-ink">Produk lainnya</h2>
            <span className="karung-underline mt-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {related.map((p) => (
                <a
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group flex items-center gap-4 bg-surface rounded-2xl border border-secondary-100
                             hover:border-accent/50 hover:shadow-card-sm transition-all p-3"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary-100 shrink-0">
                    <Image src={p.image} alt={p.name_id} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink group-hover:text-primary transition-colors">
                      {p.name_id}
                    </h3>
                    <p className="text-ink-muted text-sm">{p.name_en}</p>
                    <span className={`${badgeClass[p.stock]} mt-2`}>{stockLabel[p.stock]}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  )
}
