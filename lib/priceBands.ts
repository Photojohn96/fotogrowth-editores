import type { Editor, PriceBand } from './types'

/**
 * Compute dynamic price bands from the actual editor data.
 *
 * Why: hardcoded bands like "$0-100, $100-300..." become useless when the real
 * distribution sits far below or far above (e.g. video editors charging $15/video
 * all bucket into "<$100" and the filter is dead). We bucket from data.
 *
 * Strategy:
 *  1. If unit filter is set, only consider editors matching that unit.
 *  2. Pull all `price_min_usd` values, sort.
 *  3. Use quartile boundaries (Q1, median, Q3) to split into 4 bands.
 *     - Round each boundary to a "nice" number (5 / 10 / 25 / 50 / 100).
 *     - If multiple quartiles round to the same number, collapse to fewer bands.
 *  4. Count how many editors fall in each band so we can show "$15-50 · 4 editores".
 *
 * If fewer than ~5 editors total, fall back to a single "Cualquier precio" band
 * (bucketing 5 people into 4 bands is noise).
 */
export function computePriceBands(
  editors: Editor[],
  unitFilter: 'project' | 'video' | null = null
): PriceBand[] {
  const pool = unitFilter
    ? editors.filter(e => e.price_unit === unitFilter)
    : editors

  if (pool.length < 5) {
    // Not enough data — single "any price" band keeps the UI honest.
    if (pool.length === 0) return []
    const min = Math.min(...pool.map(e => e.price_min_usd))
    const max = Math.max(...pool.map(e => e.price_max_usd))
    return [{
      id: 'all',
      label: `$${min} – $${max}`,
      min, max,
      count: pool.length
    }]
  }

  const mins = pool.map(e => e.price_min_usd).sort((a, b) => a - b)
  const q = (p: number) => mins[Math.floor((mins.length - 1) * p)]
  const q25 = niceRound(q(0.25))
  const q50 = niceRound(q(0.50))
  const q75 = niceRound(q(0.75))
  const max = Math.max(...pool.map(e => e.price_max_usd))

  // Build candidate boundaries. Use a Set to dedupe collapsed bands.
  const cuts = Array.from(new Set([0, q25, q50, q75, max + 1])).sort((a, b) => a - b)

  const bands: PriceBand[] = []
  for (let i = 0; i < cuts.length - 1; i++) {
    const min = cuts[i]
    const max = cuts[i + 1] - 1
    const count = pool.filter(e => e.price_max_usd >= min && e.price_min_usd <= max).length
    if (count === 0) continue   // skip empty bands so UI isn't cluttered
    bands.push({
      id: `b${i}`,
      label: i === cuts.length - 2 && cuts.length > 2
        ? `$${min}+`
        : min === 0
        ? `Hasta $${max}`
        : `$${min} – $${max}`,
      min, max, count
    })
  }
  return bands
}

/**
 * Round to the nearest "nice" number so band edges read cleanly.
 *   17 → 15, 43 → 50, 287 → 300, 1432 → 1500
 */
function niceRound(n: number): number {
  if (n < 25) return Math.round(n / 5) * 5
  if (n < 100) return Math.round(n / 25) * 25
  if (n < 500) return Math.round(n / 50) * 50
  if (n < 2000) return Math.round(n / 100) * 100
  return Math.round(n / 500) * 500
}
