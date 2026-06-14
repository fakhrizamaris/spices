// ─────────────────────────────────────────────────────────────────────────────
// JefendiSpice — business configuration.
// Edit values here; UI reads from this single source of truth.
// Replace WHATSAPP_NUMBER with the real number before going live.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name: 'JefendiSpice',
  legalName: 'JefendiSpice',
  tagline_id: 'Eksportir Rempah Sumatera Utara',
  tagline_en: 'North Sumatra Spice Exporter',

  // WhatsApp — international format WITHOUT "+" or spaces. e.g. 6281234567890
  whatsappNumber: '6281959243545',
  email: 'sales@jefendispice.my.id',
  phoneDisplay: '+62 819-5924-3545',

  location: {
    region_id: 'Sumatera Utara, Indonesia',
    region_en: 'North Sumatra, Indonesia',
    city: 'Medan',
    port: 'Pelabuhan Belawan',
    addressLine: 'Medan, Sumatera Utara, Indonesia',
    mapsQuery: 'Belawan Port Medan Sumatera Utara',
  },

  // Trust / capacity figures shown across the site
  stats: {
    monthlyCapacityMT: 200,
    exportPorts: 'Belawan',
    responseTime_id: 'Biasanya balas < 2 jam',
    responseTime_en: 'Usually replies in < 2 hrs',
    languages_id: 'Melayani Bahasa Indonesia & English',
    languages_en: 'We serve English & Bahasa',
  },

  social: {
    instagram: '',
    linkedin: '',
  },
} as const

// ─── Core products (trader, non-producer — curated list) ─────────────────────

export type StockStatus = 'available' | 'limited' | 'out_of_stock'

export interface CoreProduct {
  slug: string
  name_id: string
  name_en: string
  scientific: string
  blurb_id: string
  longDesc_id: string
  image: string
  gallery: string[]
  stock: StockStatus
  specs: { label_id: string; label_en: string; value: string }[]
  moq: string
  capacity: string
}

export const coreProducts: CoreProduct[] = [
  {
    slug: 'pinang',
    name_id: 'Pinang (Biji Pinang)',
    name_en: 'Areca Nut / Betel Nut',
    scientific: 'Areca catechu',
    blurb_id:
      'Pinang kering kualitas ekspor dari Sumatera Utara. Tersedia belah & utuh, sortir bersih, kadar air terkontrol.',
    longDesc_id:
      'Pinang kering JefendiSpice dipanen dan dikumpulkan dari petani di seluruh Sumatera Utara, lalu dijemur dan disortir di gudang kami sebelum dimuat. Tersedia dalam bentuk utuh maupun belah, dengan kadar air terkontrol untuk pengiriman jarak jauh ke India dan Pakistan. Stok tersedia sepanjang tahun dengan kemampuan repeat order skala kontainer setiap bulan.',
    image: '/gudang/gudang-rajawali1.jpeg',
    gallery: ['/gudang/gudang-rajawali1.jpeg', '/gudang/gudang-rajawali3.jpeg', '/gudang/gudang-rajawali4.jpeg'],
    stock: 'available',
    specs: [
      { label_id: 'Bentuk', label_en: 'Form', value: 'Whole / Split' },
      { label_id: 'Kadar Air', label_en: 'Moisture', value: 'maks. 12%' },
      { label_id: 'Asal', label_en: 'Origin', value: 'Sumatera Utara' },
      { label_id: 'Kemasan', label_en: 'Packing', value: 'Karung PP 50 kg' },
    ],
    moq: '1 x 20ft container (±18 MT)',
    capacity: '±120 MT / bulan',
  },
  {
    slug: 'pala',
    name_id: 'Pala (Biji & Fuli)',
    name_en: 'Nutmeg & Mace',
    scientific: 'Myristica fragrans',
    blurb_id:
      'Biji pala dan fuli (mace) kering, aroma kuat, cocok untuk industri rempah dan minyak atsiri.',
    longDesc_id:
      'Biji pala dan fuli (mace) kering dengan aroma kuat khas Nusantara, dipilih untuk industri rempah, bumbu, dan minyak atsiri. Disortir tangan untuk memisahkan biji berkualitas, dengan kadar air rendah agar tahan dalam perjalanan ekspor. Cocok untuk buyer yang mencari diversifikasi sumber di luar Vietnam.',
    image: '/gudang/gudang-rajawali2.jpeg',
    gallery: ['/gudang/gudang-rajawali2.jpeg', '/gudang/gudang-rajawali5.jpeg', '/gudang/gudang-rajawali16.jpeg'],
    stock: 'limited',
    specs: [
      { label_id: 'Bentuk', label_en: 'Form', value: 'Biji / Fuli' },
      { label_id: 'Kadar Air', label_en: 'Moisture', value: 'maks. 10%' },
      { label_id: 'Sortir', label_en: 'Sorting', value: 'Hand-sorted' },
      { label_id: 'Kemasan', label_en: 'Packing', value: 'Karung / sesuai permintaan' },
    ],
    moq: 'Mulai 1 MT',
    capacity: '±40 MT / bulan',
  },
  {
    slug: 'kemiri',
    name_id: 'Kemiri (Candlenut)',
    name_en: 'Candlenut',
    scientific: 'Aleurites moluccanus',
    blurb_id:
      'Kemiri kupas bersih, warna cerah, untuk bumbu dan industri makanan. Stok rutin sepanjang tahun.',
    longDesc_id:
      'Kemiri kupas bersih dengan warna cerah dan tingkat pecah rendah, untuk industri bumbu dan makanan. Dikumpulkan dari sentra kemiri Sumatera dan disortir di gudang sebelum dikemas. Tersedia rutin sepanjang tahun untuk pasar ekspor maupun buyer lokal di Indonesia.',
    image: '/gudang/gudang-rajawali4.jpeg',
    gallery: ['/gudang/gudang-rajawali4.jpeg', '/gudang/gudang-rajawali3.jpeg', '/gudang/gudang-rajawali2.jpeg'],
    stock: 'available',
    specs: [
      { label_id: 'Bentuk', label_en: 'Form', value: 'Kupas / Whole' },
      { label_id: 'Kadar Air', label_en: 'Moisture', value: 'maks. 8%' },
      { label_id: 'Broken', label_en: 'Broken', value: 'maks. 5%' },
      { label_id: 'Kemasan', label_en: 'Packing', value: 'Karung PP 50 kg' },
    ],
    moq: 'Mulai 1 MT',
    capacity: '±40 MT / bulan',
  },
]

export const stockLabel: Record<StockStatus, string> = {
  available: 'Stok Tersedia',
  limited: 'Stok Terbatas',
  out_of_stock: 'Stok Habis',
}

// ─── Warehouse gallery (proof of stock) ──────────────────────────────────────

export const warehouseGallery: { src: string; caption_id: string; caption_en: string }[] = [
  { src: '/gudang/gudang-rajawali3.jpeg', caption_id: 'Hamparan pinang dijemur — gudang Sumatera Utara', caption_en: 'Areca nut sun-drying — North Sumatra warehouse' },
  { src: '/gudang/gudang-rajawali1.jpeg', caption_id: 'Pinang sortir dalam karung siap muat', caption_en: 'Sorted areca nut bagged and ready to load' },
  { src: '/gudang/gudang-rajawali4.jpeg', caption_id: 'Stok karung bertingkat — kapasitas gudang', caption_en: 'Stacked bags — warehouse capacity' },
  { src: '/gudang/gudang-rajawali2.jpeg', caption_id: 'Area penyimpanan & sortir', caption_en: 'Storage and sorting area' },
  { src: '/gudang/gudang-rajawali5.jpeg', caption_id: 'Gudang penyimpanan rempah', caption_en: 'Spice storage warehouse' },
  { src: '/gudang/gudang-rajawali16.jpeg', caption_id: 'Persiapan barang untuk pengiriman', caption_en: 'Goods prepared for shipment' },
]
