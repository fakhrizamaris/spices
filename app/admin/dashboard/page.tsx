import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export const metadata: Metadata = { title: 'Dashboard' }

async function getStats() {
  const [products, inquiries, gallery] = await Promise.all([
    supabaseAdmin.from('products').select('id, is_published, stock_status'),
    supabaseAdmin.from('inquiries').select('id, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('gallery').select('id', { count: 'exact', head: true }),
  ])

  const allProducts = products.data ?? []
  const allInquiries = inquiries.data ?? []

  return {
    totalProducts: allProducts.length,
    publishedProducts: allProducts.filter((p) => p.is_published).length,
    outOfStock: allProducts.filter((p) => p.stock_status === 'out_of_stock').length,
    newInquiries: allInquiries.filter((i) => i.status === 'new').length,
    recentInquiries: allInquiries,
    totalGallery: gallery.count ?? 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-8 max-w-5xl">
      {/* Judul */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Selamat Datang 👋</h1>
        <p className="text-stone-500 text-sm mt-1">
          Ini adalah panel untuk mengelola website JefendiSpice.
        </p>
      </div>

      {/* Alert kalau ada permintaan baru */}
      {stats.newInquiries > 0 && (
        <a
          href="/admin/inquiries"
          className="flex items-center gap-4 mb-6 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 hover:bg-blue-100 transition-colors"
        >
          <span className="text-3xl">📬</span>
          <div className="flex-1">
            <p className="font-semibold text-blue-800">
              Ada {stats.newInquiries} permintaan baru yang belum ditangani
            </p>
            <p className="text-blue-600 text-sm">Klik di sini untuk melihat dan membalas →</p>
          </div>
        </a>
      )}

      {/* Kartu statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          href="/admin/products"
          icon="◈"
          label="Produk Aktif"
          value={stats.publishedProducts}
          sub={`dari ${stats.totalProducts} total produk`}
          alert={stats.outOfStock > 0 ? `${stats.outOfStock} stok habis` : undefined}
        />
        <StatCard
          href="/admin/inquiries"
          icon="✉"
          label="Permintaan Baru"
          value={stats.newInquiries}
          sub="belum ditangani"
          highlight={stats.newInquiries > 0}
        />
        <StatCard
          href="/admin/gallery"
          icon="▣"
          label="Foto Galeri"
          value={stats.totalGallery}
          sub="tampil di website"
        />
      </div>

      {/* Panduan cepat */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-900 mb-5">Yang bisa dilakukan di sini</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickLink
            href="/admin/inquiries"
            icon="✉"
            title="Lihat Permintaan Masuk"
            desc="Baca pesan dari calon pembeli, balas lewat WhatsApp"
          />
          <QuickLink
            href="/admin/products"
            icon="◈"
            title="Ubah Status Stok Produk"
            desc="Tandai Tersedia / Terbatas / Habis langsung dari tabel"
          />
          <QuickLink
            href="/admin/products/new"
            icon="+"
            title="Tambah Produk Baru"
            desc="Upload foto, isi spesifikasi, publikasikan ke website"
          />
          <QuickLink
            href="/admin/gallery"
            icon="▣"
            title="Upload Foto Gudang"
            desc="Tambah foto baru ke galeri yang tampil di halaman utama"
          />
        </div>
      </div>

      {/* Link preview */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-primary transition-colors"
      >
        ↗ Buka website publik di tab baru
      </a>
    </div>
  )
}

function StatCard({
  href, icon, label, value, sub, highlight, alert,
}: {
  href: string; icon: string; label: string; value: number
  sub: string; highlight?: boolean; alert?: string
}) {
  return (
    <a
      href={href}
      className={`rounded-2xl p-5 border transition-all group ${
        highlight
          ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
          : 'bg-white border-stone-200 hover:border-accent/40 hover:shadow-card-sm'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-lg ${highlight ? 'text-blue-500' : 'text-accent'}`}>{icon}</span>
        <span className="text-stone-500 text-sm font-medium">{label}</span>
      </div>
      <p className={`text-4xl font-bold mb-1 ${highlight ? 'text-blue-700' : 'text-stone-900 group-hover:text-primary'} transition-colors`}>
        {value}
      </p>
      <p className="text-stone-400 text-xs">{sub}</p>
      {alert && (
        <p className="mt-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg px-2 py-1 inline-block">
          ⚠ {alert}
        </p>
      )}
    </a>
  )
}

function QuickLink({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      className="flex items-start gap-3 p-4 rounded-xl border border-stone-100 hover:border-primary/30 hover:bg-primary-50/30 transition-all group"
    >
      <span className="text-xl text-stone-300 group-hover:text-primary transition-colors mt-0.5">{icon}</span>
      <div>
        <p className="font-medium text-stone-800 text-sm group-hover:text-primary transition-colors">{title}</p>
        <p className="text-stone-400 text-xs mt-0.5">{desc}</p>
      </div>
    </a>
  )
}
