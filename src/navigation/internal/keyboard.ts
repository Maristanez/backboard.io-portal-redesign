/** Keyboard routing for the panel rail. */
import { PANELS } from '../../domain/types'

export type KeyAction =
  | { type: 'toggle-palette' }
  | { type: 'dismiss' }
  | { type: 'step'; by: 1 | -1 }
  | { type: 'goto'; index: number }

/**
 * What a keypress should do, or `null` for "not ours".
 *
 * `isTyping` gates the bare keys only. The palette shortcut and Escape stay
 * live inside inputs on purpose: they're how you get *out* of a field, so
 * suppressing them would trap the user in the search box.
 */
export function resolveKeyAction(event: KeyboardEvent, isTyping: boolean): KeyAction | null {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    return { type: 'toggle-palette' }
  }
  if (event.key === 'Escape') return { type: 'dismiss' }

  if (isTyping) return null

  if (event.key === 'ArrowRight') return { type: 'step', by: 1 }
  if (event.key === 'ArrowLeft') return { type: 'step', by: -1 }

  // Digits map onto panels 1..n; anything past the rail is left to the browser.
  if (/^[1-9]$/.test(event.key)) {
    const index = Number(event.key) - 1
    return index < PANELS.length ? { type: 'goto', index } : null
  }
  return null
}
