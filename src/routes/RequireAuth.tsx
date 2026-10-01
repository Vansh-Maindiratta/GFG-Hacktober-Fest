import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Panel'
import { LogoMark } from '@/components/ui/Logo'

/**
 * Route guard.
 *
 * The mock session stands in for GitHub OAuth — the same component will work
 * unchanged once the backend issues real sessions.
 */
export function RequireAuth({
  children,
  role = 'participant',
}: {
  children: React.ReactNode
  role?: 'participant' | 'admin'
}) {
  const { isAuthenticated, role: sessionRole, login } = useAuth()
  const location = useLocation()
  const [pending, setPending] = useState<'participant' | 'admin' | null>(null)

  const authorized = isAuthenticated && (role === 'participant' || sessionRole === 'admin')

  if (!authorized) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-line bg-coal/80 p-8 text-center">
          <LogoMark className="mx-auto" size={48} />
          <h1 className="mt-6 text-2xl font-bold text-ink">
            {role === 'admin' ? 'Admin access required' : 'Sign in to continue'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {role === 'admin'
              ? 'The admin console manages projects, problem statements and scoring. Use a maintainer session to enter.'
              : 'Your dashboard, progress tracker and contributions are tied to your GitHub identity.'}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Button
              fullWidth
              icon={<GithubIcon className="size-4" />}
              loading={pending === (role === 'admin' ? 'admin' : 'participant')}
              onClick={async () => {
                const next = role === 'admin' ? 'admin' : 'participant'
                setPending(next)
                await login(next)
                setPending(null)
              }}
            >
              Continue with GitHub{role === 'admin' ? ' (maintainer)' : ' (demo)'}
            </Button>

            {role === 'admin' ? (
              <Button
                fullWidth
                variant="outline"
                icon={<ShieldCheck className="size-4" aria-hidden />}
                loading={pending === 'participant'}
                onClick={async () => {
                  setPending('participant')
                  await login('participant')
                  setPending(null)
                }}
              >
                Sign in as participant instead
              </Button>
            ) : null}
          </div>

          <p className="mt-6 font-mono text-[11px] leading-relaxed text-dim">
            // TODO: Connect authentication — GitHub OAuth is issued by the backend.
            <br />
            redirected from <span className="text-mint">{location.pathname}</span>
          </p>
        </div>
      </Container>
    )
  }

  return <>{children}</>
}
