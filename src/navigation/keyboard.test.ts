import { describe, expect, it } from 'vitest'

import { resolveKeyAction } from './keyboard'

const key = (init: Partial<KeyboardEvent> & { key: string }) =>
  ({ metaKey: false, ctrlKey: false, ...init }) as KeyboardEvent

describe('resolveKeyAction', () => {
  it('toggles the command palette on the platform shortcut', () => {
    expect(resolveKeyAction(key({ key: 'k', metaKey: true }), false)).toEqual({
      type: 'toggle-palette',
    })
    expect(resolveKeyAction(key({ key: 'K', ctrlKey: true }), false)).toEqual({
      type: 'toggle-palette',
    })
  })

  it('opens the palette even while typing, since it is how you escape a field', () => {
    expect(resolveKeyAction(key({ key: 'k', metaKey: true }), true)).toEqual({
      type: 'toggle-palette',
    })
  })

  it('dismisses every layer on Escape', () => {
    expect(resolveKeyAction(key({ key: 'Escape' }), false)).toEqual({ type: 'dismiss' })
  })

  it('dismisses on Escape while typing too', () => {
    expect(resolveKeyAction(key({ key: 'Escape' }), true)).toEqual({ type: 'dismiss' })
  })

  it('steps panels with the arrow keys', () => {
    expect(resolveKeyAction(key({ key: 'ArrowRight' }), false)).toEqual({ type: 'step', by: 1 })
    expect(resolveKeyAction(key({ key: 'ArrowLeft' }), false)).toEqual({ type: 'step', by: -1 })
  })

  it('jumps to a panel by number', () => {
    expect(resolveKeyAction(key({ key: '1' }), false)).toEqual({ type: 'goto', index: 0 })
    expect(resolveKeyAction(key({ key: '8' }), false)).toEqual({ type: 'goto', index: 7 })
  })

  it('ignores digits past the panel count', () => {
    expect(resolveKeyAction(key({ key: '9' }), false)).toBeNull()
    expect(resolveKeyAction(key({ key: '0' }), false)).toBeNull()
  })

  it('leaves arrows and digits alone while typing', () => {
    expect(resolveKeyAction(key({ key: 'ArrowRight' }), true)).toBeNull()
    expect(resolveKeyAction(key({ key: '3' }), true)).toBeNull()
  })
})
