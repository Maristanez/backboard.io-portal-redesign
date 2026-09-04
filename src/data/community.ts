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
    name: 'Peter Lian',
    school: 'University of Waterloo',
    tier: 'Rookie',
    bio: '2nd-year CS Waterloo, currently on co-op in Ottawa.',
    links: ['X', 'LinkedIn', 'GitHub', 'YouTube'],
  },
  {
    name: 'Preston Jay Susanto',
    school: 'Diablo Valley College',
    tier: 'Rookie',
    bio: '2nd-year EECS @ DVC. Building Unvibe, the first multi-learning layer for vibe coders.',
    links: ['LinkedIn', 'Instagram', 'Website'],
  },
  { name: 'Qasim Li', school: 'University of Toronto', tier: 'Legend', bio: '', links: ['GitHub'] },
  {
    name: 'Ricardo Gao',
    school: 'Conestoga College',
    tier: 'Rookie',
    bio: 'chatgpt generating….',
    links: ['LinkedIn', 'Instagram'],
  },
  {
    name: 'Seif Otefa',
    school: 'McMaster University',
    tier: 'Legend',
    bio: 'Program admin. Ask me about budgets.',
    links: ['X', 'LinkedIn', 'GitHub', 'Website'],
  },
  {
    name: 'Teghveer Ateliey',
    school: 'McMaster University',
    tier: 'Rookie',
    bio: 'Mechatronics Engineering & Society',
    links: ['X', 'LinkedIn', 'GitHub'],
  },
  {
    name: 'Waaberi Ibrahim',
    school: 'University of Ottawa',
    tier: 'Rookie',
    bio: '2nd year SWE student',
    links: ['X', 'LinkedIn', 'GitHub'],
  },
  {
    name: 'Sanika Surose',
    school: 'McMaster University',
    tier: 'Rookie',
    bio: '3rd year SWE @ McMaster',
    links: ['LinkedIn', 'GitHub', 'Instagram'],
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
