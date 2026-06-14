import {
  getProducts as fetchProducts,
  getProductBySlug as fetchProductBySlug,
} from './supabase'
import { coreProducts, type CoreProduct, type StockStatus } from './site-config'

// View model consumed by public pages — superset of the static CoreProduct shape.
export interface ProductView extends CoreProduct {
  id?: string
  featured?: boolean
}

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Map a DB row → ProductView, filling gaps from sensible defaults.
function mapRow(row: Record<string, unknown>): ProductView {
  const specs = Array.isArray(row.specs)
    ? (row.specs as ProductView['specs'])
    : []
  const gallery = Array.isArray(row.gallery) ? (row.gallery as string[]) : []
  const cover = (row.cover_url as string) || gallery[0] || ''

  return {
    id: row.id as string,
    slug: row.slug as string,
    name_id: (row.name_id as string) ?? '',
    name_en: (row.name_en as string) ?? '',
    scientific: (row.scientific as string) ?? '',
    blurb_id: (row.blurb_id as string) || (row.description_id as string) || '',
    longDesc_id: (row.long_desc_id as string) || (row.description_id as string) || '',
    image: cover,
    gallery: gallery.length ? gallery : cover ? [cover] : [],
    stock: ((row.stock_status as StockStatus) ?? 'available'),
    specs,
    moq: (row.moq as string) || '',
    capacity: (row.capacity as string) || '',
    featured: Boolean(row.featured),
  }
}

// Public list — published products, featured first. Falls back to static seed
// bila Supabase belum dikonfigurasi / DB kosong / query gagal (situs tetap render).
export async function getProducts(): Promise<ProductView[]> {
  if (!isSupabaseConfigured()) return coreProducts
  try {
    const rows = await fetchProducts()
    if (rows.length === 0) return coreProducts
    return rows.map((r) => mapRow(r as unknown as Record<string, unknown>))
  } catch {
    return coreProducts
  }
}

// Single product by slug. Falls back to static seed.
export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  if (!isSupabaseConfigured()) {
    return coreProducts.find((p) => p.slug === slug) ?? null
  }
  try {
    const row = await fetchProductBySlug(slug)
    if (!row) return coreProducts.find((p) => p.slug === slug) ?? null
    return mapRow(row as unknown as Record<string, unknown>)
  } catch {
    return coreProducts.find((p) => p.slug === slug) ?? null
  }
}
