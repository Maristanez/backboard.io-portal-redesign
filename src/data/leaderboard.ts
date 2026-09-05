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
  { name: 'Bryan Maristanez', school: 'York University', points: 65, tier: 'Rookie' },
  { name: 'Zahadad Jarif', school: 'York University', points: 40, tier: 'Rookie' },
]

export const TEAMS: Team[] = [
  {
    name: 'York',
    location: 'TORONTO, ON',
    memberInitials: ['BM', 'ZJ'],
    memberCount: 2,
    // With a roster this small the team total is simply the members' points.
    points: 105,
    eventCount: 0,
    isMine: true,
  },
]
