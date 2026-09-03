import { describe, expect, it } from 'vitest'

import { buildMonthGrid, eventKey, shiftMonth } from './month'

const events = {
  '2026-9-13': {
    title: 'Pivot Hack',
    date: 'Sunday, September 13 at 12:00 PM',
    where: 'Waterloo',
    target: 60,
    by: 'Peter Lian',
  },
}

/** September 2026 starts on a Tuesday and has 30 days. */
const september = { year: 2026, month: 8 }

describe('eventKey', () => {
  it('builds an un-padded YYYY-M-D key', () => {
    expect(eventKey(2026, 8, 3)).toBe('2026-9-3')
    expect(eventKey(2026, 11, 25)).toBe('2026-12-25')
  })
})

describe('shiftMonth', () => {
  it('steps within a year', () => {
    expect(shiftMonth(2026, 8, 1)).toEqual({ year: 2026, month: 9 })
  })

  it('rolls over the year boundary in both directions', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 })
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 })
  })
})

describe('buildMonthGrid', () => {
  it('always returns six weeks, so the grid never reflows between months', () => {
    expect(buildMonthGrid(september.year, september.month, {}, null)).toHaveLength(42)
  })

  it('pads the leading days before the first of the month', () => {
    // September 2026 begins on a Tuesday, so two blanks come first.
    const grid = buildMonthGrid(september.year, september.month, {}, null)
    expect(grid[0]!.inMonth).toBe(false)
    expect(grid[1]!.inMonth).toBe(false)
    expect(grid[2]).toMatchObject({ inMonth: true, day: 1 })
  })

  it('ends the month on the right day', () => {
    const grid = buildMonthGrid(september.year, september.month, {}, null)
    const last = grid.filter((cell) => cell.inMonth).at(-1)
    expect(last).toMatchObject({ day: 30 })
  })

  it('handles a leap-year February', () => {
    const grid = buildMonthGrid(2028, 1, {}, null)
    expect(grid.filter((c) => c.inMonth).at(-1)).toMatchObject({ day: 29 })
  })

  it('attaches events to their day', () => {
    const grid = buildMonthGrid(september.year, september.month, events, null)
    const thirteenth = grid.find((cell) => cell.inMonth && cell.day === 13)
    expect(thirteenth?.event?.title).toBe('Pivot Hack')
  })

  it('leaves other days without events', () => {
    const grid = buildMonthGrid(september.year, september.month, events, null)
    expect(grid.find((c) => c.inMonth && c.day === 12)?.event).toBeUndefined()
  })

  it('marks today only in the month it falls in', () => {
    const today = { year: 2026, month: 8, day: 2 }
    const sept = buildMonthGrid(2026, 8, {}, today)
    expect(sept.find((c) => c.isToday)?.day).toBe(2)

    const oct = buildMonthGrid(2026, 9, {}, today)
    expect(oct.some((c) => c.isToday)).toBe(false)
  })

  it('does not mark padding days as today', () => {
    const grid = buildMonthGrid(2026, 8, {}, { year: 2026, month: 8, day: 2 })
    expect(grid.filter((c) => c.isToday)).toHaveLength(1)
  })
})
