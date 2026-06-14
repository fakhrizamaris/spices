import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin, getTransformedImageUrl } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { Product, ProductFormData } from '@/types'

// Transform hanya berlaku untuk gambar yang dihosting di Supabase Storage.
function isStorageUrl(url: string | null | undefined): url is string {
  return Boolean(url && url.includes('/storage/v1/object/public/'))
}

// Optimasi cover & gambar via Supabase image render (resize + q/format auto).
// URL non-storage (mis. /gudang/* lokal) dibiarkan apa adanya.
function withTransformedUrls(rows: Product[]): Product[] {
  return rows.map((p) => ({
    ...p,
    cover_url: isStorageUrl(p.cover_url)
      ? getTransformedImageUrl(p.cover_url, { width: 600, height: 400, quality: 70, format: 'webp' })
      : p.cover_url,
    images: Array.isArray(p.images)
      ? p.images.map((img) => ({
          ...img,
          url: isStorageUrl(img.url)
            ? getTransformedImageUrl(img.url, { width: 800, height: 600, quality: 75, format: 'webp' })
            : img.url,
        }))
      : p.images,
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const published = searchParams.get('published')
  const search = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const perPage = parseInt(searchParams.get('per_page') ?? '20', 10)
  const offset = (page - 1) * perPage

  let query = supabaseAdmin
    .from('products')
    .select('*, images:product_images(*)', { count: 'exact' })
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  if (category) query = query.eq('category', category as ProductFormData['category'])
  if (featured === 'true') query = query.eq('featured', true)
  if (published !== null) query = query.eq('is_published', published === 'true')
  if (search) {
    query = query.or(`name_id.ilike.%${search}%,name_en.ilike.%${search}%`)
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const products = withTransformedUrls((data ?? []) as unknown as Product[])
  return NextResponse.json({ data: products, total: count, page, per_page: perPage })
}

export async function POST(request: Request) {
  let body: ProductFormData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.name_id?.trim() || !body.name_en?.trim()) {
    return NextResponse.json({ error: 'Product names (ID and EN) are required' }, { status: 422 })
  }

  const slug = body.slug?.trim() || slugify(body.name_en)

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({ ...body, slug })
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidatePath('/')
  revalidatePath(`/products/${slug}`)
  return NextResponse.json({ data }, { status: 201 })
}
