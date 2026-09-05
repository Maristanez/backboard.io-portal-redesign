/**
 * The directory, open roles, and the ambassador toolkit.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  Member,
  Opportunity,
  Resource,
} from '../domain/types'

export const MEMBERS: Member[] = [
  {
    name: 'Zahadad Jarif',
    school: 'York University',
    tier: 'Rookie',
    bio: '',
    links: [],
  },
]

export const OPPORTUNITIES: Opportunity[] = [
  {
    title: 'Developer Relations Intern',
    type: 'INTERNSHIP',
    team: 'DevRel · Backboard',
    location: 'Remote · Winter 2027',
    closes: 'OCT 15',
  },
  {
    title: 'Agent Infrastructure Engineer (New Grad)',
    type: 'FULL-TIME',
    team: 'Platform · Backboard',
    location: 'Toronto / SF',
    closes: 'NOV 1',
  },
  {
    title: 'Campus Lead — Waterloo',
    type: 'PART-TIME',
    team: 'Ambassador program',
    location: 'Waterloo, ON',
    closes: 'SEP 20',
  },
]

export const RESOURCES: Resource[] = [
  {
    kind: 'BRAND',
    title: 'Brand kit & logos',
    description: 'Wordmark, mark, colour and clear-space rules.',
  },
  {
    kind: 'TALK TRACK',
    title: 'What is agentic infrastructure?',
    description: 'A 5-minute pitch with slides you can present as-is.',
  },
  {
    kind: 'DECK',
    title: 'Workshop deck',
    description: '90-minute hands-on session, exercises included.',
  },
  {
    kind: 'DOCS',
    title: 'SDK quickstart',
    description: 'Get a first agent running in under ten minutes.',
  },
  {
    kind: 'PLAYBOOK',
    title: 'Running a campus event',
    description: 'Budget, promotion, attendance proof, follow-up.',
  },
  {
    kind: 'POLICY',
    title: 'Points & review policy',
    description: "What counts, what doesn't, how reviews work.",
  },
]
