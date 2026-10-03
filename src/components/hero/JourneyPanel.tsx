import { motion } from 'framer-motion'
import { BarChart3, BookOpen, GitMerge, MousePointer2, Code2, Trophy } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { MOCK_USERS } from '@/data/mock/users'
import { EVENT_STATS } from '@/config/site'
import { Link } from 'react-router-dom'
import { ArrowRight, FolderGit2, AlertCircle, Users, Award } from 'lucide-react'

const JOURNEY_STEPS = [
  {
    num: 1,
    icon: BookOpen,
    title: 'Explore Projects',
    sub: 'Find repositories and good first issues',
  },
  {
    num: 2,
    icon: MousePointer2,
    title: 'Claim an Issue',
    sub: 'Pick an issue based on your interest',
  },
  {
    num: 3,
    icon: Code2,
    title: 'Code & Open PR',
    sub: 'Write code and submit a pull request',
  },
  {
    num: 4,
    icon: GitMerge,
    title: 'Get Merged',
    sub: 'Earn XP when your PR is merged',
  },
  {
    num: 5,
    icon: Trophy,
    title: 'Unlock Badges',
    sub: 'Showcase your achievements',
  },
  {
    num: 6,
    icon: BarChart3,
    title: 'Climb Leaderboard',
    sub: 'Compete with other contributors',
  },
]

const STAT_ICONS = [FolderGit2, AlertCircle, Users, Award]

/** Avatar placeholder from user initials */
function InitialAvatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const colors = ['#0D3B26', '#0A2E3A', '#1A1D0F', '#261A0D']
  const textColors = ['#2EE59D', '#38BDF8', '#84CC16', '#FBBF24']
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full text-[10px] font-bold"
      style={{
        width: 30,
        height: 30,
        background: colors[index % 4],
        border: '1.5px solid rgba(46,229,157,0.35)',
        color: textColors[index % 4],
        marginLeft: index === 0 ? 0 : -10,
        zIndex: 10 - index,
        position: 'relative',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      {initials}
    </div>
  )
}

/**
 * "Your Open Source Journey" right panel.
 * Timeline of 6 steps + stat tiles + participant strip.
 * All values come from the existing data layer.
 */
export function JourneyPanel() {
  const participantCount = MOCK_USERS.length

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-0 overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(8,17,27,0.96)',
        border: '1px solid rgba(45,212,191,0.22)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 30px 70px -40px rgba(0,0,0,0.9)',
      }}
    >
      {/* Panel heading */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: '1px solid rgba(45,212,191,0.12)' }}
      >
        <p
          className="font-mono text-[13px] font-bold uppercase"
          style={{ color: '#C7D5E4', letterSpacing: '0.2em' }}
        >
          YOUR OPEN SOURCE JOURNEY
        </p>
      </div>

      {/* Timeline */}
      <div className="relative px-3 py-4">
        {/* Vertical line */}
        <div
          className="absolute left-[22px] top-5 bottom-5"
          style={{ width: '2px', background: 'linear-gradient(to bottom, #2EE59D 0%, rgba(46,229,157,0.18) 100%)' }}
          aria-hidden
        />

        <div className="flex flex-col gap-2.5">
          {JOURNEY_STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.07 }}
              className="relative flex items-center gap-3"
            >
              {/* Timeline node */}
              <div className="relative z-10 flex w-[22px] shrink-0 items-center justify-center self-stretch">
                <span
                  className="block size-4 rounded-full"
                  style={{
                    background: '#2EE59D',
                    boxShadow: '0 0 0 3px #08111B, 0 0 8px rgba(46,229,157,0.55)',
                  }}
                  aria-hidden
                />
              </div>

              <div className="journey-card flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3">

              {/* Icon */}
              <div
                className="grid shrink-0 place-items-center rounded-lg"
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(46,229,157,0.09)',
                  border: '1px solid rgba(46,229,157,0.18)',
                }}
              >
                <step.icon
                  className="size-[18px]"
                  style={{ color: '#2EE59D' }}
                  aria-hidden
                />
              </div>

              {/* Text */}
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold leading-tight text-white">
                    {step.num}. {step.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-tight" style={{ color: '#9FB0C3' }}>
                    {step.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stat tiles */}
      <div
        className="grid grid-cols-4 gap-2.5 px-4 py-4"
        style={{ borderTop: '1px solid rgba(45,212,191,0.12)' }}
      >
        {EVENT_STATS.map((stat, idx) => {
          const Icon = STAT_ICONS[idx]
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + idx * 0.06 }}
              className="stat-tile flex flex-col items-center gap-1.5 px-1.5 py-3.5 text-center"
            >
              <Icon className="size-5" style={{ color: '#2EE59D' }} aria-hidden />
              <span
                className="font-mono text-[19px] font-bold leading-none"
                style={{ color: '#FFFFFF' }}
              >
                {stat.value}{stat.suffix}
              </span>
              <span
                className="font-mono text-[10px] uppercase leading-[1.3]"
                style={{ color: '#9FB0C3', letterSpacing: '0.06em' }}
              >
                {stat.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Participant strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="flex items-center justify-between gap-3 px-4 py-3.5"
        style={{ borderTop: '1px solid rgba(45,212,191,0.12)', background: 'rgba(46,229,157,0.05)' }}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Overlapping avatars */}
          <div className="flex shrink-0 items-center">
            {MOCK_USERS.slice(0, 4).map((u, i) => (
              <InitialAvatar key={u.id} name={u.name} index={i} />
            ))}
          </div>
          <GithubIcon className="size-4 shrink-0" style={{ color: '#9FB0C3' }} />
          <p className="truncate text-[13px] font-medium" style={{ color: '#9FB0C3' }}>
            Join{' '}
            <span style={{ color: '#FFFFFF' }}>{participantCount}</span>{' '}
            developers contributing this month.
          </p>
        </div>
        <Link
          to="/leaderboard"
          aria-label="View leaderboard"
          className="grid size-9 shrink-0 place-items-center rounded-full transition"
          style={{
            background: '#2EE59D',
            color: '#050B14',
          }}
        >
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </motion.div>
  )
}
