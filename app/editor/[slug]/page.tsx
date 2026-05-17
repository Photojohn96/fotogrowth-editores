import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { supabasePublic } from '@/lib/supabase'
import type { Editor } from '@/lib/types'
import { VIDEO_TYPES, LANGUAGES, TURNAROUNDS, AVAILABILITY_OPTIONS, labelOf } from '@/lib/constants'

const AVAIL_CLASSES: Record<string, string> = {
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red:   'bg-red-500/15 text-red-400 border-red-500/30'
}

// Server component — fetches via service role-less anon client + relies on RLS
// (approved-only) to filter. If the row isn't approved, query returns nothing → 404.
export default async function EditorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data, error } = await supabasePublic
    .from('editors')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle()

  if (error) {
    console.error('[editor detail]', error)
  }
  if (!data) notFound()

  const editor = data as Editor

  // Build WhatsApp link only if number present. wa.me strips non-digits.
  const waNumber = editor.whatsapp?.replace(/\D/g, '') || null
  const waMessage = encodeURIComponent(
    `Hola ${editor.name.split(' ')[0]}, te encontré en el directorio de editores de FotoGrowth. Quería preguntarte por tus servicios de edición.`
  )
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null

  function priceLabel(): string {
    const unit = editor.price_unit === 'project' ? 'proyecto' : 'video'
    if (editor.price_min_usd === editor.price_max_usd) return `$${editor.price_min_usd} USD / ${unit}`
    return `$${editor.price_min_usd} – $${editor.price_max_usd} USD / ${unit}`
  }

  const avail = AVAILABILITY_OPTIONS.find(a => a.id === editor.availability)

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-8 inline-block">
          ← Volver al directorio
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-3">Editor de video · Bienes raíces</p>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">{editor.name}</h1>
            {avail && (
              <span className={`text-xs uppercase tracking-wider border rounded-full px-3 py-1 ${AVAIL_CLASSES[avail.color]}`}>
                <span className="mr-1">{avail.emoji}</span>{avail.label}
              </span>
            )}
          </div>
          <p className="text-white/50">
            {editor.country}{editor.city ? ` · ${editor.city}` : ''}
            {editor.ig_handle && <> · <a href={`https://instagram.com/${editor.ig_handle}`} target="_blank" rel="noopener" className="text-fg-azul hover:underline">@{editor.ig_handle}</a></>}
          </p>
        </div>

        {/* Bio */}
        {editor.bio && (
          <p className="text-lg text-white/75 leading-relaxed mb-10">
            {editor.bio}
          </p>
        )}

        {/* CTA block */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="section-label mb-1">Tarifa</p>
              <p className="text-2xl font-bold text-white">{priceLabel()}</p>
              <p className="text-xs text-white/40 mt-1">Entrega típica: {labelOf(TURNAROUNDS, editor.turnaround)}</p>
            </div>
            {waLink && (
              <a href={waLink} target="_blank" rel="noopener" className="btn-primary px-6 py-3 text-sm bg-green-600 hover:bg-green-500">
                💬 Contactar por WhatsApp
              </a>
            )}
          </div>
          <p className="text-xs text-white/40 border-t border-white/5 pt-4">
            Cuando contactes, mencioná que viste a {editor.name.split(' ')[0]} en el directorio de FotoGrowth.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="section-label mb-3">Tipos de video</p>
            <div className="flex flex-wrap gap-1.5">
              {editor.video_types.map(vt => (
                <span key={vt} className="chip">
                  <span>{VIDEO_TYPES.find(v => v.id === vt)?.emoji}</span>
                  <span>{labelOf(VIDEO_TYPES, vt)}</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-3">Idiomas</p>
            <div className="flex flex-wrap gap-1.5">
              {editor.languages.map(l => (
                <span key={l} className="chip">{labelOf(LANGUAGES, l)}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio links */}
        <div className="mb-10">
          <p className="section-label mb-3">Portfolio</p>
          <div className="space-y-2">
            <PortfolioLink url={editor.portfolio_url} primary />
            {editor.portfolio_extras?.map((url, i) => <PortfolioLink key={i} url={url} />)}
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t border-white/5 pt-6">
          <p className="text-xs text-white/30">
            Este editor está en el directorio curado de FotoGrowth. Las tarifas y disponibilidad
            las maneja el editor directamente — FotoGrowth no media en la transacción.
          </p>
        </div>
      </section>
    </main>
  )
}

function PortfolioLink({ url, primary = false }: { url: string; primary?: boolean }) {
  // Best-effort domain extraction. Falls back to full URL.
  let display = url
  try { display = new URL(url).hostname.replace(/^www\./, '') } catch {}
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between bg-white/[0.04] border ${primary ? 'border-fg-azul/40' : 'border-white/10'} rounded-xl px-4 py-3 hover:bg-white/[0.06] transition-colors`}
    >
      <div>
        <p className="text-sm text-white">{display}</p>
        <p className="text-[11px] text-white/30 truncate max-w-md">{url}</p>
      </div>
      <span className="text-fg-azul text-sm">↗</span>
    </a>
  )
}
