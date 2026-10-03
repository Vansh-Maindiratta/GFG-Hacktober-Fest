import type { Difficulty } from '@/types'

/**
 * OFFICIAL GEEKSTOBER SCORING — single source of truth.
 *
 * Every screen that shows XP (issues, project pages, contribution details,
 * dashboard, leaderboard, admin portal, badges) reads these values through
 * `xpForDifficulty` / `XP_BREAKDOWN`. Never hardcode 10 / 30 / 50 anywhere else.
 */
export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 10,
  medium: 30,
  hard: 50,
}

/** Canonical order used whenever tiers are listed. */
export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

/** XP awarded when a contribution of the given difficulty is merged. */
export function xpForDifficulty(difficulty: Difficulty): number {
  return XP_BY_DIFFICULTY[difficulty]
}

/** Smallest / largest official award — drives "potential XP" displays. */
export const MIN_XP = XP_BY_DIFFICULTY.easy
export const MAX_XP = XP_BY_DIFFICULTY.hard

/** e.g. "+10 Easy" — used by the leaderboard and progress legends. */
export const XP_BREAKDOWN: { difficulty: Difficulty; xp: number }[] = DIFFICULTY_ORDER.map(
  (difficulty) => ({ difficulty, xp: XP_BY_DIFFICULTY[difficulty] }),
)

/** "10–50 XP" — the full official range, formatted once. */
export function formatXpRange(): string {
  return `${MIN_XP}–${MAX_XP} XP`
}
