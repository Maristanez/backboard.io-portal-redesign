/**
 * The fixed top bar: identity on the left, rail navigation in the middle,
 * account controls on the right.
 *
 * The middle slot changes shape with the mode — rail gets named pills,
 * coverflow a position counter, deck a row of dots — because each mode gives
 * the panels a different amount of room.
 */
import type { StageMode } from '../../coverflow/geometry'
import { border, brandFill, color, font, layout, shadow, z } from '../../design/tokens'
import { PANELS } from '../../domain/types'
import { VIEWER } from '../../data/program'
import { BellIcon, GearIcon, SearchIcon } from './icons'

interface HeaderProps {
  mode: StageMode
  index: number
  /** Animated points total for the pill. */
  points: number
  /** Ring fill for the avatar, as a stroke-dasharray. */
  tierRingDash: string
  /** Below this width the wordmark's supporting labels are dropped. */
  compact: boolean
  onGoTo: (index: number) => void
  onOpenPalette: () => void
  onToggleNotifications: () => void
  onToggleSettings: () => void
  hasUnreadNotifications: boolean
}

export function Header({
  mode,
  index,
  points,
  tierRingDash,
  compact,
  onGoTo,
  onOpenPalette,
  onToggleNotifications,
  onToggleSettings,
  hasUnreadNotifications,
}: HeaderProps) {
  const isRail = mode === 'rail'
  const isCoverflow = mode === 'coverflow' || mode === 'hybrid'
  const isDeck = mode === 'deck'
  const labelDisplay = compact ? 'none' : 'inline'

  return (
    <header
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: layout.headerHeight,
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0,1fr) auto',
        alignItems: 'center',
        gap: 16,
        padding: '0 clamp(16px,1.7vw,32px)',
        zIndex: z.header,
        borderBottom: `1px solid ${border.subtle}`,
        background: 'linear-gradient(180deg,rgba(6,8,12,.9),rgba(6,8,12,.4))',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <img
          src="/assets/logo-white.svg"
          alt="backboard.io"
          draggable={false}
          style={{ height: 22, display: 'block', WebkitUserDrag: 'none' } as never}
        />
        <span
          aria-hidden
          style={{
            width: 1,
            height: 20,
            background: border.bright,
            display: labelDisplay,
          }}
        />
        <span
          style={{
            font: `500 11px/1 ${font.mono}`,
            letterSpacing: '.22em',
            color: color.textDim,
            whiteSpace: 'nowrap',
            display: labelDisplay,
          }}
        >
          AMBASSADORS
        </span>
      </div>

      {isRail && (
        <nav
          aria-label="Panels"
          style={{
            display: 'flex',
            gap: 2,
            padding: 4,
            border: `1px solid ${border.base}`,
            borderRadius: 999,
            background: color.surface,
          }}
        >
          {PANELS.map((label, i) => {
            const on = i === index
            return (
              <button
                key={label}
                onClick={() => onGoTo(i)}
                aria-current={on ? 'page' : undefined}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 999,
                  font: `500 12px/1 ${font.sans}`,
                  color: on ? color.textBright : color.textDim,
                  background: on ? brandFill.strong : 'transparent',
                  boxShadow: on
                    ? `0 0 18px rgba(30,124,242,.45), inset 0 0 0 1px ${border.accentStrong}`
                    : 'none',
                  transition: 'all .35s',
                }}
              >
                {label}
              </button>
            )
          })}
        </nav>
      )}

      {isCoverflow && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 8,
            font: `500 12px/1 ${font.mono}`,
            letterSpacing: '.18em',
            color: color.textFaint,
            whiteSpace: 'nowrap',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <span style={{ color: color.accent, fontSize: 20, fontWeight: 500 }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>/ {String(PANELS.length).padStart(2, '0')}</span>
          <span
            style={{
              marginLeft: 12,
              color: color.textMuted,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {PANELS[index]}
          </span>
        </div>
      )}

      {isDeck && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {PANELS.map((label, i) => (
            <button
              key={label}
              onClick={() => onGoTo(i)}
              title={label}
              aria-label={label}
              aria-current={i === index ? 'page' : undefined}
              style={{
                border: 0,
                cursor: 'pointer',
                padding: 0,
                height: 3,
                borderRadius: 2,
                width: i === index ? 40 : 12,
                background: i === index ? color.accent : 'rgba(140,170,220,.25)',
                transition: 'all .4s',
              }}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none', justifySelf: 'end' }}>
        <button
          className="bb-jump"
          onClick={onOpenPalette}
          title="Jump to panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 38,
            padding: '0 14px',
            borderRadius: 999,
            border: `1px solid ${border.strong}`,
            background: color.surface,
            cursor: 'pointer',
            color: color.textDim,
            font: `500 12px/1 ${font.sans}`,
          }}
        >
          <SearchIcon />
          <span style={{ display: labelDisplay }}>Jump</span>
          <span
            style={{
              font: `500 10px/1 ${font.mono}`,
              color: color.textFaint,
              padding: '3px 6px',
              borderRadius: 4,
              border: `1px solid ${border.strong}`,
            }}
          >
            ⌘K
          </span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            border: `1px solid ${brandFill.strong}`,
            borderRadius: 999,
            background: brandFill.faint,
            boxShadow: shadow.glowSoft,
            flex: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color.accent,
              boxShadow: `0 0 10px ${color.accent}`,
              animation: 'bbPulse 2.4s infinite',
            }}
          />
          <span
            style={{
              font: `600 13px/1 ${font.mono}`,
              color: color.accentSoft,
              letterSpacing: '.06em',
            }}
          >
            {points} PTS
          </span>
          <span aria-hidden style={{ width: 1, height: 12, background: 'rgba(140,170,220,.25)' }} />
          <span
            style={{
              font: `500 10px/1 ${font.mono}`,
              letterSpacing: '.2em',
              color: color.accent,
            }}
          >
            {VIEWER.tier}
          </span>
        </div>

        <button
          onClick={onToggleNotifications}
          title="Notifications"
          aria-label="Notifications"
          style={circleButton}
        >
          <BellIcon />
          {hasUnreadNotifications && (
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: 8,
                right: 9,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color.accent,
                boxShadow: `0 0 8px ${color.accent}`,
              }}
            />
          )}
        </button>

        <button onClick={onToggleSettings} title="Settings" aria-label="Settings" style={circleButton}>
          <GearIcon />
        </button>

        <button
          onClick={() => onGoTo(PANELS.length - 1)}
          title={`Profile · ${VIEWER.points} pts`}
          aria-label="Profile"
          style={{
            position: 'relative',
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 0,
            background: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg viewBox="0 0 44 44" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} aria-hidden>
            <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(140,170,220,.15)" strokeWidth="2.5" />
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke={color.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={tierRingDash}
              style={{
                filter: 'drop-shadow(0 0 5px rgba(77,155,255,.9))',
                transition: 'stroke-dasharray 1.2s cubic-bezier(.22,.8,.2,1)',
              }}
            />
          </svg>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: color.brand,
              color: '#fff',
              font: `600 12px/32px ${font.sans}`,
              textAlign: 'center',
            }}
          >
            {VIEWER.initials}
          </span>
        </button>
      </div>
    </header>
  )
}

const circleButton = {
  position: 'relative',
  width: 38,
  height: 38,
  borderRadius: '50%',
  border: `1px solid ${border.strong}`,
  background: color.surface,
  cursor: 'pointer',
  color: color.textMuted,
  display: 'grid',
  placeItems: 'center',
} as const
