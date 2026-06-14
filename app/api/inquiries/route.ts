import { NextResponse } from 'next/server'
import { createInquiry, getInquiries } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import { siteConfig } from '@/lib/site-config'
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
    if (process.env.RESEND_API_KEY) {
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
  // FROM: gunakan RESEND_FROM_EMAIL jika ada (butuh domain verified di Resend),
  // atau pakai onboarding@resend.dev (gratis, tanpa verifikasi domain).
  // TO: gunakan INQUIRY_NOTIFICATION_EMAIL atau fallback ke email bisnis di siteConfig.
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL ?? siteConfig.email

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[JefendiSpice] Inquiry baru dari ${inquiry.name}${inquiry.country ? ` (${inquiry.country})` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1a3a2a">Inquiry Baru — JefendiSpice</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:120px">Nama</td><td style="padding:8px 0;font-weight:600">${inquiry.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
            ${inquiry.country ? `<tr><td style="padding:8px 0;color:#666">Negara</td><td style="padding:8px 0">${inquiry.country}</td></tr>` : ''}
            ${inquiry.whatsapp ? `<tr><td style="padding:8px 0;color:#666">WhatsApp</td><td style="padding:8px 0"><a href="https://wa.me/${inquiry.whatsapp.replace(/\D/g, '')}">${inquiry.whatsapp}</a></td></tr>` : ''}
            ${inquiry.volume ? `<tr><td style="padding:8px 0;color:#666">Volume</td><td style="padding:8px 0">${inquiry.volume}</td></tr>` : ''}
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee">
          <p style="color:#666;font-size:14px;margin:0 0 8px"><strong>Pesan:</strong></p>
          <p style="background:#f9f9f9;padding:12px;border-radius:8px;font-size:14px;line-height:1.6">${inquiry.message.replace(/\n/g, '<br>')}</p>
          <p style="margin-top:24px;font-size:12px;color:#999">Pesan ini dikirim otomatis dari form kontak JefendiSpice.</p>
        </div>
      `,
    }),
  })
}
