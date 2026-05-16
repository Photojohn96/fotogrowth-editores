'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { VIDEO_TYPES, LANGUAGES, TURNAROUNDS, PRICE_UNITS, COUNTRIES } from '@/lib/constants'
import type { EditorSubmission } from '@/lib/types'

type Step = 1 | 2 | 3 | 4 | 5

const EMPTY: EditorSubmission = {
  name: '', email: '', whatsapp: '', city: '', country: '', ig_handle: '',
  video_types: [], languages: [], turnaround: '48h',
  price_min_usd: 100, price_max_usd: 300, price_unit: 'project',
  portfolio_url: '', portfolio_extras: [],
  bio: ''
}

export default function ApplyPage() {
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<EditorSubmission>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof EditorSubmission>(key: K, value: EditorSubmission[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function toggleArray<K extends keyof EditorSubmission>(key: K, value: string) {
    const current = (data[key] as unknown as string[]) || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    update(key, next as EditorSubmission[K])
  }

  // Per-step validation — keeps Next button accurate, no surprise errors.
  function isStepValid(): boolean {
    switch (step) {
      case 1: return !!(data.name.trim() && data.email.includes('@') && data.country)
      case 2: return data.video_types.length > 0 && data.languages.length > 0
      case 3: return data.price_min_usd > 0 && data.price_max_usd >= data.price_min_usd && !!data.turnaround
      case 4: return !!data.portfolio_url.trim() && data.portfolio_url.startsWith('http')
      case 5: return true
      default: return false
    }
  }

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error enviando')
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return <SubmittedScreen />

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Nav />

      <section className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/40">Paso {step} de 5</p>
            <p className="text-xs text-white/40">{Math.round((step / 5) * 100)}%</p>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-fg-azul transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {step === 1 && <Step1 data={data} update={update} />}
        {step === 2 && <Step2 data={data} toggle={toggleArray} />}
        {step === 3 && <Step3 data={data} update={update} />}
        {step === 4 && <Step4 data={data} update={update} />}
        {step === 5 && <Step5 data={data} />}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 border border-red-500/30 bg-red-500/5 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1) as Step)}
            disabled={step === 1}
            className="btn-ghost px-5 py-2.5 text-xs disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ← Atrás
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(prev => (prev + 1) as Step)}
              disabled={!isStepValid()}
              className="btn-primary px-6 py-2.5 text-xs"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="btn-primary px-6 py-2.5 text-xs"
            >
              {submitting ? 'Enviando...' : 'Enviar aplicación ✓'}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

// ───── Step components ─────

function Step1({ data, update }: {
  data: EditorSubmission
  update: <K extends keyof EditorSubmission>(k: K, v: EditorSubmission[K]) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Empecemos por lo básico 👋</h2>
        <p className="text-sm text-white/50">Solo para contactarte cuando aprobemos tu perfil.</p>
      </div>

      <Field label="Nombre completo *">
        <input className="input" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Juan Pérez" />
      </Field>

      <Field label="Email *">
        <input type="email" className="input" value={data.email} onChange={e => update('email', e.target.value)} placeholder="juan@editor.com" />
      </Field>

      <Field label="WhatsApp (con código de país)">
        <input className="input" value={data.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} placeholder="+52 55 1234 5678" />
        <p className="text-[11px] text-white/30 mt-1">Esto es lo que verán los miembros de FotoGrowth para contactarte.</p>
      </Field>

      <Field label="@ de Instagram (opcional)">
        <input className="input" value={data.ig_handle || ''} onChange={e => update('ig_handle', e.target.value)} placeholder="@tu_handle" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ciudad">
          <input className="input" value={data.city || ''} onChange={e => update('city', e.target.value)} placeholder="CDMX, Bogotá..." />
        </Field>
        <Field label="País *">
          <select className="input" value={data.country} onChange={e => update('country', e.target.value)}>
            <option value="">Elige tu país</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
    </div>
  )
}

function Step2({ data, toggle }: {
  data: EditorSubmission
  toggle: <K extends keyof EditorSubmission>(k: K, v: string) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">¿Qué editás? 🎬</h2>
        <p className="text-sm text-white/50">Marcá todos los que apliquen.</p>
      </div>

      <Field label="Tipos de video que editás *">
        <div className="flex flex-wrap gap-2">
          {VIDEO_TYPES.map(v => {
            const active = data.video_types.includes(v.id)
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggle('video_types', v.id)}
                className={`chip ${active ? 'chip-active' : ''}`}
              >
                <span>{v.emoji}</span>
                <span>{v.label}</span>
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Idiomas que hablás con el cliente *">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => {
            const active = data.languages.includes(l.id)
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => toggle('languages', l.id)}
                className={`chip ${active ? 'chip-active' : ''}`}
              >
                {l.label}
              </button>
            )
          })}
        </div>
      </Field>
    </div>
  )
}

function Step3({ data, update }: {
  data: EditorSubmission
  update: <K extends keyof EditorSubmission>(k: K, v: EditorSubmission[K]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Precio y tiempo de entrega 💵</h2>
        <p className="text-sm text-white/50">Sé realista — los miembros valoran transparencia.</p>
      </div>

      <Field label="Rango de precio (USD) *">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-white/40 mb-1 block">Mínimo</label>
            <input
              type="number" min="0" step="10"
              className="input"
              value={data.price_min_usd}
              onChange={e => update('price_min_usd', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-[11px] text-white/40 mb-1 block">Máximo</label>
            <input
              type="number" min="0" step="10"
              className="input"
              value={data.price_max_usd}
              onChange={e => update('price_max_usd', Number(e.target.value))}
            />
          </div>
        </div>
      </Field>

      <Field label="¿Cómo cobrás? *">
        <div className="flex flex-wrap gap-2">
          {PRICE_UNITS.map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => update('price_unit', u.id as EditorSubmission['price_unit'])}
              className={`chip ${data.price_unit === u.id ? 'chip-active' : ''}`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Tiempo de entrega típico *">
        <div className="flex flex-wrap gap-2">
          {TURNAROUNDS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => update('turnaround', t.id)}
              className={`chip ${data.turnaround === t.id ? 'chip-active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Field>
    </div>
  )
}

function Step4({ data, update }: {
  data: EditorSubmission
  update: <K extends keyof EditorSubmission>(k: K, v: EditorSubmission[K]) => void
}) {
  const extras = data.portfolio_extras || []

  function updateExtra(i: number, v: string) {
    const next = [...extras]
    next[i] = v
    update('portfolio_extras', next.filter(Boolean))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Mostranos tu trabajo 🎥</h2>
        <p className="text-sm text-white/50">Sin esto no podemos aprobar — los fotógrafos compran lo que ven.</p>
      </div>

      <Field label="Link principal de portfolio *">
        <input
          className="input"
          value={data.portfolio_url}
          onChange={e => update('portfolio_url', e.target.value)}
          placeholder="https://youtube.com/@tu-canal o https://vimeo.com/showcase/..."
        />
        <p className="text-[11px] text-white/30 mt-1">YouTube channel, Vimeo, sitio personal, Drive público...</p>
      </Field>

      <Field label="Links extra (opcional)">
        <input
          className="input mb-2"
          value={extras[0] || ''}
          onChange={e => updateExtra(0, e.target.value)}
          placeholder="Link a un reel destacado..."
        />
        <input
          className="input"
          value={extras[1] || ''}
          onChange={e => updateExtra(1, e.target.value)}
          placeholder="Otro proyecto..."
        />
      </Field>

      <Field label="Bio corta (max 280 chars)">
        <textarea
          className="input min-h-[100px] resize-none"
          maxLength={280}
          value={data.bio || ''}
          onChange={e => update('bio', e.target.value)}
          placeholder="Ej: Edito desde 2020 listing videos para agentes en CDMX. Cinematográfico, entrego en 48h, especialista en twilight + drone."
        />
        <p className="text-[11px] text-white/30 mt-1 text-right">{(data.bio || '').length}/280</p>
      </Field>
    </div>
  )
}

function Step5({ data }: { data: EditorSubmission }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Revisá antes de enviar ✓</h2>
        <p className="text-sm text-white/50">Si todo se ve bien, dale a enviar. Revisamos en 24-48h.</p>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3 text-sm">
        <ReviewRow label="Nombre" value={data.name} />
        <ReviewRow label="Email" value={data.email} />
        {data.whatsapp && <ReviewRow label="WhatsApp" value={data.whatsapp} />}
        <ReviewRow label="Ubicación" value={`${data.city ? data.city + ', ' : ''}${data.country}`} />
        <ReviewRow label="Tipos de video" value={data.video_types.join(', ')} />
        <ReviewRow label="Idiomas" value={data.languages.join(', ')} />
        <ReviewRow label="Precio" value={`$${data.price_min_usd} – $${data.price_max_usd} ${data.price_unit}`} />
        <ReviewRow label="Entrega" value={data.turnaround} />
        <ReviewRow label="Portfolio" value={data.portfolio_url} />
        {data.bio && <ReviewRow label="Bio" value={data.bio} />}
      </div>

      <p className="text-xs text-white/40 text-center">
        Al enviar aceptás aparecer en el directorio público de FotoGrowth cuando seamos aprobado.
      </p>
    </div>
  )
}

// ───── Small helpers ─────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">{label}</label>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs text-white/40 w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-white/85 flex-1 break-words">{value || '—'}</span>
    </div>
  )
}

function SubmittedScreen() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Recibido!</h1>
        <p className="text-white/55 leading-relaxed mb-8">
          Vamos a revisar tu aplicación en las próximas 24-48 horas. Si todo se ve bien,
          aparecerás en el directorio y te llegará un email con el link a tu perfil.
        </p>
        <Link href="/" className="btn-primary px-6 py-3 text-sm">
          Volver al directorio
        </Link>
      </div>
    </main>
  )
}
