/**
 * Previous/next arrows pinned to the stage edges.
 *
 * The rail is primarily a gesture surface, so these exist for anyone who isn't
 * going to discover the swipe — they fade out rather than disappear at the ends
 * so the control doesn't jump around.
 */
import { border, color, z } from '../../design/tokens'
import { ChevronIcon } from './icons'

interface EdgeArrowsProps {
  index: number
  panelCount: number
  onStep: (by: number) => void
}

export function EdgeArrows({ index, panelCount, onStep }: EdgeArrowsProps) {
  const atStart = index === 0
  const atEnd = index === panelCount - 1

  return (
    <>
      <button
        className="bb-arrow"
        onClick={() => onStep(-1)}
        title="Previous panel"
        aria-label="Previous panel"
        disabled={atStart}
        style={{ ...arrowStyle, left: 18, opacity: atStart ? 0 : 1 }}
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        className="bb-arrow"
        onClick={() => onStep(1)}
        title="Next panel"
        aria-label="Next panel"
        disabled={atEnd}
        style={{ ...arrowStyle, right: 18, opacity: atEnd ? 0 : 1 }}
      >
        <ChevronIcon direction="right" />
      </button>
    </>
  )
}

const arrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: z.edgeArrow,
  width: 52,
  height: 52,
  borderRadius: '50%',
  border: `1px solid ${border.strong}`,
  background: 'rgba(10,14,20,.7)',
  backdropFilter: 'blur(10px)',
  color: color.textSoft,
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
} as const
