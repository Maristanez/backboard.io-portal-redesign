import { describe, expect, it } from 'vitest'

import { resolveDragIntent, resolveDragCommit, smoothVelocity } from './gestures'

/** A settled 1000px-wide stage on panel 3, with no flick velocity. */
const base = { index: 3, viewportWidth: 1000, velocity: 0 }

describe('resolveDragCommit', () => {
  it('snaps back when the drag never clears the threshold', () => {
    // 8% of 1000px = 80px.
    expect(resolveDragCommit({ ...base, dragX: -60 })).toBe(3)
    expect(resolveDragCommit({ ...base, dragX: 60 })).toBe(3)
  })

  it('advances when dragged left past the threshold', () => {
    expect(resolveDragCommit({ ...base, dragX: -100 })).toBe(4)
  })

  it('goes back when dragged right past the threshold', () => {
    expect(resolveDragCommit({ ...base, dragX: 100 })).toBe(2)
  })

  it('caps the threshold at 120px so wide screens stay easy to page', () => {
    // 8% of 4000px would be 320px; the cap keeps it at 120.
    expect(resolveDragCommit({ ...base, viewportWidth: 4000, dragX: -140 })).toBe(4)
  })

  it('accepts a fast flick that never travels far', () => {
    // 30px is well under the threshold, but the gesture was quick.
    expect(resolveDragCommit({ ...base, dragX: -30, velocity: -0.8 })).toBe(4)
    expect(resolveDragCommit({ ...base, dragX: 30, velocity: 0.8 })).toBe(2)
  })

  it('ignores a fast flick that barely moved, so taps do not page', () => {
    expect(resolveDragCommit({ ...base, dragX: -10, velocity: -0.8 })).toBe(3)
  })

  it('ignores a slow drag that barely moved', () => {
    expect(resolveDragCommit({ ...base, dragX: -30, velocity: -0.1 })).toBe(3)
  })
})

describe('resolveDragIntent', () => {
  it('waits until the pointer has actually moved', () => {
    expect(resolveDragIntent(3, 3)).toBe('undecided')
    expect(resolveDragIntent(-4, 2)).toBe('undecided')
  })

  it('starts dragging once the pointer clears the dead zone horizontally', () => {
    expect(resolveDragIntent(10, 2)).toBe('drag')
    expect(resolveDragIntent(-10, 2)).toBe('drag')
  })

  it('yields to a clearly vertical gesture so panels can scroll', () => {
    expect(resolveDragIntent(4, 20)).toBe('scroll')
  })

  it('still pages on a diagonal that leans horizontal', () => {
    // 1.6x is the cutoff: 10 across and 15 down is still a page.
    expect(resolveDragIntent(10, 15)).toBe('drag')
    expect(resolveDragIntent(10, 17)).toBe('scroll')
  })
})

describe('smoothVelocity', () => {
  it('tracks a steady drag toward its true speed', () => {
    // 16px per 16ms frame = 1px/ms, approached over successive frames.
    let v = 0
    for (let i = 0; i < 20; i++) v = smoothVelocity(v, 16, 16)
    expect(v).toBeCloseTo(1, 2)
  })

  it('damps a single jittery frame rather than tracking it', () => {
    const v = smoothVelocity(0, 40, 16)
    expect(Math.abs(v)).toBeLessThan(40 / 16)
  })

  it('survives a zero-length frame without dividing by zero', () => {
    expect(Number.isFinite(smoothVelocity(0.5, 10, 0))).toBe(true)
  })
})
