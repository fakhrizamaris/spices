import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const ADMIN_SESSION_COOKIE = 'admin_session'

// Simple constant-time comparison to avoid timing attacks
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Allow the login page itself
  if (pathname === '/admin/login') return NextResponse.next()

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

  // Validate session cookie (sha-256 hash of password stored as hex)
  if (sessionToken) {
    const expectedHash = await sha256(ADMIN_PASSWORD)
    if (safeCompare(sessionToken, expectedHash)) {
      return NextResponse.next()
    }
  }

  // Redirect unauthenticated requests to login
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const config = {
  matcher: ['/admin/:path*'],
}
