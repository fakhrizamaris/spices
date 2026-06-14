import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Language } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Return the localised field from a bilingual object (e.g. product.name_id / product.name_en)
export function localise<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  lang: Language
): string {
  const key = `${field}_${lang}` as keyof T
  const fallback = `${field}_${lang === 'id' ? 'en' : 'id'}` as keyof T
  return (obj[key] as string) || (obj[fallback] as string) || ''
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(dateString: string, lang: Language = 'id'): string {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatWeight(kg: number, lang: Language = 'id'): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toLocaleString()} MT`
  }
  return `${kg.toLocaleString()} kg`
}

// Extract Supabase Storage path from a public URL for deletion
export function extractStoragePath(url: string, bucket: string): string {
  const marker = `/storage/v1/object/public/${bucket}/`
  const idx = url.indexOf(marker)
  return idx !== -1 ? url.slice(idx + marker.length) : url
}

// Capitalise first letter
export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Simple email validation
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

// Build absolute URL from relative path
export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  return `${base}${path}`
}
