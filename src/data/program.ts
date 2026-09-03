/**
 * Program content, extracted verbatim from the `D-Rail-Coverflow v3` canvas.
 *
 * This is the seam where a real backend would attach: every panel reads from
 * here rather than embedding its own literals, so swapping these constants for
 * fetched data is a change to this module alone.
 */
import { color } from '../design/tokens'
import type {
  CategoryBreakdown,
  Challenge,
  ChecklistItem,
  EarnCategory,
  EarnOption,
  EventsByDay,
  FeedItem,
  Kpi,
  Leader,
  Member,
  Notification,
  Opportunity,
  PaletteTarget,
  Preference,
  Resource,
  StoreItem,
  Submission,
  Team,
  Tier,
} from '../domain/types'

/** The signed-in ambassador. */
export const VIEWER = {
  name: 'Bilal M.',
  initials: 'BM',
  school: 'McMaster University',
  joined: 'Joined Aug 2026',
  tier: 'ROOKIE',
  cohort: "FALL '26 COHORT",
  /** Spendable and lifetime points are equal until something is redeemed. */
  points: 65,
  referralCode: 'OZEYBYR3',
  referralLink: 'https://app.backboard.io/signup?ref=OZEYBYR3',
  rank: 8,
  cohortSize: 26,
} as const

/** Points needed for the next tier up from the viewer's. */
export const NEXT_TIER = { name: 'Captain', threshold: 1000 } as const

/** "Today" in the design's fiction — the calendar highlights this date. */
export const TODAY = { year: 2026, month: 8, day: 2 } as const

export const TIER_LADDER: Tier[] = [
  { name: 'Rookie', threshold: 0 },
  { name: 'Captain', threshold: 1000 },
  { name: 'Legend', threshold: 3000 },
  { name: 'Founder', threshold: 7500 },
]

/** Ways to earn, grouped by category. Order is the tab order. */
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

export const CHALLENGES: Challenge[] = [
  {
    title: 'CLI Star and Fork',
    description:
      'Star and fork our CLI, Nash and other open-source backends. Attach a screenshot of your GitHub activity.',
    points: 25,
    meta: 'NO CLAIM LIMIT',
    status: 'approved',
  },
  {
    title: 'Portal Redesign',
    description:
      'Open competition: redesign this portal for the ambassador program. Must be open source and keep all functionality. Winning design replaces the current one.',
    points: 500,
    meta: 'DUE 9/11/2026 · 1 WINNER',
    status: 'open',
  },
  {
    title: 'Bounty #1: Backboard LinkedIn post',
    description: 'Create a post on LinkedIn about Backboard and agentic infrastructure.',
    points: 40,
    meta: 'DUE 9/1/2026 · 20 CLAIMS',
    status: 'approved',
  },
]

/** Keyed `YYYY-M-D`, month and day un-padded, matching the calendar's lookup. */
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

export const PREFERENCES: Preference[] = [
  { key: 'email', label: 'Email notifications', description: 'Approvals, rejections, new challenges' },
  { key: 'digest', label: 'Weekly digest', description: 'Leaderboard movement every Monday' },
  { key: 'dm', label: 'Allow DMs from ambassadors', description: 'Shown as contact in the directory' },
  { key: 'public', label: 'Public profile', description: 'Visible in the directory' },
  {
    key: 'calendar',
    label: 'Sync to Google Calendar',
    description: 'Approved events appear on your calendar',
  },
]

export const INITIAL_PREFERENCES = {
  email: true,
  digest: false,
  dm: true,
  public: true,
  calendar: false,
} as const

export const KPIS: Kpi[] = [
  { label: 'POINTS EARNED', value: '65', delta: '+65 this week' },
  { label: 'SUBMISSIONS', value: '2', delta: '2 approved' },
  { label: 'EST. REACH', value: '1.2k', delta: '+1.2k this week' },
  { label: 'EVENTS HOSTED', value: '0', delta: 'first one unlocks T2' },
]

export const CATEGORY_BREAKDOWN: CategoryBreakdown[] = [
  { label: 'Content', points: 50, percent: 77 },
  { label: 'Challenges', points: 15, percent: 23 },
  { label: 'Events', points: 0, percent: 0 },
  { label: 'Build', points: 0, percent: 0 },
  { label: 'Referrals', points: 0, percent: 0 },
]

/** Weekly points for the analytics sparkline, oldest week first. */
export const WEEKLY_POINTS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 65]

/**
 * Command palette destinations. Entries past the eight panels deep-link into a
 * sub-tab, which is how the collapsed panels stay reachable by name.
 */
export const PALETTE_TARGETS: PaletteTarget[] = [
  { label: 'Home', hint: 'What to do next', panel: 'Home' },
  { label: 'Submit', hint: 'Log work for review', panel: 'Submit' },
  { label: 'Challenges', hint: 'Admin-published bounties', panel: 'Challenges' },
  { label: 'Calendar', hint: 'Events worldwide', panel: 'Calendar' },
  { label: 'Leaderboard', hint: 'Semester ranking', panel: 'Leaderboard' },
  {
    label: 'Campus teams',
    hint: 'Leaderboard → Campuses',
    panel: 'Leaderboard',
    tab: 'Campuses',
  },
  { label: 'Store', hint: 'Redeem points', panel: 'Store' },
  { label: 'Referrals', hint: 'Store → Referrals', panel: 'Store', tab: 'Referrals' },
  { label: 'Directory', hint: 'Community → Directory', panel: 'Community', tab: 'Directory' },
  {
    label: 'Opportunities',
    hint: 'Community → Jobs and internships',
    panel: 'Community',
    tab: 'Opportunities',
  },
  {
    label: 'Resources',
    hint: 'Community → Brand kit and decks',
    panel: 'Community',
    tab: 'Resources',
  },
  { label: 'Profile', hint: 'You and your tier', panel: 'Profile' },
  { label: 'Analytics', hint: 'Profile → Reach and points', panel: 'Profile', tab: 'Analytics' },
]

/** Day-of-week headers for the calendar grid. */
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
