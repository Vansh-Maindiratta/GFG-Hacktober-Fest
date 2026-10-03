import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { SITE_CONFIG } from '@/config/site'
import { PixelScene } from '@/components/hero/PixelScene'
import { JourneyPanel } from '@/components/hero/JourneyPanel'

/**
 * Landing hero — pixel-art night scene with left copy column and right journey panel.
 * Matches Main_UI.png layout: full-bleed scene, floating content over it.
 */
export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', paddingTop: '80px' }}
    >
      {/* Pixel-art scene background */}
      <PixelScene />

      {/* Content layer */}
      <div
        className="relative mx-auto grid max-w-screen-xl gap-6 px-6 py-12 lg:grid-cols-[1fr_500px] lg:items-start lg:gap-10 lg:px-10 xl:gap-14"
        style={{ zIndex: 1 }}
      >
        {/* ── Left column: copy ── */}
        <div className="flex flex-col justify-center" style={{ paddingTop: '3rem' }}>
          {/* Event pill */}
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

          {/* Headline: CODE. CONTRIBUTE. COMPETE. */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-pixel leading-[0.9] tracking-[-0.01em] uppercase"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(3.2rem, 6.5vw, 5.8rem)',
            }}
          >
            <span style={{ color: '#FFFFFF', display: 'block' }}>Code.</span>
            <span style={{ color: '#2EE59D', display: 'block' }}>Contribute.</span>
            <span style={{ color: '#FFFFFF', display: 'block' }}>Compete.</span>
          </motion.h1>

          {/* Subheading (mint) */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-5 text-lg font-semibold leading-snug"
            style={{ color: '#2EE59D', maxWidth: '34rem' }}
          >
            {SITE_CONFIG.motto}
          </motion.p>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-3 text-[15px] leading-relaxed"
            style={{ color: '#9FB0C3', maxWidth: '34rem' }}
          >
            Explore real repositories, fix issues, ship features, improve documentation —
            every merged pull request earns XP and moves you up the leaderboard.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {/* Primary: Explore Projects */}
            <a
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold transition-all duration-200"
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
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-semibold transition-all duration-200"
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

        {/* ── Right column: Journey Panel ── */}
        <div className="lg:sticky lg:top-24 lg:pt-4">
          <JourneyPanel />
        </div>
      </div>
    </section>
  )
}
