import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE ?? 'admin_session'

async function sha256(message: string): Promise<string> {
  const buf = new TextEncoder().encode(message)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }))

  if (!password || password !== ADMIN_PASSWORD) {
    await new Promise((r) => setTimeout(r, 500)) // slight delay to slow brute-force
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await sha256(ADMIN_PASSWORD)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.json({ ok: true })
}
