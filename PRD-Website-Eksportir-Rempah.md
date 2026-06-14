# PRD — Website Eksportir Rempah Nusantara
> **Status:** Draft v2.0 | **Tanggal:** 13 Juni 2026 | **Author:** Fakhri Djamaris
> **Update:** Foto gudang asli sudah ada izin, infrastruktur full-stack dengan CMS sederhana

---

## 🎯 Latar Belakang & Tujuan

Website ini adalah **platform digital eksportir rempah non-produsen** yang menghubungkan gudang rempah di Sumatera Utara dengan pembeli internasional dari India, Pakistan, dan Timur Tengah. Dibangun production-ready dengan CMS sederhana agar pemilik gudang atau ayah bisa update stok dan produk sendiri tanpa perlu coding.

> [!NOTE]
> Foto gudang asli sudah mendapat izin dari pemilik gudang per 13 Juni 2026.
> Website akan di-deploy ke Vercel dengan domain custom `.my.id`.

---

## 🧱 Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR/SSG terbaik untuk SEO, native support Vercel |
| Styling | Tailwind CSS | Utility-first, cepat, konsisten |
| Database | Supabase (PostgreSQL) | Simpan data produk, stok, dan form inquiry |
| Media Storage | Cloudinary | Optimasi foto otomatis, transformasi gambar, CDN global |
| Deploy | Vercel | Zero-config deploy dari GitHub |
| Domain | .my.id (Niagahoster/ID Cloud Host) | Domain Indonesia murah, ~Rp 15-25rb/tahun |
| CMS | Custom Admin Panel (Next.js route `/admin`) | Sederhana, tidak perlu tool tambahan |

---

## 👥 Target Pengguna

| Segmen | Perilaku | Kebutuhan Utama |
|---|---|---|
| Importir India & Pakistan | Teliti soal spesifikasi dan legalitas, transaksi volume besar | Spesifikasi teknis, bukti stok nyata, kontak mudah |
| Trader Timur Tengah | Sensitif soal halal dan konsistensi kualitas | Trust signal kuat, komunikasi via WhatsApp |
| Pembeli Lokal Indonesia | Butuh akses langsung ke gudang | Lokasi, stok tersedia, harga per hubungi |
| Admin (Ayah/Pemilik Gudang) | Non-teknis, butuh update produk dan stok | Panel admin yang simpel, tidak perlu coding |

---

## 🗺️ UX Flow — Perjalanan User di Website

```
[User Buka Website]
        │
        ▼
[HERO] → Kesan pertama: "Ini supplier serius, stok nyata ada"
   Aksi: Scroll down ATAU klik CTA
        │
        ▼
[ABOUT US] → "Siapa mereka, apakah bisa dipercaya?"
   Aksi: Mulai percaya, terus scroll
        │
        ▼
[PRODUCTS] → "Ada produk yang saya cari, dengan spesifikasi yang jelas"
   Aksi: Klik produk untuk lihat detail + stok terkini
        │
        ▼
[WHY CHOOSE US] → "Kenapa harus mereka, bukan supplier lain?"
   Aksi: Semakin yakin
        │
        ▼
[GALLERY] → "Stok dan gudang ini nyata, bukan foto palsu"
   Aksi: Kepercayaan naik signifikan (foto asli dari gudang)
        │
        ▼
[CONTACT / INQUIRY] → "Saya mau hubungi mereka sekarang"
   Aksi: Isi form inquiry ATAU klik WhatsApp langsung
        │
        ▼
[KONFIRMASI + SUPABASE] → Data tersimpan, notif ke admin
```

> Tombol WhatsApp floating selalu tersedia di semua posisi scroll.

---

## 🗄️ Database Schema (Supabase)

### Tabel: `products`
```sql
CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_id       TEXT NOT NULL,           -- Nama produk bahasa Indonesia
  name_en       TEXT NOT NULL,           -- Nama produk bahasa Inggris
  slug          TEXT UNIQUE NOT NULL,    -- URL-friendly: "cengkeh", "buah-pala"
  description_id TEXT,
  description_en TEXT,
  moisture      TEXT,                    -- Contoh: "12-14%"
  grade         TEXT,                    -- Contoh: "AB Grade"
  moq           TEXT,                    -- Contoh: "1 Metric Ton"
  packaging     TEXT,                    -- Contoh: "50kg gunny sack"
  origin        TEXT DEFAULT 'Sumatera Utara, Indonesia',
  stock_status  TEXT DEFAULT 'available', -- available | limited | out_of_stock
  stock_note    TEXT,                    -- Contoh: "Stok terbatas, hubungi kami"
  is_featured   BOOLEAN DEFAULT false,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT now(),
  updated_at    TIMESTAMP DEFAULT now()
);
```

### Tabel: `product_images`
```sql
CREATE TABLE product_images (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  cloudinary_url  TEXT NOT NULL,          -- URL dari Cloudinary
  cloudinary_id   TEXT NOT NULL,          -- Public ID untuk delete/transform
  alt_text        TEXT,
  is_primary      BOOLEAN DEFAULT false,  -- Foto utama yang tampil di card
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT now()
);
```

### Tabel: `gallery`
```sql
CREATE TABLE gallery (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_url  TEXT NOT NULL,
  cloudinary_id   TEXT NOT NULL,
  caption_id      TEXT,                   -- Caption bahasa Indonesia
  caption_en      TEXT,                   -- Caption bahasa Inggris
  category        TEXT DEFAULT 'gudang',  -- gudang | produk | proses
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT now()
);
```

### Tabel: `inquiries`
```sql
CREATE TABLE inquiries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  country     TEXT NOT NULL,
  email       TEXT,
  whatsapp    TEXT,
  product_id  UUID REFERENCES products(id),
  product_name TEXT,                      -- Backup jika produk dihapus
  volume      TEXT,                       -- Estimasi volume order
  message     TEXT,
  status      TEXT DEFAULT 'new',         -- new | read | replied
  created_at  TIMESTAMP DEFAULT now()
);
```

### Tabel: `site_settings`
```sql
CREATE TABLE site_settings (
  key    TEXT PRIMARY KEY,
  value  TEXT
);
-- Isi awal:
-- whatsapp_number, company_name, tagline_id, tagline_en,
-- address, email, hero_headline_id, hero_headline_en
```

---

## 🖼️ Cloudinary Architecture

```
Folder structure di Cloudinary:
rempah-nusantara/
├── products/
│   ├── cengkeh/
│   ├── buah-pala/
│   ├── pinang/
│   └── kemiri/
└── gallery/
    ├── gudang/       ← foto gudang asli dari ayah
    ├── produk/       ← foto close-up produk
    └── proses/       ← foto proses/kegiatan
```

Transformasi otomatis yang dipakai:
- Card produk: `w_600,h_400,c_fill,q_auto,f_auto`
- Gallery thumbnail: `w_400,h_300,c_fill,q_auto,f_auto`
- Hero background: `w_1920,h_1080,c_fill,q_auto,f_auto`
- Admin preview: `w_200,h_150,c_fill,q_auto`

---

## 🏗️ Folder Structure (Next.js)

```
project/
├── app/
│   ├── (public)/                    ← Layout publik
│   │   ├── layout.tsx               ← Root layout + metadata
│   │   ├── page.tsx                 ← Homepage
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         ← Detail produk (SEO per produk)
│   │   └── gallery/
│   │       └── page.tsx
│   │
│   ├── admin/                       ← CMS Panel (protected)
│   │   ├── layout.tsx               ← Admin layout
│   │   ├── page.tsx                 ← Dashboard (ringkasan inquiry)
│   │   ├── products/
│   │   │   ├── page.tsx             ← List semua produk
│   │   │   ├── new/page.tsx         ← Tambah produk baru
│   │   │   └── [id]/page.tsx        ← Edit produk
│   │   ├── gallery/
│   │   │   └── page.tsx             ← Upload/kelola foto gudang
│   │   └── inquiries/
│   │       └── page.tsx             ← Lihat semua form inquiry
│   │
│   └── api/
│       ├── inquiries/route.ts       ← POST: simpan inquiry ke Supabase
│       ├── products/route.ts        ← GET: ambil produk dari Supabase
│       └── upload/route.ts          ← POST: upload foto ke Cloudinary
│
├── components/
│   ├── ui/                          ← Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── SectionHeader.tsx
│   ├── sections/                    ← Section-level components
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Products.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Gallery.tsx
│   │   └── Contact.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppFloat.tsx
│   └── admin/                       ← Admin-specific components
│       ├── ProductForm.tsx
│       ├── ImageUploader.tsx
│       └── InquiryTable.tsx
│
├── lib/
│   ├── supabase.ts                  ← Supabase client
│   ├── cloudinary.ts                ← Cloudinary config + helpers
│   └── utils.ts                     ← Helper functions
│
├── hooks/
│   ├── useLanguage.ts               ← Bilingual toggle logic
│   └── useProducts.ts               ← Fetch products dari Supabase
│
├── types/
│   └── index.ts                     ← TypeScript types semua entity
│
├── public/
│   ├── images/                      ← Static images (logo, icons)
│   └── locales/
│       ├── id.json                  ← Semua teks Indonesia
│       └── en.json                  ← Semua teks Inggris
│
└── middleware.ts                    ← Proteksi route /admin
```

---

## 🔐 Admin CMS — Fitur

Panel admin di `/admin` (protected dengan password sederhana via middleware):

| Halaman | Fitur |
|---|---|
| Dashboard | Jumlah inquiry baru, produk aktif, ringkasan |
| Products | List, tambah, edit, hapus produk + update stok |
| Gallery | Upload foto gudang dari HP/laptop, atur urutan, hapus |
| Inquiries | Lihat semua form masuk, tandai sudah dibalas |

> [!IMPORTANT]
> Admin panel sengaja dibuat sesederhana mungkin.
> Ayah cukup bisa: buka browser → login → update stok → save.
> Tidak perlu paham coding sama sekali.

---

## 🎨 Design System

**Tone Visual:** Premium, natural, trustworthy. Pedagang rempah kelas dunia, bukan startup.

### Color Tokens
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary` | `#1B4332` | Navbar, heading, CTA primary |
| `--color-secondary` | `#8B5E3C` | Accent text, card border |
| `--color-accent` | `#C9A84C` | Highlight, hover, badge |
| `--color-bg` | `#FAF7F2` | Background utama |
| `--color-surface` | `#FFFFFF` | Card background |
| `--color-text` | `#1C1C1C` | Body text |
| `--color-text-muted` | `#6B6B6B` | Subtext, caption |

### Typography
| Peran | Font | Ukuran |
|---|---|---|
| Heading | Playfair Display | 48-72px |
| Section heading | Playfair Display | 24-36px |
| Body | Plus Jakarta Sans | 16px |
| UI/Label | Plus Jakarta Sans | 14px |

---

## 🔍 SEO Architecture

### Per-page Metadata (Next.js generateMetadata)
```
Homepage:
- title: "[Nama Usaha] | Indonesian Spice Exporter"
- description: "Premium Indonesian spices exporter..."
- og:image: foto hero gudang dari Cloudinary
- canonical: https://namadomain.my.id

Product Detail Page:
- title: "[Nama Produk] | [Nama Usaha]"
- description: "Export grade [produk] from North Sumatra..."
- og:image: foto produk dari Cloudinary
```

### File Wajib untuk SEO
```
public/
├── sitemap.xml        ← Auto-generate dari Next.js (semua halaman + produk)
├── robots.txt         ← Allow semua, disallow /admin
└── favicon.ico
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "ExportCompany",
  "name": "[Nama Usaha]",
  "description": "Indonesian spice exporter...",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Sumatera Utara",
    "addressCountry": "ID"
  },
  "offers": {
    "@type": "AggregateOffer",
    "itemOffered": ["Cloves", "Nutmeg", "Areca Nut", "Candlenut"]
  }
}
```

---

## 🚀 Deploy & Domain Setup

### Vercel Deploy
```
1. Push project ke GitHub repository
2. Buka vercel.com → Import repository
3. Set environment variables:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ADMIN_PASSWORD=
4. Deploy → otomatis dapat URL xxx.vercel.app
```

### Custom Domain .my.id
```
1. Beli domain di Niagahoster atau ID Cloud Host (~Rp 15-25rb/tahun)
2. Di Vercel: Settings → Domains → Add Domain → masukkan namadomain.my.id
3. Di Niagahoster: DNS Management → tambah record:
   Type: CNAME | Name: @ | Value: cname.vercel-dns.com
4. Tunggu propagasi DNS 5-30 menit → domain aktif
```

---

## ⏳ Timeline Eksekusi

| Hari | Tahap | Yang Dikerjakan |
|---|---|---|
| Hari 1 | Setup | Nama final, buat akun Supabase + Cloudinary, init Next.js project |
| Hari 1 | Database | Buat semua tabel Supabase, seed data produk awal |
| Hari 2 | Upload | Upload foto gudang asli ke Cloudinary, atur folder |
| Hari 2 | Frontend | Build semua section public (Hero sampai Contact) |
| Hari 3 | Admin CMS | Build panel admin (CRUD produk, gallery, lihat inquiry) |
| Hari 3 | SEO | Metadata, sitemap, robots.txt, JSON-LD |
| Hari 4 | Review | QA semua fitur, test di mobile, test bilingual |
| Hari 4 | Deploy | Push ke GitHub → Vercel → connect domain .my.id |

---

## ❓ Item yang Masih Pending

| Item | Status | Aksi |
|---|---|---|
| Nama usaha final | ⏳ Sedang brainstorm | Pilih dari 10 kandidat |
| Nomor WhatsApp | ❌ Belum dikonfirmasi | Tanya ayah |
| Foto gudang asli | ✅ Sudah ada izin | Upload ke Cloudinary di Hari 2 |
| Logo | ❌ Belum ada | Generate Midjourney setelah nama final |
| Domain .my.id | ❌ Belum dibeli | Beli setelah nama final |
| Akun Supabase | ❌ Belum dibuat | Setup di Hari 1 |
| Akun Cloudinary | ❌ Belum dibuat | Setup di Hari 1 |
