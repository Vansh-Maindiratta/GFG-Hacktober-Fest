/**
 * Session persistence, kept in its own module so both the auth service and the
 * HTTP gateway can read the token without importing each other.
 *
 * The stored session mirrors what the backend issues after GitHub OAuth:
 * `{ user, provider, accessToken }`.
 */

export interface StoredSession {
  user: import('@/types').User
  provider: 'github' | 'demo'
  accessToken?: string
}

const STORAGE_KEY = 'geekstober.session'
const OAUTH_STATE_KEY = 'geekstober.oauth.state'

function loadStored(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

let memorySession: StoredSession | null = loadStored()

export function getSession(): StoredSession | null {
  return memorySession
}

export function setSession(session: StoredSession | null): void {
  memorySession = session
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable (private mode) — session stays in memory */
  }
}

/** Bearer token attached to every API request when a session exists. */
export function getAccessToken(): string | undefined {
  return memorySession?.accessToken
}

/* --------------------------------------------------------- OAuth CSRF state */

export function createOAuthState(): string {
  const state = crypto.randomUUID()
  try {
    sessionStorage.setItem(OAUTH_STATE_KEY, state)
  } catch {
    /* sessionStorage unavailable — state check degrades gracefully */
  }
  return state
}

export function consumeOAuthState(state?: string | null): boolean {
  if (!state) return false
  try {
    const expected = sessionStorage.getItem(OAUTH_STATE_KEY)
    sessionStorage.removeItem(OAUTH_STATE_KEY)
    return expected === state
  } catch {
    return true
  }
}
