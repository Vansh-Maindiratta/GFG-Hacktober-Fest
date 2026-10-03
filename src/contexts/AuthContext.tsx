import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  beginGitHubLogin,
  completeGitHubLogin,
  getSession,
  signOut,
} from '@/services/auth.service'
import type { Session } from '@/services/auth.service'
import type { User, UserRole } from '@/types'

/**
 * Application session.
 *
 * `loginWithGitHub()` starts the real GitHub OAuth flow (or the local demo
 * session when no backend is configured), `completeGitHubLogin()` finishes the
 * redirect round-trip, and `logout()` clears the session everywhere.
 */
interface AuthContextValue {
  session: Session | null
  user: User | null
  isAuthenticated: boolean
  role: UserRole | null
  loginWithGitHub: (role?: UserRole) => Promise<void>
  completeLogin: (code: string, state?: string | null) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Session is rehydrated synchronously from storage on first render.
  const [session, setSession] = useState<Session | null>(() => getSession())

  const loginWithGitHub = useCallback(async (role: UserRole = 'participant') => {
    await beginGitHubLogin(role)
    // When OAuth is configured this navigates away; in demo mode the session
    // resolves here and the guard lets the route through.
    setSession(getSession())
  }, [])

  const completeLogin = useCallback(async (code: string, state?: string | null) => {
    const next = await completeGitHubLogin(code, state)
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      role: session?.user.role ?? null,
      loginWithGitHub,
      completeLogin,
      logout,
    }),
    [session, loginWithGitHub, completeLogin, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
