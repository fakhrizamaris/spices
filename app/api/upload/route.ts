import { NextResponse } from 'next/server'
import { uploadToStorage } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

// POST /api/upload — terima file dari admin panel, simpan ke Supabase Storage.
// FormData:
//   file     : File (wajib)
//   type     : 'product' | 'gallery' (wajib)
//   slug     : slug produk        (wajib bila type=product)
//   category : kategori gallery   (wajib bila type=gallery)
// Mengembalikan { url, path } (URL publik Supabase Storage).
export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Body harus multipart/form-data.' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const type = formData.get('type') as 'product' | 'gallery' | null
  const slug = (formData.get('slug') as string) || ''
  const category = (formData.get('category') as string) || ''

  // ── Validasi ────────────────────────────────────────────────────────────────
  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 })
  }
  if (type !== 'product' && type !== 'gallery') {
    return NextResponse.json(
      { error: "Field 'type' harus 'product' atau 'gallery'." },
      { status: 400 }
    )
  }
  if (type === 'product' && !slug.trim()) {
    return NextResponse.json({ error: "Field 'slug' wajib untuk type=product." }, { status: 400 })
  }
  if (type === 'gallery' && !category.trim()) {
    return NextResponse.json(
      { error: "Field 'category' wajib untuk type=gallery." },
      { status: 400 }
    )
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Tipe file tidak didukung (${file.type}). Gunakan JPG/PNG/WebP/AVIF.` },
      { status: 415 }
    )
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Ukuran file melebihi batas 10 MB.' }, { status: 413 })
  }

  // Folder rapi: products/<slug> atau gallery/<category>
  const subPath = type === 'product' ? `products/${slugify(slug)}` : `gallery/${slugify(category)}`
  const bucket = type === 'product' ? 'products' : 'gallery'
  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const storagePath = `${subPath}/${filename}`

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const publicUrl = await uploadToStorage(bucket, storagePath, buffer, file.type)
    return NextResponse.json({ data: { url: publicUrl, path: storagePath } }, { status: 201 })
  } catch (err) {
    console.error('Upload error:', err)
    const msg = err instanceof Error ? err.message : 'Upload gagal.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
