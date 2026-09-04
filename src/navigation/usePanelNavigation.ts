/**
 * Binds the rail's gesture, wheel and keyboard logic to React.
 *
 * All the decisions live in sibling modules as pure functions; this hook owns
 * only the state and the event plumbing.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react'

import { PANELS } from '../domain/types'
import { resolveDragCommit, resolveDragIntent, smoothVelocity } from './internal/gestures'
import { resolveKeyAction } from './internal/keyboard'
import {
  advanceWheel,
  canScrollVertically,
  initialWheelState,
  resolveWheelDelta,
  type WheelState,
} from './internal/wheel'

const STORAGE_KEY = 'bb.portal.panel'

/** Elements that own their own pointer input and must not start a drag. */
const NON_DRAGGABLE = 'input,textarea,select,[data-nodrag]'

function clampIndex(index: number): number {
  return Math.max(0, Math.min(PANELS.length - 1, index))
}

/** localStorage is unavailable in private modes and sandboxed frames. */
function readStoredIndex(): number {
  try {
    return clampIndex(Number(localStorage.getItem(STORAGE_KEY)) || 0)
  } catch {
    return 0
  }
}

function storeIndex(index: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(index))
  } catch {
    // Persisting the last panel is a convenience, never a requirement.
  }
}

export interface PanelNavigationOptions {
  /** Suspends gestures while an overlay owns the screen. */
  paused: boolean
  onTogglePalette: () => void
  onDismiss: () => void
}

export function usePanelNavigation({
  paused,
  onTogglePalette,
  onDismiss,
}: PanelNavigationOptions) {
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  )
  const [reducedMotion, setReducedMotion] = useState(false)
  /** Bumped on every commit to restart the panel's entrance animation. */
  const [tick, setTick] = useState(0)

  const wheel = useRef<WheelState>(initialWheelState())
  const drag = useRef({ startX: 0, startY: 0, lastX: 0, lastAt: 0, velocity: 0, watching: false })
  /** Suppresses the click that a drag would otherwise fire on release. */
  const justDragged = useRef(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const goTo = useCallback((next: number) => {
    const clamped = clampIndex(next)
    setIndex((current) => {
      if (current === clamped) return current
      setDragX(0)
      setTick((t) => t + 1)
      storeIndex(clamped)
      return clamped
    })
  }, [])

  const step = useCallback(
    (by: number) => setIndex((current) => {
      const next = clampIndex(current + by)
      if (next !== current) {
        setDragX(0)
        setTick((t) => t + 1)
        storeIndex(next)
      }
      return next
    }),
    [],
  )

  // Restore the last panel, and pick up the viewport and motion preference.
  useEffect(() => {
    setIndex(readStoredIndex())

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motion.matches)
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    motion.addEventListener('change', onMotionChange)

    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)

    return () => {
      motion.removeEventListener('change', onMotionChange)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement?.tagName ?? ''
      const action = resolveKeyAction(event, /INPUT|TEXTAREA/.test(active))
      if (!action) return

      switch (action.type) {
        case 'toggle-palette':
          event.preventDefault()
          onTogglePalette()
          break
        case 'dismiss':
          onDismiss()
          break
        case 'step':
          step(action.by)
          break
        case 'goto':
          goTo(action.index)
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, step, onTogglePalette, onDismiss])

  const onWheel = useCallback(
    (event: ReactWheelEvent<HTMLElement>) => {
      if (pausedRef.current) return

      const scrollable = canScrollVertically(
        event.target as Element,
        event.deltaY,
        event.currentTarget,
      )
      const delta = resolveWheelDelta(event, scrollable)
      if (!delta) return

      const result = advanceWheel(wheel.current, delta, Date.now())
      wheel.current = result.state
      if (result.step) step(result.step)
    },
    [step],
  )

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (pausedRef.current || event.button !== 0) return
    if ((event.target as Element).closest(NON_DRAGGABLE)) return

    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastAt: performance.now(),
      velocity: 0,
      watching: true,
    }
  }, [])

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const state = drag.current
      if (!state.watching && !dragging) return

      const dx = event.clientX - state.startX
      const dy = event.clientY - state.startY

      if (state.watching) {
        const intent = resolveDragIntent(dx, dy)
        if (intent === 'undecided') return
        state.watching = false
        if (intent === 'scroll') return

        // Capture so the drag survives the pointer leaving the element.
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // Capture is best-effort; the drag still works without it.
        }
        setDragging(true)
      }

      const now = performance.now()
      state.velocity = smoothVelocity(state.velocity, event.clientX - state.lastX, now - state.lastAt)
      state.lastX = event.clientX
      state.lastAt = now

      setDragX(dx)
    },
    [dragging],
  )

  const onPointerUp = useCallback(() => {
    drag.current.watching = false
    if (!dragging) return

    const next = resolveDragCommit({
      index,
      dragX,
      velocity: drag.current.velocity,
      viewportWidth,
    })

    justDragged.current = true
    window.setTimeout(() => {
      justDragged.current = false
    }, 250)

    setDragging(false)
    setDragX(0)
    goTo(next)
  }, [dragging, dragX, index, viewportWidth, goTo])

  /**
   * Swallows the click that ends a drag. Panels are click-to-focus, so without
   * this every swipe would also activate whatever sat under the finger.
   */
  const onClickCapture = useCallback((event: React.MouseEvent) => {
    if (!justDragged.current) return
    event.stopPropagation()
    event.preventDefault()
  }, [])

  /** True while a drag is settling, so click-to-focus can stand down. */
  const isSettlingDrag = useCallback(() => justDragged.current, [])

  return {
    index,
    dragX,
    dragging,
    viewportWidth,
    reducedMotion,
    tick,
    goTo,
    step,
    isSettlingDrag,
    stageHandlers: {
      onWheel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      onDragStart: (event: React.DragEvent) => event.preventDefault(),
    },
  }
}
