import { siteConfig } from '@/lib/site-config'

// STEP 4 §4 — Gatekeeping teknis. MOQ, dokumen, port, negara tujuan.
const EXPORT_FACTS = [
  { label: 'Port Muat', value: 'Pelabuhan Belawan, Medan' },
  { label: 'Incoterms', value: 'FOB · CIF · CNF' },
  { label: 'Dokumen', value: 'Phytosanitary · Certificate of Origin · Packing List' },
  { label: 'Negara Tujuan', value: 'India · Pakistan · UEA · Arab Saudi · lokal Indonesia' },
  { label: 'Kemasan', value: 'Karung PP 50 kg / sesuai permintaan buyer' },
  { label: 'Pembayaran', value: 'TT (Telegraphic Transfer) · L/C dinegosiasikan' },
]

export function ExportCapacity() {
  return (
    <section id="ekspor" className="py-20 sm:py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-secondary-600 font-semibold text-sm uppercase tracking-[0.2em] mb-2">
              Kapasitas Ekspor
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
              Siap untuk pesanan skala kontainer
            </h2>
            <span className="karung-underline mt-4" />
            <p className="text-ink-muted mt-5">
              Kami melayani importir dan trader dengan dokumen ekspor lengkap dan
              komunikasi cepat dalam Bahasa Indonesia &amp; English. Kapasitas pasokan
              hingga <strong className="text-ink">±{siteConfig.stats.monthlyCapacityMT} MT per bulan</strong>{' '}
              dengan repeat order bulanan.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-800
                               px-3.5 py-2 rounded-full text-sm font-medium">
                ✓ {siteConfig.stats.responseTime_id}
              </span>
              <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-800
                               px-3.5 py-2 rounded-full text-sm font-medium">
                ✓ {siteConfig.stats.languages_id}
              </span>
            </div>
          </div>

          <dl className="divide-y divide-secondary-100 border border-secondary-100 rounded-2xl overflow-hidden bg-cream">
            {EXPORT_FACTS.map((f) => (
              <div key={f.label} className="grid grid-cols-3 gap-4 px-5 py-4">
                <dt className="text-ink-muted text-sm col-span-1">{f.label}</dt>
                <dd className="text-ink text-sm font-medium col-span-2">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
