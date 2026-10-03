import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminArchiveProject,
  adminCreateProject,
  adminCreateProblemStatement,
  adminDeleteProblemStatement,
  adminListContributions,
  adminListParticipants,
  adminListProblemStatements,
  adminListProjects,
  adminRestoreProject,
  adminReviewContribution,
  adminUpdateProblemStatement,
  adminUpdateProject,
  getAnalytics,
} from '@/services/admin.service'
import type { ProblemStatement, Project } from '@/types'

/** Admin dashboard queries. */

export function useAnalytics() {
  return useQuery({ queryKey: ['admin', 'analytics'], queryFn: getAnalytics })
}

export function useAdminProjects() {
  return useQuery({ queryKey: ['admin', 'projects'], queryFn: adminListProjects })
}

export function useAdminProblemStatements(projectId?: string) {
  return useQuery({
    queryKey: ['admin', 'problem-statements', projectId ?? 'all'],
    queryFn: () => adminListProblemStatements(projectId),
  })
}

export function useAdminParticipants() {
  return useQuery({ queryKey: ['admin', 'participants'], queryFn: adminListParticipants })
}

export function useAdminContributions() {
  return useQuery({ queryKey: ['admin', 'contributions'], queryFn: adminListContributions })
}

export function useProjectMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    void queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  return {
    create: useMutation({
      mutationFn: (input: Partial<Project>) => adminCreateProject(input),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Project> }) => adminUpdateProject(id, patch),
      onSuccess: invalidate,
    }),
    archive: useMutation({
      mutationFn: (id: string) => adminArchiveProject(id),
      onSuccess: invalidate,
    }),
    restore: useMutation({
      mutationFn: (id: string) => adminRestoreProject(id),
      onSuccess: invalidate,
    }),
  }
}

export function useContributionReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: 'award' | 'reject' }) =>
      adminReviewContribution(id, decision),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'contributions'] })
      void queryClient.invalidateQueries({ queryKey: ['contributions'] })
      void queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] })
    },
  })
}

export function useProblemStatementMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'problem-statements'] })
    void queryClient.invalidateQueries({ queryKey: ['problem-statements'] })
  }

  return {
    create: useMutation({
      mutationFn: (input: Partial<ProblemStatement>) => adminCreateProblemStatement(input),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<ProblemStatement> }) =>
        adminUpdateProblemStatement(id, patch),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) => adminDeleteProblemStatement(id),
      onSuccess: invalidate,
    }),
  }
}
