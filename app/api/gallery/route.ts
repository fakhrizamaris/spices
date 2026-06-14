import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { getGallery } from '@/lib/supabase'
import type { GalleryCategory } from '@/types'
import type { Database } from '@/types/database'

type GalleryInsert = Database['public']['Tables']['gallery']['Insert']

const CATEGORIES: GalleryCategory[] = ['facility', 'product', 'certification', 'team', 'other']

// GET /api/gallery — daftar item galeri (opsional filter ?category=).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as GalleryCategory | null
  try {
    const data = await getGallery(category ?? undefined)
    return NextResponse.json({ data, total: data.length })
  } catch (err) {
    console.error('getGallery error:', err)
    return NextResponse.json({ error: 'Gagal memuat galeri.' }, { status: 500 })
  }
}

// POST /api/gallery — simpan item baru (dipanggil admin setelah upload file).
// Body: url (wajib), category (wajib), caption_id?, caption_en?, position?
export async function POST(request: Request) {
  let body: {
    url?: string
    category?: GalleryCategory
    caption_id?: string
    caption_en?: string
    position?: number
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid (JSON).' }, { status: 400 })
  }

  if (!body.url?.trim()) {
    return NextResponse.json({ error: 'URL foto wajib diisi.' }, { status: 422 })
  }
  if (!body.category || !CATEGORIES.includes(body.category)) {
    return NextResponse.json(
      { error: `Kategori tidak valid. Gunakan: ${CATEGORIES.join(', ')}.` },
      { status: 422 }
    )
  }

  const insert: GalleryInsert = {
    url: body.url.trim(),
    category: body.category,
    caption_id: body.caption_id?.trim() || null,
    caption_en: body.caption_en?.trim() || null,
    position: body.position ?? 0,
  }

  const { data, error } = await supabaseAdmin
    .from('gallery')
    .insert(insert)
    .select('*')
    .single()

  if (error) {
    console.error('Gallery insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidatePath('/')
  return NextResponse.json({ data }, { status: 201 })
}
