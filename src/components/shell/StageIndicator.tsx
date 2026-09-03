/**
 * Position indicators below the stage. Each mode gets the one that fits: named
 * dots for coverflow, a progress line for rail, a big counter for deck.
 */
import type { StageMode } from '../../coverflow/geometry'
import { border, color, font, z } from '../../design/tokens'
import { PANELS } from '../../domain/types'

interface StageIndicatorProps {
  mode: StageMode
  index: number
  onGoTo: (index: number) => void
}

export function StageIndicator({ mode, index, onGoTo }: StageIndicatorProps) {
  if (mode === 'coverflow' || mode === 'hybrid') {
    return (
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 22,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(6px,1.4vw,26px)',
          zIndex: z.chrome,
          flexWrap: 'nowrap',
          minWidth: 0,
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
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 0,
                minWidth: 0,
                flex: '0 1 auto',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: on ? 36 : 14,
                  height: 4,
                  borderRadius: 2,
                  background: on ? color.accent : 'rgba(140,170,220,.25)',
                  boxShadow: on ? '0 0 18px rgba(30,124,242,.45)' : 'none',
                  transition: 'all .4s',
                }}
              />
              <span
                style={{
                  font: `500 clamp(8px,.65vw,10px)/1 ${font.mono}`,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: on ? color.textBright : color.textDim,
                  transition: 'color .4s',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  if (mode === 'rail') {
    return (
      <>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '11vw',
            right: '11vw',
            bottom: 24,
            height: 2,
            background: border.soft,
            borderRadius: 1,
            zIndex: z.chrome,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${100 / PANELS.length}%`,
              transform: `translateX(${index * 100}%)`,
              background: color.accent,
              boxShadow: `0 0 12px ${color.accent}`,
              borderRadius: 1,
              transition: 'transform .6s cubic-bezier(.22,.8,.2,1)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            right: '11vw',
            bottom: 38,
            font: `500 10px/1 ${font.mono}`,
            letterSpacing: '.2em',
            color: color.textFaint,
            zIndex: z.chrome,
          }}
        >
          SWIPE · TRACKPAD · ← →
        </div>
      </>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 84,
        borderTop: `1px solid ${border.subtle}`,
        background: 'linear-gradient(0deg,rgba(6,8,12,.9),rgba(6,8,12,.3))',
        padding: '0 44px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        zIndex: z.chrome,
        font: `500 11px/1 ${font.mono}`,
        letterSpacing: '.2em',
        color: color.textFaint,
      }}
    >
      <span style={{ font: `600 48px/1 ${font.display}`, color: color.text, letterSpacing: '-.02em' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span>/ {String(PANELS.length).padStart(2, '0')}</span>
      <span style={{ marginLeft: 18 }}>
        {(PANELS[index + 1] ?? 'End').toUpperCase()} →
      </span>
    </div>
  )
}

/** Deck mode's oversized parallax titles, sliding behind the panels. */
export function DeckTitles({
  offset,
  dragging,
}: {
  offset: number
  dragging: boolean
}) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: 72,
        display: 'flex',
        whiteSpace: 'nowrap',
        transform: `translateX(${offset}px)`,
        transition: dragging ? 'none' : 'transform .8s cubic-bezier(.22,.8,.2,1)',
        pointerEvents: 'none',
      }}
    >
      {PANELS.map((label) => (
        <div
          key={label}
          style={{
            width: '100vw',
            padding: '0 3vw',
            font: `600 15vw/1 ${font.display}`,
            letterSpacing: '-.03em',
            textTransform: 'uppercase',
            color: 'rgba(140,175,235,.06)',
            overflow: 'hidden',
          }}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
