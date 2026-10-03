import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle, Loader2, LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { useAuth } from '@/contexts/AuthContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { isGitHubOAuthConfigured } from '@/services/auth.service'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Panel'
import { LogoMark } from '@/components/ui/Logo'
import { XP_BREAKDOWN } from '@/config/scoring'
import { SITE_CONFIG } from '@/config/site'
import { DIFFICULTY_LABEL } from '@/utils/format'

const NEXT_STORAGE_KEY = 'geekstober.login.next'

/** Only internal paths may be used as a post-login redirect target. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw
  return '/dashboard'
}

/**
 * Geekstober authentication portal.
 * One provider — GitHub — styled exactly like the rest of the portal.
 */
export default function Login() {
  useDocumentTitle('Sign in')
  const [params] = useSearchParams()
  const { isAuthenticated, role, user, loginWithGitHub, logout } = useAuth()
  const [pending, setPending] = useState<'participant' | 'admin' | null>(null)

  const next = safeNext(params.get('next'))
  const oauthError = params.get('error')
  const oauthConfigured = isGitHubOAuthConfigured()
  const wantsAdmin = next.startsWith('/admin')

  const start = async (role: 'participant' | 'admin') => {
    try {
      setPending(role)
      // Remember where the user was headed so the OAuth redirect can return
      // them there (GitHub only echoes `state` back to the callback route).
      sessionStorage.setItem(NEXT_STORAGE_KEY, next)
      await loginWithGitHub(role)
    } finally {
      setPending(null)
    }
  }

  // Only follow `next` when the session is actually allowed there — otherwise
  // the guard and this page would bounce authenticated users in a loop.
  const authorized = isAuthenticated && (!wantsAdmin || role === 'admin')
  if (authorized) return <Navigate to={next} replace />

  // Signed in, but the destination needs a different role (e.g. an admin
  // route reached with a participant session).
  if (isAuthenticated) {
    return (
      <section className="relative overflow-hidden border-b border-line bg-pitch/60 py-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container size="narrow" className="relative">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-line-strong bg-coal/85 p-7 text-center shadow-2xl sm:p-9">
            <LogoMark size={48} />
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.32em] text-brand-bright/80">
              {'//'} admin access required
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white">Admin portal</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              You&apos;re signed in as{' '}
              <span className="font-mono text-mint">@{user?.username}</span> ({role}) — this account
              can&apos;t open the Geekstober admin console. Switch to a maintainer session to continue.
            </p>

            <div className="mt-7 space-y-3">
              {!oauthConfigured ? (
                <Button
                  fullWidth
                  size="lg"
                  icon={pending === 'admin' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ShieldCheck className="size-4" aria-hidden />}
                  loading={pending === 'admin'}
                  onClick={() => void start('admin')}
                >
                  Sign in as maintainer (demo)
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  icon={pending === 'participant' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <GithubIcon className="size-5" />}
                  loading={pending === 'participant'}
                  onClick={() => void start('participant')}
                >
                  Re-authenticate with GitHub
                </Button>
              )}
              <Button
                fullWidth
                variant="outline"
                icon={<LogOut className="size-4" aria-hidden />}
                onClick={async () => {
                  await logout()
                }}
              >
                Sign out of @{user?.username}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border-b border-line bg-pitch/60 py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[46rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />

      <Container size="narrow" className="relative">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-line-strong bg-coal/85 p-7 shadow-2xl sm:p-9">
          {/* identity */}
          <div className="flex flex-col items-center text-center">
            <LogoMark size={52} />
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.32em] text-brand-bright/80">
              {'//'} open source contribution
            </p>
            <h1
              className="mt-3 text-3xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              GEEK<span className="text-mint">STOBER</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to claim issues, track merged PRs and climb the leaderboard.
            </p>
          </div>

          {/* error */}
          {oauthError ? (
            <p
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-lg border border-rose/40 bg-rose/10 px-3.5 py-3 text-sm text-rose"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                GitHub sign-in didn&apos;t complete
                {oauthError === 'access_denied' ? ' — you cancelled the request.' : ` (${oauthError}).`}
                {' '}Please try again.
              </span>
            </p>
          ) : null}

          {/* action */}
          <div className="mt-7 space-y-3">
            <Button
              fullWidth
              size="lg"
              icon={
                pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <GithubIcon className="size-5" />
                )
              }
              loading={pending === 'participant'}
              onClick={() => void start('participant')}
            >
              Continue with GitHub
            </Button>

            {wantsAdmin && !oauthConfigured ? (
              <Button
                fullWidth
                variant="outline"
                icon={<ShieldCheck className="size-4" aria-hidden />}
                loading={pending === 'admin'}
                onClick={() => void start('admin')}
              >
                Sign in as maintainer (demo)
              </Button>
            ) : null}

            <ButtonLink
              to={next === '/dashboard' ? '/projects' : next}
              variant="ghost"
              className="w-full"
            >
              Continue as visitor
            </ButtonLink>
          </div>

          {/* what you get */}
          <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
            {[
              { icon: Sparkles, text: 'Earn XP for merged PRs — the official Geekstober table' },
              { icon: ShieldCheck, text: 'Your dashboard, progress tracker and badge unlocks' },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2.5 text-sm text-muted">
                <item.icon className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden />
                {item.text}
              </li>
            ))}
            <li className="flex flex-wrap items-center gap-2 pt-1">
              {XP_BREAKDOWN.map((entry) => (
                <span
                  key={entry.difficulty}
                  className="rounded-md border border-line bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  +{entry.xp}{' '}
                  <span className="text-dim">{DIFFICULTY_LABEL[entry.difficulty]}</span>
                </span>
              ))}
            </li>
          </ul>

          {/* mode notice */}
          <p className="mt-6 rounded-lg border border-line bg-white/[0.02] px-3.5 py-3 font-mono text-[11px] leading-relaxed text-dim">
            {oauthConfigured ? (
              <>
                secured by <span className="text-mint">GitHub OAuth</span> — {SITE_CONFIG.name} never sees your
                password.
              </>
            ) : (
              <>
                demo mode — set <span className="text-mint">VITE_API_BASE_URL</span> and{' '}
                <span className="text-mint">VITE_GITHUB_CLIENT_ID</span> to activate real GitHub sign-in.
              </>
            )}
          </p>

          <p className="mt-5 text-center font-mono text-[11px] text-dim">
            no account needed — your GitHub identity is your profile ·{' '}
            <Link to="/rules" className="text-mint hover:underline">
              how scoring works
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
