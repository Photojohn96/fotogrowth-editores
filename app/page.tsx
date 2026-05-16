'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import EditorCard from '@/components/EditorCard'
import Filters from '@/components/DirectoryFilters'
import { supabasePublic } from '@/lib/supabase'
import type { Editor, DirectoryFilters } from '@/lib/types'
import { PRICE_BANDS } from '@/lib/constants'

const EMPTY_FILTERS: DirectoryFilters = {
  q: '', language: null, video_type: null, price_band: null, turnaround: null
}

export default function HomePage() {
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DirectoryFilters>(EMPTY_FILTERS)

  // Fetch approved editors on mount
  useEffect(() => {
    let alive = true
    supabasePublic
      .from('editors')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return
        if (error) console.error('[editors fetch]', error)
        setEditors((data as Editor[]) || [])
        setLoading(false)
      })
    return () => { alive = false }
  }, [])

  // Client-side filter — fine for <1K editores. Migrate to server if it grows.
  const filtered = useMemo(() => {
    return editors.filter(e => {
      // Text search across name + city + bio + IG
      if (filters.q.trim()) {
        const q = filters.q.toLowerCase()
        const hay = `${e.name} ${e.city ?? ''} ${e.bio ?? ''} ${e.ig_handle ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.language && !e.languages.includes(filters.language)) return false
      if (filters.video_type && !e.video_types.includes(filters.video_type)) return false
      if (filters.turnaround && e.turnaround !== filters.turnaround) return false
      if (filters.price_band) {
        const band = PRICE_BANDS.find(p => p.id === filters.price_band)
        if (band) {
          // Match if editor's range overlaps the band
          if (e.price_max_usd < band.min || e.price_min_usd > band.max) return false
        }
      }
      return true
    })
  }, [editors, filters])

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-fg-azul/8 blur-[160px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="section-label mb-4">Directorio curado · FotoGrowth</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5 gradient-text">
            Editores de video <br />para bienes raíces
          </h1>
          <p className="text-white/55 max-w-xl mx-auto leading-relaxed mb-8">
            Encuentra el editor perfecto para tu próximo listing. Filtrá por idioma,
            presupuesto y estilo — contacta directo por WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/aplicar" className="btn-primary px-6 py-3 text-sm">
              Soy editor — Aplicar al directorio
            </Link>
            <a href="#directorio" className="btn-ghost px-6 py-3 text-sm">
              Ver el directorio ↓
            </a>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section id="directorio" className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-10">
          {/* Filters sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Filters filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </aside>

          {/* Editor grid */}
          <div>
            {loading ? (
              <div className="text-center py-20 text-white/30">Cargando editores...</div>
            ) : filtered.length === 0 ? (
              <EmptyState hasFilters={!!(filters.q || filters.language || filters.video_type || filters.price_band || filters.turnaround)} />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filtered.map(e => <EditorCard key={e.id} editor={e} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-xs text-white/30 space-y-2">
          <p>Por <a href="https://fotogrowth.com" className="text-fg-azul hover:underline">FotoGrowth</a> · Directorio en beta</p>
          <p>¿Eres miembro de FotoGrowth? Este recurso es parte de tu acceso.</p>
        </div>
      </footer>
    </main>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="text-center py-20 text-white/40">
        <p className="mb-2">No encontramos editores con esos filtros.</p>
        <p className="text-sm text-white/30">Probá limpiando algún filtro.</p>
      </div>
    )
  }
  return (
    <div className="text-center py-20 text-white/40">
      <p className="mb-3">El directorio está arrancando 🚀</p>
      <p className="text-sm text-white/30 mb-6">Estamos curando los primeros editores.</p>
      <Link href="/aplicar" className="btn-primary px-5 py-2 text-xs">
        ¿Eres editor? Aplicá acá
      </Link>
    </div>
  )
}
