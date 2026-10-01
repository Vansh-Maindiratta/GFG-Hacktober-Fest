/** Site-wide configuration. Values are data-driven so nothing is hardcoded in UI. */

import type { EventStats } from '@/types'

export interface NavItem {
  label: string
  to: string
  /** Anchor id when the link points at a section of another page. */
  hash?: string
  auth?: 'participant' | 'admin' | 'any'
}

export const SITE_CONFIG = {
  name: 'GFG Hacktober Fest',
  shortName: 'GFG HBF',
  tagline: 'Code. Contribute. Compete.',
  description:
    'An open-source contribution competition where developers build, fix, contribute and compete.',
  motto: 'Turn open-source contributions into achievements.',
  githubUrl: 'https://github.com/gfg-hacktober-fest',
  discordUrl: 'https://discord.gg/gfg-hacktober-fest',
  instagramUrl: 'https://instagram.com/gfg.hacktoberfest',
  linkedinUrl: 'https://linkedin.com/company/gfg-hacktober-fest',
  email: 'hacktoberfest@gfg.club.edu',
  venue: 'Open Source • Online + Campus Finals',
  dates: 'Oct 01 — Oct 31',
  edition: '2026 Edition',
} as const

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Rules', to: '/rules' },
  { label: 'Badges', to: '/badges' },
  { label: 'About', to: '/about' },
]

/**
 * Event statistics powering the landing page counters.
 * TODO: Replace with GET /stats from the backend.
 */
export const EVENT_STATS: EventStats[] = [
  { id: 'projects', label: 'Projects', value: 12, suffix: '+', hint: 'curated repositories' },
  { id: 'participants', label: 'Participants', value: 250, suffix: '+', hint: 'registered developers' },
  { id: 'issues', label: 'Open Issues', value: 500, suffix: '+', hint: 'ready to be solved' },
  { id: 'contributions', label: 'Potential Contributions', value: 1000, suffix: '+', hint: 'XP opportunities' },
]

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Initiate', minXp: 0 },
  { level: 2, title: 'Committer', minXp: 150 },
  { level: 3, title: 'Contributor', minXp: 400 },
  { level: 4, title: 'Maintainer', minXp: 720 },
  { level: 5, title: 'Reviewer', minXp: 1200 },
  { level: 6, title: 'Architect', minXp: 1800 },
  { level: 7, title: 'Open Source Hero', minXp: 2600 },
] as const
