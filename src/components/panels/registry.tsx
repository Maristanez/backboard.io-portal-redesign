/**
 * Which component renders which panel.
 *
 * A map rather than a chain of `name === 'X' &&` branches: adding a panel is
 * one entry here plus one name in `PANELS`, and the stage no longer needs to
 * know what any individual panel is called.
 */
import type { CalendarEvent, PanelName } from '../../domain/types'
import type { ProgramState } from '../../state/useProgramState'
import { CalendarPanel } from './CalendarPanel'
import { ChallengesPanel } from './ChallengesPanel'
import { CommunityPanel } from './CommunityPanel'
import { HomePanel } from './HomePanel'
import { LeaderboardPanel } from './LeaderboardPanel'
import { ProfilePanel } from './ProfilePanel'
import { StorePanel } from './StorePanel'
import { SubmitPanel } from './SubmitPanel'

/** Everything a panel might need. Most use a fraction of it. */
export interface PanelContext {
  program: ProgramState
  /** Animated points total, shared with the header so they count up together. */
  points: number
  onNavigate: (panel: PanelName) => void
  onApplyToChallenge: (index: number, title: string) => void
  onOpenEvent: (event: CalendarEvent) => void
  onSubmitEvent: () => void
}

export const PANEL_VIEWS: Record<PanelName, (ctx: PanelContext) => JSX.Element> = {
  Home: ({ program, points, onNavigate }) => (
    <HomePanel program={program} points={points} onNavigate={onNavigate} />
  ),
  Submit: ({ program }) => <SubmitPanel program={program} />,
  Challenges: ({ program, onApplyToChallenge }) => (
    <ChallengesPanel program={program} onApply={onApplyToChallenge} />
  ),
  Calendar: ({ onOpenEvent, onSubmitEvent }) => (
    <CalendarPanel onOpenEvent={onOpenEvent} onSubmitEvent={onSubmitEvent} />
  ),
  Leaderboard: ({ program }) => <LeaderboardPanel program={program} />,
  Store: ({ program }) => <StorePanel program={program} />,
  Community: ({ program }) => <CommunityPanel program={program} />,
  Profile: ({ program }) => <ProfilePanel program={program} />,
}
