import { waGeneral } from '@/lib/whatsapp'
import { siteConfig } from '@/lib/site-config'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

// Floating WhatsApp — selalu sejangkauan jempol (STEP 5 & 7). Pulse ring agar
// menarik perhatian; gold ring agar menonjol di atas palet hijau-dominan.
export function StickyWhatsApp() {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-whatsapp opacity-60 animate-ping" aria-hidden />
      <a
        href={waGeneral()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="relative flex items-center gap-2.5 rounded-full
                   bg-whatsapp text-white shadow-card
                   px-4 py-3.5 sm:px-5
                   hover:brightness-95 active:scale-95 transition-all
                   ring-4 ring-accent/25"
      >
        <WhatsAppIcon className="w-6 h-6 shrink-0" />
        <span className="hidden sm:inline font-semibold text-sm whitespace-nowrap">Chat via WhatsApp</span>
        <span className="sr-only">{siteConfig.stats.responseTime_id}</span>
      </a>
    </div>
  )
}
