import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { GalleryItem } from '@/types'
import GalleryManager from '@/components/admin/GalleryManager'

export const metadata: Metadata = { title: 'Galeri' }

export default async function AdminGalleryPage() {
  const { data: items } = await supabaseAdmin
    .from('gallery')
    .select('*')
    .order('position')

  const gallery = (items ?? []) as GalleryItem[]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Galeri</h1>
        <p className="text-stone-500 text-sm mt-1">
          {gallery.length} item · foto tampil di section Gudang situs publik
        </p>
      </div>
      <GalleryManager initialItems={gallery} />
    </div>
  )
}
