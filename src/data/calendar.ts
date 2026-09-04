/**
 * The shared event calendar and its labels.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  EventsByDay,
} from '../domain/types'

export const CALENDAR_EVENTS: EventsByDay = {
  '2026-9-13': {
    title: 'Pivot Hack',
    date: 'Sunday, September 13 at 12:00 PM',
    where: "Builder's Space Waterloo",
    target: 60,
    by: 'Peter Lian',
  },
  '2026-9-17': {
    title: 'Hack the North',
    date: 'Thursday, September 17 at 6:00 PM',
    where: 'University of Waterloo, E7',
    target: 120,
    by: 'Seif Otefa',
  },
  '2026-10-3': {
    title: 'DeltaHacks kickoff',
    date: 'Saturday, October 3 at 10:00 AM',
    where: 'McMaster University',
    target: 80,
    by: 'Bilal M.',
  },
}

export const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/**
 * The tier a point total falls in.
 *
 * Tier is a function of points, so deriving it keeps the ladder and the
 * viewer's badge from ever disagreeing.
 */
