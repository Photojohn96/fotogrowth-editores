import Link from 'next/link'
import type { Editor } from '@/lib/types'
import { VIDEO_TYPES, LANGUAGES, TURNAROUNDS, labelOf } from '@/lib/constants'

function priceLabel(e: Editor): string {
  const unit = e.price_unit === 'project' ? 'proyecto' : e.price_unit === 'video' ? 'video' : 'hora'
  if (e.price_min_usd === e.price_max_usd) return `$${e.price_min_usd} / ${unit}`
  return `$${e.price_min_usd} – $${e.price_max_usd} / ${unit}`
}

export default function EditorCard({ editor }: { editor: Editor }) {
  return (
    <Link
      href={`/editor/${editor.slug}`}
      className="group block bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/15 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-base group-hover:text-fg-azul transition-colors">
            {editor.name}
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            {editor.country}{editor.city ? ` · ${editor.city}` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{priceLabel(editor)}</p>
          <p className="text-[10px] text-white/40 mt-0.5">{labelOf(TURNAROUNDS, editor.turnaround)}</p>
        </div>
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
