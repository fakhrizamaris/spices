'use client'

import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'
import { waGeneral } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useLanguage } from '@/hooks/useLanguage'

// Hero text-forward: foto gudang jadi PITA pendek di atas (tetap bukti stok),
// lalu headline + CTA + stats langsung dominan tanpa scroll.
export function Hero() {
  const { lang, t } = useLanguage()
  const region = lang === 'id' ? siteConfig.location.region_id : siteConfig.location.region_en

  return (
    <section id="top" className="relative bg-primary-950 grain overflow-hidden">
      <div className="absolute inset-0 bg-skylight" />

      {/* Pita foto pendek — bukti stok, lalu menyatu ke hijau gelap */}
      <div className="relative h-40 sm:h-52 lg:h-60 w-full overflow-hidden">
        <Image
          src="/gudang/gudang-rajawali3.jpeg"
          alt="Gudang penyimpanan rempah JefendiSpice di Sumatera Utara"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent" />
        <span className="karung-rule absolute inset-x-0 top-0" />

        <div className="absolute bottom-4 left-0 right-0">
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-sm
                            border border-white/20 px-3.5 py-1.5">
              <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
              <span className="text-primary-50 text-xs sm:text-sm font-medium">
                {lang === 'id' ? 'Stok fisik' : 'Physical stock'} · {region}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blok teks dominan */}
      <div className="relative z-10 container mx-auto px-4 pt-10 pb-16 sm:pt-12 sm:pb-20">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-cream max-w-3xl leading-[1.05]">
          {t('landing.hero.headline', 'Rempah Ekspor Bersertifikat, Stok Siap Kirim')}
        </h1>
        <span className="karung-underline mt-6" />

        <p className="mt-6 text-lg text-primary-100/85 max-w-xl">
          {t(
            'landing.hero.subheadline',
            'Pinang, pala, cengkeh, dan kemiri dari gudang kami di Sumatera Utara — lengkap dengan dokumen ekspor dan siap kirim ke seluruh dunia.'
          )}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-base">
            <WhatsAppIcon className="w-5 h-5" />
            {t('landing.hero.cta_primary', 'Cek stok & harga via WhatsApp')}
          </a>
          <a
            href="#produk"
            className="btn border border-white/30 hover:border-white text-cream px-7 py-3.5
                       backdrop-blur-sm text-base"
          >
            {t('landing.hero.cta_secondary', 'Lihat produk & spesifikasi')}
          </a>
        </div>

        <dl className="mt-12 grid grid-cols-3 gap-4 max-w-lg pt-6 relative">
          <span className="karung-rule absolute inset-x-0 top-0 opacity-80" />
          <div>
            <dt className="text-primary-200/70 text-xs">
              {lang === 'id' ? 'Kapasitas / bulan' : 'Capacity / month'}
            </dt>
            <dd className="text-cream font-display text-2xl font-bold">±{siteConfig.stats.monthlyCapacityMT} MT</dd>
          </div>
          <div>
            <dt className="text-primary-200/70 text-xs">
              {lang === 'id' ? 'Pasar ekspor' : 'Export market'}
            </dt>
            <dd className="text-cream font-display text-2xl font-bold">5+ {lang === 'id' ? 'Negara' : 'Countries'}</dd>
          </div>
          <div>
            <dt className="text-primary-200/70 text-xs">
              {lang === 'id' ? 'Respon' : 'Response'}
            </dt>
            <dd className="text-cream font-display text-2xl font-bold">&lt; 2 {lang === 'id' ? 'jam' : 'hrs'}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
