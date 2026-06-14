'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/products', label: 'Produk', icon: '◈' },
  { href: '/admin/gallery', label: 'Galeri', icon: '▣' },
  { href: '/admin/inquiries', label: 'Permintaan', icon: '✉' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (!confirm('Keluar dari admin panel?')) return
    setLoggingOut(true)
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  function isActive(href: string) {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard' || pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 bg-primary-950 text-primary-100 flex flex-col shrink-0 relative">
      <span className="karung-rule absolute inset-x-0 top-0" />

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 mt-1.5">
        <a href="/" target="_blank" className="block group">
          <p className="font-display text-lg font-bold text-white">
            Jefendi<span className="text-accent">Spice</span>
          </p>
          <p className="text-primary-300/60 text-xs mt-0.5 group-hover:text-accent transition-colors">
            Panel Admin ↗
          </p>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-primary-200/70 hover:text-white hover:bg-white/8'
              }`}
            >
              <span className={`text-base ${active ? 'text-accent' : ''}`}>{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary-300/60 hover:text-white hover:bg-white/8 transition-all"
        >
          <span>↗</span>
          Lihat Website
        </a>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary-300/60 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
        >
          <span>⏻</span>
          {loggingOut ? 'Keluar...' : 'Keluar'}
        </button>
      </div>
    </aside>
  )
}
