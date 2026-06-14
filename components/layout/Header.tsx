'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { waGeneral } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useLanguage } from '@/hooks/useLanguage'

const NAV = [
  { href: '/#produk', id: 'Produk', en: 'Products' },
  { href: '/#gudang', id: 'Gudang', en: 'Warehouse' },
  { href: '/#ekspor', id: 'Ekspor', en: 'Export' },
  { href: '/#kontak', id: 'Kontak', en: 'Contact' },
]

export function Header() {
  const { lang, setLang } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Transparan di atas hero (homepage), blur + shadow saat scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || !isHome || menuOpen
  const label = (item: (typeof NAV)[number]) => (lang === 'id' ? item.id : item.en)

  return (
    <header
      className={`z-40 transition-all duration-300 ${
        isHome ? 'fixed top-0 inset-x-0' : 'sticky top-0'
      } ${
        solid
          ? 'bg-primary-900/90 backdrop-blur-md border-b border-white/10 shadow-card-sm'
          : 'bg-transparent'
      }`}
    >
      <span className="karung-rule" />
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-1.5">
          <span className="font-display text-xl font-bold text-white">
            Jefendi<span className="text-accent">Spice</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-primary-100/80 hover:text-white text-sm font-medium transition-colors"
            >
              {label(item)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language toggle — ID | EN */}
          <div
            className="flex items-center rounded-full border border-white/20 overflow-hidden text-xs font-semibold"
            role="group"
            aria-label="Language"
          >
            {(['id', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`px-2.5 py-1.5 uppercase transition-colors ${
                  lang === code ? 'bg-accent text-primary-900' : 'text-primary-100/70 hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <a
            href={waGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-whatsapp hover:brightness-95 text-white
                       px-3.5 py-2 rounded-full text-sm font-semibold transition-all ring-2 ring-accent/30"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          {/* Hamburger — mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 items-center
                       rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden bg-primary-900/95 backdrop-blur-md border-t border-white/10">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-primary-100/90 hover:text-white py-2.5 text-base font-medium border-b border-white/5"
              >
                {label(item)}
              </a>
            ))}
            <a
              href={waGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-3"
            >
              <WhatsAppIcon className="w-5 h-5" />
              {lang === 'id' ? 'Chat via WhatsApp' : 'Chat on WhatsApp'}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
