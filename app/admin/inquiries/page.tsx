import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { Inquiry } from '@/types'
import InquiriesTable from '@/components/admin/InquiriesTable'

export const metadata: Metadata = { title: 'Permintaan' }

export default async function AdminInquiriesPage() {
  const { data } = await supabaseAdmin
    .from('inquiries')
    .select('*, product:products(id, name_id, name_en, slug)')
    .order('created_at', { ascending: false })

  const items = (data ?? []) as Inquiry[]
  const newCount = items.filter((i) => i.status === 'new').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
          Permintaan Masuk
          {newCount > 0 && (
            <span className="text-sm font-semibold bg-blue-500 text-white px-2.5 py-0.5 rounded-full">
              {newCount} baru
            </span>
          )}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Klik baris untuk lihat detail dan balas langsung via WhatsApp
        </p>
      </div>
      <InquiriesTable initialItems={items} />
    </div>
  )
}
