import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { LogoMark } from '@/components/ui/Logo'

/**
 * Route guard / Sign-in Page.
 *
 * Compact 440px max-width card aligned to the 1560px container right edge.
 * Background artwork scaled ~115% anchored object-[25%_100%] showing developer + laptop + cat on lower-left.
 * Keeps all existing authentication & maintainer demo login logic intact.
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
      <div className="relative flex min-h-[calc(100vh-80px)] w-full items-center overflow-hidden bg-[#050B14] py-8 px-4 sm:px-6">
        {/* ── Background Artwork: ~115% scale anchored object-[25%_100%] ── */}
        <picture className="pointer-events-none absolute inset-0 block h-full w-full select-none">
          <source media="(max-width: 1280px)" srcSet="/hero-bg-mobile.webp" />
          <img
            src="/hero-bg.webp"
            alt=""
            aria-hidden="true"
            width={1812}
            height={868}
            className="h-full w-full object-cover object-[25%_100%] scale-115 transform-gpu [image-rendering:pixelated]"
            style={{ transformOrigin: 'left bottom' }}
          />
        </picture>

        {/* ── Dark Gradient Overlays for Readability ── */}
        {/* Darker on the right behind the card, transparent on left over developer */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_left,rgba(5,11,20,0.92)_0%,rgba(5,11,20,0.70)_50%,transparent_100%)] lg:bg-[linear-gradient(to_left,rgba(5,11,20,0.90)_0%,rgba(5,11,20,0.60)_45%,transparent_85%)]" />
        {/* Top gradient for floating navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050B14]/90 via-[#050B14]/40 to-transparent" />
        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050B14] via-[#050B14]/50 to-transparent" />

        {/* ── Optional upper-left pixel text over sky ── */}
        <div className="pointer-events-none absolute left-[4%] top-24 z-10 hidden select-none lg:block">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-[#2EE59D]/75">
            Contribute. Earn XP. Climb the leaderboard.
          </p>
        </div>

        {/* ── Centered Container aligned with 1560px Navbar width ── */}
        <div className="relative z-10 mx-auto flex w-[92%] max-w-[1560px] justify-center lg:justify-end">
          {/* Card: max-w 440px, padding 28px */}
          <div className="w-full max-w-[440px] rounded-2xl border border-line-strong bg-[#08121C]/94 p-7 text-center backdrop-blur-xl shadow-[0_30px_90px_-30px_rgba(0,255,157,0.22)]">
            {/* Logo Mark Tile (~56px) */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-mint/40 bg-mint/10 p-3 shadow-[0_0_20px_-5px_rgba(0,255,157,0.3)]">
              <LogoMark size={32} />
            </div>

            {/* Eyebrow label */}
            <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-mint">
              // OPEN SOURCE CONTRIBUTION
            </p>

            {/* Pixel Title (~30px) */}
            <h1 className="mt-1.5 font-pixel text-2xl sm:text-[28px] font-bold tracking-wider">
              <span className="text-ink">GEEK</span>
              <span className="text-mint">STOBER</span>
            </h1>

            {/* Subheading (13-14px) */}
            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
              {role === 'admin'
                ? 'The admin console manages projects, problem statements and scoring. Sign in with a maintainer session to enter.'
                : 'Sign in to claim issues, track merged PRs and climb the leaderboard.'}
            </p>

            {/* Action Buttons (48px tall, 12px gaps) */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                fullWidth
                size="md"
                className="h-12 text-sm font-semibold"
                icon={<GithubIcon className="size-4" />}
                loading={pending === 'participant'}
                onClick={async () => {
                  setPending('participant')
                  await login('participant')
                  setPending(null)
                }}
              >
                Continue with GitHub
              </Button>

              <Button
                fullWidth
                size="md"
                variant="outline"
                className="h-12 text-sm font-semibold"
                icon={<ShieldCheck className="size-4" aria-hidden />}
                loading={pending === 'admin'}
                onClick={async () => {
                  setPending('admin')
                  await login('admin')
                  setPending(null)
                }}
              >
                Sign in as maintainer (demo)
              </Button>

              <Link
                to="/"
                className="mt-0.5 font-mono text-xs text-muted transition hover:text-mint"
              >
                Continue as visitor
              </Link>
            </div>

            {/* Divider (16px margins) */}
            <div className="my-4 border-t border-line/60" />

            {/* Feature Bullets (13-14px text) */}
            <div className="space-y-2.5 text-left">
              <div className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-mint" aria-hidden />
                <span>
                  Earn XP for merged PRs — the official <strong className="font-semibold text-ink">Geekstober</strong> table
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-mint" aria-hidden />
                <span>Your dashboard, progress tracker and badge showcase</span>
              </div>
            </div>

            {/* Redirect note */}
            <p className="mt-4 font-mono text-[10px] leading-relaxed text-dim">
              redirected from <span className="text-mint">{location.pathname}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
