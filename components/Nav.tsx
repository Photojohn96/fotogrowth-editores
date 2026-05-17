import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
          <span className="text-lg">🎬</span>
          <span className="hidden sm:inline">Editores · <span className="text-fg-azul">FotoGrowth</span></span>
          <span className="sm:hidden">FotoGrowth</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/directorio"
            className="text-sm text-white/70 hover:text-white px-3 py-1.5 transition-colors hidden sm:inline"
          >
            Directorio
          </Link>
          <Link href="/aplicar" className="btn-primary px-4 py-2 text-xs">
            Aplicar →
          </Link>
        </div>
      </div>
    </nav>
  )
}
