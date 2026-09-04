/**
 * Who the viewer is, and the tier ladder they sit on.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  Tier,
} from '../domain/types'

export const VIEWER = {
  name: 'Bilal M.',
  initials: 'BM',
  school: 'McMaster University',
  joined: 'Joined Aug 2026',
  tier: 'ROOKIE',
  cohort: "FALL '26 COHORT",
  /** Spendable and lifetime points are equal until something is redeemed. */
  points: 65,
  referralCode: 'OZEYBYR3',
  referralLink: 'https://app.backboard.io/signup?ref=OZEYBYR3',
  rank: 8,
  cohortSize: 26,
} as const

/** Points needed for the next tier up from the viewer's. */

export const NEXT_TIER = { name: 'Captain', threshold: 1000 } as const

/** "Today" in the design's fiction — the calendar highlights this date. */

export const TODAY = { year: 2026, month: 8, day: 2 } as const

export const TIER_LADDER: Tier[] = [
  { name: 'Rookie', threshold: 0 },
  { name: 'Captain', threshold: 1000 },
  { name: 'Legend', threshold: 3000 },
  { name: 'Founder', threshold: 7500 },
]

/** Ways to earn, grouped by category. Order is the tab order. */

export function tierFor(points: number): Tier {
  // Walk down from the top; the first threshold cleared is the tier.
  return [...TIER_LADDER].reverse().find((tier) => points >= tier.threshold) ?? TIER_LADDER[0]!
}
