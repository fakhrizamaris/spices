import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import { siteConfig } from '@/lib/site-config'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import '@/app/globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jefendispice.my.id'
const OG_IMAGE = `${BASE_URL}/gudang/gudang-rajawali3.jpeg`

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline_en}`,
    template: `%s | ${siteConfig.name}`,
  },

  description:
    'JefendiSpice — Indonesian spice exporter from North Sumatra. Wholesale areca nut (betel nut), nutmeg, candlenut. Real warehouse stock, export via Belawan port to India, Pakistan & Middle East.',

  keywords: [
    'indonesian spice exporter',
    'areca nut supplier indonesia',
    'betel nut exporter indonesia',
    'nutmeg exporter north sumatra',
    'candlenut exporter indonesia',
    'buy indonesian spices wholesale',
    'eksportir rempah sumatera utara',
    'pinang ekspor indonesia',
    'pala ekspor sumatera',
    'kemiri ekspor indonesia',
    'spice exporter belawan',
    'indonesian wholesale spices',
  ],

  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    alternateLocale: 'id_ID',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'JefendiSpice warehouse — North Sumatra spice exporter',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE],
  },

  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/?lang=id',
      'en-US': '/?lang=en',
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },

  // Uncomment and fill in after verifying Search Console ownership:
  // verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE' },
}

// JSON-LD structured data — Organisation + LocalBusiness + Offer catalogue
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'LocalBusiness'],
      '@id': `${BASE_URL}/#organization`,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: OG_IMAGE,
        width: 1200,
        height: 630,
      },
      image: OG_IMAGE,
      description:
        'Indonesian spice exporter specialising in areca nut, nutmeg and candlenut from North Sumatra. Container-scale export via Belawan port.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.location.city,
        addressRegion: 'Sumatera Utara',
        addressCountry: 'ID',
      },
      geo: {
        '@type': 'GeoCoordinates',
        // Coordinates for Belawan port, Medan
        latitude: 3.7917,
        longitude: 98.7003,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: `+${siteConfig.whatsappNumber}`,
          email: siteConfig.email,
          availableLanguage: ['Indonesian', 'English'],
          contactOption: 'TollFree',
        },
      ],
      sameAs: [
        siteConfig.social.instagram,
        siteConfig.social.linkedin,
      ].filter(Boolean),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Indonesian Export Spices',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Areca Nut / Betel Nut (Pinang)',
              description: 'Dried areca nut from North Sumatra, whole & split, moisture max 12%. MOQ 1 x 20ft FCL.',
              image: `${BASE_URL}/gudang/gudang-rajawali1.jpeg`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Nutmeg & Mace (Pala)',
              description: 'Sun-dried nutmeg and mace from North Sumatra, hand-sorted, moisture max 10%.',
              image: `${BASE_URL}/gudang/gudang-rajawali2.jpeg`,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Candlenut (Kemiri)',
              description: 'Shelled candlenut, bright colour, broken max 5%, moisture max 8%.',
              image: `${BASE_URL}/gudang/gudang-rajawali4.jpeg`,
            },
          },
        ],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: siteConfig.name,
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/products/{search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${fraunces.variable} scroll-smooth scroll-pt-16`}>
      <head>
        {/* Preconnect — cut latency for external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-ink antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
