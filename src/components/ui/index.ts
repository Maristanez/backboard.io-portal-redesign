/**
 * Shared visual primitives.
 *
 * These exist because the same shapes were open-coded across eight panels: the
 * panel heading thirteen times, the input skin four times, the initials helper
 * twice verbatim. Each one here is a single place to change a decision that
 * previously lived in N places.
 */
export { PanelHeading } from './PanelHeading'
export { Stat, Unit } from './Stat'
export { Field, TextArea, Labelled, fieldStyle } from './Field'
export { Button } from './Button'
export { Avatar, initials } from './Avatar'
export { Meter } from './Meter'
export { StatusPill, EmptyState, Card } from './Feedback'
