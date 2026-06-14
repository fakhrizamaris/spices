'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { warehouseGallery, siteConfig } from '@/lib/site-config'
import type { GalleryView } from '@/lib/gallery'
import { waQuote } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useLanguage } from '@/hooks/useLanguage'

// STEP 4 §3 — Bukti stok. Section gelap dengan grain + glow skylight.
// Foto asli bisa diklik → lightbox zoom (yet-another-react-lightbox).
// `items` dari DB galeri (via page), default ke foto gudang statis.
export function WarehouseGallery({ items = warehouseGallery }: { items?: GalleryView[] }) {
  const { lang } = useLanguage()
  const [index, setIndex] = useState(-1)
  const caption = (item: GalleryView) => (lang === 'id' ? item.caption_id : item.caption_en)
  const region = lang === 'id' ? siteConfig.location.region_id : siteConfig.location.region_en

  const slides = items.map((item) => ({
    src: item.src,
    description: caption(item),
  }))

  return (
    <section id="gudang" className="relative py-20 sm:py-24 bg-primary-900 text-cream grain overflow-hidden">
      <div className="absolute inset-0 bg-skylight" />
      <span className="karung-rule absolute inset-x-0 top-0" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-2">
            {lang === 'id' ? 'Bukti Stok Nyata' : 'Real Stock, Proven'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            {lang === 'id' ? 'Gudang kami, foto asli — bukan stok foto' : 'Our warehouse, real photos — not stock images'}
          </h2>
          <span className="karung-underline mt-4" />
          <p className="text-primary-100/70 mt-5">
            {lang === 'id' ? (
              <>Barang fisik ada di gudang {region}. Inilah yang membedakan supplier nyata dari makelar kosong.</>
            ) : (
              <>The goods physically sit in our {region} warehouse. That is what separates a real supplier from an empty broker.</>
            )}
          </p>
        </div>

        {/* Masonry: 1 kolom mobile, 2 tablet, 3 desktop — foto pertama membesar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={lang === 'id' ? `Perbesar: ${caption(item)}` : `Zoom: ${caption(item)}`}
              className={`group relative overflow-hidden rounded-xl bg-primary-800 text-left
                          focus:outline-none focus:ring-2 focus:ring-accent
                          ${i === 0 ? 'sm:col-span-2 lg:row-span-2 aspect-4/3 lg:aspect-auto' : 'aspect-square'}`}
            >
              <Image
                src={item.src}
                alt={caption(item)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-950/90 to-transparent
                               p-3 text-xs text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity">
                {caption(item)}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5
                        bg-white/5 border border-white/10 rounded-2xl p-6">
          <div>
            <p className="font-display text-xl font-semibold">
              {lang === 'id' ? 'Yakin dengan stok kami?' : 'Confident in our stock?'}
            </p>
            <p className="text-primary-100/70 text-sm mt-1">
              {lang === 'id'
                ? 'Minta penawaran resmi & foto stok terbaru per produk.'
                : 'Request an official quote & the latest stock photos per product.'}
            </p>
          </div>
          <a href={waQuote()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp whitespace-nowrap">
            <WhatsAppIcon className="w-5 h-5" />
            {lang === 'id' ? 'Minta Penawaran' : 'Request a Quote'}
          </a>
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(6, 21, 14, 0.94)' } }}
      />
    </section>
  )
}
