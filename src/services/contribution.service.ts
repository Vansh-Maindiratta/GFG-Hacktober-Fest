import { MOCK_CONTRIBUTIONS, MOCK_PROGRESS } from '@/data/mock/contributions'
import { MOCK_SCORING_CONFIG } from '@/data/mock/scoring'
import { xpForDifficulty } from '@/config/scoring'
import type {
  CalculatorInput,
  CalculatorResult,
  Contribution,
  ContributionProgress,
  ScoringConfig,
} from '@/types'
import { api, isBackendConfigured, mockLatency } from './api'

/**
 * Contributions, progress tracking and scoring.
 * TODO: Connect GET /contributions, GET /users/:id/progress,
 *       GET /scoring and PUT /admin/scoring.
 */

export async function getContributions(filter?: {
  userId?: string
  projectId?: string
  status?: string
}): Promise<Contribution[]> {
  if (isBackendConfigured()) {
    return api.get<Contribution[]>('/contributions', { ...filter })
  }

  await mockLatency()
  let list = [...MOCK_CONTRIBUTIONS]
  if (filter?.userId) list = list.filter((c) => c.author.id === filter.userId)
  if (filter?.projectId) list = list.filter((c) => c.projectId === filter.projectId)
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((c) => c.prStatus === filter.status)
  }
  return list.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))
}

export async function getContributionProgress(userId?: string): Promise<ContributionProgress[]> {
  if (isBackendConfigured()) {
    return api.get<ContributionProgress[]>('/progress', { userId })
  }
  await mockLatency(260)
  return MOCK_PROGRESS
}

export async function getScoringConfig(): Promise<ScoringConfig> {
  if (isBackendConfigured()) {
    return api.get<ScoringConfig>('/scoring')
  }
  await mockLatency(180)
  return MOCK_SCORING_CONFIG
}

export async function saveScoringConfig(config: ScoringConfig): Promise<ScoringConfig> {
  if (isBackendConfigured()) {
    return api.put<ScoringConfig>('/admin/scoring', config)
  }
  // TODO: Connect admin CRUD API — mock persists for the session only.
  await mockLatency(420)
  return { ...config, updatedAt: new Date().toISOString() }
}

const XP_DISCLAIMER =
  'XP is awarded exactly once, on merge — Easy 10, Medium 30, Difficult 50. Final classification comes from the maintainer review.'

/**
 * Official XP for a contribution difficulty.
 * Reads the central scoring config (src/config/scoring.ts) — there is no
 * second copy of the numbers anywhere in the app.
 */
export async function estimateXp(input: CalculatorInput): Promise<CalculatorResult> {
  if (isBackendConfigured()) {
    return api.post<CalculatorResult>('/scoring/estimate', input)
  }

  await mockLatency(160)
  return {
    difficulty: input.difficulty,
    xp: xpForDifficulty(input.difficulty),
    disclaimer: XP_DISCLAIMER,
  }
}
