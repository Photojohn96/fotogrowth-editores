import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight">
          <span className="text-lg">🎬</span>
          <span>Editores · <span className="text-fg-azul">FotoGrowth</span></span>
        </Link>
        <Link href="/aplicar" className="btn-primary px-5 py-2 text-xs">
          Aplicar al directorio →
        </Link>
      </div>
    </nav>
  )
}
