// Constants used across the form + filters. Single source of truth.

export const VIDEO_TYPES = [
  { id: 'video_tour',    label: 'Video Tours',           emoji: '🎬' },
  { id: 'twilight',      label: 'Twilight / Hora Mágica', emoji: '🌆' },
  { id: 'drone_reels',   label: 'Drone Reels',           emoji: '🚁' },
  { id: 'listing_video', label: 'Listing Video MLS',     emoji: '📺' },
  { id: 'reels',         label: 'Reels Instagram',       emoji: '📱' },
  { id: 'cinematic',     label: 'Cinemático / Luxury',   emoji: '✨' },
  { id: 'walkthrough',   label: 'Walkthrough rápido',    emoji: '🚶' },
  { id: 'commercial',    label: 'Commercial / Corporate', emoji: '🏢' }
] as const

export const LANGUAGES = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'Inglés' },
  { id: 'pt', label: 'Portugués' },
  { id: 'fr', label: 'Francés' },
  { id: 'it', label: 'Italiano' }
] as const

export const TURNAROUNDS = [
  { id: '24h',      label: '24 horas' },
  { id: '48h',      label: '48 horas' },
  { id: '72h',      label: '3 días' },
  { id: '1week',    label: '1 semana' },
  { id: 'flexible', label: 'Flexible / Depende' }
] as const

// Simplified: project or video (per-hour removed for clarity)
export const PRICE_UNITS = [
  { id: 'project', label: 'Por proyecto' },
  { id: 'video',   label: 'Por video' }
] as const

// Availability badge — shows on directory card
export const AVAILABILITY_OPTIONS = [
  { id: 'available_now', label: 'Disponible ya',      emoji: '🟢', color: 'green' },
  { id: 'limited',       label: 'Capacidad limitada', emoji: '🟡', color: 'amber' },
  { id: 'full',          label: 'Agenda llena',       emoji: '🔴', color: 'red' }
] as const

// For filters in directory
export const PRICE_BANDS = [
  { id: 'lt100',    label: 'Hasta $100',  min: 0,    max: 100 },
  { id: '100-300',  label: '$100 – $300', min: 100,  max: 300 },
  { id: '300-500',  label: '$300 – $500', min: 300,  max: 500 },
  { id: '500-1000', label: '$500 – $1K',  min: 500,  max: 1000 },
  { id: '1000+',    label: '$1K+',        min: 1000, max: 99999 }
] as const

// Country list — short, LATAM-first
export const COUNTRIES = [
  '🇲🇽 México',
  '🇨🇴 Colombia',
  '🇦🇷 Argentina',
  '🇨🇱 Chile',
  '🇵🇪 Perú',
  '🇻🇪 Venezuela',
  '🇪🇸 España',
  '🇺🇸 Estados Unidos',
  '🇧🇷 Brasil',
  '🇪🇨 Ecuador',
  '🇺🇾 Uruguay',
  '🇩🇴 Rep. Dominicana',
  '🇨🇷 Costa Rica',
  '🇬🇹 Guatemala',
  '🇵🇦 Panamá',
  '🇵🇷 Puerto Rico',
  'Otro'
] as const

// Helper: turn label arrays into label lookups (id → label)
export function labelOf<T extends ReadonlyArray<{ id: string; label: string }>>(
  arr: T,
  id: string
): string {
  return arr.find(x => x.id === id)?.label ?? id
}
