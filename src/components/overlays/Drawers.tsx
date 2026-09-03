/**
 * The two right-hand drawers.
 *
 * Both stay mounted and slide on transform rather than mounting on open, so
 * the animation runs in both directions.
 */
import { border, color, font, layout, z } from '../../design/tokens'
import { NOTIFICATIONS, PREFERENCES } from '../../data/program'
import type { PreferenceKey } from '../../domain/types'

function drawerStyle(open: boolean) {
  return {
    position: 'absolute',
    top: layout.headerHeight,
    right: 0,
    bottom: 0,
    width: layout.drawerWidth,
    zIndex: z.drawer,
    transform: `translateX(${open ? '0' : '100%'})`,
    // Hiding a closed drawer keeps its controls out of the tab order. The
    // visibility flip is delayed until the slide finishes, so closing still
    // animates; opening flips it immediately.
    visibility: open ? 'visible' : 'hidden',
    transition: open
      ? 'transform .5s cubic-bezier(.22,.8,.2,1), visibility 0s'
      : 'transform .5s cubic-bezier(.22,.8,.2,1), visibility 0s .5s',
    background: color.drawer,
    borderLeft: `1px solid ${border.base}`,
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
  } as const
}

function DrawerHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 26px',
        borderBottom: `1px solid ${border.subtle}`,
      }}
    >
      <h3 style={{ margin: 0, font: `600 26px/1 ${font.display}`, color: color.textBright }}>
        {title}
      </h3>
      <button
        onClick={onClose}
        aria-label={`Close ${title.toLowerCase()}`}
        style={{
          border: 0,
          background: 'none',
          color: color.textMuted,
          cursor: 'pointer',
          fontSize: 18,
        }}
      >
        ✕
      </button>
    </div>
  )
}

export function NotificationsDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <div style={drawerStyle(open)} aria-hidden={!open}>
      <DrawerHeader title="Notifications" onClose={onClose} />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {NOTIFICATIONS.map((notification) => (
          <div
            key={notification.text}
            style={{
              padding: '14px 16px',
              borderRadius: 8,
              border: `1px solid ${border.soft}`,
              background: color.inset,
              display: 'flex',
              gap: 12,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: notification.color,
                marginTop: 6,
                flex: 'none',
                boxShadow: `0 0 8px ${notification.color}`,
              }}
            />
            <div>
              <div style={{ fontSize: 13.5, lineHeight: 1.4, color: color.text }}>
                {notification.text}
              </div>
              <div
                style={{ font: `500 10px/1 ${font.mono}`, color: color.textFaint, marginTop: 6 }}
              >
                {notification.when}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsDrawer({
  open,
  onClose,
  preferences,
  onToggle,
}: {
  open: boolean
  onClose: () => void
  preferences: Record<PreferenceKey, boolean>
  onToggle: (key: PreferenceKey) => void
}) {
  return (
    <div style={drawerStyle(open)} aria-hidden={!open}>
      <DrawerHeader title="Settings" onClose={onClose} />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {PREFERENCES.map((preference) => {
          const on = preferences[preference.key]
          return (
            <div
              key={preference.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div>
                <div style={{ font: `500 14px/1.3 ${font.sans}`, color: color.text }}>
                  {preference.label}
                </div>
                <div style={{ fontSize: 12, color: color.textFaint, marginTop: 4 }}>
                  {preference.description}
                </div>
              </div>
              <button
                role="switch"
                aria-checked={on}
                aria-label={preference.label}
                onClick={() => onToggle(preference.key)}
                style={{
                  flex: 'none',
                  width: 42,
                  height: 24,
                  borderRadius: 12,
                  border: 0,
                  cursor: 'pointer',
                  background: on ? color.brand : border.bright,
                  position: 'relative',
                  transition: 'background .3s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: on ? 21 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left .3s',
                  }}
                />
              </button>
            </div>
          )
        })}
        <div
          style={{
            borderTop: `1px solid ${border.subtle}`,
            paddingTop: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <button
            className="bb-secondary"
            style={{
              border: `1px solid ${border.bright}`,
              cursor: 'pointer',
              padding: 12,
              borderRadius: 8,
              background: 'none',
              color: color.text,
              font: `600 13px/1 ${font.sans}`,
              textAlign: 'left',
            }}
          >
            Change email
          </button>
          <button
            style={{
              border: `1px solid ${color.dangerBorder}`,
              cursor: 'pointer',
              padding: 12,
              borderRadius: 8,
              background: 'none',
              color: color.danger,
              font: `600 13px/1 ${font.sans}`,
              textAlign: 'left',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
