// Centralized types — keep in sync with Supabase schema.

export type EditorStatus = 'pending' | 'approved' | 'rejected'

export type EditorAvailability = 'available_now' | 'limited' | 'full'

export type Editor = {
  id: string
  created_at: string
  status: EditorStatus

  // Basic
  name: string
  email: string
  whatsapp: string | null      // E.164 ideally, but we accept anything
  city: string | null
  country: string                // ISO-ish display name. Free-text for MVP.
  ig_handle: string | null

  // Services
  video_types: string[]          // ['video_tour','twilight','drone_reels',...]
  languages: string[]            // ['es','en','pt','fr','it']
  turnaround: string             // '24h' | '48h' | '72h' | '1week' | 'flexible'

  // Pricing
  price_min_usd: number          // lower bound
  price_max_usd: number          // upper bound (same as min if fixed)
  price_unit: 'project' | 'video'

  // Portfolio
  portfolio_url: string          // primary link (YouTube/Vimeo/Drive/site)
  portfolio_extras: string[] | null // up to 2 additional links

  // Bio
  bio: string | null             // 280 char max — short pitch

  // Availability (new)
  availability: EditorAvailability

  // Admin
  approved_at: string | null
  slug: string                   // URL-friendly identifier, generated server-side
}

// Form payload — what comes from /aplicar before server fills system fields
export type EditorSubmission = Omit<
  Editor,
  'id' | 'created_at' | 'status' | 'approved_at' | 'slug'
>

// Filter shape for directory page
export type DirectoryFilters = {
  q: string                      // free-text search
  language: string | null
  video_type: string | null
  price_band: 'any' | 'lt100' | '100-300' | '300-500' | '500-1000' | '1000+' | null
  turnaround: string | null
  availability: string | null    // 'available_now' filter
}
