import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type {
  Product,
  GalleryItem,
  GalleryCategory,
  Inquiry,
  InquiryFormData,
  ProductFormData,
  StockStatus,
} from '@/types'

type CookieToSet = { name: string; value: string; options?: CookieOptions }

// Placeholder yang valid agar createClient tidak melempar error saat env belum
// diisi (mis. saat dev tanpa .env.local). Pemakaian nyata digerbang oleh
// pengecekan env di lib/products.ts dan pemanggil lain.
const PLACEHOLDER_URL = 'http://localhost:54321'
const PLACEHOLDER_KEY = 'public-anon-placeholder'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || PLACEHOLDER_KEY

// Browser client — use in Client Components
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server client — use in Server Components, Route Handlers, Server Actions
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — cookie mutations are no-ops; handled by middleware
        }
      },
    },
  })
}

// Admin client — bypasses RLS; only use in trusted server contexts
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Storage helpers ──────────────────────────────────────────────────────────

const BUCKET_PRODUCTS = 'products'
const BUCKET_GALLERY = 'gallery'

export async function uploadToStorage(
  bucket: 'products' | 'gallery',
  path: string,
  file: File | Buffer,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: true })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function deleteFromStorage(bucket: 'products' | 'gallery', path: string) {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path])
  if (error) throw new Error(`Storage delete failed: ${error.message}`)
}

export function getStorageUrl(bucket: 'products' | 'gallery', path: string): string {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Transform URL for resized images via Supabase image transformation
export function getTransformedImageUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number; format?: 'webp' | 'avif' }
): string {
  const base = `${supabaseUrl}/storage/v1/render/image/public`
  const path = url.replace(`${supabaseUrl}/storage/v1/object/public`, '')
  const params = new URLSearchParams()
  if (options.width) params.set('width', String(options.width))
  if (options.height) params.set('height', String(options.height))
  if (options.quality) params.set('quality', String(options.quality))
  if (options.format) params.set('format', options.format)
  return `${base}${path}?${params.toString()}`
}

export { BUCKET_PRODUCTS, BUCKET_GALLERY }

// ─── Query helpers (akses DB langsung) ─────────────────────────────────────────
// Catatan layering: helper di sini mengembalikan baris DB apa adanya (tanpa
// fallback). `lib/products.ts` membungkus getProducts/getProductBySlug dengan
// fallback statis + mapping ke ProductView untuk render publik (supaya situs
// tetap jalan tanpa DB). Komponen publik impor dari `lib/products`, admin/API
// impor dari sini.

// Ambil semua produk terbit + gambar (primary = position terkecil).
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, images:product_images(*)')
    .eq('is_published', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(`getProducts gagal: ${error.message}`)
  return ((data ?? []) as unknown as Product[]).map(withSortedImages)
}

// Satu produk terbit berdasarkan slug (untuk halaman detail).
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, images:product_images(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) throw new Error(`getProductBySlug gagal: ${error.message}`)
  return data ? withSortedImages(data as unknown as Product) : null
}

function withSortedImages(p: Product): Product {
  if (Array.isArray(p.images)) {
    p.images = [...p.images].sort((a, b) => a.position - b.position)
  }
  return p
}

// Gallery, opsional difilter per kategori, urut position.
export async function getGallery(category?: GalleryCategory): Promise<GalleryItem[]> {
  let query = supabaseAdmin.from('gallery').select('*').order('position', { ascending: true })
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw new Error(`getGallery gagal: ${error.message}`)
  return (data ?? []) as GalleryItem[]
}

// Simpan inquiry. Terima field B2B (country/whatsapp/volume) + kompat lama.
export async function createInquiry(input: InquiryFormData): Promise<{ id: string }> {
  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      country: input.country?.trim() || null,
      whatsapp: input.whatsapp?.trim() || null,
      volume: input.volume?.trim() || null,
      product_id: input.product_id || null,
      message: input.message.trim(),
      // Kompat form lama
      company: input.company?.trim() || null,
      phone: input.phone?.trim() || null,
      quantity_kg: input.quantity_kg ?? null,
      status: 'new',
    })
    .select('id')
    .single()

  if (error) throw new Error(`createInquiry gagal: ${error.message}`)
  return { id: data.id }
}

// Daftar inquiry untuk admin (terbaru dulu) + ringkasan produk terkait.
export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .select('*, product:products(id, name_id, name_en, slug)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`getInquiries gagal: ${error.message}`)
  return (data ?? []) as unknown as Inquiry[]
}

// Update produk dari admin. `updated_at` di-set otomatis oleh trigger DB.
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
): Promise<Product> {
  const { data: row, error } = await supabaseAdmin
    .from('products')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(`updateProduct gagal: ${error.message}`)
  return row as unknown as Product
}

// Update stok cepat (+ catatan opsional). Kembalikan slug untuk revalidasi.
export async function updateStockStatus(
  id: string,
  status: StockStatus,
  note?: string
): Promise<{ id: string; slug: string }> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update({ stock_status: status, stock_note: note?.trim() || null })
    .eq('id', id)
    .select('id, slug')
    .single()

  if (error) throw new Error(`updateStockStatus gagal: ${error.message}`)
  return data as { id: string; slug: string }
}
