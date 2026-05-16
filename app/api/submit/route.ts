import { supabaseAdmin, makeSlug } from '@/lib/supabase'
import type { EditorSubmission } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EditorSubmission

    // Minimal server-side validation. Client already filters, but trust nothing from client.
    if (!body.name?.trim()) return bad('name required')
    if (!body.email?.includes('@')) return bad('valid email required')
    if (!body.country) return bad('country required')
    if (!Array.isArray(body.video_types) || body.video_types.length === 0) return bad('select at least 1 video type')
    if (!Array.isArray(body.languages) || body.languages.length === 0) return bad('select at least 1 language')
    if (!body.portfolio_url?.startsWith('http')) return bad('portfolio_url must be a valid URL')
    if (body.price_min_usd < 0 || body.price_max_usd < body.price_min_usd) return bad('invalid price range')

    // Sanitize bio length server-side too — client maxLength can be tampered.
    const bio = body.bio?.slice(0, 280) ?? null

    const sb = supabaseAdmin()

    // Generate id first so we can build slug from it. Supabase auto-generates if omitted,
    // but doing it client-side here lets us compute slug in 1 round-trip.
    const id = crypto.randomUUID()
    const slug = makeSlug(body.name, id)

    const { error } = await sb.from('editors').insert({
      id,
      slug,
      status: 'pending',
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      whatsapp: body.whatsapp?.trim() || null,
      city: body.city?.trim() || null,
      country: body.country,
      ig_handle: body.ig_handle?.trim().replace(/^@/, '') || null,
      video_types: body.video_types,
      languages: body.languages,
      turnaround: body.turnaround,
      price_min_usd: Math.round(body.price_min_usd),
      price_max_usd: Math.round(body.price_max_usd),
      price_unit: body.price_unit,
      portfolio_url: body.portfolio_url.trim(),
      portfolio_extras: body.portfolio_extras?.filter(Boolean) || null,
      bio
    })

    if (error) {
      // Duplicate email triggers UNIQUE constraint — communicate clearly
      if (error.code === '23505') {
        return bad('Ya hay una aplicación con ese email. Si querés actualizarla, escribinos a hola@fotogrowth.com.')
      }
      console.error('[submit] insert error', error)
      return Response.json({ error: 'Error guardando' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error('[submit] uncaught', e)
    return Response.json({ error: 'Error procesando' }, { status: 500 })
  }
}

function bad(msg: string) {
  return Response.json({ error: msg }, { status: 400 })
}
