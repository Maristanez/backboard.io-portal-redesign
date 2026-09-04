/**
 * The redemption catalogue.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  StoreItem,
} from '../domain/types'

export const STORE_ITEMS: StoreItem[] = [
  {
    shelf: 'T1',
    name: 'Backboard hoodie',
    description: 'Heavyweight embroidered hoodie, shipped to campus.',
    cost: 250,
    limit: '1 / SEMESTER',
    unlocksAt: 'Rookie',
  },
  {
    shelf: 'T2',
    name: 'Pizza budget',
    description: '$150 food budget for an approved campus event.',
    cost: 800,
    limit: '2 / SEMESTER',
    unlocksAt: 'Captain',
  },
  {
    shelf: 'T3',
    name: 'Event budget',
    description: '$500 for an approved event. Must go toward growth, not prizes.',
    cost: 2000,
    limit: '1 / SEMESTER',
    unlocksAt: 'Captain',
  },
  {
    shelf: 'T4',
    name: 'Conference ticket',
    description:
      'Conference ticket of your choice + $300 travel stipend. Max 2 ambassadors per semester.',
    cost: 5000,
    limit: '1 / SEMESTER EACH',
    unlocksAt: 'Legend',
  },
]
