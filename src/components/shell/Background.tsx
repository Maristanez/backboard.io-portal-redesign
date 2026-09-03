/**
 * The parallax field behind the panels: a fine grid, a soft brand glow, and a
 * vignette. All three drift against the rail at different rates, which is what
 * gives the stage its sense of depth while panels slide.
 */
import { motion } from '../../design/tokens'

interface BackgroundProps {
  gridOffset: number
  glowOffset: number
  /** Transitions are suppressed mid-drag so the parallax tracks the finger. */
  dragging: boolean
}

export function Background({ gridOffset, glowOffset, dragging }: BackgroundProps) {
  const transition = dragging ? 'none' : motion.background

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(120,160,230,.045) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(120,160,230,.045) 1px,transparent 1px)',
          backgroundSize: '96px 96px',
          backgroundPosition: `${gridOffset}px 0`,
          transition,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '60%',
          width: '70vw',
          height: '70vw',
          transform: `translate(-50%,-50%) translateX(${glowOffset}px)`,
          background:
            'radial-gradient(circle,rgba(30,124,242,.11) 0%,rgba(30,124,242,.035) 30%,transparent 62%)',
          pointerEvents: 'none',
          transition,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 110%,transparent 40%,rgba(0,0,0,.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
