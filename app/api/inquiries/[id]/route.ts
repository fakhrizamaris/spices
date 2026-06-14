import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import type { InquiryStatus } from '@/types'
import type { Database } from '@/types/database'

type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']

const VALID_STATUSES: InquiryStatus[] = ['new', 'in_progress', 'replied', 'closed']

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  let body: { status?: InquiryStatus; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid.' }, { status: 400 })
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Status tidak valid.' }, { status: 422 })
  }

  const update: InquiryUpdate = { updated_at: new Date().toISOString() }
  if (body.status) update.status = body.status
  if (body.notes !== undefined) update.notes = body.notes

  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/admin/inquiries')
  return NextResponse.json({ data })
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .select('*, product:products(id, name_id, name_en, slug)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Tidak ditemukan.' }, { status: 404 })
  return NextResponse.json({ data })
}
