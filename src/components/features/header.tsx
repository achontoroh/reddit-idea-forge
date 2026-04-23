import type { FC, CSSProperties } from 'react'
import Link from 'next/link'
import { Button, Glyph, Wordmark } from '@/components/ui'

interface HeaderUser {
  email: string
  avatarUrl?: string | null
}

interface BreadcrumbCrumb {
  label: string
  href?: string
}

interface HeaderProps {
  breadcrumb?: BreadcrumbCrumb[]
  user?: HeaderUser | null
}

const MONO_CAPS_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12.5px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  lineHeight: 1,
}

export const Header: FC<HeaderProps> = ({ breadcrumb, user }) => {
  const logoHref = user ? '/dashboard' : '/'

  return (
    <header
      className="flex items-center justify-between px-page-gutter-mobile md:px-page-gutter"
      style={{
        height: '63px',
        borderBottom: 'var(--border-hair)',
      }}
    >
      <div className="flex items-center gap-4">
        <Wordmark size={18} href={logoHref} />
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb crumbs={breadcrumb} />
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? <UserCluster user={user} /> : <SignInButton />}
      </div>
    </header>
  )
}

const Breadcrumb: FC<{ crumbs: BreadcrumbCrumb[] }> = ({ crumbs }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-3 md:flex"
      style={MONO_CAPS_STYLE}
    >
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} className="flex items-center gap-3">
          <span aria-hidden="true" style={{ color: 'var(--ink-400)' }}>
            /
          </span>
          {crumb.href ? (
            <Link
              href={crumb.href}
              style={{ color: 'var(--ink-900)', textDecoration: 'none' }}
            >
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--ink-900)' }} aria-current="page">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}

const UserCluster: FC<{ user: HeaderUser }> = ({ user }) => {
  return (
    <>
      <span
        className="hidden sm:inline"
        style={{ fontSize: '12.5px', color: 'var(--ink-600)', lineHeight: 1 }}
      >
        {user.email}
      </span>
      <Avatar email={user.email} avatarUrl={user.avatarUrl} />
    </>
  )
}

const Avatar: FC<{ email: string; avatarUrl?: string | null }> = ({
  email,
  avatarUrl,
}) => {
  const alt = `${email} avatar`
  const tileStyle: CSSProperties = {
    width: '30px',
    height: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  }

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar source is user-provided URL
      <img src={avatarUrl} alt={alt} style={tileStyle} />
    )
  }

  return (
    <span
      aria-label={alt}
      style={{ ...tileStyle, backgroundColor: 'var(--ink-900)' }}
    >
      <Glyph size={30} color="var(--ink-paper)" />
    </span>
  )
}

const SignInButton: FC = () => (
  <Link href="/login" aria-label="Sign in">
    <Button intent="ghost" size="sm">
      Sign in →
    </Button>
  </Link>
)
