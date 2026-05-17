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
  q: '', language: null, video_type: null, price_band: null, turnaround: null, availability: null
}

export default function DirectoryPage() {
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DirectoryFilters>(EMPTY_FILTERS)

  // Fetch approved editors on mount. Sort by availability (available_now first)
  // then by created_at desc, so the most discoverable editors land at the top.
  useEffect(() => {
    let alive = true
    supabasePublic
      .from('editors')
      .select('*')
      .eq('status', 'approved')
      .then(({ data, error }) => {
        if (!alive) return
        if (error) console.error('[editors fetch]', error)
        const rows = (data as Editor[]) || []
        rows.sort((a, b) => {
          // Sort: available_now > limited > full, then newest first
          const rank: Record<string, number> = { available_now: 0, limited: 1, full: 2 }
          const ra = rank[a.availability] ?? 99
          const rb = rank[b.availability] ?? 99
          if (ra !== rb) return ra - rb
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        setEditors(rows)
        setLoading(false)
      })
    return () => { alive = false }
  }, [])

  // Client-side filter — fine for <1K editores. Migrate to server when it grows.
  const filtered = useMemo(() => {
    return editors.filter(e => {
      if (filters.q.trim()) {
        const q = filters.q.toLowerCase()
        const hay = `${e.name} ${e.city ?? ''} ${e.bio ?? ''} ${e.ig_handle ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.language && !e.languages.includes(filters.language)) return false
      if (filters.video_type && !e.video_types.includes(filters.video_type)) return false
      if (filters.turnaround && e.turnaround !== filters.turnaround) return false
      if (filters.availability && e.availability !== filters.availability) return false
      if (filters.price_band) {
        const band = PRICE_BANDS.find(p => p.id === filters.price_band)
        if (band) {
          if (e.price_max_usd < band.min || e.price_min_usd > band.max) return false
        }
      }
      return true
    })
  }, [editors, filters])

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      {/* Header */}
      <section className="px-6 pt-12 pb-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-2">Directorio</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight gradient-text">
            Editores de video para bienes raíces
          </h1>
          <p className="text-white/50 mt-2 text-sm">
            {editors.length} {editors.length === 1 ? 'editor activo' : 'editores activos'} ·
            filtra por idioma, presupuesto y disponibilidad
          </p>
        </div>
      </section>

      {/* Directory grid */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-10">
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
            <Filters filters={filters} onChange={setFilters} resultCount={filtered.length} />
          </aside>

          <div>
            {loading ? (
              <SkeletonGrid />
            ) : filtered.length === 0 ? (
              <EmptyState hasFilters={hasFilters(filters)} totalEditors={editors.length} />
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
        <div className="max-w-6xl mx-auto text-center text-xs text-white/30">
          ¿Eres editor? <Link href="/aplicar" className="text-fg-azul hover:underline">Aplica gratis al directorio →</Link>
        </div>
      </footer>
    </main>
  )
}

function hasFilters(f: DirectoryFilters): boolean {
  return !!(f.q || f.language || f.video_type || f.price_band || f.turnaround || f.availability)
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 animate-pulse">
          <div className="h-5 bg-white/10 rounded w-1/2 mb-2" />
          <div className="h-3 bg-white/5 rounded w-1/3 mb-4" />
          <div className="h-3 bg-white/5 rounded w-full mb-1.5" />
          <div className="h-3 bg-white/5 rounded w-5/6 mb-4" />
          <div className="flex gap-2">
            <div className="h-5 bg-white/5 rounded-full w-20" />
            <div className="h-5 bg-white/5 rounded-full w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasFilters, totalEditors }: { hasFilters: boolean; totalEditors: number }) {
  if (hasFilters) {
    return (
      <div className="text-center py-20 text-white/40">
        <p className="mb-2">No encontramos editores con esos filtros.</p>
        <p className="text-sm text-white/30">Prueba limpiando algún filtro.</p>
      </div>
    )
  }
  if (totalEditors === 0) {
    return (
      <div className="text-center py-20 text-white/40">
        <p className="mb-3 text-2xl">🚀</p>
        <p className="mb-3 font-semibold text-white/80">El directorio está arrancando</p>
        <p className="text-sm text-white/40 mb-6 max-w-md mx-auto">
          Estamos curando los primeros editores. Si eres editor de video real estate,
          aplica gratis ahora — los primeros tienen prioridad de exposición.
        </p>
        <Link href="/aplicar" className="btn-primary px-5 py-2.5 text-xs">
          Aplicar al directorio →
        </Link>
      </div>
    )
  }
  return null
}
