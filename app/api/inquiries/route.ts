import { NextResponse } from 'next/server'
import { createInquiry, getInquiries } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import type { InquiryFormData } from '@/types'

// POST /api/inquiries — terima form inquiry (publik), validasi, simpan.
// Body: name, email, country, whatsapp, product_id, volume, message
// (field lama company/phone/quantity_kg masih diterima untuk kompatibilitas).
export async function POST(request: Request) {
  let body: InquiryFormData
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid (JSON).' }, { status: 400 })
  }

  // ── Validasi input sebelum query ────────────────────────────────────────────
  const errors: Record<string, string> = {}
  if (!body.name?.trim()) errors.name = 'Nama wajib diisi.'
  if (!body.email?.trim()) errors.email = 'Email wajib diisi.'
  else if (!isValidEmail(body.email)) errors.email = 'Format email tidak valid.'
  if (!body.message?.trim()) errors.message = 'Pesan wajib diisi.'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: 'Validasi gagal. Periksa kembali isian Anda.', fields: errors },
      { status: 422 }
    )
  }

  try {
    const { id } = await createInquiry(body)

    // Notifikasi email opsional (tidak memblok respons bila gagal).
    if (process.env.RESEND_API_KEY && process.env.INQUIRY_NOTIFICATION_EMAIL) {
      sendNotificationEmail(body).catch((err) =>
        console.error('Notifikasi email gagal:', err)
      )
    }

    return NextResponse.json(
      { data: { id }, message: 'Permintaan terkirim. Tim kami akan menghubungi Anda.' },
      { status: 201 }
    )
  } catch (err) {
    console.error('Inquiry insert error:', err)
    return NextResponse.json(
      { error: 'Gagal menyimpan permintaan. Silakan coba lagi atau hubungi via WhatsApp.' },
      { status: 500 }
    )
  }
}

// GET /api/inquiries — daftar untuk admin. Dilindungi service-role bearer token.
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  }

  try {
    const data = await getInquiries()
    return NextResponse.json({ data, total: data.length })
  } catch (err) {
    console.error('getInquiries error:', err)
    return NextResponse.json({ error: 'Gagal memuat daftar permintaan.' }, { status: 500 })
  }
}

async function sendNotificationEmail(inquiry: InquiryFormData) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `noreply@${new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com').hostname}`,
      to: [process.env.INQUIRY_NOTIFICATION_EMAIL],
      subject: `Inquiry baru dari ${inquiry.name}${inquiry.country ? ` (${inquiry.country})` : ''}`,
      html: `
        <h2>Inquiry Baru</h2>
        <p><strong>Nama:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        ${inquiry.country ? `<p><strong>Negara:</strong> ${inquiry.country}</p>` : ''}
        ${inquiry.whatsapp ? `<p><strong>WhatsApp:</strong> ${inquiry.whatsapp}</p>` : ''}
        ${inquiry.volume ? `<p><strong>Volume:</strong> ${inquiry.volume}</p>` : ''}
        <p><strong>Pesan:</strong></p>
        <p>${inquiry.message.replace(/\n/g, '<br>')}</p>
      `,
    }),
  })
}
