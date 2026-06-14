'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/site-config'
import { waGeneral } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useLanguage } from '@/hooks/useLanguage'
import type { ProductView } from '@/lib/products'

const EMPTY_FORM = { name: '', email: '', country: '', whatsapp: '', product_id: '', volume: '', message: '' }

// STEP 4 §6 / STEP 5 — Dua jalur paralel: WhatsApp (primer) + form (sekunder).
// Field: Nama, Negara, Email, WhatsApp, Produk (dropdown dari DB), Volume, Pesan.
export function ContactSection({ products = [] }: { products?: ProductView[] }) {
  const { lang, t } = useLanguage()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState(EMPTY_FORM)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    // Opsi dropdown ber-value `id || slug`. Kirim product_id hanya bila id DB
    // (uuid) ada; bila hanya slug (mode fallback statis), selipkan nama produk
    // ke pesan agar pilihan tidak hilang.
    const selected = products.find((p) => (p.id ?? p.slug) === form.product_id)
    const productId = selected?.id || undefined
    const productLabel = selected ? (lang === 'id' ? selected.name_id : selected.name_en) : ''
    const message =
      selected && !productId ? `[${lang === 'id' ? 'Produk' : 'Product'}: ${productLabel}]\n${form.message}` : form.message

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          country: form.country || undefined,
          whatsapp: form.whatsapp || undefined,
          product_id: productId,
          volume: form.volume || undefined,
          message,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm(EMPTY_FORM)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="kontak" className="py-20 sm:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            {t('landing.contact.headline', 'Mulai dari Sampel atau Satu Kontainer?')}
          </h2>
          <span className="karung-underline mt-4" />
          <p className="text-ink-muted mt-5">
            {t(
              'landing.contact.subtext',
              'Tanya harga, MOQ, dan ketersediaan stok dulu — tanpa keharusan order.'
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* WhatsApp — primer */}
          <div className="relative bg-primary-900 text-cream rounded-3xl p-8 flex flex-col justify-center grain overflow-hidden">
            <span className="karung-rule absolute inset-x-0 top-0" />
            <div className="absolute inset-0 bg-skylight" />
            <div className="relative">
              <p className="text-accent font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                {lang === 'id' ? 'Cara Tercepat' : 'Fastest Way'}
              </p>
              <h2 className="font-display text-3xl font-semibold">
                {t('landing.contact.whatsapp_cta', 'Chat langsung di WhatsApp')}
              </h2>
              <p className="text-primary-100/75 mt-3">
                {lang === 'id'
                  ? `${siteConfig.stats.responseTime_id}. ${siteConfig.stats.languages_id}.`
                  : 'We usually reply in under 2 hours. English, Hindi-friendly, and Indonesian.'}
              </p>

              <a href={waGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6">
                <WhatsAppIcon className="w-5 h-5" />
                {siteConfig.phoneDisplay}
              </a>

              <dl className="mt-8 space-y-3 text-sm border-t border-white/10 pt-6">
                <div className="flex gap-3">
                  <dt className="text-primary-200/70 w-20 shrink-0">Email</dt>
                  <dd>
                    <a href={`mailto:${siteConfig.email}`} className="text-primary-50 hover:text-accent">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-primary-200/70 w-20 shrink-0">{lang === 'id' ? 'Lokasi' : 'Location'}</dt>
                  <dd className="text-primary-50">{siteConfig.location.addressLine}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="text-primary-200/70 w-20 shrink-0">Port</dt>
                  <dd className="text-primary-50">{siteConfig.location.port}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Form — sekunder */}
          <div className="bg-surface rounded-3xl p-8 border border-secondary-100">
            <h3 className="font-display text-2xl font-semibold text-ink">
              {lang === 'id' ? 'Atau kirim permintaan' : 'Or send a request'}
            </h3>
            <p className="text-ink-muted text-sm mt-1">
              {lang === 'id' ? 'Kami balas via email/WhatsApp.' : 'We reply by email or WhatsApp.'}
            </p>

            {status === 'sent' ? (
              <div className="mt-6 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
                <p className="font-semibold text-primary-800">
                  {lang === 'id' ? 'Permintaan terkirim!' : 'Request sent!'}
                </p>
                <p className="text-primary-700 text-sm mt-1">
                  {lang === 'id'
                    ? 'Terima kasih. Tim kami akan menghubungi Anda segera.'
                    : 'Thank you. Our team will get back to you shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder={lang === 'id' ? 'Nama lengkap' : 'Full name'}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                  />
                  <input
                    className="input"
                    placeholder={lang === 'id' ? 'Negara' : 'Country'}
                    value={form.country}
                    onChange={(e) => set('country', e.target.value)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    required
                  />
                  <input
                    className="input"
                    placeholder={lang === 'id' ? 'Nomor WhatsApp' : 'WhatsApp number'}
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', e.target.value)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    className="input"
                    value={form.product_id}
                    onChange={(e) => set('product_id', e.target.value)}
                    aria-label={lang === 'id' ? 'Produk yang diminati' : 'Product of interest'}
                  >
                    <option value="">
                      {lang === 'id' ? 'Produk yang diminati (opsional)' : 'Product of interest (optional)'}
                    </option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.id ?? p.slug}>
                        {lang === 'id' ? p.name_id : p.name_en}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input"
                    placeholder={lang === 'id' ? 'Volume (cth. 1x20ft / 5 MT)' : 'Volume (e.g. 1x20ft / 5 MT)'}
                    value={form.volume}
                    onChange={(e) => set('volume', e.target.value)}
                  />
                </div>
                <textarea
                  className="input min-h-[110px]"
                  rows={4}
                  placeholder={
                    lang === 'id'
                      ? 'Pesan — detail kebutuhan, grade, tujuan'
                      : 'Message — requirements, grade, destination'
                  }
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                />
                {status === 'error' && (
                  <p className="text-red-600 text-sm">
                    {lang === 'id'
                      ? 'Gagal mengirim. Coba lagi atau via WhatsApp.'
                      : 'Failed to send. Please try again or use WhatsApp.'}
                  </p>
                )}
                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                  {status === 'sending'
                    ? lang === 'id'
                      ? 'Mengirim...'
                      : 'Sending...'
                    : t('landing.contact.form_cta', 'Kirim permintaan penawaran')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
