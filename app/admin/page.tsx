'use client'

import { useState, useEffect } from 'react'
import { supabasePublic } from '@/lib/supabase'
import type { Editor } from '@/lib/types'
import { VIDEO_TYPES, LANGUAGES, TURNAROUNDS, labelOf } from '@/lib/constants'

// IMPORTANT: This page reads via supabasePublic but admin RLS policy must
// allow SELECT on all rows when the request includes admin password header.
// Simpler MVP: gate the UI by password, fetch via /api/admin-list (service role).
// For v1, we use the easier path: client fetches with a custom Postgres function
// or — even simpler — gate everything client-side and use service-role API for actions.

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')

  async function load() {
    setLoading(true)
    const { data, error } = await supabasePublic
      .from('editors')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('[admin load]', error)
    setEditors((data as Editor[]) || [])
    setLoading(false)
  }

  useEffect(() => { if (authed) load() }, [authed])

  async function act(id: string, action: 'approve' | 'reject') {
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, action })
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(`Error: ${j.error || res.statusText}`)
      return
    }
    await load()
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="max-w-sm w-full px-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin</h1>
          <input
            type="password"
            className="input mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setAuthed(true)}
          />
          <button onClick={() => setAuthed(true)} className="btn-primary w-full py-3 text-sm">
            Entrar
          </button>
        </div>
      </main>
    )
  }

  const filtered = filter === 'all' ? editors : editors.filter(e => e.status === filter)

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin · Editores</h1>
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip ${filter === f ? 'chip-active' : ''}`}
              >
                {f} ({editors.filter(e => f === 'all' || e.status === f).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-white/40 text-center py-20">Cargando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/40 text-center py-20">No hay editores en este estado.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(e => <AdminCard key={e.id} editor={e} onAct={act} />)}
          </div>
        )}
      </div>
    </main>
  )
}

function AdminCard({
  editor,
  onAct
}: {
  editor: Editor
  onAct: (id: string, action: 'approve' | 'reject') => void
}) {
  const statusColor = editor.status === 'approved'
    ? 'text-green-400 border-green-500/30'
    : editor.status === 'rejected'
    ? 'text-red-400 border-red-500/30'
    : 'text-amber-400 border-amber-500/30'

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{editor.name}</h3>
          <p className="text-xs text-white/40 mt-1">
            {editor.email} · {editor.country}{editor.city ? ` · ${editor.city}` : ''}
            {editor.whatsapp && ` · WA: ${editor.whatsapp}`}
            {editor.ig_handle && ` · @${editor.ig_handle}`}
          </p>
        </div>
        <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${statusColor}`}>
          {editor.status}
        </span>
      </div>

      {editor.bio && <p className="text-sm text-white/65 mb-3">{editor.bio}</p>}

      <div className="grid md:grid-cols-3 gap-4 text-xs mb-4">
        <div>
          <p className="text-white/40 mb-1">Edita</p>
          <p className="text-white/80">{editor.video_types.map(v => labelOf(VIDEO_TYPES, v)).join(', ')}</p>
        </div>
        <div>
          <p className="text-white/40 mb-1">Precio · Entrega</p>
          <p className="text-white/80">
            ${editor.price_min_usd}-${editor.price_max_usd} / {editor.price_unit} · {labelOf(TURNAROUNDS, editor.turnaround)}
          </p>
        </div>
        <div>
          <p className="text-white/40 mb-1">Idiomas</p>
          <p className="text-white/80">{editor.languages.map(l => labelOf(LANGUAGES, l)).join(', ')}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <a
          href={editor.portfolio_url}
          target="_blank"
          rel="noopener"
          className="text-xs text-fg-azul hover:underline truncate max-w-md"
        >
          🔗 {editor.portfolio_url}
        </a>
        <div className="flex gap-2">
          {editor.status !== 'approved' && (
            <button onClick={() => onAct(editor.id, 'approve')} className="btn-primary px-4 py-1.5 text-xs">
              ✓ Aprobar
            </button>
          )}
          {editor.status !== 'rejected' && (
            <button onClick={() => onAct(editor.id, 'reject')} className="btn-ghost px-4 py-1.5 text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30">
              ✕ Rechazar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
