/** A thin progress track. Five call sites had this open-coded. */
import { border, color } from '../../design/tokens'

interface MeterProps {
  /** Fill, 0-100. */
  percent: number
  height?: number
  /** The headline meters use a gradient and glow; inline ones stay flat. */
  emphasis?: boolean
  /** Duration of the fill transition; 0 for none. */
  transitionMs?: number
}

export function Meter({ percent, height = 4, emphasis = false, transitionMs = 0 }: MeterProps) {
  return (
    <div
      style={{
        height,
        borderRadius: 2,
        background: border.soft,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percent}%`,
          borderRadius: 2,
          background: emphasis ? 'linear-gradient(90deg,#1e7cf2,#8ec0ff)' : color.brand,
          ...(emphasis ? { boxShadow: '0 0 12px rgba(77,155,255,.6)' } : {}),
          ...(transitionMs
            ? { transition: `width ${transitionMs}ms cubic-bezier(.22,.8,.2,1)` }
            : {}),
        }}
      />
    </div>
  )
}
