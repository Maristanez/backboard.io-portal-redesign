/**
 * Individual ranking and campus teams.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  Leader,
  Team,
} from '../domain/types'

export const LEADERS: Leader[] = [
  { name: 'Qasim Li', school: 'University of Toronto', points: 4820, tier: 'Legend' },
  { name: 'Seif Otefa', school: 'McMaster University', points: 3910, tier: 'Legend' },
  { name: 'Ryushen Tan', school: 'University of Waterloo', points: 3350, tier: 'Legend' },
  { name: 'Youseph Elkhouly', school: 'York University', points: 2780, tier: 'Captain' },
  { name: 'Peter Lian', school: 'University of Waterloo', points: 1640, tier: 'Captain' },
  { name: 'Preston Jay Susanto', school: 'Diablo Valley College', points: 1210, tier: 'Captain' },
  { name: 'Teghveer Ateliey', school: 'McMaster University', points: 640, tier: 'Rookie' },
  { name: 'Bilal M.', school: 'McMaster University', points: 65, tier: 'Rookie' },
]

export const TEAMS: Team[] = [
  {
    name: 'McMaster',
    location: 'HAMILTON, ON',
    memberInitials: ['SO', 'TA', 'SS', 'BM'],
    memberCount: 4,
    points: 1840,
    eventCount: 3,
    isMine: true,
  },
  {
    name: 'Waterloo',
    location: 'WATERLOO, ON',
    memberInitials: ['PL', 'RT', 'RG'],
    memberCount: 3,
    points: 4990,
    eventCount: 5,
    isMine: false,
  },
  {
    name: 'Toronto',
    location: 'TORONTO, ON',
    memberInitials: ['QL', 'RB'],
    memberCount: 2,
    points: 4820,
    eventCount: 2,
    isMine: false,
  },
  {
    name: 'Ottawa',
    location: 'OTTAWA, ON',
    memberInitials: ['WI'],
    memberCount: 1,
    points: 420,
    eventCount: 1,
    isMine: false,
  },
  {
    name: 'York',
    location: 'TORONTO, ON',
    memberInitials: ['YE', 'RG'],
    memberCount: 2,
    points: 2780,
    eventCount: 2,
    isMine: false,
  },
  {
    name: 'Diablo Valley',
    location: 'PLEASANT HILL, CA',
    memberInitials: ['PJ'],
    memberCount: 1,
    points: 1210,
    eventCount: 1,
    isMine: false,
  },
]
