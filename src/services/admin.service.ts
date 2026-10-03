import { MOCK_PROJECTS, MOCK_PROBLEM_STATEMENTS } from '@/data/mock/projects'
import { MOCK_USERS } from '@/data/mock/users'
import { MOCK_CONTRIBUTIONS } from '@/data/mock/contributions'
import { xpForDifficulty } from '@/config/scoring'
import type { Contribution, PlatformAnalytics, ProblemStatement, Project, User } from '@/types'
import { api, isBackendConfigured, mockLatency } from './api'

/**
 * Admin CRUD surface.
 *
 * The mock branch mutates an in-memory copy so the interface behaves like the
 * real thing during development. Every call is role-checked server-side once
 * the backend is connected (admin routes reject non-admin sessions).
 */

const projects: Project[] = [...MOCK_PROJECTS]
const problemStatements: ProblemStatement[] = [...MOCK_PROBLEM_STATEMENTS]
const contributions: Contribution[] = [...MOCK_CONTRIBUTIONS]

/* -------------------------------------------------------------- analytics */

function bucketContributionsOverTime(list: Contribution[]): PlatformAnalytics['contributionsOverTime'] {
  const buckets = new Map<string, { contributions: number; xp: number }>()
  for (const item of list) {
    const date = new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    const bucket = buckets.get(date) ?? { contributions: 0, xp: 0 }
    bucket.contributions += 1
    bucket.xp += item.xpAwarded ?? 0
    buckets.set(date, bucket)
  }
  return [...buckets.entries()]
    .sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]))
    .map(([date, values]) => ({ date, ...values }))
}

function xpDistribution(list: User[]): PlatformAnalytics['xpDistribution'] {
  const bands = [
    { range: '0–100', min: 0, max: 100 },
    { range: '101–300', min: 101, max: 300 },
    { range: '301–600', min: 301, max: 600 },
    { range: '601–1000', min: 601, max: 1000 },
    { range: '1001–1500', min: 1001, max: 1500 },
    { range: '1500+', min: 1501, max: Number.POSITIVE_INFINITY },
  ]
  return bands.map((band) => ({
    range: band.range,
    participants: list.filter((user) => user.totalXp >= band.min && user.totalXp <= band.max).length,
  }))
}

/** Analytics derived from the live data layer — never placeholder numbers. */
function deriveAnalytics(): PlatformAnalytics {
  const list = contributions
  const merged = list.filter((item) => item.prStatus === 'merged')

  const activity = new Map<string, { name: string; contributions: number; xp: number }>()
  for (const item of list) {
    const entry = activity.get(item.projectId) ?? { name: item.projectName, contributions: 0, xp: 0 }
    entry.contributions += 1
    entry.xp += item.xpAwarded ?? 0
    activity.set(item.projectId, entry)
  }

  return {
    totalParticipants: MOCK_USERS.length,
    activeContributors: new Set(list.map((item) => item.author.id)).size,
    totalProjects: projects.length,
    openIssues: projects.reduce((sum, project) => sum + project.openIssues, 0),
    pullRequestsSubmitted: list.length,
    pullRequestsMerged: merged.length,
    totalXpAwarded: list.reduce((sum, item) => sum + (item.xpAwarded ?? 0), 0),
    contributionsOverTime: bucketContributionsOverTime(list),
    difficultyDistribution: (['easy', 'medium', 'hard'] as const).map((difficulty) => ({
      difficulty,
      count: list.filter((item) => item.difficulty === difficulty).length,
    })),
    projectActivity: [...activity.values()].sort((a, b) => b.xp - a.xp),
    xpDistribution: xpDistribution(MOCK_USERS),
  }
}

export async function getAnalytics(): Promise<PlatformAnalytics> {
  if (isBackendConfigured()) {
    return api.get<PlatformAnalytics>('/admin/analytics')
  }
  await mockLatency(420)
  return deriveAnalytics()
}

/* ---------------------------------------------------------------- projects */

export async function adminListProjects(): Promise<Project[]> {
  if (isBackendConfigured()) return api.get<Project[]>('/admin/projects')
  await mockLatency(300)
  return [...projects]
}

export async function adminCreateProject(input: Partial<Project>): Promise<Project> {
  if (isBackendConfigured()) return api.post<Project>('/admin/projects', input)
  await mockLatency(400)

  const created: Project = {
    id: `p-${String(projects.length + 1).padStart(3, '0')}`,
    name: input.name ?? 'Untitled project',
    slug: (input.slug ?? input.name ?? 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    tagline: input.tagline ?? '',
    description: input.description ?? '',
    repositoryUrl: input.repositoryUrl ?? '',
    admin: input.admin ?? { name: 'Unassigned', username: 'unassigned', githubUrl: '' },
    technologies: input.technologies ?? [],
    difficulty: input.difficulty ?? 'medium',
    status: input.status ?? 'active',
    category: input.category ?? 'Developer Tools',
    tags: input.tags ?? [],
    featured: input.featured ?? false,
    openIssues: input.openIssues ?? 0,
    slotsAvailable: input.slotsAvailable ?? input.slotsTotal ?? 0,
    slotsTotal: input.slotsTotal ?? 0,
    stars: 0,
    forks: 0,
    createdAt: new Date().toISOString(),
    guidelines: input.guidelines ?? [],
    requirements: input.requirements ?? [],
  }

  projects.unshift(created)
  return created
}

export async function adminUpdateProject(id: string, patch: Partial<Project>): Promise<Project> {
  if (isBackendConfigured()) return api.patch<Project>(`/admin/projects/${id}`, patch)
  await mockLatency(360)
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Project not found')
  projects[index] = { ...projects[index], ...patch }
  return projects[index]
}

/** Deactivate a repository — it disappears from the public registry view. */
export async function adminArchiveProject(id: string): Promise<void> {
  if (isBackendConfigured()) {
    await api.delete(`/admin/projects/${id}`)
    return
  }
  await mockLatency(320)
  const index = projects.findIndex((p) => p.id === id)
  if (index !== -1) projects[index] = { ...projects[index], status: 'archived' }
}

/** Re-activate a previously archived repository. */
export async function adminRestoreProject(id: string): Promise<Project> {
  if (isBackendConfigured()) return api.patch<Project>(`/admin/projects/${id}`, { status: 'active' })
  await mockLatency(300)
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Project not found')
  projects[index] = { ...projects[index], status: 'active' }
  return projects[index]
}

/* ------------------------------------------------------- problem statements */

export async function adminListProblemStatements(projectId?: string): Promise<ProblemStatement[]> {
  if (isBackendConfigured()) {
    return api.get<ProblemStatement[]>('/admin/problem-statements', { projectId })
  }
  await mockLatency(300)
  return problemStatements.filter((ps) => !projectId || ps.projectId === projectId)
}

export async function adminCreateProblemStatement(
  input: Partial<ProblemStatement>,
): Promise<ProblemStatement> {
  if (isBackendConfigured()) return api.post<ProblemStatement>('/admin/problem-statements', input)
  await mockLatency(420)

  const created: ProblemStatement = {
    id: `ps-${String(problemStatements.length + 1).padStart(3, '0')}`,
    projectId: input.projectId ?? projects[0].id,
    title: input.title ?? 'Untitled problem statement',
    description: input.description ?? '',
    githubIssueUrl: input.githubIssueUrl ?? '',
    difficulty: input.difficulty ?? 'medium',
    contributionType: input.contributionType ?? 'bug-fix',
    technology: input.technology ?? 'TypeScript',
    status: input.status ?? 'open',
    deadline: input.deadline,
    requirements: input.requirements ?? [],
  }

  problemStatements.unshift(created)
  return created
}

export async function adminUpdateProblemStatement(
  id: string,
  patch: Partial<ProblemStatement>,
): Promise<ProblemStatement> {
  if (isBackendConfigured()) return api.patch<ProblemStatement>(`/admin/problem-statements/${id}`, patch)
  await mockLatency(340)
  const index = problemStatements.findIndex((ps) => ps.id === id)
  if (index === -1) throw new Error('Problem statement not found')
  problemStatements[index] = { ...problemStatements[index], ...patch }
  return problemStatements[index]
}

export async function adminDeleteProblemStatement(id: string): Promise<void> {
  if (isBackendConfigured()) {
    await api.delete(`/admin/problem-statements/${id}`)
    return
  }
  await mockLatency(300)
  const index = problemStatements.findIndex((ps) => ps.id === id)
  if (index !== -1) problemStatements.splice(index, 1)
}

/* ------------------------------------------------------------ participants */

export async function adminListParticipants(): Promise<User[]> {
  if (isBackendConfigured()) return api.get<User[]>('/admin/participants')
  await mockLatency(300)
  return MOCK_USERS
}

export async function adminListContributions(): Promise<Contribution[]> {
  if (isBackendConfigured()) return api.get<Contribution[]>('/admin/contributions')
  await mockLatency(300)
  return [...contributions]
}

/**
 * Review outcome for a merged PR: award the official XP for its difficulty
 * (Easy 10 / Medium 30 / Difficult 50) or reject it for zero.
 */
export async function adminReviewContribution(
  id: string,
  decision: 'award' | 'reject',
): Promise<Contribution> {
  if (isBackendConfigured()) {
    return api.patch<Contribution>(`/admin/contributions/${id}/review`, { decision })
  }
  await mockLatency(340)
  const index = contributions.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Contribution not found')

  const current = contributions[index]
  contributions[index] =
    decision === 'award'
      ? {
          ...current,
          xpAwarded: xpForDifficulty(current.difficulty),
          prStatus: 'merged',
          reviewStatus: 'approved',
          mergedAt: current.mergedAt ?? new Date().toISOString(),
        }
      : { ...current, xpAwarded: 0, reviewStatus: 'rejected' }

  return contributions[index]
}
