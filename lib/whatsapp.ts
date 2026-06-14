import { siteConfig } from './site-config'

// Build a wa.me deep link with a pre-filled message.
// Pre-filling removes typing friction and gives the admin instant context.
export function waLink(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`
}

// Generic "ask about the business" link
export function waGeneral(): string {
  return waLink(
    `Halo ${siteConfig.name}, saya tertarik dengan produk rempah Anda. Boleh info stok & harga?`
  )
}

// Product-specific link — carries the product name into the chat
export function waProduct(productName: string): string {
  return waLink(
    `Halo ${siteConfig.name}, saya ingin tanya stok, harga, dan MOQ untuk: ${productName}. Terima kasih.`
  )
}

// Quote request after seeing the warehouse proof
export function waQuote(): string {
  return waLink(
    `Halo ${siteConfig.name}, saya ingin minta penawaran (quotation) untuk ekspor. Mohon dibantu.`
  )
}
