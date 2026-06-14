'use client'

import { siteConfig } from '@/lib/site-config'
import { useLanguage } from '@/hooks/useLanguage'

const NAV = [
  { href: '/#produk', id: 'Produk', en: 'Products' },
  { href: '/#gudang', id: 'Gudang', en: 'Warehouse' },
  { href: '/#ekspor', id: 'Ekspor', en: 'Export' },
  { href: '/#kontak', id: 'Kontak', en: 'Contact' },
]

// STEP 2 — Footer = cek "legit?" terakhir: alamat fisik + peta.
export function Footer() {
  const { lang, t } = useLanguage()
  const year = new Date().getFullYear()
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(siteConfig.location.mapsQuery)}`

  return (
    <footer className="relative bg-primary-950 text-primary-100/70 py-12">
      <span className="karung-rule absolute inset-x-0 top-0" />
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <p className="font-display text-xl font-bold text-white">
              Jefendi<span className="text-accent">Spice</span>
            </p>
            <p className="text-sm mt-2 max-w-xs">
              {t(
                'landing.footer.tagline',
                'Eksportir rempah Sumatera Utara — stok nyata, dokumen lengkap, kirim via Belawan.'
              )}
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">{t('nav.contact', 'Kontak')}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">{siteConfig.email}</a>
              </li>
              <li>{siteConfig.phoneDisplay}</li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  {siteConfig.location.addressLine} ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">
              {lang === 'id' ? 'Navigasi' : 'Navigation'}
            </p>
            <ul className="space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-accent">
                    {lang === 'id' ? item.id : item.en}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <p>
            © {year} {siteConfig.name}.{' '}
            {lang === 'id' ? 'Hak Cipta Dilindungi.' : 'All Rights Reserved.'}
          </p>
          <p>{lang === 'id' ? 'Dibuat dengan bangga di Indonesia 🇮🇩' : 'Proudly made in Indonesia 🇮🇩'}</p>
        </div>
      </div>
    </footer>
  )
}
