/**
 * Panel geometry for the rail / coverflow / deck stage.
 *
 * Pure: given where the rail is pointing, it returns the visual state of every
 * panel. Keeping it free of React lets the awkward parts — the drag
 * interpolation, the tilt falloff, the reduced-motion branch — be tested
 * directly instead of through a rendered component.
 */
import { border, color, shadow } from '../design/tokens'

/** Stage presentation. `hybrid` is what the portal ships. */
export type StageMode = 'rail' | 'coverflow' | 'hybrid' | 'deck'

export interface GeometryInput {
  mode: StageMode
  /** Index of the focused panel. */
  index: number
  /** Live drag offset in px; 0 when settled. */
  dragX: number
  viewportWidth: number
  panelCount: number
  /** Panel width as a percentage of the viewport, for rail and hybrid. */
  panelWidth: number
  reducedMotion: boolean
  glow: boolean
}

/** The visual state of one panel. */
export interface PanelGeometry {
  transform: string
  boxShadow: string
  opacity: number
  zIndex: number
  /**
   * Opacity of the giant panel-name overlay. Rises as a panel leaves focus, so
   * off-centre cards read as labelled stacks rather than unreadable content.
   */
  labelOpacity: number
}

/** Card fills: deck panels are full-bleed and sit darker than raised cards. */
const cardBackground = { raised: color.card, deck: color.cardDeck } as const

/** Gutter between panels in rail mode, in px. */
const RAIL_GUTTER = 24

/**
 * Per-mode coverflow constants. Hybrid keeps the rail's panel width and tilts
 * gently; pure coverflow narrows the panels and leans them much harder.
 */
const COVERFLOW = {
  hybrid: { stepFactor: 0.78, depth: 360, angle: 30, scaleDrop: 0.05 },
  coverflow: { stepFactor: 0.62, depth: 420, angle: 42, scaleDrop: 0.08 },
} as const

/** Pure coverflow fixes panel width rather than taking it from the prop. */
const COVERFLOW_PANEL_WIDTH = 66

/**
 * How far out a panel stays visible, and how fast it fades getting there.
 * Deck cuts off hard at ~1 because its panels fully occlude each other.
 */
const FADE = {
  rail: { cutoff: 2.2, rate: 0.55 },
  coverflow: { cutoff: 2.5, rate: 0.45 },
  deck: { cutoff: 1.2, rate: 0.3 },
} as const

/** The label overlay stays hidden within this fraction of a step of focus. */
const LABEL_DEAD_ZONE = 0.25
/** ...then ramps to fully opaque over the remainder. */
const LABEL_RAMP = 1.6

/**
 * Rounds to 4dp so floating-point noise never reaches the DOM. The `+ 0`
 * normalises -0, which would otherwise render as `translateX(-0px)`.
 */
function round(n: number): number {
  return Math.round(n * 1e4) / 1e4 + 0
}

export function computePanelGeometry(input: GeometryInput): PanelGeometry[] {
  const { mode, index, dragX, viewportWidth: w, panelCount, panelWidth, glow, reducedMotion } = input

  const isRail = mode === 'rail'
  const isHybrid = mode === 'hybrid'
  // Hybrid is a coverflow that keeps the rail's panel width.
  const isCoverflow = mode === 'coverflow' || isHybrid

  // Fractional rail position: dragging moves it smoothly between whole panels.
  const position = index - dragX / w
  const widthFraction =
    (isRail || isHybrid ? panelWidth : isCoverflow ? COVERFLOW_PANEL_WIDTH : 100) / 100

  // Reduced motion collapses the 3D entirely, leaving a flat slide.
  const tilt = reducedMotion ? 0 : 1

  return Array.from({ length: panelCount }, (_, i) => {
    const delta = i - position
    const distance = Math.abs(delta)
    // Falloff saturates at one panel out, so panels 2+ away look alike.
    const falloff = Math.min(distance, 1)

    if (isCoverflow) {
      const { stepFactor, depth, angle, scaleDrop } = COVERFLOW[isHybrid ? 'hybrid' : 'coverflow']
      // Clamped so the tilt tops out rather than spinning past 90 degrees.
      const lean = Math.max(-1, Math.min(1, delta))
      const transform =
        `translateX(${round(delta * widthFraction * w * stepFactor)}px) ` +
        `translateZ(${round(-distance * depth * tilt)}px) ` +
        `rotateY(${round(-lean * angle * tilt)}deg) ` +
        `scale(${round(1 - falloff * scaleDrop)})`

      return {
        transform,
        boxShadow: distance < 0.5 && glow ? shadow.coverFocused : shadow.coverResting,
        ...fadeAndStack(distance, FADE.coverflow),
        labelOpacity: labelOpacity(distance),
      }
    }

    if (isRail) {
      const step = widthFraction * w + RAIL_GUTTER
      const transform = `translateX(${round(delta * step)}px) scale(${round(1 - falloff * 0.05)})`

      return {
        transform,
        boxShadow: distance < 0.5 && glow ? shadow.railFocused : shadow.railResting,
        ...fadeAndStack(distance, FADE.rail),
        labelOpacity: labelOpacity(distance),
      }
    }

    // Deck: a plain full-width slide, no depth and no elevation.
    return {
      transform: `translateX(${round(delta * w)}px)`,
      boxShadow: 'none',
      ...fadeAndStack(distance, FADE.deck),
      labelOpacity: labelOpacity(distance),
    }
  })
}

/** Opacity and stacking share a distance falloff across all three modes. */
function fadeAndStack(
  distance: number,
  { cutoff, rate }: { cutoff: number; rate: number },
): { opacity: number; zIndex: number } {
  const falloff = Math.min(distance, 1)
  return {
    opacity: distance > cutoff ? 0 : round(1 - falloff * rate),
    zIndex: 100 - Math.round(distance * 10),
  }
}

function labelOpacity(distance: number): number {
  return round(Math.max(0, Math.min(1, (distance - LABEL_DEAD_ZONE) * LABEL_RAMP)))
}

/** Stage-level presentation, shared by every panel and the parallax layers. */
export interface StageLayout {
  /** CSS perspective on the stage; only coverflow needs one. */
  perspective: string
  panelTop: string
  panelBottom: string
  panelLeft: string
  panelWidth: string
  cardBackground: string
  cardBorder: string
  cardRadius: string
  /** Background grid offset in px — drifts against the rail. */
  gridOffset: number
  /** Radial glow offset in px — drifts more slowly than the grid. */
  glowOffset: number
  /** Deck-mode giant title strip offset in px. */
  titleOffset: number
}

/** How far the parallax layers move per panel of rail travel. */
const PARALLAX = { grid: 60, glow: 40, title: 1.15 }

/**
 * Stage chrome for a mode.
 *
 * `position` and `panelCount` drive the parallax layers; they default to a
 * settled rail at panel 0, since callers that only want the static chrome
 * shouldn't have to supply them.
 */
export function computeStageLayout(
  mode: StageMode,
  panelWidth: number,
  position = 0,
  panelCount = 1,
  viewportWidth = 0,
): StageLayout {
  const isRail = mode === 'rail'
  const isHybrid = mode === 'hybrid'
  const isCoverflow = mode === 'coverflow' || isHybrid
  const isDeck = mode === 'deck'

  const widthFraction =
    (isRail || isHybrid ? panelWidth : isCoverflow ? COVERFLOW_PANEL_WIDTH : 100) / 100

  return {
    perspective: isCoverflow ? '1800px' : 'none',
    panelTop: isDeck ? '0' : '28px',
    // Coverflow needs room for the dot indicator, deck for its full-width footer.
    panelBottom: isDeck ? '84px' : isCoverflow ? '70px' : '56px',
    panelLeft: `${round((1 - widthFraction) * 50)}vw`,
    panelWidth: `${round(widthFraction * 100)}vw`,
    cardBackground: isDeck ? cardBackground.deck : cardBackground.raised,
    cardBorder: isDeck ? '0' : `1px solid ${border.strong}`,
    cardRadius: isDeck ? '0' : '18px',
    gridOffset: round(-position * PARALLAX.grid),
    // Measured from the middle panel, so the glow sits centred at rest.
    glowOffset: round(-(position - (panelCount - 1) / 2) * PARALLAX.glow),
    titleOffset: round(-position * viewportWidth * PARALLAX.title),
  }
}
