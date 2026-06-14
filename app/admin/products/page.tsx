import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { Product } from '@/types'
import ProductsTable from '@/components/admin/ProductsTable'

export const metadata: Metadata = { title: 'Produk' }

export default async function AdminProductsPage() {
  const { data } = await supabaseAdmin
    .from('products')
    .select('id, slug, name_id, name_en, category, is_published, featured, cover_url, stock_status, created_at')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  const products = (data ?? []) as Product[]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Produk</h1>
          <p className="text-stone-500 text-sm mt-1">
            {products.length} produk · ubah stok langsung dari tabel
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary-700 text-cream text-sm font-semibold rounded-xl transition-colors"
        >
          + Tambah Produk
        </a>
      </div>

      <ProductsTable initialProducts={products} />
    </div>
  )
}
