/** Command palette search. */
import type { PaletteTarget } from '../domain/types'

/**
 * Palette entries matching a query.
 *
 * Matches label *and* hint, which is what lets you find a panel by what it does
 * ("ranking" → Leaderboard) rather than only by its name. Order is preserved
 * rather than scored, so the list doesn't reshuffle under the cursor as you
 * type — the first result stays predictable, and Enter takes it.
 */
export function filterPaletteTargets(
  targets: readonly PaletteTarget[],
  query: string,
): PaletteTarget[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return [...targets]

  return targets.filter(
    (target) =>
      target.label.toLowerCase().includes(needle) ||
      target.hint.toLowerCase().includes(needle),
  )
}
