/**
 * Initials avatar.
 *
 * `initials()` was duplicated verbatim in two panels; it lives here now, next
 * to the only thing that uses it.
 */
import { color, font } from '../../design/tokens'

/** First letters of the first two words of a name. */
export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

interface AvatarProps {
  name: string
  size?: number
  /** Stacked avatars overlap and sit on a solid ground so they read as a pile. */
  stacked?: boolean
}

export function Avatar({ name, size = 32, stacked = false }: AvatarProps) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        font: `600 ${size <= 30 ? 10 : 12}px/1 ${font.sans}`,
        color: color.accentSoft,
        ...(stacked
          ? { background: '#101620', border: '2px solid #0a0d13', marginRight: -8 }
          : {
              background: 'rgba(30,124,242,.15)',
              border: '1px solid rgba(77,155,255,.3)',
            }),
      }}
    >
      {initials(name)}
    </span>
  )
}
