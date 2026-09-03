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
import { PANELS } from './domain/types'
import { VIEWER } from './data/program'
import { useCountUp } from './hooks/useCountUp'
import { usePanelNavigation } from './navigation/usePanelNavigation'
import { Background } from './components/shell/Background'
import { DeckTitles, StageIndicator } from './components/shell/StageIndicator'
import { EdgeArrows } from './components/shell/EdgeArrows'
import { Header } from './components/shell/Header'
import { Panel } from './components/shell/Panel'

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

  const nav = usePanelNavigation({
    paused: paletteOpen || drawer !== null,
    onTogglePalette: () => setPaletteOpen((open) => !open),
    onDismiss: () => {
      setPaletteOpen(false)
      setDrawer(null)
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
            {/* Panel content lands in subsequent changes. */}
          </Panel>
        ))}
      </div>

      <StageIndicator mode={MODE} index={index} onGoTo={nav.goTo} />
      <EdgeArrows index={index} panelCount={PANELS.length} onStep={nav.step} />
    </div>
  )
}
