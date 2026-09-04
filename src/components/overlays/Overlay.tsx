/**
 * Modal shell: backdrop, centring, and dismissal.
 *
 * Clicking the backdrop closes; clicking the body doesn't. Escape is handled
 * globally by the navigation hook, so every layer dismisses the same way.
 */
import { useEffect, useRef, type ReactNode } from 'react'

import { color, shadow, z } from '../../design/tokens'

interface OverlayProps {
  onClose: () => void
  children: ReactNode
  label: string
}

export function Overlay({ onClose, children, label }: OverlayProps) {
  const body = useRef<HTMLDivElement>(null)

  // Move focus into the dialog so keyboard users aren't left behind it.
  useEffect(() => {
    const focusable = body.current?.querySelector<HTMLElement>(
      'input,textarea,button,[href]',
    )
    focusable?.focus()
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(3,5,8,.72)',
        backdropFilter: 'blur(6px)',
        zIndex: z.overlay,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        ref={body}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 520,
          maxWidth: '90vw',
          padding: '30px 32px',
          borderRadius: 14,
          border: '1px solid rgba(77,155,255,.35)',
          background: color.surfaceSolid,
          boxShadow: shadow.float,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** Re-exported so overlay code has one obvious import for its inputs. */
export { fieldStyle as overlayField } from '../ui'
