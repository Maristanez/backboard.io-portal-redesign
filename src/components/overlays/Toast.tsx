/** Transient confirmation, centred above the stage indicator. */
import { font, z } from '../../design/tokens'

export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 64,
        transform: 'translateX(-50%)',
        zIndex: z.toast,
        padding: '12px 20px',
        borderRadius: 999,
        border: '1px solid rgba(77,155,255,.4)',
        background: 'rgba(10,14,20,.95)',
        color: '#dbe8ff',
        font: `500 13px/1 ${font.sans}`,
        boxShadow: '0 0 30px rgba(30,124,242,.35)',
      }}
    >
      {message}
    </div>
  )
}
