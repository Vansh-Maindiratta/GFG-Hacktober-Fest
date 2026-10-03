import { Activity, Boxes, GitMerge, Trophy, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminContributions, useAnalytics } from '@/hooks/useAdmin'
import { useScoringConfig } from '@/hooks/useContributions'
import { isBackendConfigured } from '@/services/api'
import { Panel } from '@/components/ui/Panel'
import { Metric } from '@/components/ui/Stat'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/States'
import { DifficultyPill, StatusPill } from '@/components/ui/Pills'
import { relativeTime } from '@/utils/format'
import {
  ContributionsOverTime,
  DifficultyDistribution,
  ProjectActivity,
  XpDistribution,
} from '@/components/charts/AnalyticsCharts'

export default function AdminOverview() {
  const { data, isLoading, isError, refetch } = useAnalytics()
  const { data: contributions = [] } = useAdminContributions()
  const { data: scoring } = useScoringConfig()

  const recent = [...contributions]
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))
    .slice(0, 5)

  if (isError) {
    return <ErrorState title="Unable to load analytics" onRetry={() => void refetch()} />
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-[14px]" />)
        ) : data ? (
          <>
            <Metric label="Total participants" value={data.totalParticipants.toLocaleString('en-US')} delta="registered" icon={<Users className="size-4" />} />
            <Metric label="Active contributors" value={data.activeContributors.toLocaleString('en-US')} delta="with submitted PRs" icon={<Activity className="size-4" />} />
            <Metric label="Total repositories" value={data.totalProjects} delta="in the registry" icon={<Boxes className="size-4" />} />
            <Metric label="Open issues" value={data.openIssues} delta="awaiting PRs" icon={<Zap className="size-4" />} />
            <Metric label="PRs submitted" value={data.pullRequestsSubmitted} delta="all repositories" icon={<Activity className="size-4" />} />
            <Metric label="PRs merged" value={data.pullRequestsMerged} delta={`${Math.round((data.pullRequestsMerged / Math.max(1, data.pullRequestsSubmitted)) * 100)}% merge rate`} icon={<GitMerge className="size-4" />} />
            <Metric label="Total XP awarded" value={data.totalXpAwarded.toLocaleString('en-US')} delta="this festival" icon={<Trophy className="size-4" />} />
            <Metric label="Avg XP / contributor" value={Math.round(data.totalXpAwarded / Math.max(1, data.activeContributors))} delta="across active users" icon={<Zap className="size-4" />} />
          </>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Contributions over time</h2>
            <span className="font-mono text-[11px] text-dim">submitted PRs · XP</span>
          </div>
          {isLoading || !data ? <Skeleton className="h-64" /> : <ContributionsOverTime data={data.contributionsOverTime} />}
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Difficulty distribution</h2>
            <span className="font-mono text-[11px] text-dim">classified contributions</span>
          </div>
          {isLoading || !data ? <Skeleton className="h-64" /> : <DifficultyDistribution data={data.difficultyDistribution} />}
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Project activity</h2>
            <span className="font-mono text-[11px] text-dim">contributions per repository</span>
          </div>
          {isLoading || !data ? <Skeleton className="h-64" /> : <ProjectActivity data={data.projectActivity} />}
        </Panel>

        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">XP distribution</h2>
            <span className="font-mono text-[11px] text-dim">participants per band</span>
          </div>
          {isLoading || !data ? <Skeleton className="h-64" /> : <XpDistribution data={data.xpDistribution} />}
        </Panel>
      </div>

      {/* recent activity */}
      <Panel className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-ink">Recent activity</h2>
          <Link to="/admin/contributions" className="font-mono text-xs text-mint hover:underline">
            review queue →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-dim">No contribution activity yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3">
                <DifficultyPill difficulty={item.difficulty} />
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.title}</span>
                <span className="font-mono text-[11.5px] text-dim">@{item.author.username}</span>
                <span className="font-mono text-[11.5px] text-dim">{relativeTime(item.submittedAt)}</span>
                <span className="font-mono text-xs font-bold tabular text-mint">
                  {item.xpAwarded !== null ? `+${item.xpAwarded} XP` : 'pending'}
                </span>
                <StatusPill status={item.prStatus} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">integration status</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'GitHub App', value: 'mock mode', tone: 'text-amber' },
            { label: 'Webhook receiver', value: 'not connected', tone: 'text-amber' },
            { label: 'Scoring engine', value: `config ${scoring?.version ?? '—'}`, tone: 'text-mint' },
            {
              label: 'API base',
              value: isBackendConfigured() ? 'backend connected' : 'mock data layer',
              tone: isBackendConfigured() ? 'text-mint' : 'text-amber',
            },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-line bg-white/[0.03] p-3">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">{item.label}</p>
              <p className={`mt-1.5 font-mono text-sm ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-dim">
          // charts and counts are computed from live registry, contribution and participant data —
          // they switch to GET /admin/analytics automatically once the backend is configured
        </p>
      </Panel>
    </div>
  )
}
