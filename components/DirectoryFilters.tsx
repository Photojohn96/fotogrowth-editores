'use client'

import { VIDEO_TYPES, LANGUAGES, TURNAROUNDS, AVAILABILITY_OPTIONS, PRICE_UNITS } from '@/lib/constants'
import type { DirectoryFilters, PriceBand } from '@/lib/types'

type Props = {
  filters: DirectoryFilters
  onChange: (next: DirectoryFilters) => void
  resultCount: number
  priceBands: PriceBand[]   // dynamically computed from data
}

export default function Filters({ filters, onChange, resultCount, priceBands }: Props) {
  function toggle<K extends keyof DirectoryFilters>(key: K, value: DirectoryFilters[K]) {
    onChange({ ...filters, [key]: filters[key] === value ? null : value })
  }

  function clearAll() {
    onChange({ q: '', language: null, video_type: null, price_band: null, price_unit: null, turnaround: null, availability: null })
  }

  const hasActiveFilters = !!(filters.language || filters.video_type || filters.price_band || filters.price_unit || filters.turnaround || filters.availability || filters.q)

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre, ciudad, IG..."
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          className="input"
        />
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">
          {resultCount} {resultCount === 1 ? 'editor' : 'editores'}
        </span>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-fg-azul hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Availability — primary filter */}
      <FilterGroup title="Disponibilidad">
        {AVAILABILITY_OPTIONS.map(a => (
          <button
            key={a.id}
            onClick={() => toggle('availability', a.id)}
            className={`chip ${filters.availability === a.id ? 'chip-active' : ''}`}
          >
            <span>{a.emoji}</span>
            <span>{a.label}</span>
          </button>
        ))}
      </FilterGroup>

      {/* Price unit — apples-to-apples normalizer.
          If you don't pick one, price bands include both project + video editors
          which is rarely what you want (a $15/video editor isn't comparable to
          a $400/project editor in the same band). Hint copy explains this. */}
      <FilterGroup
        title="Tipo de precio"
        hint="Filtra primero para que las bandas tengan sentido."
      >
        {PRICE_UNITS.map(u => (
          <button
            key={u.id}
            onClick={() => toggle('price_unit', u.id as DirectoryFilters['price_unit'])}
            className={`chip ${filters.price_unit === u.id ? 'chip-active' : ''}`}
          >
            {u.label}
          </button>
        ))}
      </FilterGroup>

      {/* Dynamic price bands */}
      {priceBands.length > 0 && (
        <FilterGroup
          title={`Rango ${filters.price_unit ? '(por ' + (filters.price_unit === 'project' ? 'proyecto' : 'video') + ')' : '(USD)'}`}
        >
          {priceBands.map(p => (
            <button
              key={p.id}
              onClick={() => toggle('price_band', p.id)}
              className={`chip ${filters.price_band === p.id ? 'chip-active' : ''}`}
              title={`${p.count} ${p.count === 1 ? 'editor' : 'editores'} en este rango`}
            >
              <span>{p.label}</span>
              <span className="ml-1 text-white/30 text-[10px]">·{p.count}</span>
            </button>
          ))}
        </FilterGroup>
      )}

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

function FilterGroup({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-label mb-2">{title}</p>
      {hint && <p className="text-[10px] text-white/30 mb-2 leading-snug">{hint}</p>}
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
