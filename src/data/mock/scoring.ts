import { XP_BY_DIFFICULTY } from '@/config/scoring'
import { DIFFICULTY_LABEL } from '@/utils/format'
import type { ScoringConfig } from '@/types'

/**
 * Scoring configuration.
 *
 * XP values are NOT defined here — they come from the central
 * `src/config/scoring.ts` module (Easy 10 / Medium 30 / Difficult 50) so the
 * rules page, calculator, admin editor and dashboard can never drift apart.
 * TODO: Replace with GET /scoring (public) and PUT /admin/scoring (admin).
 */
export const MOCK_SCORING_CONFIG: ScoringConfig = {
  version: 'v2.0',
  updatedAt: '2026-10-12T09:00:00.000Z',
  tiers: [
    {
      difficulty: 'easy',
      label: DIFFICULTY_LABEL.easy,
      xp: XP_BY_DIFFICULTY.easy,
      examples: [
        'Minor README improvement',
        'Documentation correction',
        'Typo or broken link fix',
        'Small CSS or copy change',
        'Simple bug fix with tests',
      ],
    },
    {
      difficulty: 'medium',
      label: DIFFICULTY_LABEL.medium,
      xp: XP_BY_DIFFICULTY.medium,
      examples: [
        'Functional bug fix in application code',
        'New UI component with tests',
        'API integration with error handling',
        'Database or query improvement',
        'Moderate refactor with coverage',
        'Small end-to-end feature',
      ],
    },
    {
      difficulty: 'hard',
      label: DIFFICULTY_LABEL.hard,
      xp: XP_BY_DIFFICULTY.hard,
      examples: [
        'Major feature spanning front end and API',
        'Authentication or authorisation system',
        'Significant performance improvement',
        'Architectural change with migration',
        'Complex algorithm or data structure work',
        'Infrastructure or build pipeline overhaul',
      ],
    },
  ],
  requirements: [
    {
      id: 'merged-pr',
      label: 'Merged pull request',
      description: 'XP is credited only after the maintainer merges the PR into the base branch.',
      mandatory: true,
    },
    {
      id: 'issue-link',
      label: 'Linked issue',
      description: 'The PR must reference the problem statement issue it resolves.',
      mandatory: true,
    },
    {
      id: 'review-pass',
      label: 'Code review passed',
      description: 'Approving review from the project admin or a designated reviewer.',
      mandatory: true,
    },
    {
      id: 'no-spam',
      label: 'No spam or gaming',
      description: 'Whitespace-only commits, reverted changes and self-merged PRs award zero XP.',
      mandatory: true,
    },
    {
      id: 'one-credit',
      label: 'One credit per issue',
      description: 'An issue awards XP once; follow-up fixes on the same issue are collaborative credit.',
      mandatory: true,
    },
    {
      id: 'tests',
      label: 'Tests for behavioural changes',
      description: 'Code that changes behaviour should ship with coverage.',
      mandatory: false,
    },
  ],
}
