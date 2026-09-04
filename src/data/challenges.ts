/**
 * Admin-published bounties.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  Challenge,
} from '../domain/types'

export const CHALLENGES: Challenge[] = [
  {
    title: 'CLI Star and Fork',
    description:
      'Star and fork our CLI, Nash and other open-source backends. Attach a screenshot of your GitHub activity.',
    points: 25,
    meta: 'NO CLAIM LIMIT',
    status: 'approved',
  },
  {
    title: 'Portal Redesign',
    description:
      'Open competition: redesign this portal for the ambassador program. Must be open source and keep all functionality. Winning design replaces the current one.',
    points: 500,
    meta: 'DUE 9/11/2026 · 1 WINNER',
    status: 'open',
  },
  {
    title: 'Bounty #1: Backboard LinkedIn post',
    description: 'Create a post on LinkedIn about Backboard and agentic infrastructure.',
    points: 40,
    meta: 'DUE 9/1/2026 · 20 CLAIMS',
    status: 'approved',
  },
]

/** Keyed `YYYY-M-D`, month and day un-padded, matching the calendar's lookup. */
