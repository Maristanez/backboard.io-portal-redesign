/**
 * Ways to earn points, and the work already logged.
 *
 * Extracted verbatim from the `D-Rail-Coverflow v3` design canvas.
 */
import type {
  ChecklistItem,
  EarnCategory,
  EarnOption,
  Submission,
} from '../domain/types'

export const EARN_OPTIONS: Record<EarnCategory, EarnOption[]> = {
  Content: [
    {
      title: 'Awareness post',
      description: 'X, LinkedIn, TikTok, or IG post about Backboard',
      points: 50,
    },
    {
      title: 'Educational post or thread',
      description: 'Project build or how-to showing real Backboard usage',
      points: 150,
    },
    {
      title: 'Tutorial blog or YouTube video',
      description: 'Original work: 3+ min video or 800+ words',
      points: 250,
    },
    {
      title: 'Short-form video demo',
      description: 'Reel, TikTok, or Short: screen recording or talking head',
      points: 100,
    },
  ],
  Events: [
    {
      title: 'Host a campus workshop',
      description: 'Hands-on session with attendance proof',
      points: 400,
    },
    {
      title: 'Speak at a meetup or club',
      description: 'Talk or demo featuring Backboard',
      points: 150,
    },
    {
      title: 'Hackathon booth or sponsorship rep',
      description: 'Staff a Backboard presence for the event',
      points: 300,
    },
  ],
  Build: [
    { title: 'Ship a project on the API', description: 'Public repo + short writeup', points: 300 },
    {
      title: 'Hackathon win using Backboard',
      description: 'Any placement or category prize',
      points: 1000,
    },
  ],
  Growth: [
    { title: 'Campus club partnership', description: 'Club posts or co-hosts with us', points: 200 },
  ],
  Feedback: [
    {
      title: 'Bug report or product feedback',
      description: 'Counts once accepted by the team',
      points: 50,
    },
  ],
  Other: [
    {
      title: 'Something else',
      description: 'Describe it in the notes; reviewers set the award',
      points: 0,
    },
  ],
}

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    title: 'LinkedIn: agentic infra explainer',
    date: 'Aug 28',
    category: 'Content',
    points: '50',
    status: 'APPROVED',
  },
  {
    title: 'CLI star and fork',
    date: 'Aug 26',
    category: 'Challenge',
    points: '25',
    status: 'APPROVED',
  },
]

export const CHECKLIST: ChecklistItem[] = [
  {
    step: 'profile',
    title: 'Complete your profile',
    description: 'Bio and links show in the directory',
    points: 50,
    target: 'Profile',
  },
  {
    step: 'post',
    title: 'Publish your first post',
    description: 'Any awareness post about Backboard',
    points: 50,
    target: 'Submit',
  },
  {
    step: 'challenge',
    title: 'Claim a challenge',
    description: 'CLI Star and Fork is the fastest',
    points: 25,
    target: 'Challenges',
  },
  {
    step: 'event',
    title: 'Attend or host an event',
    description: 'Invite friends to a listed event first',
    points: 100,
    target: 'Calendar',
  },
]

/** Which checklist steps start done. */

export const INITIAL_CHECKLIST_STATE = {
  profile: false,
  post: true,
  challenge: true,
  event: false,
} as const
