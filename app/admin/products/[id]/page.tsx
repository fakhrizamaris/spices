import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import ProductForm from '@/components/admin/ProductForm'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabaseAdmin
    .from('products')
    .select('name_id')
    .eq('id', id)
    .single()
  return { title: data ? `Edit: ${data.name_id}` : 'Edit Produk' }
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('*, images:product_images(*)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="p-8">
      <div className="mb-8">
        <a href="/admin/products" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
          ← Kembali ke Produk
        </a>
        <h1 className="text-2xl font-bold text-stone-900 mt-3">Edit Produk</h1>
        <p className="text-stone-500 text-sm mt-1">{(product as Product).name_id}</p>
      </div>
      <ProductForm mode="edit" product={product as Product} />
    </div>
  )
}
