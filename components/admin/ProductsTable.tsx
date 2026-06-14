'use client'

import { useState } from 'react'
import type { Product, StockStatus } from '@/types'

const STOCK_OPTIONS: { value: StockStatus; label: string; cls: string }[] = [
  { value: 'available', label: 'Tersedia', cls: 'badge-available' },
  { value: 'limited', label: 'Terbatas', cls: 'badge-limited' },
  { value: 'out_of_stock', label: 'Habis', cls: 'badge-out' },
]

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [updating, setUpdating] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  async function changeStock(id: string, status: StockStatus) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_status: status }),
      })
      if (!res.ok) throw new Error()
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock_status: status } : p)))
      showToast('Status stok diperbarui ✓', true)
    } catch {
      showToast('Gagal update stok. Coba lagi.', false)
    } finally {
      setUpdating(null)
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      {/* Toast notifikasi */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
            toast.ok
              ? 'bg-primary text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-stone-500">Produk</th>
              <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Kategori</th>
              <th className="text-left px-4 py-3 font-medium text-stone-500">Stok</th>
              <th className="text-center px-4 py-3 font-medium text-stone-500 hidden sm:table-cell">Tampil</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                {/* Nama produk */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                      {product.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.cover_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-stone-300 text-xl">
                          📦
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{product.name_id}</p>
                      <p className="text-stone-400 text-xs">{product.name_en}</p>
                    </div>
                  </div>
                </td>

                {/* Kategori */}
                <td className="px-4 py-3 text-stone-500 capitalize hidden md:table-cell">
                  {product.category.replace('_', ' ')}
                </td>

                {/* Dropdown stok inline */}
                <td className="px-4 py-3">
                  <div className="relative inline-block">
                    <select
                      value={product.stock_status}
                      disabled={updating === product.id}
                      onChange={(e) => changeStock(product.id, e.target.value as StockStatus)}
                      className={`appearance-none pl-2 pr-7 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer
                        disabled:opacity-60 disabled:cursor-wait
                        ${
                          product.stock_status === 'available'
                            ? 'bg-primary-50 text-primary-800 border-primary-200'
                            : product.stock_status === 'limited'
                            ? 'bg-accent-400/20 text-accent-700 border-accent-400/30'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                    >
                      {STOCK_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current opacity-60 text-[10px]">
                      ▾
                    </span>
                  </div>
                  {updating === product.id && (
                    <span className="ml-2 text-stone-400 text-xs">menyimpan…</span>
                  )}
                </td>

                {/* Status publik */}
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.is_published
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {product.is_published ? 'Publik' : 'Draft'}
                  </span>
                </td>

                {/* Edit */}
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/products/${product.id}`}
                    className="text-brand-600 hover:text-brand-700 font-medium text-xs
                               opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Edit →
                  </a>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-stone-400">
                  <p className="text-3xl mb-2">📦</p>
                  <p>Belum ada produk.</p>
                  <a
                    href="/admin/products/new"
                    className="mt-2 inline-block text-brand-600 hover:underline"
                  >
                    Tambah produk pertama
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
