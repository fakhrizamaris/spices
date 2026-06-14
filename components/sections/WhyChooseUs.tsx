'use client'

import { useLanguage } from '@/hooks/useLanguage'

type Item = { title: string; desc: string }

const FALLBACK_TITLE = 'Kenapa Importir Memilih Kami'
const FALLBACK_ITEMS: Item[] = [
  { title: 'Dokumen Ekspor Lengkap', desc: 'Setiap pengiriman dilengkapi sertifikat fitosanitasi dan certificate of origin.' },
  { title: 'Stok Bisa Anda Verifikasi', desc: 'Kami tunjukkan stok asli di gudang lewat video call sebelum Anda transfer.' },
  { title: 'Balasan Cepat via WhatsApp', desc: 'Tim kami biasanya membalas pertanyaan harga dan stok dalam kurang dari 2 jam.' },
  { title: 'Akses Langsung Pelabuhan Belawan', desc: 'Gudang kami dekat Belawan, memudahkan muat kontainer FCL dengan jadwal kirim yang pasti.' },
]

// 4 poin kepercayaan dengan bukti konkret. Latar hijau gelap = jeda visual
// setelah grid produk yang terang, sebelum bukti gudang.
export function WhyChooseUs() {
  const { t, tr } = useLanguage()
  const items = tr<Item[]>('landing.why_choose_us.items', FALLBACK_ITEMS)

  return (
    <section className="relative py-20 sm:py-24 bg-primary-900 text-cream grain overflow-hidden">
      <span className="karung-rule absolute inset-x-0 top-0" />
      <div className="absolute inset-0 bg-skylight" />
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            {t('landing.why_choose_us.title', FALLBACK_TITLE)}
          </h2>
          <span className="karung-underline mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6
                         hover:border-accent/40 transition-colors"
            >
              <span className="font-display text-accent text-2xl font-bold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-semibold mt-3">{item.title}</h3>
              <p className="text-primary-100/75 text-sm mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
