-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: 002_product_display_fields
-- Description: Tambah kolom display-oriented ke products + seed 3 produk inti
--              (pinang, pala, kemiri) agar CMS admin mengisi situs publik.
-- ─────────────────────────────────────────────────────────────────────────────

alter table products
  add column if not exists stock_status text not null default 'available'
    check (stock_status in ('available', 'limited', 'out_of_stock')),
  add column if not exists scientific   text not null default '',
  add column if not exists blurb_id     text not null default '',
  add column if not exists long_desc_id text not null default '',
  add column if not exists capacity     text not null default '',
  add column if not exists moq          text not null default '',
  add column if not exists specs        jsonb not null default '[]'::jsonb,
  add column if not exists gallery      text[] not null default '{}';

create index if not exists products_stock_status_idx on products (stock_status);

-- ─── Seed 3 produk inti (idempoten — tidak menimpa edit admin) ────────────────

insert into products
  (slug, name_id, name_en, scientific, blurb_id, long_desc_id, category,
   stock_status, moq, capacity, cover_url, gallery, specs, is_published, featured)
values
  (
    'pinang',
    'Pinang (Biji Pinang)',
    'Areca Nut / Betel Nut',
    'Areca catechu',
    'Pinang kering kualitas ekspor dari Sumatera Utara. Tersedia belah & utuh, sortir bersih, kadar air terkontrol.',
    'Pinang kering JefendiSpice dipanen dan dikumpulkan dari petani di seluruh Sumatera Utara, lalu dijemur dan disortir di gudang kami sebelum dimuat. Tersedia dalam bentuk utuh maupun belah, dengan kadar air terkontrol untuk pengiriman jarak jauh ke India dan Pakistan. Stok tersedia sepanjang tahun dengan kemampuan repeat order skala kontainer setiap bulan.',
    'whole_spice',
    'available',
    '1 x 20ft container (±18 MT)',
    '±120 MT / bulan',
    '/gudang/gudang-rajawali1.jpeg',
    array['/gudang/gudang-rajawali1.jpeg','/gudang/gudang-rajawali3.jpeg','/gudang/gudang-rajawali4.jpeg'],
    '[{"label_id":"Bentuk","label_en":"Form","value":"Whole / Split"},{"label_id":"Kadar Air","label_en":"Moisture","value":"maks. 12%"},{"label_id":"Asal","label_en":"Origin","value":"Sumatera Utara"},{"label_id":"Kemasan","label_en":"Packing","value":"Karung PP 50 kg"}]'::jsonb,
    true,
    true
  ),
  (
    'pala',
    'Pala (Biji & Fuli)',
    'Nutmeg & Mace',
    'Myristica fragrans',
    'Biji pala dan fuli (mace) kering, aroma kuat, cocok untuk industri rempah dan minyak atsiri.',
    'Biji pala dan fuli (mace) kering dengan aroma kuat khas Nusantara, dipilih untuk industri rempah, bumbu, dan minyak atsiri. Disortir tangan untuk memisahkan biji berkualitas, dengan kadar air rendah agar tahan dalam perjalanan ekspor. Cocok untuk buyer yang mencari diversifikasi sumber di luar Vietnam.',
    'whole_spice',
    'limited',
    'Mulai 1 MT',
    '±40 MT / bulan',
    '/gudang/gudang-rajawali2.jpeg',
    array['/gudang/gudang-rajawali2.jpeg','/gudang/gudang-rajawali5.jpeg','/gudang/gudang-rajawali16.jpeg'],
    '[{"label_id":"Bentuk","label_en":"Form","value":"Biji / Fuli"},{"label_id":"Kadar Air","label_en":"Moisture","value":"maks. 10%"},{"label_id":"Sortir","label_en":"Sorting","value":"Hand-sorted"},{"label_id":"Kemasan","label_en":"Packing","value":"Karung / sesuai permintaan"}]'::jsonb,
    true,
    true
  ),
  (
    'kemiri',
    'Kemiri (Candlenut)',
    'Candlenut',
    'Aleurites moluccanus',
    'Kemiri kupas bersih, warna cerah, untuk bumbu dan industri makanan. Stok rutin sepanjang tahun.',
    'Kemiri kupas bersih dengan warna cerah dan tingkat pecah rendah, untuk industri bumbu dan makanan. Dikumpulkan dari sentra kemiri Sumatera dan disortir di gudang sebelum dikemas. Tersedia rutin sepanjang tahun untuk pasar ekspor maupun buyer lokal di Indonesia.',
    'whole_spice',
    'available',
    'Mulai 1 MT',
    '±40 MT / bulan',
    '/gudang/gudang-rajawali4.jpeg',
    array['/gudang/gudang-rajawali4.jpeg','/gudang/gudang-rajawali3.jpeg','/gudang/gudang-rajawali2.jpeg'],
    '[{"label_id":"Bentuk","label_en":"Form","value":"Kupas / Whole"},{"label_id":"Kadar Air","label_en":"Moisture","value":"maks. 8%"},{"label_id":"Broken","label_en":"Broken","value":"maks. 5%"},{"label_id":"Kemasan","label_en":"Packing","value":"Karung PP 50 kg"}]'::jsonb,
    true,
    true
  )
on conflict (slug) do nothing;
