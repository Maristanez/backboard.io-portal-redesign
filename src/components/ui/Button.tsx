/**
 * The three button treatments the design uses.
 *
 * `primary` is a filled blue call to action with a glow, `secondary` an
 * outlined alternative, `ghost` a bare text action (Cancel). Disabled primaries
 * fall back to the outlined look rather than dimming, which is how the design
 * distinguishes "not yet" from "not a button".
 */
import type { CSSProperties, ReactNode } from 'react'

import { border, color, font } from '../../design/tokens'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  variant?: Variant
  onClick?: () => void
  disabled?: boolean
  title?: string
  /** Compact padding, for buttons sitting inside cards and rows. */
  small?: boolean
  style?: CSSProperties
  children: ReactNode
}

export function Button({
  variant = 'primary',
  onClick,
  disabled = false,
  title,
  small = false,
  style,
  children,
}: ButtonProps) {
  const filled = variant === 'primary' && !disabled

  const base: CSSProperties = {
    cursor: disabled ? 'default' : 'pointer',
    padding: small ? '9px 14px' : '12px 20px',
    borderRadius: 8,
    font: `600 ${small ? 12 : 14}px/1 ${font.sans}`,
    whiteSpace: 'nowrap',
  }

  const skin: CSSProperties =
    variant === 'ghost'
      ? { border: 0, background: 'none', color: color.textMuted, font: `500 14px/1 ${font.sans}` }
      : filled
        ? {
            border: `1px solid ${color.brand}`,
            background: color.brand,
            color: '#fff',
            boxShadow: '0 0 24px rgba(30,124,242,.4)',
          }
        : {
            border: `1px solid ${disabled ? border.strong : border.bright}`,
            background: 'transparent',
            color: disabled ? color.textDim : color.text,
          }

  return (
    <button
      className={filled ? 'bb-primary' : variant === 'secondary' ? 'bb-secondary' : undefined}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ ...base, ...skin, ...style }}
    >
      {children}
    </button>
  )
}
