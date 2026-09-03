/**
 * Gesture decision logic for the panel rail.
 *
 * These are the judgement calls a pointer or wheel gesture forces — did that
 * drag mean "next panel"? is this wheel event meant for the rail or for the
 * scrollable list under the cursor? — separated from the event plumbing so they
 * can be exercised as plain functions.
 */

/** Fraction of the viewport a drag must cover to page. */
const DRAG_THRESHOLD_RATIO = 0.08
/** ...capped here, so very wide screens don't demand an unreasonable drag. */
const DRAG_THRESHOLD_MAX = 120
/** px/ms above which a gesture counts as a flick. */
const FLICK_VELOCITY = 0.45
/** A flick still needs this much travel, so a tap with jitter doesn't page. */
const FLICK_MIN_TRAVEL = 24

export interface DragCommit {
  index: number
  dragX: number
  /** Smoothed horizontal velocity in px/ms; negative is leftward. */
  velocity: number
  viewportWidth: number
}

/**
 * The panel a finished drag should land on.
 *
 * Two ways to page: drag far enough, or flick fast enough having moved at all.
 * The flick path is what makes short, quick swipes feel responsive.
 */
export function resolveDragCommit({
  index,
  dragX,
  velocity,
  viewportWidth,
}: DragCommit): number {
  const threshold = Math.min(DRAG_THRESHOLD_MAX, viewportWidth * DRAG_THRESHOLD_RATIO)
  const isFlick = Math.abs(velocity) > FLICK_VELOCITY && Math.abs(dragX) > FLICK_MIN_TRAVEL

  if (dragX < -threshold || (isFlick && dragX < 0)) return index + 1
  if (dragX > threshold || (isFlick && dragX > 0)) return index - 1
  return index
}

/** How far the pointer must move before the gesture is classified at all. */
const DRAG_DEAD_ZONE = 6
/** Vertical:horizontal ratio past which the gesture belongs to the page. */
const VERTICAL_BIAS = 1.6

/**
 * What a pointer movement is turning into.
 *
 * `undecided` means keep watching — the pointer hasn't moved enough to tell.
 * Deferring the call is what lets a panel's own scrollable regions work: a
 * gesture only becomes the rail's once it commits to the horizontal.
 */
export type DragIntent = 'undecided' | 'drag' | 'scroll'

export function resolveDragIntent(dx: number, dy: number): DragIntent {
  if (Math.abs(dx) < DRAG_DEAD_ZONE && Math.abs(dy) < DRAG_DEAD_ZONE) return 'undecided'
  if (Math.abs(dy) > Math.abs(dx) * VERTICAL_BIAS) return 'scroll'
  return 'drag'
}

/** Weight given to the running average vs. the newest frame. */
const VELOCITY_SMOOTHING = 0.6

/**
 * Exponentially smoothed pointer velocity in px/ms.
 *
 * Raw frame-to-frame speed is far too noisy to threshold a flick against, so
 * each frame contributes only a fraction of the result.
 */
export function smoothVelocity(previous: number, deltaX: number, deltaMs: number): number {
  // Guard a zero-length frame; browsers do occasionally deliver two events with
  // the same timestamp.
  const dt = Math.max(1, deltaMs)
  return previous * VELOCITY_SMOOTHING + (deltaX / dt) * (1 - VELOCITY_SMOOTHING)
}
