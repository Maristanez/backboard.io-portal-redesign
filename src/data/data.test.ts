import { describe, expect, it } from 'vitest'

import { PANELS, PANEL_TABS, TIERS } from '../domain/types'
import {
  CALENDAR_EVENTS,
  CATEGORY_BREAKDOWN,
  CHECKLIST,
  EARN_OPTIONS,
  LEADERS,
  PALETTE_TARGETS,
  STORE_ITEMS,
  TIER_LADDER,
  VIEWER,
  tierFor,
  WEEKLY_POINTS,
} from '.'

describe('program data', () => {
  it('has eight panels, matching the keys 1-8 shortcut range', () => {
    expect(PANELS).toHaveLength(8)
  })

  it('only defines tabs for panels that exist', () => {
    for (const panel of Object.keys(PANEL_TABS)) {
      expect(PANELS).toContain(panel)
    }
  })

  it('routes every palette target at a real panel and tab', () => {
    for (const target of PALETTE_TARGETS) {
      expect(PANELS).toContain(target.panel)
      if (target.tab) {
        const tabs = PANEL_TABS[target.panel as keyof typeof PANEL_TABS] as
          | readonly string[]
          | undefined
        expect(tabs, `${target.panel} should have tabs`).toBeDefined()
        expect(tabs).toContain(target.tab)
      }
    }
  })

  it('reaches every sub-tab from the palette, so collapsed panels stay findable', () => {
    for (const [panel, tabs] of Object.entries(PANEL_TABS)) {
      for (const tab of tabs) {
        const reachable = PALETTE_TARGETS.some(
          (t) => t.panel === panel && (t.tab === tab || (!t.tab && tabs[0] === tab)),
        )
        expect(reachable, `${panel} → ${tab} is unreachable from the palette`).toBe(true)
      }
    }
  })

  it('orders the tier ladder by ascending threshold', () => {
    const thresholds = TIER_LADDER.map((t) => t.threshold)
    expect(thresholds).toStrictEqual([...thresholds].sort((a, b) => a - b))
    expect(TIER_LADDER.map((t) => t.name)).toStrictEqual([...TIERS])
  })

  it('ranks leaders by descending points', () => {
    const points = LEADERS.map((l) => l.points)
    expect(points).toStrictEqual([...points].sort((a, b) => b - a))
  })

  it('places the viewer on the leaderboard at their stated rank', () => {
    const index = LEADERS.findIndex((l) => l.name === VIEWER.name)
    expect(index).toBe(VIEWER.rank - 1)
    expect(LEADERS[index]?.points).toBe(VIEWER.points)
  })

  it('prices every store item above the viewer, except the first shelf', () => {
    // The design shows exactly one affordable-looking shelf gated by tier, and
    // the rest either too expensive or tier-locked. Guards the Store panel's
    // "Redeem" / "Need more pts" / "Unlocks at" branching.
    const rookieItems = STORE_ITEMS.filter((i) => i.unlocksAt === 'Rookie')
    expect(rookieItems).toHaveLength(1)
    expect(rookieItems[0]!.cost).toBeGreaterThan(VIEWER.points)
  })

  it('gives every earn category at least one option', () => {
    for (const [category, options] of Object.entries(EARN_OPTIONS)) {
      expect(options.length, `${category} has no options`).toBeGreaterThan(0)
    }
  })

  it('keys calendar events as YYYY-M-D with no zero padding', () => {
    for (const key of Object.keys(CALENDAR_EVENTS)) {
      expect(key).toMatch(/^\d{4}-\d{1,2}-\d{1,2}$/)
      const [, month, day] = key.split('-')
      expect(month).not.toMatch(/^0\d/)
      expect(day).not.toMatch(/^0\d/)
    }
  })

  it('ends the sparkline on the viewer\'s current points', () => {
    expect(WEEKLY_POINTS.at(-1)).toBe(VIEWER.points)
  })

  it('splits the category breakdown to roughly 100 percent', () => {
    const total = CATEGORY_BREAKDOWN.reduce((sum, c) => sum + c.percent, 0)
    expect(total).toBe(100)
  })

  it('points every checklist step at a real panel', () => {
    for (const item of CHECKLIST) {
      expect(PANELS).toContain(item.target)
    }
  })
})

describe('tierFor', () => {
  it('places a total in the highest tier it clears', () => {
    expect(tierFor(0).name).toBe('Rookie')
    expect(tierFor(999).name).toBe('Rookie')
    expect(tierFor(1000).name).toBe('Captain')
    expect(tierFor(3000).name).toBe('Legend')
    expect(tierFor(7500).name).toBe('Founder')
    expect(tierFor(99999).name).toBe('Founder')
  })

  it('agrees with the tier the viewer is labelled with', () => {
    expect(tierFor(VIEWER.points).name.toUpperCase()).toBe(VIEWER.tier)
  })
})
