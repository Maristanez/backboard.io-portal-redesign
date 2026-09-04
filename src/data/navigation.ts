/**
 * Command palette destinations.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  PaletteTarget,
} from '../domain/types'

export const PALETTE_TARGETS: PaletteTarget[] = [
  { label: 'Home', hint: 'What to do next', panel: 'Home' },
  { label: 'Submit', hint: 'Log work for review', panel: 'Submit' },
  { label: 'Challenges', hint: 'Admin-published bounties', panel: 'Challenges' },
  { label: 'Calendar', hint: 'Events worldwide', panel: 'Calendar' },
  { label: 'Leaderboard', hint: 'Semester ranking', panel: 'Leaderboard' },
  {
    label: 'Campus teams',
    hint: 'Leaderboard → Campuses',
    panel: 'Leaderboard',
    tab: 'Campuses',
  },
  { label: 'Store', hint: 'Redeem points', panel: 'Store' },
  { label: 'Referrals', hint: 'Store → Referrals', panel: 'Store', tab: 'Referrals' },
  { label: 'Directory', hint: 'Community → Directory', panel: 'Community', tab: 'Directory' },
  {
    label: 'Opportunities',
    hint: 'Community → Jobs and internships',
    panel: 'Community',
    tab: 'Opportunities',
  },
  {
    label: 'Resources',
    hint: 'Community → Brand kit and decks',
    panel: 'Community',
    tab: 'Resources',
  },
  { label: 'Profile', hint: 'You and your tier', panel: 'Profile' },
  { label: 'Analytics', hint: 'Profile → Reach and points', panel: 'Profile', tab: 'Analytics' },
]

/** Day-of-week headers for the calendar grid. */
