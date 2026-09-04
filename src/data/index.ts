/**
 * Program content.
 *
 * Split by the part of the program it describes rather than kept as one long
 * file — a change to the store catalogue shouldn't mean scrolling past the
 * directory to find it.
 *
 * This barrel is the seam a real backend attaches at: panels import from
 * `../../data`, so replacing any of these fixtures with a fetch is a change
 * behind this interface, not at every call site.
 */
export * from './activity'
export * from './analytics'
export * from './calendar'
export * from './challenges'
export * from './community'
export * from './earning'
export * from './leaderboard'
export * from './navigation'
export * from './preferences'
export * from './store'
export * from './viewer'
