-- 003 — B2B inquiry fields + stock note
-- Jalankan SETELAH 001 & 002. Idempotent (IF NOT EXISTS), aman dijalankan ulang.

-- ─── inquiries: field B2B ekspor ──────────────────────────────────────────────
-- Importir internasional → 'country' & 'whatsapp' lebih relevan dari company/phone.
-- 'volume' free-text (mis. "1x20ft FCL", "5 MT") lebih tepat dari quantity_kg numerik.
-- Kolom lama dibiarkan (nullable) demi kompatibilitas form yang sudah ada.
alter table inquiries add column if not exists country  text;
alter table inquiries add column if not exists whatsapp text;
alter table inquiries add column if not exists volume   text;

create index if not exists inquiries_country_idx on inquiries (country);

-- ─── Catatan stok (alasan singkat saat ubah status stok dari admin) ───────────
alter table products add column if not exists stock_note text;
