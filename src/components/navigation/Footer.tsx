import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { NAV_ITEMS, SITE_CONFIG } from '@/config/site'
import { Logo } from '@/components/ui/Logo'
import { Container } from '@/components/ui/Panel'

const COMMUNITY = [
  { label: 'GitHub', href: SITE_CONFIG.githubUrl, icon: GithubIcon },
  { label: 'Discord', href: SITE_CONFIG.discordUrl, icon: MessageCircle },
  { label: 'Instagram', href: SITE_CONFIG.instagramUrl, icon: InstagramIcon },
  { label: 'LinkedIn', href: SITE_CONFIG.linkedinUrl, icon: LinkedinIcon },
]

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-pitch">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.35]" aria-hidden />
      <Container className="relative py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              An open-source contribution competition where every merged pull request becomes visible
              progress — XP, badges, rank and a real portfolio.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-bright/70">
              Open Source • Community • Contribution
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">Navigate</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-underline text-sm text-muted transition hover:text-mint">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/dashboard" className="link-underline text-sm text-muted transition hover:text-mint">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">Community</h3>
            <ul className="mt-4 space-y-2.5">
              {COMMUNITY.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2 text-sm text-muted transition hover:text-mint"
                  >
                    <item.icon className="size-3.5" aria-hidden />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">Event</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-dim">Window</dt>
                <dd className="font-mono text-muted">{SITE_CONFIG.dates}</dd>
              </div>
              <div>
                <dt className="text-dim">Format</dt>
                <dd className="text-muted">{SITE_CONFIG.venue}</dd>
              </div>
              <div>
                <dt className="text-dim">Contact</dt>
                <dd>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="font-mono text-xs text-mint hover:underline">
                    {SITE_CONFIG.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* terminal-style footer decoration */}
        <div className="mt-12 overflow-hidden rounded-xl border border-line bg-void/70 px-4 py-3 font-mono text-[11.5px] text-muted sm:text-xs">
          <p className="truncate">
            <span className="text-brand-bright">❯</span> git commit -m{' '}
            <span className="text-mint">&quot;feat: {SITE_CONFIG.name.toLowerCase()} goes live&quot;</span>
            <span className="ml-3 text-dim">1 file changed, 42 insertions(+)</span>
            <span className="ml-3 inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-brand-bright" aria-hidden />
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-dim">
            © {new Date().getFullYear()} {SITE_CONFIG.name} · {SITE_CONFIG.edition}
          </p>
          <p className="font-mono text-[11px] text-dim">
            Built by the community, for the community{' '}
            <span className="text-brand-bright">+++ CONTRIBUTION DETECTED +++</span>
          </p>
        </div>
      </Container>
    </footer>
  )
}
