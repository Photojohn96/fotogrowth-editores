import { createClient } from '@supabase/supabase-js'

// Public client (anon key) — safe for browser. Used for SELECTs on approved rows.
// RLS on Supabase MUST be configured to allow only `status = 'approved'` reads.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client (service role) — server-only. Bypasses RLS.
// Use ONLY in route handlers / server components, never imported in client code.
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

// Generate a URL-safe slug: "Juan Perez" + uuid8 → "juan-perez-a3f2"
export function makeSlug(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  const suffix = id.replace(/-/g, '').slice(0, 4)
  return `${base || 'editor'}-${suffix}`
}
