import { describe, expect, it } from 'vitest'

import { computePanelGeometry, computeStageLayout } from './geometry'

/** A settled 8-panel rail on a 1000px viewport, focused on panel 0. */
const rail = {
  mode: 'rail' as const,
  index: 0,
  dragX: 0,
  viewportWidth: 1000,
  panelCount: 8,
  panelWidth: 78,
  reducedMotion: false,
  glow: true,
  tick: 0,
}

describe('rail geometry', () => {
  it('leaves the focused panel unscaled and centred', () => {
    const [focused] = computePanelGeometry(rail)
    expect(focused!.transform).toBe('translateX(0px) scale(1)')
  })

  it('steps each neighbour out by the panel width plus a 24px gutter', () => {
    // 78% of 1000px = 780px, + 24px gutter = 804px per step.
    const panels = computePanelGeometry(rail)
    expect(panels[1]!.transform).toBe('translateX(804px) scale(0.95)')
  })

  it('glows only the focused panel', () => {
    const panels = computePanelGeometry(rail)
    expect(panels[0]!.boxShadow).toContain('rgba(30,124,242,.18)')
    expect(panels[1]!.boxShadow).not.toContain('rgba(30,124,242,.18)')
  })

  it('drops the glow when the glow prop is off', () => {
    const panels = computePanelGeometry({ ...rail, glow: false })
    expect(panels[0]!.boxShadow).not.toContain('rgba(30,124,242,.18)')
  })
})

describe('coverflow geometry', () => {
  const hybrid = { ...rail, mode: 'hybrid' as const }

  it('tilts panels away from the focus, signed by which side they sit on', () => {
    const panels = computePanelGeometry({ ...hybrid, index: 1 })
    // Panel 0 sits left of the focus, panel 2 right; they mirror each other.
    expect(panels[0]!.transform).toContain('rotateY(30deg)')
    expect(panels[2]!.transform).toContain('rotateY(-30deg)')
  })

  it('leaves the focused panel flat', () => {
    const panels = computePanelGeometry(hybrid)
    expect(panels[0]!.transform).toContain('rotateY(0deg)')
    expect(panels[0]!.transform).toContain('translateZ(0px)')
  })

  it('pushes distant panels further back in Z', () => {
    const panels = computePanelGeometry(hybrid)
    expect(panels[1]!.transform).toContain('translateZ(-360px)')
    expect(panels[2]!.transform).toContain('translateZ(-720px)')
  })

  it('caps the tilt at one panel out, so the rail does not over-rotate', () => {
    const panels = computePanelGeometry(hybrid)
    expect(panels[2]!.transform).toContain('rotateY(-30deg)')
    expect(panels[3]!.transform).toContain('rotateY(-30deg)')
  })

  it('flattens the 3D entirely under reduced motion', () => {
    const panels = computePanelGeometry({ ...hybrid, reducedMotion: true })
    for (const panel of panels) {
      expect(panel.transform).toContain('rotateY(0deg)')
      expect(panel.transform).toContain('translateZ(0px)')
    }
  })

  it('flattens pure coverflow under reduced motion too', () => {
    // The source canvas only honours reduced-motion in hybrid mode; applying it
    // in both is a deliberate fix, and costs hybrid nothing.
    const panels = computePanelGeometry({
      ...rail,
      mode: 'coverflow',
      reducedMotion: true,
    })
    expect(panels[1]!.transform).toContain('rotateY(0deg)')
    expect(panels[1]!.transform).toContain('translateZ(0px)')
  })

  it('uses a tighter step and a deeper tilt in pure coverflow', () => {
    const panels = computePanelGeometry({ ...rail, mode: 'coverflow' })
    // Pure coverflow fixes panel width at 66%: 0.66 * 1000 * 0.62 = 409.2px.
    expect(panels[1]!.transform).toContain('translateX(409.2px)')
    expect(panels[1]!.transform).toContain('rotateY(-42deg)')
  })
})

describe('deck geometry', () => {
  const deck = { ...rail, mode: 'deck' as const }

  it('slides panels a full viewport apart with no scaling or tilt', () => {
    const panels = computePanelGeometry(deck)
    expect(panels[1]!.transform).toBe('translateX(1000px)')
  })

  it('drops the shadow entirely, since deck cards are full-bleed', () => {
    const panels = computePanelGeometry(deck)
    expect(panels[0]!.boxShadow).toBe('none')
  })
})

describe('depth and visibility', () => {
  it('stacks the focused panel above its neighbours', () => {
    const panels = computePanelGeometry(rail)
    expect(panels[0]!.zIndex).toBe(100)
    expect(panels[1]!.zIndex).toBe(90)
    expect(panels[2]!.zIndex).toBe(80)
  })

  it('fades neighbours but keeps them visible in rail mode', () => {
    const panels = computePanelGeometry(rail)
    expect(panels[0]!.opacity).toBe(1)
    expect(panels[1]!.opacity).toBeCloseTo(0.45)
  })

  it('hides panels past the mode-specific cutoff', () => {
    // Rail carries to 2.2 panels out, coverflow to 2.5, deck only to 1.2. A
    // 300px drag puts panel 2 at distance 2.3 — inside coverflow, past rail.
    const dragged = { ...rail, dragX: 300 }
    expect(computePanelGeometry(dragged)[2]!.opacity).toBe(0)
    expect(computePanelGeometry({ ...dragged, mode: 'hybrid' })[2]!.opacity).toBeGreaterThan(0)
    expect(computePanelGeometry({ ...rail, mode: 'deck' })[2]!.opacity).toBe(0)
  })

  it('reveals the giant panel label as a panel loses focus', () => {
    const panels = computePanelGeometry(rail)
    // Fully transparent on the focused panel, opaque once a panel is clear of it.
    expect(panels[0]!.labelOpacity).toBe(0)
    expect(panels[1]!.labelOpacity).toBe(1)
  })

  it('holds the label back until the panel is a quarter-step out', () => {
    const panels = computePanelGeometry({ ...rail, dragX: -125 })
    // Dragged an eighth of a panel: still inside the .25 dead zone.
    expect(panels[0]!.labelOpacity).toBe(0)
  })
})

describe('drag interpolation', () => {
  it('moves the rail continuously, not in whole-panel jumps', () => {
    // Half a viewport of drag sits the rail exactly between two panels.
    const mid = computePanelGeometry({ ...rail, dragX: -500 })
    expect(mid[0]!.opacity).toBeCloseTo(mid[1]!.opacity)
  })

  it('drags left toward the next panel', () => {
    const settled = computePanelGeometry(rail)[1]!.transform
    const dragged = computePanelGeometry({ ...rail, dragX: -100 })[1]!.transform
    const x = (t: string) => Number(/translateX\(([-\d.]+)px\)/.exec(t)![1])
    expect(x(dragged)).toBeLessThan(x(settled))
  })
})

describe('stage layout', () => {
  it('gives coverflow a perspective so the tilt reads as depth', () => {
    expect(computeStageLayout('hybrid', 78).perspective).toBe('1800px')
    expect(computeStageLayout('rail', 78).perspective).toBe('none')
  })

  it('centres the panel column by splitting the leftover width', () => {
    // 78% wide leaves 22%, so 11vw either side.
    const layout = computeStageLayout('rail', 78)
    expect(layout.panelLeft).toBe('11vw')
    expect(layout.panelWidth).toBe('78vw')
  })

  it('lets deck panels run full-bleed with no card chrome', () => {
    const layout = computeStageLayout('deck', 78)
    expect(layout.panelWidth).toBe('100vw')
    expect(layout.panelLeft).toBe('0vw')
    expect(layout.cardRadius).toBe('0')
    expect(layout.cardBorder).toBe('0')
  })

  it('reserves more bottom room in coverflow for the dot indicator', () => {
    expect(computeStageLayout('rail', 78).panelBottom).toBe('56px')
    expect(computeStageLayout('hybrid', 78).panelBottom).toBe('70px')
    expect(computeStageLayout('deck', 78).panelBottom).toBe('84px')
  })

  it('narrows pure coverflow panels regardless of the requested width', () => {
    expect(computeStageLayout('coverflow', 78).panelWidth).toBe('66vw')
  })
})

describe('parallax', () => {
  it('drifts the background grid against the rail', () => {
    expect(computeStageLayout('rail', 78, 0).gridOffset).toBe(0)
    expect(computeStageLayout('rail', 78, 1).gridOffset).toBe(-60)
  })

  it('centres the glow when the rail sits mid-way through the panels', () => {
    // 8 panels, so the midpoint is 3.5.
    expect(computeStageLayout('rail', 78, 3.5, 8).glowOffset).toBe(0)
  })
})
