import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { CodeRain } from '@/components/hero/CodeRain'
import { GitBranchVisual } from '@/components/github/GitBranchVisual'
import { RepoChip } from '@/components/github/RepoChip'
import { TerminalWindow } from '@/components/github/TerminalWindow'
import { SITE_CONFIG } from '@/config/site'

const TERMINAL_LINES = [
  { kind: 'command', text: 'git checkout -b fix/webhook-retry' },
  { kind: 'output', text: 'Switched to a new branch' },
  { kind: 'command', text: 'pnpm test --filter codeflow' },
  { kind: 'success', text: '42 passed · 0 failed' },
  { kind: 'command', text: 'gh pr create --fill' },
  { kind: 'accent', text: 'PR #419 opened → review requested' },
  { kind: 'success', text: 'merged by @aarav-dev → +45 XP' },
] as const

/**
 * Landing hero — communicates the event in under five seconds:
 * open-source competition where merged contributions earn XP.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      <CodeRain />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8">
        {/* copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-mint"
          >
            <span className="size-1.5 animate-pulse-soft rounded-full bg-brand-bright" aria-hidden />
            {SITE_CONFIG.name} · {SITE_CONFIG.dates}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[13vw] font-extrabold uppercase leading-[0.86] tracking-[-0.04em] text-ink sm:text-6xl lg:text-[5.2rem]"
          >
            Code.
            <br />
            <span className="text-brand-bright">Contribute.</span>
            <br />
            Compete.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-mint sm:text-xl"
          >
            Turn open-source contributions into achievements.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-3 max-w-xl text-base leading-relaxed text-muted"
          >
            Work inside real repositories. Fix bugs, ship features, improve documentation and
            performance — every merged pull request earns XP and moves you up the leaderboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink to="/projects" size="lg"              icon={<GithubIcon className="size-4" />}>
              Explore Projects
            </ButtonLink>
            <ButtonLink
              to="/how-it-works"
              size="lg"
              variant="secondary"
              icon={<Play className="size-4" aria-hidden />}
              trailing={<ArrowRight className="size-4" aria-hidden />}
            >
              Start Contributing
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.44 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6"
          >
            {[
              { dt: 'Repositories', dd: '12' },
              { dt: 'Open issues', dd: '277' },
              { dt: 'XP available', dd: '40k+' },
            ].map((item) => (
              <div key={item.dt}>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim">{item.dt}</dt>
                <dd className="mt-1 font-mono text-2xl font-bold tabular text-ink">{item.dd}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* visual stack */}
        <div className="relative">
          <div className="relative mx-auto max-w-xl">
            <div className="relative">
              <div className="rounded-2xl border border-line bg-coal/70 p-4 backdrop-blur-sm sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
                    contribution graph
                  </span>
                  <span className="font-mono text-[11px] text-brand-bright">main ← feature</span>
                </div>
                <GitBranchVisual />
              </div>

              <RepoChip
                name="gfg/codeflow"
                stars={1284}
                forks={316}
                language="TypeScript"
                delay={0.5}
                className="absolute -left-4 top-8 z-10 hidden sm:block lg:-left-12"
              />
              <RepoChip
                name="gfg/pixelpilot"
                stars={1760}
                forks={231}
                language="React"
                delay={0.9}
                className="absolute -right-4 top-28 z-10 hidden sm:block lg:-right-10"
              />
              <RepoChip
                name="gfg/patchsense"
                stars={2140}
                forks={402}
                language="TypeScript"
                delay={1.2}
                className="absolute -bottom-6 right-6 z-10 hidden sm:block"
              />
            </div>

            <TerminalWindow
              lines={[...TERMINAL_LINES]}
              typed
              className="mt-8 shadow-[0_36px_70px_-45px_rgb(34_197_94_/_0.75)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
