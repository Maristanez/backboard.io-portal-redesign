/**
 * Headline stats and the twelve-week points series.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  CategoryBreakdown,
  Kpi,
} from '../domain/types'

export const KPIS: Kpi[] = [
  { label: 'POINTS EARNED', value: '65', delta: '+65 this week' },
  { label: 'SUBMISSIONS', value: '2', delta: '2 approved' },
  { label: 'EST. REACH', value: '1.2k', delta: '+1.2k this week' },
  { label: 'EVENTS HOSTED', value: '0', delta: 'first one unlocks T2' },
]

export const CATEGORY_BREAKDOWN: CategoryBreakdown[] = [
  { label: 'Content', points: 50, percent: 77 },
  { label: 'Challenges', points: 15, percent: 23 },
  { label: 'Events', points: 0, percent: 0 },
  { label: 'Build', points: 0, percent: 0 },
  { label: 'Referrals', points: 0, percent: 0 },
]

/** Weekly points for the analytics sparkline, oldest week first. */

export const WEEKLY_POINTS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 65]

/**
 * Command palette destinations. Entries past the eight panels deep-link into a
 * sub-tab, which is how the collapsed panels stay reachable by name.
 */
