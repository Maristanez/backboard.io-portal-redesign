/** Month-grid construction for the shared calendar. */
import type { CalendarEvent, EventsByDay } from '../domain/types'

/** Weeks rendered, fixed so the grid doesn't reflow when months change. */
const WEEKS = 6
const DAYS_PER_WEEK = 7

/** One cell of the grid. Padding cells carry `inMonth: false`. */
export interface DayCell {
  day: number
  inMonth: boolean
  isToday: boolean
  event?: CalendarEvent
}

/** A calendar date, with `month` 0-indexed as `Date` uses it. */
export interface CalendarDate {
  year: number
  month: number
  day: number
}

/**
 * The lookup key for an event.
 *
 * Month and day are deliberately un-padded — that's the shape the design's
 * event data uses, and padding here would silently miss every event.
 */
export function eventKey(year: number, month: number, day: number): string {
  return `${year}-${month + 1}-${day}`
}

/** Steps a month, rolling the year over as needed. */
export function shiftMonth(
  year: number,
  month: number,
  by: number,
): { year: number; month: number } {
  const shifted = new Date(year, month + by, 1)
  return { year: shifted.getFullYear(), month: shifted.getMonth() }
}

/**
 * Builds the 42-cell month grid.
 *
 * Always six weeks: a five-week month next to a six-week one would otherwise
 * resize the whole panel as you page between them.
 */
export function buildMonthGrid(
  year: number,
  month: number,
  events: EventsByDay,
  today: CalendarDate | null,
): DayCell[] {
  const firstWeekday = new Date(year, month, 1).getDay()
  // Day 0 of the next month is the last day of this one.
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: WEEKS * DAYS_PER_WEEK }, (_, i) => {
    const day = i - firstWeekday + 1
    const inMonth = day >= 1 && day <= daysInMonth

    if (!inMonth) return { day, inMonth: false, isToday: false }

    const event = events[eventKey(year, month, day)]
    const isToday =
      today !== null && today.year === year && today.month === month && today.day === day

    return event ? { day, inMonth, isToday, event } : { day, inMonth, isToday }
  })
}
