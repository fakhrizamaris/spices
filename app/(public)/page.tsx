import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { getProducts } from '@/lib/products'
import { getGalleryItems } from '@/lib/gallery'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyWhatsApp } from '@/components/layout/StickyWhatsApp'
import { Hero } from '@/components/sections/Hero'
import { ProductGrid } from '@/components/sections/ProductGrid'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { AboutSection } from '@/components/sections/AboutSection'
import { WarehouseGallery } from '@/components/sections/WarehouseGallery'
import { ExportCapacity } from '@/components/sections/ExportCapacity'
import { ContactSection } from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline_en}`,
  description:
    'JefendiSpice — eksportir & trader pinang, pala, dan kemiri dari Sumatera Utara. Stok fisik di gudang, ekspor ke India, Pakistan & Timur Tengah.',
  keywords: [
    'areca nut supplier Indonesia',
    'betel nut exporter',
    'nutmeg supplier Sumatra',
    'candlenut exporter',
    'pinang ekspor Sumatera Utara',
    'spice exporter north sumatra',
  ],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline_en}`,
    description: 'Areca nut, nutmeg & candlenut exporter from North Sumatra. Real stock, container-scale.',
    images: ['/gudang/gudang-rajawali3.jpeg'],
    type: 'website',
  },
}

// ISR: revalidasi tiap jam agar edit admin tercermin tanpa rebuild
export const revalidate = 3600

// Blueprint section order (STEP 4):
// Hero → Products → Warehouse proof → Export capacity → Contact
export default async function HomePage() {
  const [products, gallery] = await Promise.all([getProducts(), getGalleryItems()])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductGrid products={products} />
        <WhyChooseUs />
        <WarehouseGallery items={gallery} />
        <AboutSection />
        <ExportCapacity />
        <ContactSection products={products} />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  )
}
