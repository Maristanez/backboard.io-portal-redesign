/**
 * The ambassador program's domain vocabulary.
 *
 * These names come from the program itself, not the UI: an ambassador earns
 * `points` by making a `Submission` against an `EarnOption`, which a reviewer
 * moves through `ReviewStatus`. Points accumulate toward a `Tier`, and are spent
 * in the store on a `StoreItem`.
 */

/** The eight top-level panels, in rail order. */
export const PANELS = [
  'Home',
  'Submit',
  'Challenges',
  'Calendar',
  'Leaderboard',
  'Store',
  'Community',
  'Profile',
] as const

export type PanelName = (typeof PANELS)[number]

/**
 * Panels that carry sub-tabs. Four of the eight collapse several former
 * top-level panels into one, which is why they need a second level.
 */
export const PANEL_TABS = {
  Leaderboard: ['Ambassadors', 'Campuses'],
  Store: ['Redeem', 'Referrals'],
  Community: ['Directory', 'Opportunities', 'Resources'],
  Profile: ['Profile', 'Analytics'],
} as const satisfies Partial<Record<PanelName, readonly string[]>>

export type TabbedPanel = keyof typeof PANEL_TABS
export type TabOf<P extends TabbedPanel> = (typeof PANEL_TABS)[P][number]
export type AnyTab = { [P in TabbedPanel]: TabOf<P> }[TabbedPanel]

/** Which tab each tabbed panel is currently showing. Absent means the first. */
export type TabSelection = Partial<{ [P in TabbedPanel]: TabOf<P> }>

/** Rank ladder. Tiers unlock store items and gate some opportunities. */
export const TIERS = ['Rookie', 'Captain', 'Legend', 'Founder'] as const
export type TierName = (typeof TIERS)[number]

export interface Tier {
  name: TierName
  /** Points needed to reach this tier. */
  threshold: number
}

/** How a reviewer has dispositioned a submission or challenge claim. */
export type ReviewStatus = 'approved' | 'pending' | 'open'

/** The categories of work an ambassador can log. */
export const EARN_CATEGORIES = [
  'Content',
  'Events',
  'Build',
  'Growth',
  'Feedback',
  'Other',
] as const
export type EarnCategory = (typeof EARN_CATEGORIES)[number]

/** One way to earn, within a category. `points` is the suggested award. */
export interface EarnOption {
  title: string
  description: string
  points: number
}

/** A logged piece of work, awaiting or past review. */
export interface Submission {
  title: string
  date: string
  category: string
  /** Kept as a string: the award is a reviewer's decision, not arithmetic. */
  points: string
  status: 'APPROVED' | 'PENDING REVIEW'
}

/** An admin-published bounty with a fixed award. */
export interface Challenge {
  title: string
  description: string
  points: number
  /** Free-form deadline and claim-limit line, e.g. "DUE 9/11/2026 · 1 WINNER". */
  meta: string
  status: ReviewStatus
}

/** An event on the shared calendar. */
export interface CalendarEvent {
  title: string
  /** Human-readable, as displayed: "Sunday, September 13 at 12:00 PM". */
  date: string
  where: string
  /** Attendance goal; invites pay out per confirmed attendee. */
  target: number
  /** Ambassador who submitted it. */
  by: string
}

/** Calendar events keyed by `YYYY-M-D` (month and day un-padded). */
export type EventsByDay = Record<string, CalendarEvent>

/** A row on the ambassador leaderboard. */
export interface Leader {
  name: string
  school: string
  points: number
  tier: TierName
}

/** A campus team. */
export interface Team {
  name: string
  location: string
  /** Member initials, for the stacked avatar row. */
  memberInitials: string[]
  memberCount: number
  points: number
  eventCount: number
  /** True for the viewer's own team, which is highlighted. */
  isMine: boolean
}

/** A redeemable store item. */
export interface StoreItem {
  /** Shelf label: T1–T4. */
  shelf: string
  name: string
  description: string
  cost: number
  /** Redemption cap, e.g. "1 / SEMESTER". */
  limit: string
  /** Tier at which this unlocks. */
  unlocksAt: TierName
}

/** A placed store order, held until an admin approves it. */
export interface StoreOrder {
  name: string
  cost: number
}

/** A directory entry. */
export interface Member {
  name: string
  school: string
  tier: TierName
  bio: string
  /** Link labels only; the design renders them as un-targeted anchors. */
  links: string[]
}

/** A logged referral, pending admin verification. */
export interface Referral {
  name: string
  date: string
}

/** A job or internship open to ambassadors. */
export interface Opportunity {
  title: string
  type: 'INTERNSHIP' | 'FULL-TIME' | 'PART-TIME'
  team: string
  location: string
  /** Closing date, e.g. "OCT 15". */
  closes: string
}

/** A downloadable or linkable resource. */
export interface Resource {
  kind: string
  title: string
  description: string
}

/** A line in the live program activity feed. */
export interface FeedItem {
  /** Relative timestamp, e.g. "2M AGO". Not derived — the design ships it. */
  when: string
  text: string
  /** Point delta as displayed, e.g. "+400". Empty when the event awards none. */
  points: string
  color: string
}

/** A notification in the drawer. */
export interface Notification {
  text: string
  when: string
  color: string
}

/** The onboarding checklist keys. */
export const CHECKLIST_STEPS = ['profile', 'post', 'challenge', 'event'] as const
export type ChecklistStep = (typeof CHECKLIST_STEPS)[number]

/** One onboarding step. */
export interface ChecklistItem {
  step: ChecklistStep
  title: string
  description: string
  points: number
  /** Panel the step sends you to. */
  target: PanelName
}

/** Notification and privacy preference keys. */
export const PREFERENCE_KEYS = ['email', 'digest', 'dm', 'public', 'calendar'] as const
export type PreferenceKey = (typeof PREFERENCE_KEYS)[number]

export interface Preference {
  key: PreferenceKey
  label: string
  description: string
}

/** A headline stat on the analytics tab. */
export interface Kpi {
  label: string
  value: string
  delta: string
}

/** A points-by-category bar. */
export interface CategoryBreakdown {
  label: string
  points: number
  /** Share of total, 0–100. */
  percent: number
}

/** A command palette destination — a panel, optionally deep-linked to a tab. */
export interface PaletteTarget {
  label: string
  hint: string
  panel: PanelName
  tab?: AnyTab
}
