import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { ProductFormData } from '@/types'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, images:product_images(*)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  let body: ProductFormData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.name_id?.trim() || !body.name_en?.trim()) {
    return NextResponse.json({ error: 'Nama produk (ID & EN) wajib diisi' }, { status: 422 })
  }

  const slug = body.slug?.trim() || slugify(body.name_en)

  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ ...body, slug })
    .eq('id', id)
    .select('slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug sudah dipakai produk lain' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Segarkan cache halaman publik yang terdampak
  revalidatePath('/')
  revalidatePath(`/products/${data.slug}`)

  return NextResponse.json({ data })
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
