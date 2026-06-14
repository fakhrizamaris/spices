'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import type {
  Product,
  ProductCategory,
  SpiceForm,
  ProductFormData,
  StockStatus,
  ProductSpec,
} from '@/types'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'whole_spice', label: 'Rempah Utuh' },
  { value: 'ground_spice', label: 'Rempah Bubuk' },
  { value: 'essential_oil', label: 'Minyak Atsiri' },
  { value: 'oleoresin', label: 'Oleoresin' },
  { value: 'other', label: 'Lainnya' },
]

const FORMS: { value: SpiceForm; label: string }[] = [
  { value: 'whole', label: 'Utuh' },
  { value: 'crushed', label: 'Pecah' },
  { value: 'powder', label: 'Bubuk' },
  { value: 'extract', label: 'Ekstrak' },
]

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: 'available', label: 'Stok Tersedia' },
  { value: 'limited', label: 'Stok Terbatas' },
  { value: 'out_of_stock', label: 'Stok Habis' },
]

interface Props {
  mode: 'create' | 'edit'
  product?: Product
}

export default function ProductForm({ mode, product }: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ProductFormData>({
    slug: product?.slug ?? '',
    name_id: product?.name_id ?? '',
    name_en: product?.name_en ?? '',
    description_id: product?.description_id ?? '',
    description_en: product?.description_en ?? '',
    origin_id: product?.origin_id ?? '',
    origin_en: product?.origin_en ?? '',
    category: product?.category ?? 'whole_spice',
    moisture_max: product?.moisture_max ?? undefined,
    ash_max: product?.ash_max ?? undefined,
    available_forms: product?.available_forms ?? [],
    min_order_kg: product?.min_order_kg ?? undefined,
    is_published: product?.is_published ?? false,
    featured: product?.featured ?? false,
    cover_url: product?.cover_url ?? '',
    stock_status: product?.stock_status ?? 'available',
    scientific: product?.scientific ?? '',
    blurb_id: product?.blurb_id ?? '',
    long_desc_id: product?.long_desc_id ?? '',
    capacity: product?.capacity ?? '',
    moq: product?.moq ?? '',
    specs: product?.specs ?? [],
    gallery: product?.gallery ?? [],
  })

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleFormType(f: SpiceForm) {
    setForm((prev) => ({
      ...prev,
      available_forms: prev.available_forms.includes(f)
        ? prev.available_forms.filter((x) => x !== f)
        : [...prev.available_forms, f],
    }))
  }

  // ── Specs editor ──────────────────────────────────────────────────────────
  function updateSpec(i: number, patch: Partial<ProductSpec>) {
    setForm((prev) => {
      const specs = [...prev.specs]
      specs[i] = { ...specs[i], ...patch }
      return { ...prev, specs }
    })
  }
  function addSpec() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { label_id: '', label_en: '', value: '' }] }))
  }
  function removeSpec(i: number) {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    const slug = form.slug || slugify(form.name_en)
    const payload = { ...form, slug }

    try {
      const url = mode === 'create' ? '/api/products' : `/api/products/${product!.id}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Gagal menyimpan produk')
      }
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!product || !confirm(`Hapus produk "${product.name_id}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      router.push('/admin/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus')
      setIsSaving(false)
    }
  }

  const uploadCover = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10 MB.')
      return
    }
    setUploadingCover(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', 'product')
      fd.append('slug', form.slug || slugify(form.name_en) || 'produk')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Upload gagal')
      set('cover_url', json.data.url as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal')
    } finally {
      setUploadingCover(false)
    }
  }, [form.slug, form.name_en])

  function handleCoverDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadCover(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Stok — paling sering diubah, taruh di atas */}
      <section className="bg-surface rounded-2xl border border-secondary-100 p-6">
        <h2 className="font-display font-semibold text-ink mb-4">Status Stok</h2>
        <div className="flex flex-wrap gap-2">
          {STOCK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('stock_status', opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                form.stock_status === opt.value
                  ? 'bg-primary text-cream'
                  : 'bg-stone-100 text-ink-muted hover:bg-stone-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Info dasar */}
      <section className="bg-surface rounded-2xl border border-secondary-100 p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink">Informasi Dasar</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama (Indonesia)" required>
            <input value={form.name_id} onChange={(e) => set('name_id', e.target.value)} className="input" required />
          </Field>
          <Field label="Nama (English)" required>
            <input value={form.name_en} onChange={(e) => set('name_en', e.target.value)} className="input" required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama Ilmiah">
            <input value={form.scientific} onChange={(e) => set('scientific', e.target.value)} className="input" placeholder="cth. Areca catechu" />
          </Field>
          <Field label="Slug URL">
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className="input" placeholder={form.name_en ? slugify(form.name_en) : 'otomatis'} />
          </Field>
        </div>
        <Field label="Ringkasan (kartu produk)">
          <textarea value={form.blurb_id} onChange={(e) => set('blurb_id', e.target.value)} className="input min-h-[70px]" rows={2} />
        </Field>
        <Field label="Deskripsi Lengkap (halaman detail)">
          <textarea value={form.long_desc_id} onChange={(e) => set('long_desc_id', e.target.value)} className="input min-h-[120px]" rows={5} />
        </Field>
      </section>

      {/* Klasifikasi & perdagangan */}
      <section className="bg-surface rounded-2xl border border-secondary-100 p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink">Klasifikasi &amp; Perdagangan</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategori">
            <select value={form.category} onChange={(e) => set('category', e.target.value as ProductCategory)} className="input">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="MOQ (minimum order)">
            <input value={form.moq} onChange={(e) => set('moq', e.target.value)} className="input" placeholder="cth. 1 x 20ft container" />
          </Field>
        </div>
        <Field label="Kapasitas / bulan">
          <input value={form.capacity} onChange={(e) => set('capacity', e.target.value)} className="input" placeholder="cth. ±120 MT / bulan" />
        </Field>
        <div>
          <p className="text-sm font-medium text-ink mb-2">Bentuk Produk</p>
          <div className="flex flex-wrap gap-2">
            {FORMS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => toggleFormType(f.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  form.available_forms.includes(f.value)
                    ? 'bg-accent text-primary-900'
                    : 'bg-stone-100 text-ink-muted hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Spesifikasi dinamis */}
      <section className="bg-surface rounded-2xl border border-secondary-100 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-ink">Spesifikasi</h2>
          <button type="button" onClick={addSpec} className="text-sm font-medium text-primary hover:text-primary-700">
            + Tambah baris
          </button>
        </div>
        {form.specs.length === 0 && <p className="text-ink-muted text-sm">Belum ada spesifikasi.</p>}
        {form.specs.map((spec, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input value={spec.label_id} onChange={(e) => updateSpec(i, { label_id: e.target.value })} className="input" placeholder="Label (cth. Kadar Air)" />
            <input value={spec.value} onChange={(e) => updateSpec(i, { value: e.target.value })} className="input" placeholder="Nilai (cth. maks. 12%)" />
            <button type="button" onClick={() => removeSpec(i)} className="text-red-500 hover:text-red-600 px-2 text-lg" aria-label="Hapus">×</button>
          </div>
        ))}
      </section>

      {/* Media */}
      <section className="bg-surface rounded-2xl border border-secondary-100 p-6 space-y-4">
        <h2 className="font-display font-semibold text-ink">Foto Produk</h2>

        {/* Drag & drop cover */}
        <div>
          <p className="text-sm font-medium text-ink mb-2">Foto Utama (cover)</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleCoverDrop}
            onClick={() => coverInputRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all
              ${dragOver ? 'border-primary bg-primary-50' : 'border-secondary-200 hover:border-primary/50 hover:bg-stone-50'}`}
          >
            {form.cover_url ? (
              /* Preview foto yang sudah ada */
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.cover_url}
                  alt="Cover produk"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Klik atau drag untuk ganti foto</span>
                </div>
                {uploadingCover && (
                  <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">Mengupload...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Placeholder saat belum ada foto */
              <div className="h-36 flex flex-col items-center justify-center gap-2 text-stone-400">
                {uploadingCover ? (
                  <>
                    <span className="text-2xl animate-pulse">📤</span>
                    <span className="text-sm">Mengupload...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">{dragOver ? '📸' : '🖼️'}</span>
                    <span className="text-sm font-medium">
                      {dragOver ? 'Lepaskan untuk upload' : 'Drag foto ke sini, atau klik untuk pilih'}
                    </span>
                    <span className="text-xs text-stone-300">JPG, PNG, WebP · maks. 10 MB</span>
                  </>
                )}
              </div>
            )}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f) }}
          />
          {form.cover_url && (
            <button
              type="button"
              onClick={() => set('cover_url', '')}
              className="mt-2 text-xs text-red-500 hover:text-red-600"
            >
              × Hapus foto
            </button>
          )}
        </div>
      </section>

      {/* Publikasi */}
      <section className="bg-surface rounded-2xl border border-secondary-100 p-6 space-y-3">
        <h2 className="font-display font-semibold text-ink">Publikasi</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="rounded border-stone-300 text-primary focus:ring-primary" />
          <span className="text-sm font-medium text-ink">Publikasikan produk</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="rounded border-stone-300 text-primary focus:ring-primary" />
          <span className="text-sm font-medium text-ink">Tampilkan sebagai produk unggulan</span>
        </label>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? 'Menyimpan...' : mode === 'create' ? 'Tambah Produk' : 'Simpan Perubahan'}
        </button>
        <a href="/admin/products" className="btn-secondary">Batal</a>
        {mode === 'edit' && (
          <button type="button" onClick={handleDelete} disabled={isSaving} className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium">
            Hapus produk
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
