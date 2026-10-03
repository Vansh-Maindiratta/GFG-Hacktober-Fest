import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { SITE_CONFIG } from '@/config/site'
import { PixelScene } from '@/components/hero/PixelScene'
import { JourneyPanel } from '@/components/hero/JourneyPanel'

/**
 * Landing hero component.
 * Features left copy column, right JourneyPanel, and pixel background artwork.
 * Aligned to the 1560px centered container matching the Navbar.
 */
export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      {/* Pixel-art scene background */}
      <PixelScene />

      {/* Content layer matching the 1560px centered navbar container */}
      <div
        className="relative mx-auto flex w-[92%] max-w-[1560px] flex-col gap-8 pb-12 pt-14 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
        style={{ zIndex: 1 }}
      >
        {/* ── Left column: copy (max-w 600px) ── */}
        <div className="flex max-w-[600px] flex-col justify-center">
          {/* Event pill: sits ~48-56px below navbar bottom edge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              border: '1px solid rgba(46,229,157,0.4)',
              background: 'rgba(46,229,157,0.06)',
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ background: '#2EE59D', boxShadow: '0 0 6px #2EE59D' }}
              aria-hidden
            />
            <span
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#2EE59D' }}
            >
              {SITE_CONFIG.name} · OCT 01 - OCT 31
            </span>
          </motion.div>

          {/* Headline: CODE. CONTRIBUTE. COMPETE. (clamp 2.5rem - 5rem, line-height 1.0, 78px line at 1917px) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-pixel tracking-[-0.01em] uppercase"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(2.5rem, 4.1vw, 5rem)',
              lineHeight: 1.0,
            }}
          >
            <span style={{ color: '#FFFFFF', display: 'block' }}>Code.</span>
            <span style={{ color: '#2EE59D', display: 'block' }}>Contribute.</span>
            <span style={{ color: '#FFFFFF', display: 'block' }}>Compete.</span>
          </motion.h1>

          {/* Subheading (mint, 20px below headline) */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-5 text-base sm:text-lg font-semibold leading-snug"
            style={{ color: '#2EE59D', maxWidth: '30rem' }}
          >
            {SITE_CONFIG.motto}
          </motion.p>

          {/* Body copy (12px below subheading, max-w 30rem, wraps to 3 lines) */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-3 text-[14px] sm:text-[15px] leading-relaxed"
            style={{ color: '#9FB0C3', maxWidth: '30rem' }}
          >
            Explore real repositories, fix issues, ship features, improve documentation —
            every merged pull request earns XP and moves you up the leaderboard.
          </motion.p>

          {/* Buttons (24px below body, height 48-52px) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            {/* Primary: Explore Projects */}
            <a
              href="/projects"
              className="inline-flex h-[50px] items-center gap-2 rounded-lg px-5 py-3 text-[14px] font-semibold transition-all duration-200"
              style={{
                background: '#2EE59D',
                color: '#050B14',
                boxShadow: '0 8px 24px -8px rgba(46,229,157,0.7)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3DFFA8'
                e.currentTarget.style.boxShadow = '0 12px 28px -8px rgba(46,229,157,0.85)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2EE59D'
                e.currentTarget.style.boxShadow = '0 8px 24px -8px rgba(46,229,157,0.7)'
              }}
            >
              <GithubIcon className="size-4" aria-hidden />
              Explore Projects
              <span style={{ color: '#050B14', opacity: 0.7 }}>→</span>
            </a>

            {/* Secondary: Start Contributing */}
            <a
              href="/how-it-works"
              className="inline-flex h-[50px] items-center gap-2 rounded-lg px-5 py-3 text-[14px] font-semibold transition-all duration-200"
              style={{
                background: 'transparent',
                color: '#2EE59D',
                border: '1px solid rgba(46,229,157,0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(46,229,157,0.08)'
                e.currentTarget.style.borderColor = 'rgba(46,229,157,0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(46,229,157,0.5)'
              }}
            >
              <Play className="size-4" aria-hidden />
              Start Contributing
              <span>→</span>
            </a>
          </motion.div>
        </div>

        {/* ── Right column: Journey Panel (top aligned with pill top edge) ── */}
        <div className="shrink-0 lg:pt-0">
          <JourneyPanel />
        </div>
      </div>
    </section>
  )
}
