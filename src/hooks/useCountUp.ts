import { useEffect, useState } from 'react'

/**
 * Eases a number up from zero on mount.
 *
 * Used for the points total, which the design animates in so the figure reads
 * as something earned rather than a static label. Respects reduced motion by
 * landing on the target immediately.
 */
export function useCountUp(target: number, durationMs = 1400, reducedMotion = false): number {
  const [value, setValue] = useState(reducedMotion ? target : 0)

  useEffect(() => {
    if (reducedMotion) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs)
      // Cubic ease-out: fast start, gentle settle.
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs, reducedMotion])

  return value
}
