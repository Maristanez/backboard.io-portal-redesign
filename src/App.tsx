/**
 * Application root.
 *
 * Owns the stage: it holds the navigation state, derives geometry from it, and
 * lays the panels and chrome out. Panel content lives in its own components.
 */
import { useMemo, useState } from 'react'

import {
  computePanelGeometry,
  computeStageLayout,
  type StageMode,
} from './coverflow/geometry'
import { color } from './design/tokens'
import { PANELS, type CalendarEvent, type PaletteTarget } from './domain/types'
import { VIEWER } from './data/program'
import { useCountUp } from './hooks/useCountUp'
import { usePanelNavigation } from './navigation/usePanelNavigation'
import { useProgramState } from './state/useProgramState'
import { Background } from './components/shell/Background'
import { DeckTitles, StageIndicator } from './components/shell/StageIndicator'
import { EdgeArrows } from './components/shell/EdgeArrows'
import { Header } from './components/shell/Header'
import { Panel } from './components/shell/Panel'
import { HomePanel } from './components/panels/HomePanel'
import { SubmitPanel } from './components/panels/SubmitPanel'
import { ChallengesPanel } from './components/panels/ChallengesPanel'
import { CalendarPanel } from './components/panels/CalendarPanel'
import { LeaderboardPanel } from './components/panels/LeaderboardPanel'
import { StorePanel } from './components/panels/StorePanel'
import { CommunityPanel } from './components/panels/CommunityPanel'
import { ProfilePanel } from './components/panels/ProfilePanel'
import {
  ApplyOverlay,
  EventOverlay,
  SubmitEventOverlay,
} from './components/overlays/ChallengeOverlays'
import { NotificationsDrawer, SettingsDrawer } from './components/overlays/Drawers'
import { CommandPalette } from './components/overlays/CommandPalette'
import { Toast } from './components/overlays/Toast'

/** The modal currently over the stage, if any. */
type Overlay =
  | { kind: 'apply'; index: number; title: string }
  | { kind: 'event'; event: CalendarEvent }
  | { kind: 'submit-event' }

/** The portal ships the hybrid rail/coverflow stage. */
const MODE: StageMode = 'hybrid'
/** Panel width as a percentage of the viewport, for rail and hybrid. */
const PANEL_WIDTH = 78
/** Circumference of the header's small progress ring. */
const RING_CIRCUMFERENCE = 125.7
/** Below this the header drops its supporting labels. */
const COMPACT_WIDTH = 1200

export function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [drawer, setDrawer] = useState<'notifications' | 'settings' | null>(null)
  /** At most one modal is open at a time, so it's one piece of state. */
  const [overlay, setOverlay] = useState<Overlay | null>(null)

  const program = useProgramState()

  const nav = usePanelNavigation({
    // Gestures stand down while any layer is over the stage.
    paused: paletteOpen || drawer !== null || overlay !== null,
    onTogglePalette: () => setPaletteOpen((open) => !open),
    onDismiss: () => {
      setPaletteOpen(false)
      setDrawer(null)
      setOverlay(null)
    },
  })

  const { index, dragX, dragging, viewportWidth, reducedMotion, tick } = nav

  // Fractional rail position, shared by the panels and the parallax layers.
  const position = index - dragX / viewportWidth

  const layout = useMemo(
    () => computeStageLayout(MODE, PANEL_WIDTH, position, PANELS.length, viewportWidth),
    [position, viewportWidth],
  )

  const geometry = useMemo(
    () =>
      computePanelGeometry({
        mode: MODE,
        index,
        dragX,
        viewportWidth,
        panelCount: PANELS.length,
        panelWidth: PANEL_WIDTH,
        reducedMotion,
        glow: true,
      }),
    [index, dragX, viewportWidth, reducedMotion],
  )

  const points = useCountUp(VIEWER.points, 1400, reducedMotion)
  const goToPanel = (name: (typeof PANELS)[number]) => nav.goTo(PANELS.indexOf(name))

  /** Palette jumps set the destination tab before moving, so it lands ready. */
  const jumpTo = (target: PaletteTarget) => {
    // The union guarantees a `tab` only appears on a panel that has tabs.
    if (target.tab) program.selectTab(target.panel, target.tab)
    goToPanel(target.panel)
  }
  const ringDash = `${(points / 1000) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`

  return (
    <div
      {...nav.stageHandlers}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: color.void,
        touchAction: 'pan-y',
        userSelect: dragging ? 'none' : 'auto',
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      <Background
        gridOffset={layout.gridOffset}
        glowOffset={layout.glowOffset}
        dragging={dragging}
      />

      {MODE === ('deck' as StageMode) && (
        <DeckTitles offset={layout.titleOffset} dragging={dragging} />
      )}

      <Header
        mode={MODE}
        index={index}
        points={points}
        tierRingDash={ringDash}
        compact={viewportWidth < COMPACT_WIDTH}
        onGoTo={nav.goTo}
        onOpenPalette={() => setPaletteOpen(true)}
        onToggleNotifications={() =>
          setDrawer((d) => (d === 'notifications' ? null : 'notifications'))
        }
        onToggleSettings={() => setDrawer((d) => (d === 'settings' ? null : 'settings'))}
        hasUnreadNotifications
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 72,
          bottom: 0,
          perspective: layout.perspective,
          transformStyle: 'preserve-3d',
        }}
      >
        {PANELS.map((name, i) => (
          <Panel
            key={name}
            name={name}
            position={i + 1}
            geometry={geometry[i]!}
            layout={layout}
            focused={i === index}
            dragging={dragging}
            animationKey={tick}
            reducedMotion={reducedMotion}
            onFocus={() => {
              if (!nav.isSettlingDrag() && i !== index) nav.goTo(i)
            }}
          >
            {name === 'Home' && (
              <HomePanel program={program} points={points} onNavigate={goToPanel} />
            )}
            {name === 'Submit' && <SubmitPanel program={program} />}
            {name === 'Challenges' && (
              <ChallengesPanel
                program={program}
                // Swapped for a confirmation overlay when overlays land.
                onApply={(index, title) => setOverlay({ kind: 'apply', index, title })}
              />
            )}
            {name === 'Calendar' && (
              <CalendarPanel
                onOpenEvent={(event) => setOverlay({ kind: 'event', event })}
                onSubmitEvent={() => setOverlay({ kind: 'submit-event' })}
              />
            )}
            {name === 'Leaderboard' && <LeaderboardPanel program={program} />}
            {name === 'Store' && <StorePanel program={program} />}
            {name === 'Community' && <CommunityPanel program={program} />}
            {name === 'Profile' && <ProfilePanel program={program} />}
          </Panel>
        ))}
      </div>

      <StageIndicator mode={MODE} index={index} onGoTo={nav.goTo} />
      <EdgeArrows index={index} panelCount={PANELS.length} onStep={nav.step} />

      <NotificationsDrawer
        open={drawer === 'notifications'}
        onClose={() => setDrawer(null)}
      />
      <SettingsDrawer
        open={drawer === 'settings'}
        onClose={() => setDrawer(null)}
        preferences={program.preferences}
        onToggle={program.togglePreference}
      />

      {overlay?.kind === 'apply' && (
        <ApplyOverlay
          title={overlay.title}
          onClose={() => setOverlay(null)}
          onConfirm={() => {
            program.applyToChallenge(overlay.index)
            setOverlay(null)
          }}
        />
      )}
      {overlay?.kind === 'event' && (
        <EventOverlay event={overlay.event} onClose={() => setOverlay(null)} />
      )}
      {overlay?.kind === 'submit-event' && (
        <SubmitEventOverlay onClose={() => setOverlay(null)} />
      )}

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onJump={jumpTo}
        />
      )}

      {program.toast && <Toast message={program.toast} />}
    </div>
  )
}
