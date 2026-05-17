import Link from 'next/link'
import type { Editor } from '@/lib/types'
import { VIDEO_TYPES, LANGUAGES, TURNAROUNDS, AVAILABILITY_OPTIONS, labelOf } from '@/lib/constants'

function priceLabel(e: Editor): string {
  const unit = e.price_unit === 'project' ? 'proyecto' : 'video'
  if (e.price_min_usd === e.price_max_usd) return `$${e.price_min_usd} / ${unit}`
  return `$${e.price_min_usd} – $${e.price_max_usd} / ${unit}`
}

// Map availability to Tailwind class color so the badge stays in sync with the
// constant's `color` token without burying it in conditional JSX everywhere.
const AVAILABILITY_CLASSES: Record<string, string> = {
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red:   'bg-red-500/15 text-red-400 border-red-500/30'
}

export default function EditorCard({ editor }: { editor: Editor }) {
  const avail = AVAILABILITY_OPTIONS.find(a => a.id === editor.availability)

  return (
    <Link
      href={`/editor/${editor.slug}`}
      className="group block bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/15 transition-colors"
    >
      {/* Header: name + availability badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-base group-hover:text-fg-azul transition-colors truncate">
            {editor.name}
          </h3>
          <p className="text-xs text-white/40 mt-0.5 truncate">
            {editor.country}{editor.city ? ` · ${editor.city}` : ''}
          </p>
        </div>
        {avail && (
          <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 flex-shrink-0 ${AVAILABILITY_CLASSES[avail.color]}`}>
            <span className="mr-1">{avail.emoji}</span>{avail.label}
          </span>
        )}
      </div>

      {/* Price + turnaround row */}
      <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-white/5">
        <p className="text-sm font-semibold text-white">{priceLabel(editor)}</p>
        <p className="text-[10px] text-white/40">{labelOf(TURNAROUNDS, editor.turnaround)}</p>
      </div>

      {/* Bio */}
      {editor.bio && (
        <p className="text-sm text-white/55 leading-relaxed mb-4 line-clamp-2">
          {editor.bio}
        </p>
      )}

      {/* Video types chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {editor.video_types.slice(0, 4).map(vt => (
          <span key={vt} className="chip">
            <span>{VIDEO_TYPES.find(v => v.id === vt)?.emoji}</span>
            <span>{labelOf(VIDEO_TYPES, vt)}</span>
          </span>
        ))}
        {editor.video_types.length > 4 && (
          <span className="chip text-white/40">+{editor.video_types.length - 4}</span>
        )}
      </div>

      {/* Languages + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex gap-2">
          {editor.languages.map(l => (
            <span key={l} className="text-[10px] uppercase tracking-wider text-white/40">
              {labelOf(LANGUAGES, l)}
            </span>
          ))}
        </div>
        <span className="text-xs text-fg-azul group-hover:translate-x-0.5 transition-transform">
          Ver perfil →
        </span>
      </div>
    </Link>
  )
}
