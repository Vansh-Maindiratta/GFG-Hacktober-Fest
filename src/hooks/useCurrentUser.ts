import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { getCurrentUser } from '@/services/user.service'

/**
 * Resolves the participant the workspace belongs to.
 * Backed by the GitHub OAuth session; falls back to the demo participant only
 * for public previews (landing page, badge catalogue) while signed out.
 */
export function useCurrentUser() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['current-user', user?.id ?? 'demo'],
    queryFn: getCurrentUser,
    initialData: user ?? undefined,
    staleTime: 60_000,
  })
}
