'use client'

import { VIDEO_TYPES, LANGUAGES, PRICE_BANDS, TURNAROUNDS } from '@/lib/constants'
import type { DirectoryFilters } from '@/lib/types'

type Props = {
  filters: DirectoryFilters
  onChange: (next: DirectoryFilters) => void
  resultCount: number
}

export default function Filters({ filters, onChange, resultCount }: Props) {
  function toggle<K extends keyof DirectoryFilters>(key: K, value: DirectoryFilters[K]) {
    onChange({ ...filters, [key]: filters[key] === value ? null : value })
  }

  function clearAll() {
    onChange({ q: '', language: null, video_type: null, price_band: null, turnaround: null })
  }

  const hasActiveFilters = !!(filters.language || filters.video_type || filters.price_band || filters.turnaround || filters.q)

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Buscar editor por nombre, ciudad, IG..."
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          className="input"
        />
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">
          {resultCount} {resultCount === 1 ? 'editor encontrado' : 'editores encontrados'}
        </span>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-fg-azul hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Type chips */}
      <FilterGroup title="Tipo de video">
        {VIDEO_TYPES.map(v => (
          <button
            key={v.id}
            onClick={() => toggle('video_type', v.id)}
            className={`chip ${filters.video_type === v.id ? 'chip-active' : ''}`}
          >
            <span>{v.emoji}</span>
            <span>{v.label}</span>
          </button>
        ))}
      </FilterGroup>

      {/* Price chips */}
      <FilterGroup title="Rango de precio (USD)">
        {PRICE_BANDS.map(p => (
          <button
            key={p.id}
            onClick={() => toggle('price_band', p.id)}
            className={`chip ${filters.price_band === p.id ? 'chip-active' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </FilterGroup>

      {/* Language chips */}
      <FilterGroup title="Idioma">
        {LANGUAGES.map(l => (
          <button
            key={l.id}
            onClick={() => toggle('language', l.id)}
            className={`chip ${filters.language === l.id ? 'chip-active' : ''}`}
          >
            {l.label}
          </button>
        ))}
      </FilterGroup>

      {/* Turnaround chips */}
      <FilterGroup title="Tiempo de entrega">
        {TURNAROUNDS.map(t => (
          <button
            key={t.id}
            onClick={() => toggle('turnaround', t.id)}
            className={`chip ${filters.turnaround === t.id ? 'chip-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-label mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
