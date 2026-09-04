/**
 * Wheel and trackpad routing for the panel rail.
 *
 * The hard part isn't paging — it's deciding whether a wheel event belongs to
 * the rail at all. Panels contain scrollable lists, and a vertical wheel over
 * one of those must scroll the list, not slide the rail out from under it.
 */

/** Accumulated movement needed to page. */
const WHEEL_THRESHOLD = 70
/** After paging, ignore wheel input this long so momentum doesn't cascade. */
const WHEEL_LOCK_MS = 650
/** Accumulated movement is discarded after this long without input. */
const WHEEL_IDLE_MS = 200

/**
 * Whether the element under the pointer — or an ancestor below `boundary` —
 * can absorb this vertical scroll itself.
 *
 * Walks up from the target looking for an overflowing scroll container that
 * isn't already pinned against the edge we're scrolling toward. Being at the
 * end of a list is what hands the gesture back to the rail.
 */
export function canScrollVertically(
  target: Element | null,
  deltaY: number,
  boundary: Element,
): boolean {
  let element: Element | null = target

  while (element && element !== boundary) {
    const { overflowY } = getComputedStyle(element)
    const overflows = element.scrollHeight > element.clientHeight + 1

    if (/auto|scroll/.test(overflowY) && overflows) {
      const atTop = element.scrollTop <= 0
      const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true
    }
    element = element.parentElement
  }
  return false
}

export interface WheelInput {
  deltaX: number
  deltaY: number
  shiftKey: boolean
}

/**
 * The horizontal movement a wheel event contributes, in px.
 *
 * A dominant `deltaX` is a trackpad swipe. Shift+wheel is the long-standing
 * mouse convention for horizontal. A plain vertical wheel only reaches the rail
 * once nothing underneath wants it.
 */
export function resolveWheelDelta(
  { deltaX, deltaY, shiftKey }: WheelInput,
  targetCanScroll: boolean,
): number {
  if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX
  if (shiftKey) return deltaY
  if (targetCanScroll) return 0
  return deltaY
}

export interface WheelState {
  /** Movement banked since the last page or idle reset. */
  accumulated: number
  /** Timestamp after which paging is allowed again. */
  lockedUntil: number
  /** Timestamp of the last event, for idle detection. */
  lastEventAt: number
}

export function initialWheelState(): WheelState {
  return { accumulated: 0, lockedUntil: 0, lastEventAt: 0 }
}

/**
 * Folds one wheel event into the accumulator, returning how many panels to move.
 *
 * Trackpads emit a long momentum tail after a flick. Paging once and then
 * locking is what stops a single gesture from skipping across the whole rail.
 */
export function advanceWheel(
  state: WheelState,
  delta: number,
  now: number,
): { state: WheelState; step: -1 | 0 | 1 } {
  if (now < state.lockedUntil) {
    return { state: { ...state, lastEventAt: now }, step: 0 }
  }

  // A long gap means the previous gesture ended; don't carry its movement over.
  const stale = now - state.lastEventAt > WHEEL_IDLE_MS
  const accumulated = (stale ? 0 : state.accumulated) + delta

  if (Math.abs(accumulated) > WHEEL_THRESHOLD) {
    return {
      state: { accumulated: 0, lockedUntil: now + WHEEL_LOCK_MS, lastEventAt: now },
      step: accumulated > 0 ? 1 : -1,
    }
  }
  return { state: { ...state, accumulated, lastEventAt: now }, step: 0 }
}
