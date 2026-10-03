import { CURRENT_USER_ID, MOCK_ADMINS, MOCK_USERS } from '@/data/mock/users'
import type { UserRole } from '@/types'
import { api, isBackendConfigured, mockLatency } from './api'
import {
  consumeOAuthState,
  createOAuthState,
  getSession,
  setSession,
} from './session'
import type { StoredSession } from './session'

/**
 * Authentication.
 *
 * Primary path — real GitHub OAuth:
 *   1. `beginGitHubLogin()` redirects to GitHub's authorize endpoint.
 *   2. GitHub redirects back to /auth/github/callback?code=...&state=...
 *   3. `completeGitHubLogin()` exchanges the code with the backend, which
 *      verifies identity and role (participant / admin) and issues a session.
 *
 * Fallback path — no backend configured: a local demo session keeps the full
 * UI flow (protected routes, role gating, logout) exercisable offline.
 *
 * Secrets never reach the frontend: only the public client id is exposed via
 * VITE_GITHUB_CLIENT_ID; the client secret stays on the backend.
 */

export type Session = StoredSession

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

function githubClientId(): string {
  return (import.meta.env.VITE_GITHUB_CLIENT_ID ?? '').trim()
}

/** True when the full GitHub OAuth round-trip can run. */
export function isGitHubOAuthConfigured(): boolean {
  return isBackendConfigured() && githubClientId().length > 0
}

function redirectUri(): string {
  return `${window.location.origin}/auth/github/callback`
}

/**
 * Start login. Redirects to GitHub when OAuth is configured, otherwise
 * resolves with a local demo session (participant by default, or the demo
 * maintainer when an admin route was the original destination).
 */
export async function beginGitHubLogin(role: UserRole = 'participant'): Promise<void> {
  if (isGitHubOAuthConfigured()) {
    const params = new URLSearchParams({
      client_id: githubClientId(),
      redirect_uri: redirectUri(),
      scope: 'read:user',
      state: createOAuthState(),
    })
    window.location.assign(`${GITHUB_AUTHORIZE_URL}?${params.toString()}`)
    return // navigation takes over
  }

  await signInDemo(role)
}

/** Exchange the OAuth code for a backend-issued session. */
export async function completeGitHubLogin(code: string, state?: string | null): Promise<Session> {
  const session = await api.post<Session>('/auth/github/callback', {
    code,
    state,
    redirectUri: redirectUri(),
  })
  setSession(session)
  return session
}

/** Local demo session used when no backend/OAuth client is configured. */
export async function signInDemo(role: UserRole = 'participant'): Promise<Session> {
  await mockLatency(520)
  const user =
    role === 'admin'
      ? MOCK_ADMINS[0]
      : (MOCK_USERS.find((u) => u.id === CURRENT_USER_ID) ?? MOCK_USERS[0])

  const session: Session = { user, provider: 'demo' }
  setSession(session)
  return session
}

export async function signOut(): Promise<void> {
  if (isBackendConfigured()) {
    await api.post('/auth/logout').catch(() => undefined)
  }
  setSession(null)
}

/** Validates the OAuth CSRF state returned by GitHub on the callback route. */
export function verifyOAuthState(state?: string | null): boolean {
  return consumeOAuthState(state)
}

export { getSession }
