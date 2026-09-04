/**
 * The heading every panel opens with: a numbered kicker, a display title, and
 * usually a sentence of orientation — with an optional aside pinned right.
 *
 * Thirteen call sites across eight panels had this open-coded. Pulling it here
 * means the type ramp (kicker size, tracking, the 52px display face) is stated
 * once, and a tabbed panel's tighter top padding is a flag rather than a
 * remembered magic number.
 */
import type { ReactNode } from 'react'

import { color, font, kicker } from '../../design/tokens'
import { PanelHeader } from '../shell/Panel'

interface PanelHeadingProps {
  /** 1-based panel position, rendered as "01".."08". */
  index: number
  /** The band this panel belongs to: TODAY, PROGRAM, COMMUNITY, YOU. */
  section: string
  title: string
  description?: string
  /** Pinned to the right of the title, baseline-aligned. */
  aside?: ReactNode
  /**
   * Tabbed panels sit under a tab strip and need less room above the kicker.
   */
  underTabs?: boolean
  /** Caps the description so long lines stay readable. */
  descriptionWidth?: number
}

export function PanelHeading({
  index,
  section,
  title,
  description,
  aside,
  underTabs = false,
  descriptionWidth,
}: PanelHeadingProps) {
  return (
    <PanelHeader
      style={{
        padding: underTabs ? '18px 44px 20px' : '36px 44px 20px',
        ...(aside
          ? { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }
          : {}),
      }}
    >
      <div>
        <div style={{ ...kicker(10, '.24em'), color: color.accent, marginBottom: 12 }}>
          {String(index).padStart(2, '0')} · {section}
        </div>
        <h1
          style={{
            margin: 0,
            font: `600 52px/1 ${font.display}`,
            letterSpacing: '-.01em',
            color: color.textBright,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              margin: '10px 0 0',
              font: `400 15px/1.5 ${font.sans}`,
              color: color.textMuted,
              ...(descriptionWidth ? { maxWidth: descriptionWidth, textWrap: 'pretty' } : {}),
            }}
          >
            {description}
          </p>
        )}
      </div>
      {aside}
    </PanelHeader>
  )
}
