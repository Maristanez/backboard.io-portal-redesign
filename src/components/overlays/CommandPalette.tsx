/**
 * ⌘K palette — the fastest route to anywhere.
 *
 * It indexes sub-tabs alongside panels, which is what keeps the sections v3
 * folded into tabs reachable by their own names.
 */
import { useEffect, useRef, useState } from 'react'

import { border, brandFill, color, font, shadow, z } from '../../design/tokens'
import { PALETTE_TARGETS } from '../../data'
import { PANELS, type PaletteTarget } from '../../domain/types'
import { filterPaletteTargets } from './paletteSearch'

interface CommandPaletteProps {
  onClose: () => void
  onJump: (target: PaletteTarget) => void
}

export function CommandPalette({ onClose, onJump }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => input.current?.focus(), [])

  const results = filterPaletteTargets(PALETTE_TARGETS, query)

  const jump = (target: PaletteTarget) => {
    onJump(target)
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: z.palette,
        background: 'rgba(3,5,8,.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '14vh',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a panel"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 600,
          maxWidth: '90vw',
          borderRadius: 14,
          border: '1px solid rgba(77,155,255,.35)',
          background: 'rgba(10,14,20,.97)',
          boxShadow: shadow.float,
          overflow: 'hidden',
        }}
      >
        <input
          ref={input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            // Enter takes the first result; order is stable, so that's
            // predictable rather than a guess.
            const first = results[0]
            if (event.key === 'Enter' && first) jump(first)
          }}
          placeholder="Jump anywhere — panels or tabs (keys 1–8 also jump)"
          aria-label="Search panels and tabs"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '20px 22px',
            border: 0,
            borderBottom: `1px solid ${border.soft}`,
            background: 'none',
            color: color.text,
            fontSize: 16,
            outline: 'none',
          }}
        />
        <div
          style={{
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
        >
          {results.length === 0 && (
            <div style={{ padding: '24px 14px', fontSize: 14, color: color.textFaint }}>
              Nothing matches “{query}”.
            </div>
          )}
          {results.map((target, i) => (
            <button
              key={target.label}
              className="bb-pal-item"
              onClick={() => jump(target)}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto',
                gap: 14,
                alignItems: 'center',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '12px 14px',
                borderRadius: 8,
                border: 0,
                background: i === 0 ? brandFill.soft : 'transparent',
                color: color.text,
              }}
            >
              <span style={{ font: `500 11px/1 ${font.mono}`, color: color.accent }}>
                {String(PANELS.indexOf(target.panel) + 1).padStart(2, '0')}
              </span>
              <span style={{ font: `500 14px/1 ${font.sans}` }}>{target.label}</span>
              <span style={{ font: `400 12px/1 ${font.sans}`, color: color.textFaint }}>
                {target.hint}
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 18,
            padding: '10px 22px',
            borderTop: `1px solid ${border.subtle}`,
            font: `500 10px/1 ${font.mono}`,
            letterSpacing: '.14em',
            color: color.textFaint,
          }}
        >
          <span>↵ OPEN</span>
          <span>ESC CLOSE</span>
          <span>← → SWIPE</span>
        </div>
      </div>
    </div>
  )
}
