'use client'

import Image from 'next/image'
import type { ProductView } from '@/lib/products'
import type { StockStatus } from '@/lib/site-config'
import { waProduct } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useLanguage } from '@/hooks/useLanguage'

const badgeClass: Record<string, string> = {
  available: 'badge-available',
  limited: 'badge-limited',
  out_of_stock: 'badge-out',
}

const stockText: Record<'id' | 'en', Record<StockStatus, string>> = {
  id: { available: 'Stok Tersedia', limited: 'Stok Terbatas', out_of_stock: 'Stok Habis' },
  en: { available: 'In Stock', limited: 'Limited Stock', out_of_stock: 'Out of Stock' },
}

// STEP 4 §2 — Produk di posisi 2. Header asimetris kiri + underline karung.
// Tiap kartu: badge stok + WA pre-fill nama produk + link detail per-slug.
// Konten kartu pakai copy locale per-slug (landing.products.*) dengan fallback ke data produk.
export function ProductGrid({ products }: { products: ProductView[] }) {
  const { lang, t } = useLanguage()

  return (
    <section id="produk" className="py-20 sm:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-secondary-600 font-semibold text-sm uppercase tracking-[0.2em] mb-2">
            {lang === 'id' ? 'Produk Utama' : 'Core Products'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            {lang === 'id' ? 'Rempah yang kami stok rutin' : 'Spices we stock regularly'}
          </h2>
          <span className="karung-underline mt-4" />
          <p className="text-ink-muted mt-5">
            {lang === 'id'
              ? 'Harga mengikuti volume dan kurs. Tanyakan stok & penawaran terbaru langsung via WhatsApp — dibalas cepat.'
              : 'Pricing depends on volume and exchange rate. Ask for current stock and quotes on WhatsApp — we reply fast.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const base = `landing.products.${p.slug}`
            const name = t(`${base}.name`, lang === 'id' ? p.name_id : p.name_en)
            const blurb = t(`${base}.description`, p.blurb_id)
            return (
              <article
                key={p.slug}
                className="group bg-surface rounded-2xl overflow-hidden border border-secondary-100
                           hover:border-accent/50 hover:shadow-card transition-all flex flex-col"
              >
                <a href={`/products/${p.slug}`} className="relative aspect-4/3 bg-secondary-100 overflow-hidden block">
                  <Image
                    src={p.image}
                    alt={`${p.name_id} — ${p.name_en}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3">
                    <span className={badgeClass[p.stock]}>{stockText[lang][p.stock]}</span>
                  </span>
                </a>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    <a href={`/products/${p.slug}`} className="hover:text-primary transition-colors">
                      {name}
                    </a>
                  </h3>
                  <p className="text-ink-muted text-sm">
                    <span className="italic">{p.scientific}</span>
                  </p>

                  <p className="text-ink/70 text-sm mt-3 line-clamp-3">{blurb}</p>

                  <dl className="mt-4 space-y-1.5 text-sm">
                    {p.specs.slice(0, 3).map((s) => (
                      <div key={s.label_id} className="flex justify-between gap-2">
                        <dt className="text-ink-muted">{s.label_id}</dt>
                        <dd className="text-ink font-medium text-right">{s.value}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-2 pt-1.5 border-t border-secondary-100">
                      <dt className="text-ink-muted">MOQ</dt>
                      <dd className="text-ink font-medium text-right">{p.moq}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex gap-2">
                    <a
                      href={waProduct(`${p.name_id} (${p.name_en})`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp flex-1 px-4 py-3 text-sm"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      {lang === 'id' ? 'Tanya' : 'Ask'}
                    </a>
                    <a href={`/products/${p.slug}`} className="btn-secondary px-4 py-3 text-sm">
                      {lang === 'id' ? 'Detail' : 'Details'}
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
