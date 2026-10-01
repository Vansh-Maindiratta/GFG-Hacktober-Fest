import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '@/config/site'
import { cn } from '@/utils/cn'

/**
 * Brand mark: a git-branch glyph inside a rounded technical plate.
 * Pure SVG — no external logo assets required.
 */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center rounded-[10px] border border-brand/40 bg-gradient-to-br from-brand/25 to-brand/[0.06]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} aria-hidden focusable="false">
        <path
          d="M7 5.5v13"
          stroke="#22C55E"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M17 7.5c0 4-4 3.5-6 5.5"
          stroke="#86EFAC"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M17 7.5v9" stroke="#2F8D46" strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <circle cx="7" cy="4" r="2.4" fill="#050805" stroke="#22C55E" strokeWidth="1.7" />
        <circle cx="7" cy="20" r="2.4" fill="#050805" stroke="#2F8D46" strokeWidth="1.7" />
        <circle cx="17" cy="6" r="2.4" fill="#050805" stroke="#86EFAC" strokeWidth="1.7" />
        <circle cx="17" cy="18" r="2.4" fill="#050805" stroke="#22C55E" strokeWidth="1.7" />
      </svg>
    </span>
  )
}

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={cn('group flex shrink-0 items-center gap-3', className)}
      aria-label={`${SITE_CONFIG.name} home`}
    >
      <LogoMark />
      <span className="flex shrink-0 flex-col whitespace-nowrap leading-none">
        <span className="text-[15px] font-extrabold tracking-tight text-ink">
          GFG <span className="text-brand-bright">HACKTOBER</span>
          {!compact ? <span className="text-ink"> FEST</span> : null}
        </span>
        <span className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.34em] text-dim group-hover:text-mint/70 transition-colors">
          Open Source League
        </span>
      </span>
    </Link>
  )
}
