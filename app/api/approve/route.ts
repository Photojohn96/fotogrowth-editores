import { supabaseAdmin } from '@/lib/supabase'

// Admin-only. Auth via password header. Simple but effective for MVP — solo John usa esto.
// Migrar a Supabase Auth row-level admin role cuando crezca.
export async function POST(req: Request) {
  const auth = req.headers.get('x-admin-password')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { id, action } = (await req.json()) as { id: string; action: 'approve' | 'reject' }
    if (!id || !['approve', 'reject'].includes(action)) {
      return Response.json({ error: 'bad request' }, { status: 400 })
    }

    const sb = supabaseAdmin()
    const { error } = await sb
      .from('editors')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        approved_at: action === 'approve' ? new Date().toISOString() : null
      })
      .eq('id', id)

    if (error) {
      console.error('[approve] update error', error)
      return Response.json({ error: 'update failed' }, { status: 500 })
    }
    return Response.json({ success: true })
  } catch (e) {
    console.error('[approve] uncaught', e)
    return Response.json({ error: 'failed' }, { status: 500 })
  }
}
