import { beforeEach, describe, expect, it } from 'vitest'

import { advanceWheel, canScrollVertically, initialWheelState, resolveWheelDelta } from './wheel'

/** Builds a scrollable element with the given scroll geometry. */
function scrollable({
  scrollTop = 0,
  clientHeight = 100,
  scrollHeight = 500,
  overflowY = 'auto',
} = {}) {
  const el = document.createElement('div')
  el.style.overflowY = overflowY
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true })
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true })
  el.scrollTop = scrollTop
  return el
}

describe('canScrollVertically', () => {
  let stage: HTMLElement

  beforeEach(() => {
    stage = document.createElement('div')
    document.body.append(stage)
  })

  it('lets a mid-scroll list keep its own wheel events', () => {
    const list = scrollable({ scrollTop: 200 })
    stage.append(list)
    expect(canScrollVertically(list, -1, stage)).toBe(true)
    expect(canScrollVertically(list, 1, stage)).toBe(true)
  })

  it('releases upward scroll once the list is at its top', () => {
    const list = scrollable({ scrollTop: 0 })
    stage.append(list)
    expect(canScrollVertically(list, -1, stage)).toBe(false)
    expect(canScrollVertically(list, 1, stage)).toBe(true)
  })

  it('releases downward scroll once the list is at its bottom', () => {
    const list = scrollable({ scrollTop: 400 })
    stage.append(list)
    expect(canScrollVertically(list, 1, stage)).toBe(false)
  })

  it('ignores elements that do not overflow', () => {
    const box = scrollable({ scrollHeight: 100, clientHeight: 100 })
    stage.append(box)
    expect(canScrollVertically(box, 1, stage)).toBe(false)
  })

  it('ignores elements that are not scrollable', () => {
    const box = scrollable({ overflowY: 'hidden' })
    stage.append(box)
    expect(canScrollVertically(box, 1, stage)).toBe(false)
  })

  it('finds a scrollable ancestor from a nested target', () => {
    const list = scrollable({ scrollTop: 200 })
    const child = document.createElement('span')
    list.append(child)
    stage.append(list)
    expect(canScrollVertically(child, 1, stage)).toBe(true)
  })

  it('stops searching at the stage boundary', () => {
    const outer = scrollable({ scrollTop: 200 })
    stage.append(outer)
    // Searching from the stage itself must not walk up into `outer`.
    expect(canScrollVertically(stage, 1, stage)).toBe(false)
  })
})

describe('resolveWheelDelta', () => {
  it('takes a horizontal wheel or trackpad swipe directly', () => {
    expect(resolveWheelDelta({ deltaX: 30, deltaY: 4, shiftKey: false }, false)).toBe(30)
  })

  it('reads shift+vertical as horizontal, the usual mouse convention', () => {
    expect(resolveWheelDelta({ deltaX: 0, deltaY: 30, shiftKey: true }, false)).toBe(30)
  })

  it('pages the rail on a plain vertical wheel when nothing can scroll', () => {
    expect(resolveWheelDelta({ deltaX: 0, deltaY: 30, shiftKey: false }, false)).toBe(30)
  })

  it('yields a plain vertical wheel to a scrollable region', () => {
    expect(resolveWheelDelta({ deltaX: 0, deltaY: 30, shiftKey: false }, true)).toBe(0)
  })
})

describe('advanceWheel', () => {
  it('ignores small movements until they accumulate past the threshold', () => {
    let state = initialWheelState()
    let step = 0
    for (const _ of [1, 2, 3]) {
      void _
      ;({ state, step } = advanceWheel(state, 20, 1000))
      expect(step).toBe(0)
    }
    ;({ state, step } = advanceWheel(state, 20, 1000))
    expect(step).toBe(1)
  })

  it('pages backwards on accumulated negative movement', () => {
    const { step } = advanceWheel(initialWheelState(), -80, 1000)
    expect(step).toBe(-1)
  })

  it('locks out further paging until the momentum window closes', () => {
    const first = advanceWheel(initialWheelState(), 80, 1000)
    expect(first.step).toBe(1)
    // Trackpad momentum keeps firing; these must not cascade into more pages.
    const during = advanceWheel(first.state, 80, 1400)
    expect(during.step).toBe(0)
    const after = advanceWheel(during.state, 80, 1700)
    expect(after.step).toBe(1)
  })

  it('forgets stale accumulation between separate gestures', () => {
    const first = advanceWheel(initialWheelState(), 50, 1000)
    expect(first.step).toBe(0)
    // A second nudge long afterwards is a new gesture, not a continuation.
    const later = advanceWheel(first.state, 50, 3000)
    expect(later.step).toBe(0)
  })
})
