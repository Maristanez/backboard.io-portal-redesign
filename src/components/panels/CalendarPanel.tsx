/**
 * Calendar — the shared month grid of ambassador events.
 *
 * The month being viewed is panel-local state: it's a way of looking at the
 * data, not a change to it, so it doesn't belong in program state.
 */
import { useState } from 'react'

import { buildMonthGrid, shiftMonth } from '../../calendar/month'
import { border, brandFill, color, font, kicker } from '../../design/tokens'
import { CALENDAR_EVENTS, DAYS_OF_WEEK, MONTH_NAMES, TODAY } from '../../data'
import type { CalendarEvent } from '../../domain/types'
import { PanelBody } from '../shell/Panel'
import { Button, PanelHeading } from '../ui'

interface CalendarPanelProps {
  onOpenEvent: (event: CalendarEvent) => void
  onSubmitEvent: () => void
}

export function CalendarPanel({ onOpenEvent, onSubmitEvent }: CalendarPanelProps) {
  const [view, setView] = useState<{ year: number; month: number }>({
    year: TODAY.year,
    month: TODAY.month,
  })

  const grid = buildMonthGrid(view.year, view.month, CALENDAR_EVENTS, TODAY)

  return (
    <>
      <PanelHeading
        index={4}
        section="PROGRAM"
        title="Shared calendar"
        description="Ambassador events worldwide. Submit yours for approval."
        aside={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${border.strong}`,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setView((v) => shiftMonth(v.year, v.month, -1))}
              aria-label="Previous month"
              style={monthStepStyle}
            >
              ‹
            </button>
            <span
              style={{
                font: `600 15px/1 ${font.sans}`,
                color: color.text,
                padding: '0 10px',
                minWidth: 140,
                textAlign: 'center',
              }}
            >
              {MONTH_NAMES[view.month]} {view.year}
            </span>
            <button
              onClick={() => setView((v) => shiftMonth(v.year, v.month, 1))}
              aria-label="Next month"
              style={monthStepStyle}
            >
              ›
            </button>
          </div>
            <Button onClick={onSubmitEvent}>Submit event</Button>
          </div>
        }
      />

      <PanelBody
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gridTemplateRows: '28px repeat(6,minmax(56px,1fr))',
          padding: '20px 44px 36px',
          gap: 4,
        }}
      >
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} style={{ ...kicker(), textAlign: 'center', alignSelf: 'center' }}>
            {day}
          </div>
        ))}

        {grid.map((cell, i) => (
          <button
            key={i}
            onClick={() => cell.event && onOpenEvent(cell.event)}
            disabled={!cell.event}
            aria-label={
              cell.inMonth
                ? `${MONTH_NAMES[view.month]} ${cell.day}${cell.event ? `: ${cell.event.title}` : ''}`
                : undefined
            }
            style={{
              textAlign: 'left',
              cursor: cell.event ? 'pointer' : 'default',
              padding: '8px 10px',
              borderRadius: 6,
              border: `1px solid ${
                cell.isToday
                  ? border.accentVivid
                  : cell.inMonth
                    ? border.subtle
                    : 'transparent'
              }`,
              background: cell.event
                ? brandFill.faintest
                : cell.inMonth
                  ? 'rgba(255,255,255,.015)'
                  : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minHeight: 0,
              overflow: 'hidden',
              boxShadow: cell.isToday ? '0 0 20px rgba(30,124,242,.25)' : 'none',
            }}
          >
            <span
              style={{
                font: `500 12px/1 ${font.mono}`,
                color: cell.isToday
                  ? color.accent
                  : cell.inMonth
                    ? '#8a96a8'
                    : 'transparent',
              }}
            >
              {cell.inMonth ? cell.day : ''}
            </span>
            {cell.event && (
              <span
                style={{
                  font: `500 12px/1.2 ${font.sans}`,
                  color: '#dbe8ff',
                  padding: '5px 8px',
                  borderRadius: 4,
                  background: 'rgba(30,124,242,.22)',
                  border: `1px solid ${border.accentStrong}`,
                  width: '100%',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {cell.event.title}
              </span>
            )}
          </button>
        ))}
      </PanelBody>
    </>
  )
}

const monthStepStyle = {
  border: 0,
  background: 'none',
  color: color.textMuted,
  cursor: 'pointer',
  width: 36,
  height: 38,
} as const
