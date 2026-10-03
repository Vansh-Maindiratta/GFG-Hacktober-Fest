import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Panel'
import { LogoMark } from '@/components/ui/Logo'
import { PixelScene } from '@/components/hero/PixelScene'

/**
 * Route guard / Login Page.
 *
 * Renders inside the night-scene world with "Continue with GitHub".
 * Keeps the exact existing OAuth logic intact.
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
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-void">
        <PixelScene />
        <Container className="relative z-10 py-16 sm:py-24">
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-coal/90 p-8 text-center backdrop-blur-md shadow-2xl">
            <LogoMark className="mx-auto" size={56} />
            <h1 className="mt-6 font-pixel text-xl sm:text-2xl text-ink">
              {role === 'admin' ? 'ADMIN ACCESS REQUIRED' : 'SIGN IN TO CONTINUE'}
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
                Continue with GitHub{role === 'admin' ? ' (maintainer)' : ''}
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
      </div>
    )
  }

  return <>{children}</>
}
