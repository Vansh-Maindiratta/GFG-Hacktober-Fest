import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { useAuth } from '@/contexts/AuthContext'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { verifyOAuthState } from '@/services/auth.service'
import { Container } from '@/components/ui/Panel'
import { LogoMark } from '@/components/ui/Logo'

const NEXT_STORAGE_KEY = 'geekstober.login.next'

function readNext(): string {
  try {
    const stored = sessionStorage.getItem(NEXT_STORAGE_KEY)
    sessionStorage.removeItem(NEXT_STORAGE_KEY)
    if (stored && stored.startsWith('/') && !stored.startsWith('//')) return stored
  } catch {
    /* sessionStorage unavailable */
  }
  return '/dashboard'
}

/**
 * OAuth landing route — GitHub redirects here with `code` and `state`.
 * The code is exchanged for a session by the backend; on any failure the user
 * is returned to the portal with an error message.
 */
export default function GitHubCallback() {
  useDocumentTitle('Completing sign-in')
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { completeLogin } = useAuth()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)

  const code = params.get('code')
  const state = params.get('state')
  const error = params.get('error')

  useEffect(() => {
    if (started.current) return
    started.current = true

    const fail = (reason: string) => {
      setFailed(true)
      navigate(`/login?error=${encodeURIComponent(reason)}`, { replace: true })
    }

    if (error) {
      fail(error)
      return
    }
    if (!code) {
      fail('missing_code')
      return
    }
    if (!verifyOAuthState(state)) {
      fail('state_mismatch')
      return
    }

    const next = readNext()
    completeLogin(code, state)
      .then(() => navigate(next, { replace: true }))
      .catch(() => fail('exchange_failed'))
  }, [code, state, error, completeLogin, navigate])

  return (
    <section className="relative overflow-hidden bg-pitch/60 py-20">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden />
      <Container size="narrow" className="relative text-center">
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-line-strong bg-coal/85 p-8">
          <LogoMark className="mx-auto" size={48} />
          <p className="mt-5 flex items-center justify-center gap-2 font-mono text-sm text-muted">
            <GithubIcon className="size-4" aria-hidden />
            {failed ? 'sign-in failed — retrying…' : 'exchanging OAuth code…'}
          </p>
          <div className="mx-auto mt-5 h-1 w-40 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-1/3 animate-pulse-soft rounded-full bg-brand" />
          </div>
        </div>
      </Container>
    </section>
  )
}
