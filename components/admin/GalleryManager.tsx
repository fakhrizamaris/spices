'use client'

import { useRef, useState } from 'react'
import type { GalleryItem, GalleryCategory } from '@/types'

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'facility', label: 'Fasilitas' },
  { value: 'product', label: 'Produk' },
  { value: 'certification', label: 'Sertifikasi' },
  { value: 'team', label: 'Tim' },
  { value: 'other', label: 'Lainnya' },
]

export default function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [category, setCategory] = useState<GalleryCategory>('facility')
  const [captionId, setCaptionId] = useState('')
  const [captionEn, setCaptionEn] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) {
      setError('Pilih file foto dulu.')
      return
    }
    setBusy(true)
    setError('')
    try {
      // 1) Upload file → /api/upload (Supabase Storage)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', 'gallery')
      fd.append('category', category)
      const up = await fetch('/api/upload', { method: 'POST', body: fd })
      const upJson = await up.json()
      if (!up.ok) throw new Error(upJson.error ?? 'Upload gagal')
      const url: string = upJson.data.url

      // 2) Persist metadata → /api/gallery
      const save = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          category,
          caption_id: captionId,
          caption_en: captionEn,
          position: items.length,
        }),
      })
      const saveJson = await save.json()
      if (!save.ok) throw new Error(saveJson.error ?? 'Gagal menyimpan')

      setItems((prev) => [...prev, saveJson.data as GalleryItem])
      setCaptionId('')
      setCaptionEn('')
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus foto ini?')) return
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((it) => it.id !== id))
    } catch {
      setError('Gagal menghapus foto.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Form upload */}
      <form onSubmit={handleUpload} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-900">Upload Foto Baru</h2>
        {error && (
          <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">File (JPG/PNG/WebP, maks 10 MB)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="w-full text-sm text-stone-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg
                         file:border-0 file:bg-brand-500 file:text-white file:text-sm file:font-semibold
                         hover:file:bg-brand-600"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            value={captionId}
            onChange={(e) => setCaptionId(e.target.value)}
            placeholder="Caption (Indonesia)"
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
          />
          <input
            value={captionEn}
            onChange={(e) => setCaptionEn(e.target.value)}
            placeholder="Caption (English)"
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {busy ? 'Mengupload...' : '+ Upload Foto'}
        </button>
      </form>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 py-24 text-center text-stone-400">
          <p className="text-lg mb-2">Galeri kosong</p>
          <p className="text-sm">Upload foto fasilitas, produk, atau sertifikasi</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-stone-200 rounded-xl overflow-hidden aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.caption_id ?? ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white text-xs w-full">
                  <p className="font-medium truncate">{item.caption_id ?? item.category}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
