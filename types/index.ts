export type Language = 'id' | 'en'

// ─── Product ────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt: string | null
  position: number
  created_at: string
}

export type StockStatus = 'available' | 'limited' | 'out_of_stock'

export interface ProductSpec {
  label_id: string
  label_en: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name_id: string
  name_en: string
  description_id: string
  description_en: string
  origin_id: string
  origin_en: string
  category: ProductCategory
  moisture_max: number | null
  ash_max: number | null
  available_forms: SpiceForm[]
  min_order_kg: number | null
  is_published: boolean
  featured: boolean
  cover_url: string | null
  stock_status: StockStatus
  stock_note: string | null
  scientific: string
  blurb_id: string
  long_desc_id: string
  capacity: string
  moq: string
  specs: ProductSpec[]
  gallery: string[]
  images?: ProductImage[]
  created_at: string
  updated_at: string
}

export type ProductCategory =
  | 'whole_spice'
  | 'ground_spice'
  | 'essential_oil'
  | 'oleoresin'
  | 'other'

export type SpiceForm = 'whole' | 'crushed' | 'powder' | 'extract'

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string
  url: string
  caption_id: string | null
  caption_en: string | null
  category: GalleryCategory
  position: number
  created_at: string
}

export type GalleryCategory = 'facility' | 'product' | 'certification' | 'team' | 'other'

// ─── Inquiry ─────────────────────────────────────────────────────────────────

export interface Inquiry {
  id: string
  name: string
  email: string
  country: string | null
  whatsapp: string | null
  volume: string | null
  /** @deprecated gunakan `country` — disimpan untuk kompatibilitas form lama */
  company: string | null
  /** @deprecated gunakan `whatsapp` — disimpan untuk kompatibilitas form lama */
  phone: string | null
  product_id: string | null
  product?: Pick<Product, 'id' | 'name_id' | 'name_en' | 'slug'>
  /** @deprecated gunakan `volume` (free-text) */
  quantity_kg: number | null
  message: string
  status: InquiryStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type InquiryStatus = 'new' | 'in_progress' | 'replied' | 'closed'

// ─── Site Settings ───────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string
  key: string
  value: string
  label: string
  group: SettingsGroup
  updated_at: string
}

export type SettingsGroup = 'general' | 'contact' | 'seo' | 'social' | 'hero'

export interface ParsedSiteSettings {
  company_name: string
  tagline_id: string
  tagline_en: string
  description_id: string
  description_en: string
  email: string
  phone: string
  whatsapp: string
  address_id: string
  address_en: string
  instagram_url: string
  linkedin_url: string
  hero_title_id: string
  hero_title_en: string
  hero_subtitle_id: string
  hero_subtitle_en: string
  hero_video_url: string
  og_image_url: string
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface InquiryFormData {
  name: string
  email: string
  country?: string
  whatsapp?: string
  volume?: string
  product_id?: string
  message: string
  // Kompat form lama (opsional) — masih diterima & dipetakan oleh API.
  company?: string
  phone?: string
  quantity_kg?: number
}

export interface ProductFormData {
  slug: string
  name_id: string
  name_en: string
  description_id: string
  description_en: string
  origin_id: string
  origin_en: string
  category: ProductCategory
  moisture_max?: number
  ash_max?: number
  available_forms: SpiceForm[]
  min_order_kg?: number
  is_published: boolean
  featured: boolean
  cover_url?: string
  stock_status: StockStatus
  scientific: string
  blurb_id: string
  long_desc_id: string
  capacity: string
  moq: string
  specs: ProductSpec[]
  gallery: string[]
}
