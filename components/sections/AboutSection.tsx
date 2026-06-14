'use client'

import { useLanguage } from '@/hooks/useLanguage'

const FALLBACK = {
  title: 'Tentang JefendiSpice',
  p1: 'JefendiSpice adalah eksportir rempah — bukan petani, melainkan mitra dagang yang mengumpulkan dan menyeleksi hasil panen terbaik dari petani di Sumatera Utara. Kami fokus pada satu hal: memastikan rempah yang Anda pesan sesuai spesifikasi, tepat waktu, dan siap kirim.',
  p2: 'Kami mengelola jaringan gudang di Sumatera Utara dengan izin ekspor resmi dan akses langsung ke Pelabuhan Belawan. Setiap karung disortir, dijemur, dan diperiksa kadar airnya sebelum masuk kontainer — sehingga Anda menerima mutu yang konsisten di setiap pengiriman.',
  p3: 'Bagi pembeli internasional, kepercayaan dibangun dari bukti. Kami siap menunjukkan stok lewat video call, mengirim sampel atas permintaan, dan melengkapi setiap pengiriman dengan sertifikat fitosanitasi serta certificate of origin. Anda tahu persis apa yang Anda beli sebelum membayar.',
}

// "Siapa kami" — eksportir non-produsen. Ditaruh setelah produk: pembeli sudah
// lihat barang, sekarang bangun kepercayaan pada perusahaannya.
export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="tentang" className="py-20 sm:py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-secondary-600 font-semibold text-sm uppercase tracking-[0.2em] mb-2">
            {t('nav.about', 'Tentang Kami')}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            {t('landing.about.title', FALLBACK.title)}
          </h2>
          <span className="karung-underline mt-4" />

          <div className="mt-7 space-y-5 text-ink/80 leading-relaxed">
            <p>{t('landing.about.p1', FALLBACK.p1)}</p>
            <p>{t('landing.about.p2', FALLBACK.p2)}</p>
            <p>{t('landing.about.p3', FALLBACK.p3)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
