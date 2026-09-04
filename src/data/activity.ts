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
    when: '2M AGO',
    text: 'Peter Lian\'s "Intro to agents" workshop was approved.',
    points: '+400',
    color: color.approved,
  },
  {
    when: '18M AGO',
    text: 'Seif Otefa published a new challenge: Portal Redesign.',
    points: '500',
    color: color.accent,
  },
  { when: '1H AGO', text: 'Sanika Surose joined the McMaster team.', points: '', color: color.textFaint },
  {
    when: '2H AGO',
    text: 'Your "CLI Star and Fork" submission was approved.',
    points: '+25',
    color: color.approved,
  },
  { when: '4H AGO', text: 'Qasim Li reached Legend tier.', points: '4,820', color: color.pending },
  {
    when: 'YESTERDAY',
    text: 'Hack the North added to the shared calendar.',
    points: '',
    color: color.textFaint,
  },
]

/** Cycled into the feed every 7 seconds to make the panel feel live. */

export const FEED_POOL: Omit<FeedItem, 'when'>[] = [
  { text: 'Ryushen Tan logged an event: Waterloo AI night.', points: '+150', color: color.approved },
  {
    text: 'Teghveer Ateliey submitted a LinkedIn post for review.',
    points: '40',
    color: color.pending,
  },
  {
    text: 'Waaberi Ibrahim redeemed a Backboard hoodie.',
    points: '−250',
    color: color.accentSoft,
  },
  {
    text: "Youseph Elkhouly's integration demo was approved.",
    points: '+450',
    color: color.approved,
  },
  {
    text: 'New opportunity posted: Campus Lead — Waterloo.',
    points: '',
    color: color.textFaint,
  },
  { text: 'Preston Jay Susanto referred a new signup.', points: '+100', color: color.approved },
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
