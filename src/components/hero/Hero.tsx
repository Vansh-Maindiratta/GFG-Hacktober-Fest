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
      style={{ minHeight: '100vh', paddingTop: '84px' }}
    >
      {/* Pixel-art scene background */}
      <PixelScene />

      {/* Readability scrim — only on stacked layouts where copy sits over the scene */}
      <div
        aria-hidden
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,11,20,0.7) 0%, rgba(5,11,20,0.58) 55%, rgba(5,11,20,0.32) 100%)',
        }}
      />

      {/* Content layer */}
      <div className="relative mx-auto grid w-full max-w-[1660px] gap-8 px-6 pb-14 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-start lg:gap-10 lg:px-10 2xl:pr-8 2xl:pl-[150px]">
        {/* ── Left column: copy ── */}
        <div className="flex min-w-0 flex-col justify-center lg:pt-[66px]">
          {/* Event pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2"
            style={{
              border: '1px solid rgba(46,229,157,0.45)',
              background: 'rgba(46,229,157,0.07)',
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ background: '#2EE59D', boxShadow: '0 0 6px #2EE59D' }}
              aria-hidden
            />
            <span
              className="font-mono text-[12.5px] font-bold uppercase tracking-[0.16em]"
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
            className="font-pixel mt-5 uppercase"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 'clamp(2.5rem, 4.5vw, 5rem)',
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
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
            className="mt-4 text-xl font-bold leading-snug sm:text-2xl"
            style={{ color: '#2EE59D', maxWidth: '42rem' }}
          >
            {SITE_CONFIG.motto}
          </motion.p>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-3 text-[17px] leading-[1.6]"
            style={{ color: '#B7C6D6', maxWidth: '27rem' }}
          >
            Explore real repositories, fix issues, ship features, improve documentation —
            every merged pull request earns XP and moves you up the leaderboard.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            {/* Primary: Explore Projects */}
            <a
              href="/projects"
              className="inline-flex items-center gap-2.5 rounded-[10px] px-6 py-3.5 text-base font-semibold transition-all duration-200"
              style={{
                background: '#2EE59D',
                color: '#050B14',
                boxShadow: '0 10px 26px -10px rgba(46,229,157,0.75)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3DFFA8'
                e.currentTarget.style.boxShadow = '0 14px 30px -10px rgba(46,229,157,0.9)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2EE59D'
                e.currentTarget.style.boxShadow = '0 10px 26px -10px rgba(46,229,157,0.75)'
              }}
            >
              <GithubIcon className="size-[18px]" aria-hidden />
              Explore Projects
              <span style={{ color: '#050B14', opacity: 0.75 }}>→</span>
            </a>

            {/* Secondary: Start Contributing */}
            <a
              href="/how-it-works"
              className="inline-flex items-center gap-2.5 rounded-[10px] px-6 py-3.5 text-base font-semibold transition-all duration-200"
              style={{
                background: 'rgba(5,11,20,0.6)',
                color: '#2EE59D',
                border: '1px solid rgba(46,229,157,0.55)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(46,229,157,0.1)'
                e.currentTarget.style.borderColor = 'rgba(46,229,157,0.85)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(5,11,20,0.6)'
                e.currentTarget.style.borderColor = 'rgba(46,229,157,0.55)'
              }}
            >
              <Play className="size-[18px]" aria-hidden />
              Start Contributing
              <span>→</span>
            </a>
          </motion.div>
        </div>

        {/* ── Right column: Journey Panel ── */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:pt-7">
          <JourneyPanel />
        </div>
      </div>
    </section>
  )
}
