/** Small status and empty-state pieces shared across panels. */
import type { ReactNode } from 'react'

import { border, color, font } from '../../design/tokens'

/** Outlined uppercase status chip, coloured by state. */
export function StatusPill({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      style={{
        font: `500 9.5px/1 ${font.mono}`,
        letterSpacing: '.16em',
        padding: '5px 8px',
        borderRadius: 4,
        color: tone,
        border: `1px solid ${tone}`,
        opacity: 0.9,
      }}
    >
      {label}
    </span>
  )
}

/**
 * Placeholder for a list with nothing in it.
 *
 * `outlined` gets a dashed box — used where the empty state is the whole
 * region; the plain variant sits inside an already-bordered card.
 */
export function EmptyState({
  children,
  outlined = false,
}: {
  children: ReactNode
  outlined?: boolean
}) {
  return (
    <div
      style={{
        padding: outlined ? 40 : 36,
        textAlign: 'center',
        fontSize: outlined ? 14 : 14,
        color: color.textFaint,
        ...(outlined
          ? { border: `1px dashed ${border.strong}`, borderRadius: 10 }
          : {}),
      }}
    >
      {children}
    </div>
  )
}

/** The inset card that most panel content sits in. */
export function Card({
  children,
  style,
  padded = true,
}: {
  children: ReactNode
  style?: React.CSSProperties
  padded?: boolean
}) {
  return (
    <div
      style={{
        ...(padded ? { padding: '22px 24px' } : {}),
        borderRadius: 12,
        border: `1px solid ${border.base}`,
        background: color.inset,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
