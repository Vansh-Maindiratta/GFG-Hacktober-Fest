import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { LogOut, Menu, Search, ShieldCheck, User, X } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { NAV_ITEMS, SITE_CONFIG } from '@/config/site'
import { useAuth } from '@/contexts/AuthContext'
import { Logo } from '@/components/ui/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

/**
 * Sticky global navigation.
 * Desktop: inline links + context actions. Mobile: animated sheet menu.
 */
export function Navbar({ onSearchOpen }: { onSearchOpen: () => void }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, role, logout } = useAuth()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 12)
    setHidden(latest > 320 && latest > previous && !mobileOpen)
  })

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onSearchOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSearchOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-line bg-void/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent',
        hidden && '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="ml-3 hidden items-center gap-0.5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'text-mint' : 'text-muted hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-brand-bright"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearchOpen}
            className="hidden h-9 items-center gap-2 rounded-lg border border-line bg-coal/70 px-3 text-sm text-muted transition hover:border-brand/45 hover:text-ink md:flex"
            aria-label="Open search"
          >
            <Search className="size-4" aria-hidden />
            <span>Search</span>
            <kbd className="ml-2 rounded border border-line bg-white/[0.04] px-1.5 py-px font-mono text-[10px] text-dim">
              Ctrl K
            </kbd>
          </button>

          <a
            href={SITE_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub organization"
            className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:border-brand/45 hover:text-mint"
          >
            <GithubIcon className="size-4" />
          </a>

          {isAuthenticated && user ? (
            <>
              <Link
                to={role === 'admin' ? '/admin' : '/dashboard'}
                className="hidden h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-sm font-semibold text-void transition hover:bg-brand-bright sm:flex"
              >
                {role === 'admin' ? <ShieldCheck className="size-4" aria-hidden /> : <User className="size-4" aria-hidden />}
                {role === 'admin' ? 'Admin' : 'My Progress'}
              </Link>
              <div className="group relative hidden sm:block">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-line py-1 pl-1 pr-2 transition hover:border-brand/45"
                  aria-label={`Account menu for ${user.username}`}
                >
                  <Avatar name={user.name} username={user.username} size="sm" />
                  <span className="hidden font-mono text-xs text-muted 2xl:inline">@{user.username}</span>
                </button>
                <div className="invisible absolute right-0 top-full w-52 translate-y-1 rounded-xl border border-line bg-coal p-1.5 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-1 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-ink"
                  >
                    <User className="size-4" aria-hidden /> Profile
                  </Link>
                  <Link
                    to={role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-ink"
                  >
                    <ShieldCheck className="size-4" aria-hidden />
                    {role === 'admin' ? 'Admin panel' : 'Dashboard'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void logout()
                      navigate('/')
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-rose"
                  >
                    <LogOut className="size-4" aria-hidden /> Sign out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="hidden h-9 items-center rounded-lg bg-brand px-3.5 text-sm font-semibold text-void transition hover:bg-brand-bright sm:flex"
            >
              My Progress
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="grid size-9 place-items-center rounded-lg border border-line text-ink transition hover:border-brand/45 xl:hidden"
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-void/97 backdrop-blur-xl xl:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.25 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition',
                        isActive ? 'bg-brand/12 text-mint' : 'text-muted hover:bg-white/5 hover:text-ink',
                      )
                    }
                  >
                    {item.label}
                    <span className="font-mono text-[10px] text-dim">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </NavLink>
                </motion.div>
              ))}

              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    onSearchOpen()
                  }}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm text-muted"
                >
                  Search anything
                  <kbd className="rounded border border-line bg-white/[0.04] px-1.5 py-px font-mono text-[10px] text-dim">
                    Ctrl K
                  </kbd>
                </button>
                <Link
                  to={isAuthenticated && role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-semibold text-void"
                >
                  {isAuthenticated && role === 'admin' ? 'Admin Panel' : 'My Progress'}
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
