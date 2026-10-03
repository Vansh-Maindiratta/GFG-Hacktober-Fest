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
 * Uses the BG.png artwork cropped at ~140% scale anchored left-bottom,
 * placing the developer and cat on the left with the sign-in card on the right.
 * Keeps existing OAuth login logic intact.
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
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#050B14] px-4 py-12 sm:px-6 lg:justify-end lg:px-16 xl:px-24">
        {/* ── Background Artwork: ~140% zoom anchored left-bottom ── */}
        <picture className="pointer-events-none absolute inset-0 block h-full w-full select-none">
          <source media="(max-width: 1280px)" srcSet="/hero-bg-mobile.webp" />
          <img
            src="/hero-bg.webp"
            alt=""
            aria-hidden="true"
            width={1812}
            height={868}
            className="h-full w-full object-cover object-[15%_bottom] scale-140 transform-gpu [image-rendering:pixelated]"
            style={{ transformOrigin: 'left bottom' }}
          />
        </picture>

        {/* ── Gradient Overlays for Readability ── */}
        {/* Left-to-right gradient: lighter over developer on left, darker behind card on right */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050B14]/40 via-[#050B14]/75 to-[#050B14]/95 lg:from-[#050B14]/25 lg:via-[#050B14]/65 lg:to-[#050B14]/92" />
        {/* Top gradient for floating navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050B14]/90 via-[#050B14]/40 to-transparent" />
        {/* Bottom gradient fade into page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050B14] via-[#050B14]/60 to-transparent" />

        {/* ── Sign-in Card (Centered on mobile, right-aligned on desktop) ── */}
        <div className="relative z-10 w-full max-w-[440px]">
          <div className="rounded-2xl border border-line-strong bg-[#08121C]/92 p-8 text-center backdrop-blur-xl shadow-[0_30px_90px_-30px_rgba(0,255,157,0.2)]">
            {/* Logo Mark */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-mint/40 bg-mint/10 p-3 shadow-[0_0_20px_-5px_rgba(0,255,157,0.3)]">
              <LogoMark size={32} />
            </div>

            {/* Eyebrow */}
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.28em] text-mint">
              // OPEN SOURCE CONTRIBUTION
            </p>

            {/* Pixel Title */}
            <h1 className="mt-2.5 font-pixel text-2xl sm:text-3xl font-bold tracking-wider">
              <span className="text-ink">GEEK</span>
              <span className="text-mint">STOBER</span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-muted">
              {role === 'admin'
                ? 'The admin console manages projects, problem statements and scoring. Sign in with a maintainer session to enter.'
                : 'Sign in to claim issues, track merged PRs and climb the leaderboard.'}
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col gap-3">
              <Button
                fullWidth
                size="lg"
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
                size="lg"
                variant="outline"
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
                className="mt-1 text-xs font-mono text-muted transition hover:text-mint"
              >
                Continue as visitor
              </Link>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-line/60" />

            {/* Feature Bullets */}
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3 text-xs leading-relaxed text-muted">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                <span>
                  Earn XP for merged PRs — the official <strong className="font-semibold text-ink">Geekstober</strong> table
                </span>
              </div>
              <div className="flex items-start gap-3 text-xs leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                <span>Your dashboard, progress tracker and badge showcase</span>
              </div>
            </div>

            <p className="mt-6 font-mono text-[10.5px] leading-relaxed text-dim">
              redirected from <span className="text-mint">{location.pathname}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
