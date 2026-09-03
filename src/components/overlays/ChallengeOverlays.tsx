/** The three modal flows: claiming a challenge, viewing an event, adding one. */
import { border, color, font, kicker } from '../../design/tokens'
import type { CalendarEvent } from '../../domain/types'
import { Overlay, overlayField } from './Overlay'

const primaryButton = {
  border: 0,
  cursor: 'pointer',
  padding: '12px 22px',
  borderRadius: 8,
  background: color.brand,
  color: '#fff',
  font: `600 14px/1 ${font.sans}`,
  boxShadow: '0 0 24px rgba(30,124,242,.4)',
} as const

const cancelButton = {
  border: 0,
  background: 'none',
  color: color.textMuted,
  cursor: 'pointer',
  padding: '12px 16px',
  font: `500 14px/1 ${font.sans}`,
} as const

export function ApplyOverlay({
  title,
  onClose,
  onConfirm,
}: {
  title: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Overlay onClose={onClose} label={`Apply for ${title}`}>
      <div>
        <div style={{ ...kicker(), color: color.accent }}>APPLICATION</div>
        <h3
          style={{
            margin: '8px 0 0',
            font: `600 30px/1.1 ${font.display}`,
            color: color.textBright,
          }}
        >
          {title}
        </h3>
      </div>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={kicker()}>PROOF LINK (POST, VIDEO, SCREENSHOT…)</span>
        <input placeholder="https://…" style={overlayField} />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={kicker()}>NOTES</span>
        <textarea rows={3} style={{ ...overlayField, resize: 'none' }} />
      </label>
      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: color.textDim }}>
        An admin reviews your application. Points are only awarded once it&rsquo;s approved.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={onClose} style={cancelButton}>
          Cancel
        </button>
        <button className="bb-primary" onClick={onConfirm} style={primaryButton}>
          Submit application
        </button>
      </div>
    </Overlay>
  )
}

export function EventOverlay({
  event,
  onClose,
}: {
  event: CalendarEvent
  onClose: () => void
}) {
  return (
    <Overlay onClose={onClose} label={event.title}>
      <div>
        <div style={{ ...kicker(), color: color.accent }}>EVENT · {event.date}</div>
        <h3
          style={{
            margin: '8px 0 0',
            font: `600 34px/1.1 ${font.display}`,
            color: color.textBright,
          }}
        >
          {event.title}
        </h3>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          fontSize: 14,
          color: color.textSoft,
        }}
      >
        <div>
          <div style={{ ...kicker(9.5, '.16em'), marginBottom: 6 }}>WHERE</div>
          {event.where}
        </div>
        <div>
          <div style={{ ...kicker(9.5, '.16em'), marginBottom: 6 }}>TARGET</div>
          {event.target} attendees
        </div>
        <div>
          <div style={{ ...kicker(9.5, '.16em'), marginBottom: 6 }}>SUBMITTED BY</div>
          {event.by}
        </div>
        <div>
          <div style={{ ...kicker(9.5, '.16em'), marginBottom: 6 }}>LINK</div>
          <a href="#">Event page ↗</a>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${border.soft}`, paddingTop: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <span style={kicker()}>YOUR INVITES</span>
          <span
            style={{
              font: `500 10px/1 ${font.mono}`,
              letterSpacing: '.14em',
              color: color.accent,
            }}
          >
            +5 PTS PER ATTENDEE
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr auto',
            gap: 8,
            marginTop: 12,
          }}
        >
          <input placeholder="Name" style={{ ...overlayField, padding: '12px 14px' }} />
          <input
            placeholder="email@example.com"
            style={{ ...overlayField, padding: '12px 14px' }}
          />
          <button
            className="bb-primary"
            style={{ ...primaryButton, padding: '12px 18px', fontSize: 13 }}
          >
            Invite
          </button>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 12.5, lineHeight: 1.5, color: color.textDim }}>
          An admin confirms attendance after the event, then points land automatically.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="bb-secondary"
          onClick={onClose}
          style={{
            border: `1px solid ${border.bright}`,
            background: 'none',
            color: color.text,
            cursor: 'pointer',
            padding: '11px 18px',
            borderRadius: 8,
            font: `600 13px/1 ${font.sans}`,
          }}
        >
          Close
        </button>
      </div>
    </Overlay>
  )
}

export function SubmitEventOverlay({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose} label="Submit an event for approval">
      <div>
        <div style={{ ...kicker(), color: color.accent }}>NEW EVENT</div>
        <h3
          style={{
            margin: '8px 0 0',
            font: `600 30px/1.1 ${font.display}`,
            color: color.textBright,
          }}
        >
          Submit an event for approval
        </h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input placeholder="Event name" style={{ ...overlayField, gridColumn: '1/3' }} />
        <input placeholder="Date & time" style={overlayField} />
        <input placeholder="Location" style={overlayField} />
        <input placeholder="Target attendees" style={overlayField} />
        <input placeholder="Event link" style={overlayField} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={onClose} style={cancelButton}>
          Cancel
        </button>
        <button className="bb-primary" onClick={onClose} style={primaryButton}>
          Submit for approval
        </button>
      </div>
    </Overlay>
  )
}
