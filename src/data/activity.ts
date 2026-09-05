/**
 * The live activity feed and notification history.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import { color } from '../design/tokens'
import type {
  FeedItem,
  Notification,
} from '../domain/types'

export const INITIAL_FEED: FeedItem[] = [
  {
    when: '18M AGO',
    text: 'A new challenge was published: Portal Redesign.',
    points: '500',
    color: color.accent,
  },
  {
    when: '1H AGO',
    text: 'Zahadad Jarif joined the York team.',
    points: '',
    color: color.textFaint,
  },
  {
    when: '2H AGO',
    text: 'Your "CLI Star and Fork" submission was approved.',
    points: '+25',
    color: color.approved,
  },
  {
    when: '5H AGO',
    text: 'Zahadad Jarif submitted a LinkedIn post for review.',
    points: '40',
    color: color.pending,
  },
  {
    when: 'YESTERDAY',
    text: 'Hack the North added to the shared calendar.',
    points: '',
    color: color.textFaint,
  },
]

/** Cycled into the feed every 7 seconds to make the panel feel live. */

export const FEED_POOL: Omit<FeedItem, 'when'>[] = [
  { text: 'Zahadad Jarif logged a referral.', points: '+100', color: color.approved },
  {
    text: 'New opportunity posted: Campus Lead — Waterloo.',
    points: '',
    color: color.textFaint,
  },
  { text: 'Your awareness post was approved.', points: '+50', color: color.approved },
  {
    text: 'DeltaHacks kickoff added to the shared calendar.',
    points: '',
    color: color.textFaint,
  },
  { text: 'Portal Redesign closes in six days.', points: '', color: color.pending },
  {
    text: "Zahadad Jarif's event submission is under review.",
    points: '',
    color: color.pending,
  },
]

export const NOTIFICATIONS: Notification[] = [
  {
    text: '"CLI Star and Fork" was approved. +25 pts landed.',
    when: '2H AGO',
    color: color.approved,
  },
  {
    text: 'New challenge: Portal Redesign — 500 pts, due Sep 11.',
    when: 'YESTERDAY',
    color: color.accent,
  },
  {
    text: 'Pivot Hack (Sep 13) was added to the shared calendar.',
    when: '2D AGO',
    color: color.accent,
  },
  {
    text: 'Reviewer note on your LinkedIn post: "Great reach — approved."',
    when: '5D AGO',
    color: color.approved,
  },
]
