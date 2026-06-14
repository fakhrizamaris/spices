'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import type { Inquiry, InquiryStatus } from '@/types'

const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'Baru',
  in_progress: 'Diproses',
  replied: 'Sudah Dibalas',
  closed: 'Selesai',
}

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  closed: 'bg-stone-100 text-stone-500',
}

const ALL_STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: '🔵 Baru' },
  { value: 'in_progress', label: '🟡 Sedang Diproses' },
  { value: 'replied', label: '🟢 Sudah Dibalas' },
  { value: 'closed', label: '⚪ Selesai' },
]

function waLink(whatsapp: string, name: string) {
  const num = whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')
  const msg = encodeURIComponent(`Halo ${name}, terima kasih sudah menghubungi JefendiSpice.`)
  return `https://wa.me/${num}?text=${msg}`
}

export default function InquiriesTable({ initialItems }: { initialItems: Inquiry[] }) {
  const [items, setItems] = useState<Inquiry[]>(initialItems)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(id: string, status: InquiryStatus) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
      if (selected?.id === id) setSelected((s) => s && { ...s, status })
    } catch {
      alert('Gagal update status. Coba lagi.')
    } finally {
      setUpdating(null)
    }
  }

  const newCount = items.filter((i) => i.status === 'new').length

  return (
    <div className="flex gap-6">
      {/* Tabel utama */}
      <div className="flex-1 min-w-0">
        {newCount > 0 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-blue-600 text-xl">📬</span>
            <p className="text-blue-800 text-sm font-medium">
              Ada <strong>{newCount}</strong> permintaan baru yang belum ditangani
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-500">Pengirim</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden md:table-cell">Produk</th>
                <th className="text-left px-4 py-3 font-medium text-stone-500 hidden lg:table-cell">Volume</th>
                <th className="text-center px-4 py-3 font-medium text-stone-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-stone-500 hidden sm:table-cell">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`cursor-pointer transition-colors ${
                    selected?.id === item.id
                      ? 'bg-primary-50 border-l-4 border-l-primary'
                      : item.status === 'new'
                      ? 'bg-blue-50/40 hover:bg-blue-50'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.status === 'new' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <p className="text-stone-400 text-xs">
                          {item.country ?? item.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600 hidden md:table-cell">
                    {item.product ? item.product.name_id : <span className="text-stone-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-stone-600 hidden lg:table-cell">
                    {item.volume ?? <span className="text-stone-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-400 text-xs whitespace-nowrap hidden sm:table-cell">
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-stone-400">
                    <p className="text-3xl mb-2">📭</p>
                    <p>Belum ada permintaan masuk.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel detail — muncul saat baris diklik */}
      {selected && (
        <div className="w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden sticky top-6">
            {/* Header panel */}
            <div className="px-5 py-4 border-b border-stone-100 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-stone-900">{selected.name}</p>
                <p className="text-stone-400 text-xs mt-0.5">{formatDate(selected.created_at)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none mt-0.5"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            {/* Info kontak */}
            <div className="px-5 py-4 space-y-3 border-b border-stone-100">
              <InfoRow label="Email" value={selected.email} />
              {selected.country && <InfoRow label="Negara" value={selected.country} />}
              {selected.whatsapp && <InfoRow label="WhatsApp" value={selected.whatsapp} />}
              {selected.product && <InfoRow label="Produk" value={selected.product.name_id} />}
              {selected.volume && <InfoRow label="Volume" value={selected.volume} />}
            </div>

            {/* Isi pesan */}
            <div className="px-5 py-4 border-b border-stone-100">
              <p className="text-xs font-medium text-stone-500 mb-2">PESAN</p>
              <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </div>

            {/* Tombol aksi */}
            <div className="px-5 py-4 space-y-3">
              {/* WhatsApp langsung */}
              {selected.whatsapp && (
                <a
                  href={waLink(selected.whatsapp, selected.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:brightness-95 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                  </svg>
                  Balas via WhatsApp
                </a>
              )}

              {/* Ubah email */}
              <a
                href={`mailto:${selected.email}?subject=Re: Inquiry JefendiSpice`}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-stone-200 hover:border-stone-300 text-stone-700 text-sm font-medium rounded-xl transition-colors"
              >
                ✉ Kirim Email
              </a>

              {/* Update status */}
              <div className="pt-1">
                <p className="text-xs font-medium text-stone-500 mb-2">UBAH STATUS</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(selected.id, s.value)}
                      disabled={selected.status === s.value || updating === selected.id}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                        selected.status === s.value
                          ? 'bg-primary text-white cursor-default'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50'
                      }`}
                    >
                      {updating === selected.id && selected.status !== s.value
                        ? '...'
                        : s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs text-stone-400 shrink-0 w-16 pt-0.5">{label}</span>
      <span className="text-sm text-stone-700 break-all">{value}</span>
    </div>
  )
}
