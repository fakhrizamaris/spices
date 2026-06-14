import type { Metadata } from 'next'
import ProductForm from '@/components/admin/ProductForm'

export const metadata: Metadata = { title: 'Tambah Produk' }

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <a href="/admin/products" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
          ← Kembali ke Produk
        </a>
        <h1 className="text-2xl font-bold text-stone-900 mt-3">Tambah Produk Baru</h1>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
