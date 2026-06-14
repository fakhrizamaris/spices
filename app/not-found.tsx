import Link from 'next/link'
import { waGeneral } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-950 grain flex flex-col items-center justify-center px-4 text-center">
      <span className="karung-rule absolute inset-x-0 top-0" />

      <p className="font-display text-accent text-8xl font-bold opacity-20 select-none leading-none">
        404
      </p>

      <div className="-mt-4">
        <p className="font-display text-xl font-semibold text-cream">
          Halaman tidak ditemukan
        </p>
        <p className="text-primary-200/60 text-sm mt-2 max-w-xs">
          Mungkin halaman dipindah atau URL salah ketik.
          Coba kembali ke beranda.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
        <a
          href={waGeneral()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Tanya via WhatsApp
        </a>
      </div>
    </div>
  )
}
