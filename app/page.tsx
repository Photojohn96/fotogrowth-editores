import Link from 'next/link'
import Nav from '@/components/Nav'
import { supabasePublic } from '@/lib/supabase'

// Splash landing — marketplace style. Dual CTA: browse the directory or apply
// as an editor. No grid here — the directory lives at /directorio.
//
// Server component so we can show real member counts. Falls back to safe defaults
// if Supabase is unreachable, keeping the page resilient.
export default async function HomePage() {
  let editorCount = 0
  let countryCount = 0
  let availableNowCount = 0

  try {
    const { data } = await supabasePublic
      .from('editors')
      .select('country, availability')
      .eq('status', 'approved')

    if (data) {
      editorCount = data.length
      countryCount = new Set(data.map(r => r.country)).size
      availableNowCount = data.filter(r => r.availability === 'available_now').length
    }
  } catch (e) {
    console.error('[home counts]', e)
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-fg-azul/10 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-fg-acento/5 blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-medium">
              Directorio curado por FotoGrowth
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6 gradient-text">
            Editores de video <br className="hidden md:block" />para bienes raíces
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-10">
            La forma más rápida de encontrar editores profesionales — o aplicar para
            que fotógrafos en 23 países te encuentren a ti.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/directorio" className="btn-primary px-7 py-3.5 text-sm">
              Ver el directorio →
            </Link>
            <Link href="/aplicar" className="btn-ghost px-7 py-3.5 text-sm">
              Aplicar como editor
            </Link>
          </div>

          {/* Live stats — only show once there are real numbers */}
          {editorCount > 0 && (
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm text-white/40">
              <span><b className="text-white font-semibold">{editorCount}</b> editores activos</span>
              {countryCount > 0 && <span><b className="text-white font-semibold">{countryCount}</b> países</span>}
              {availableNowCount > 0 && (
                <span>
                  <b className="text-green-400 font-semibold">{availableNowCount}</b> disponibles ya
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS — 3 columns ─────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center mb-3">Cómo funciona</p>
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            En 30 segundos te conectas con el editor correcto
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card num="01" title="Encuentra">
              Filtra por idioma, presupuesto, tipo de video y disponibilidad.
              Cada editor está curado a mano.
            </Card>
            <Card num="02" title="Contacta directo">
              Click en WhatsApp y empieza la conversación. Sin intermediarios,
              sin comisiones, sin esperas.
            </Card>
            <Card num="03" title="Trabaja">
              Tú y el editor manejan el proyecto. FotoGrowth solo conecta —
              tú decides los términos.
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FOR EDITORS — recruitment CTA ────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label mb-3">¿Eres editor?</p>
          <h2 className="text-3xl font-bold tracking-tight mb-5 gradient-text">
            Pon tu trabajo enfrente de +200 fotógrafos.
          </h2>
          <p className="text-white/55 max-w-2xl mx-auto leading-relaxed mb-8">
            FotoGrowth tiene una comunidad activa de fotógrafos inmobiliarios en LATAM,
            España y USA. El directorio es <b className="text-white">gratis</b> — solo
            armas tu perfil una vez y te encuentran.
          </p>
          <Link href="/aplicar" className="btn-primary px-7 py-3.5 text-sm">
            Aplicar gratis al directorio →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-xs text-white/30">
          Por <a href="https://fotogrowth.com" className="text-fg-azul hover:underline">FotoGrowth</a> —
          comunidad de fotógrafos inmobiliarios.
        </div>
      </footer>
    </main>
  )
}

function Card({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
      <p className="text-[11px] font-mono text-fg-azul mb-3">{num}</p>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/55 leading-relaxed">{children}</p>
    </div>
  )
}
