/**
 * Panel navigation.
 *
 * `usePanelNavigation` is the whole interface. The wheel routing, drag physics
 * and key mapping behind it live in `./internal` — they're the hook's
 * implementation, tested directly through their own seams but not part of what
 * a caller needs to know.
 */
export { usePanelNavigation } from './usePanelNavigation'
export type { PanelNavigationOptions } from './usePanelNavigation'
