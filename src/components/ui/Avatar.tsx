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

interface AvatarBase {
  size?: number
  /** Stacked avatars overlap and sit on a solid ground so they read as a pile. */
  stacked?: boolean
}

/**
 * Either a full name to derive initials from, or initials already computed.
 *
 * Modelled as a union because passing stored initials as `name` silently
 * re-derives them — 'YE' becomes 'Y' — and the result looks plausible enough
 * to miss. Requiring the caller to say which they have makes that a type error.
 */
type AvatarProps = AvatarBase &
  ({ name: string; label?: never } | { label: string; name?: never })

export function Avatar({ name, label, size = 32, stacked = false }: AvatarProps) {
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
      {label ?? initials(name as string)}
    </span>
  )
}
