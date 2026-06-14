import { getGallery } from './supabase'
import { warehouseGallery } from './site-config'

// View model dipakai section galeri publik.
export interface GalleryView {
  src: string
  caption_id: string
  caption_en: string
}

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Galeri publik dari DB; fallback ke foto gudang statis bila env belum diisi /
// tabel kosong / query gagal (situs tetap menampilkan bukti stok).
export async function getGalleryItems(): Promise<GalleryView[]> {
  if (!isSupabaseConfigured()) return warehouseGallery
  try {
    const rows = await getGallery()
    if (!rows.length) return warehouseGallery
    return rows.map((r) => ({
      src: r.url,
      caption_id: r.caption_id ?? '',
      caption_en: r.caption_en ?? r.caption_id ?? '',
    }))
  } catch {
    return warehouseGallery
  }
}
