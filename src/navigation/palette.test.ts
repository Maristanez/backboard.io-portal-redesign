import { describe, expect, it } from 'vitest'

import { filterPaletteTargets } from './palette'
import { PALETTE_TARGETS } from '../data/program'

describe('filterPaletteTargets', () => {
  it('returns everything for an empty query', () => {
    expect(filterPaletteTargets(PALETTE_TARGETS, '')).toHaveLength(PALETTE_TARGETS.length)
    expect(filterPaletteTargets(PALETTE_TARGETS, '   ')).toHaveLength(PALETTE_TARGETS.length)
  })

  it('matches on the label, case-insensitively', () => {
    const hits = filterPaletteTargets(PALETTE_TARGETS, 'STORE')
    expect(hits.map((t) => t.label)).toContain('Store')
  })

  it('matches on the hint, so you can search by what a panel does', () => {
    // "Semester ranking" is the hint for Leaderboard, whose label lacks the word.
    const hits = filterPaletteTargets(PALETTE_TARGETS, 'ranking')
    expect(hits.map((t) => t.label)).toStrictEqual(['Leaderboard'])
  })

  it('finds a sub-tab by its own name, not its parent panel', () => {
    const hits = filterPaletteTargets(PALETTE_TARGETS, 'referrals')
    expect(hits).toHaveLength(1)
    expect(hits[0]).toMatchObject({ panel: 'Store', tab: 'Referrals' })
  })

  it('returns nothing when a query matches nothing', () => {
    expect(filterPaletteTargets(PALETTE_TARGETS, 'zzzz')).toStrictEqual([])
  })

  it('preserves the declared order rather than re-ranking', () => {
    const hits = filterPaletteTargets(PALETTE_TARGETS, 'o')
    const declared = PALETTE_TARGETS.filter((t) => hits.includes(t))
    expect(hits).toStrictEqual(declared)
  })
})
