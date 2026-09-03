/**
 * One panel card on the stage.
 *
 * Owns the shared chrome — positioning, the coverflow transform, the giant
 * name overlay that fades in as the panel loses focus, and the bottom scrim —
 * so each panel's own component is just its content.
 */
import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'

import type { PanelGeometry, StageLayout } from '../../coverflow/geometry'
import { color, font, motion, z } from '../../design/tokens'

interface PanelProps {
  name: string
  /** 1-based position, rendered as the overlay's "01".. label. */
  position: number
  geometry: PanelGeometry
  layout: StageLayout
  focused: boolean
  dragging: boolean
  /** Restarts the content's entrance animation; alternates to retrigger it. */
  animationKey: number
  reducedMotion: boolean
  onFocus: () => void
  children?: ReactNode
}

export function Panel({
  name,
  position,
  geometry,
  layout,
  focused,
  dragging,
  animationKey,
  reducedMotion,
  onFocus,
  children,
}: PanelProps) {
  const entrance =
    focused && !reducedMotion
      ? `bbEnter${animationKey % 2 ? 'A' : 'B'} .75s ${motion.ease} both`
      : 'none'

  return (
    <section
      aria-label={name}
      aria-hidden={geometry.opacity === 0}
      onClick={onFocus}
      style={{
        position: 'absolute',
        top: layout.panelTop,
        bottom: layout.panelBottom,
        left: layout.panelLeft,
        width: layout.panelWidth,
        transform: geometry.transform,
        opacity: geometry.opacity,
        zIndex: geometry.zIndex,
        transition: dragging ? 'none' : motion.panel,
        display: 'flex',
        flexDirection: 'column',
        background: layout.cardBackground,
        border: layout.cardBorder,
        borderRadius: layout.cardRadius,
        backdropFilter: 'blur(18px)',
        boxShadow: geometry.boxShadow,
        overflow: 'hidden',
        // Unfocused panels are decoration; don't let them swallow clicks meant
        // for the stage, but keep them clickable to bring into focus.
        cursor: focused ? 'default' : 'pointer',
      }}
    >
      {/* Name overlay — fades in as the panel drifts off-centre. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: z.panelLabel,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          background: 'rgba(6,8,12,.62)',
          opacity: geometry.labelOpacity,
          transition: 'opacity .5s',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }}
      >
        <span
          style={{
            font: `500 12px/1 ${font.mono}`,
            letterSpacing: '.3em',
            color: color.accent,
          }}
        >
          {String(position).padStart(2, '0')}
        </span>
        <span
          style={{
            font: `600 clamp(40px,5.5vw,110px)/1 ${font.display}`,
            letterSpacing: '.02em',
            textTransform: 'uppercase',
            color: 'rgba(235,241,250,.9)',
            textAlign: 'center',
          }}
        >
          {name}
        </span>
        <span
          style={{
            font: `500 11px/1 ${font.mono}`,
            letterSpacing: '.2em',
            color: color.textFaint,
          }}
        >
          CLICK OR SWIPE
        </span>
      </div>

      <PanelEntranceContext.Provider value={entrance}>{children}</PanelEntranceContext.Provider>

      {/* Bottom scrim, so scrolled content fades out rather than clipping. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 44,
          background: 'linear-gradient(0deg,rgba(11,15,22,.95),rgba(11,15,22,0))',
          pointerEvents: 'none',
          zIndex: 4,
          borderRadius: `0 0 ${layout.cardRadius} ${layout.cardRadius}`,
        }}
      />
    </section>
  )
}

/**
 * The entrance animation for the focused panel's body.
 *
 * Panels differ too much to share a body wrapper, so the animation is passed
 * down rather than applied by `Panel` itself.
 */
const PanelEntranceContext = createContext('none')

/** Header strip at the top of a panel, above the scrollable body. */
export function PanelHeader({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        padding: '36px 44px 20px',
        borderBottom: '1px solid rgba(140,170,220,.08)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Scrollable body of a panel. Carries the focused panel's entrance animation. */
export function PanelBody({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  const animation = useContext(PanelEntranceContext)

  return (
    <div
      style={{
        animation,
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '28px 44px 36px',
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
