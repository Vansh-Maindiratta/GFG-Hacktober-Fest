import { useMemo, useState } from 'react'
import { Calculator, Info } from 'lucide-react'
import { useScoringConfig, useXpEstimate } from '@/hooks/useContributions'
import { Panel } from '@/components/ui/Panel'
import { Field, Select } from '@/components/ui/Field'
import { Skeleton } from '@/components/ui/Skeleton'
import { DIFFICULTY_LABEL } from '@/utils/format'
import { xpForDifficulty } from '@/config/scoring'
import { cn } from '@/utils/cn'
import type { CalculatorInput, Difficulty } from '@/types'

/**
 * Official XP calculator.
 * Difficulty is the only input — Geekstober scoring is fixed
 * (Easy 10 / Medium 30 / Difficult 50) and read from the central config.
 */
export function PointsCalculator() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  const { data: config, isLoading: loadingConfig } = useScoringConfig()

  const input = useMemo<CalculatorInput>(() => ({ difficulty }), [difficulty])
  const { data: estimate, isLoading: estimating } = useXpEstimate(input, true)

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
        <span className="grid size-9 place-items-center rounded-lg border border-brand/40 bg-brand/12 text-brand-bright">
          <Calculator className="size-4" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-bold text-ink">Points calculator</h3>
          <p className="font-mono text-[11px] text-dim">official Geekstober values · awarded once, on merge</p>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Field label="Difficulty of the contribution" htmlFor="calc-difficulty" hint="As classified by the maintainer at review.">
            <Select
              id="calc-difficulty"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
            >
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <option key={level} value={level}>
                  {DIFFICULTY_LABEL[level]} — {xpForDifficulty(level)} XP
                </option>
              ))}
            </Select>
          </Field>

          <div className="overflow-hidden rounded-xl border border-line">
            {(config?.tiers ?? []).map((tier) => (
              <div
                key={tier.difficulty}
                className={cn(
                  'flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0 transition',
                  tier.difficulty === difficulty ? 'bg-brand/[0.09]' : 'bg-white/[0.02]',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-xs font-semibold uppercase tracking-[0.16em]',
                    tier.difficulty === difficulty ? 'text-mint' : 'text-muted',
                  )}
                >
                  {tier.label}
                </span>
                <span
                  className={cn(
                    'font-mono text-sm font-bold tabular',
                    tier.difficulty === difficulty ? 'text-mint' : 'text-dim',
                  )}
                >
                  +{tier.xp} XP
                </span>
              </div>
            ))}
            {!config && !loadingConfig ? (
              <div className="space-y-2 bg-white/[0.02] p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : null}
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-dim">
            // contribution type, impact and code volume never change the number — only the classified tier does
          </p>
        </div>

        <div className="rounded-xl border border-brand/30 bg-brand/[0.07] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">your reward</p>

          {loadingConfig || !estimate || estimating ? (
            <Skeleton className="mt-4 h-16 w-full" />
          ) : (
            <>
              <p className="mt-3 font-mono text-5xl font-extrabold tabular leading-none text-mint">
                {estimate.xp}
                <span className="ml-1 text-lg font-bold text-brand-bright">XP</span>
              </p>
              <p className="mt-2 font-mono text-xs tabular text-muted">
                {DIFFICULTY_LABEL[estimate.difficulty]} tier · fixed value
              </p>

              <div className="mt-4 border-t border-brand/25 pt-4">
                <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-brand-bright" aria-hidden />
                  {estimate.disclaimer}
                </p>
              </div>

              <p className="mt-3 font-mono text-[10.5px] text-dim">
                config {config?.version} · updated {config ? new Date(config.updatedAt).toLocaleDateString() : '—'}
              </p>
            </>
          )}
        </div>
      </div>
    </Panel>
  )
}
