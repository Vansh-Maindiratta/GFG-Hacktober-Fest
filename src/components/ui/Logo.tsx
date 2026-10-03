import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '@/config/site'
import { cn } from '@/utils/cn'

/**
 * Pixel-cat mascot mark — pure SVG, no external assets.
 * Matches the cat-head icon in the screenshot navbar.
 */
export function LogoMark({ className, size = 42 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center rounded-[10px] border bg-[#0A141F]',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderColor: 'rgba(46,229,157,0.3)',
      }}
    >
      {/* Pixel cat face SVG */}
      <svg
        viewBox="0 0 24 24"
        width={size * 0.72}
        height={size * 0.72}
        aria-hidden
        focusable="false"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Cat head outline */}
        <rect x="4" y="6" width="16" height="13" rx="2" fill="none" stroke="#2EE59D" strokeWidth="1.5" />
        {/* Left ear */}
        <polygon points="5,6 5,2 9,6" fill="#2EE59D" />
        {/* Right ear */}
        <polygon points="19,6 19,2 15,6" fill="#2EE59D" />
        {/* Left eye */}
        <rect x="7" y="10" width="3" height="3" rx="0.5" fill="#2EE59D" />
        {/* Right eye */}
        <rect x="14" y="10" width="3" height="3" rx="0.5" fill="#2EE59D" />
        {/* Nose */}
        <rect x="11" y="14" width="2" height="1" fill="#2EE59D" />
        {/* Mouth left */}
        <rect x="9" y="15" width="2" height="1" fill="#2EE59D" opacity="0.7" />
        {/* Mouth right */}
        <rect x="13" y="15" width="2" height="1" fill="#2EE59D" opacity="0.7" />
      </svg>
    </span>
  )
}

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      className={cn('group flex shrink-0 items-center gap-2.5', className)}
      aria-label={`${SITE_CONFIG.name} home`}
    >
      <LogoMark />
      <span className="flex shrink-0 flex-col whitespace-nowrap leading-none">
        <span
          className="text-[19px] font-extrabold leading-none tracking-tight text-white"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          <span className="text-white">GEEK</span>
          <span style={{ color: '#2EE59D' }}>STOBER</span>
        </span>
        {!compact && (
          <span
            className="mt-1 font-mono text-[9.5px] uppercase transition-colors"
            style={{ color: '#7C90A6', letterSpacing: '0.14em' }}
          >
            GFG STUDENT CHAPTER RBU
          </span>
        )}
      </span>
    </Link>
  )
}
