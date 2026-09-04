/**
 * A labelled figure — the portal's unit of "one number worth reading".
 *
 * `size` covers the three scales the design uses: the 40px hero figure beside a
 * panel title, the 36px card in a stat row, and the 38px analytics KPI.
 */
import type { ReactNode } from 'react'

import { border, color, font, kicker } from '../../design/tokens'

type StatSize = 'hero' | 'card' | 'kpi'

const SIZES: Record<StatSize, number> = { hero: 40, card: 36, kpi: 38 }

interface StatProps {
  label: string
  value: ReactNode
  /** Small trailing note under the value, e.g. "+65 this week". */
  note?: string
  /** Renders the figure in the accent blue rather than plain text. */
  accent?: boolean
  size?: StatSize
  /** Hero stats sit inline beside a title; cards get their own bordered box. */
  boxed?: boolean
  /** Glow behind the figure, used on the two headline totals. */
  glow?: boolean
}

export function Stat({
  label,
  value,
  note,
  accent = false,
  size = 'card',
  boxed = false,
  glow = false,
}: StatProps) {
  const figure = (
    <>
      <div style={boxed ? kicker() : { ...kicker(), marginBottom: 8 }}>{label}</div>
      <div
        style={{
          font: `600 ${SIZES[size]}px/1 ${font.display}`,
          color: accent ? color.accentSoft : color.text,
          marginTop: boxed ? 10 : 0,
          ...(glow ? { textShadow: '0 0 24px rgba(77,155,255,.5)' } : {}),
        }}
      >
        {value}
      </div>
      {note && (
        <div style={{ font: `500 11px/1 ${font.mono}`, color: color.accent, marginTop: 8 }}>
          {note}
        </div>
      )}
    </>
  )

  if (!boxed) return <div>{figure}</div>

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: 10,
        border: `1px solid ${border.base}`,
        ...(note ? { background: color.inset } : {}),
      }}
    >
      {figure}
    </div>
  )
}

/** The unit suffix that trails a figure, e.g. the "PTS" after a total. */
export function Unit({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return <span style={{ fontSize: size, color: color.textFaint }}>{children}</span>
}
