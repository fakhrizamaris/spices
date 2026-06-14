import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin, deleteFromStorage } from '@/lib/supabase'
import { extractStoragePath } from '@/lib/utils'

// DELETE /api/gallery/[id] — hapus item galeri + best-effort hapus file di Storage.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Ambil dulu untuk tahu file mana yang harus dibersihkan.
  const { data: item } = await supabaseAdmin
    .from('gallery')
    .select('url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabaseAdmin.from('gallery').delete().eq('id', id)
  if (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Bersihkan file di Storage (tidak memblok keberhasilan hapus baris).
  const row = item as { url: string } | null
  if (row?.url?.includes('/storage/v1/object/public/gallery/')) {
    const path = extractStoragePath(row.url, 'gallery')
    deleteFromStorage('gallery', path).catch((e) => console.error('Storage cleanup:', e))
  }

  revalidatePath('/')
  return NextResponse.json({ ok: true })
}
