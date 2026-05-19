import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'

type AdminShellProps = {
  children: ReactNode
  title: string
  description: string
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Profile', href: '/admin/profile' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Portfolio', href: '/admin/portfolio' },
  { label: 'Proofs', href: '/admin/proofs' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'FAQs', href: '/admin/faqs' },
  { label: 'Messages', href: '/admin/inquiries' },
  { label: 'Clients', href: '/admin/clients' },
  { label: 'Finance', href: '/admin/finance' },
]

export function AdminShell({ children, title, description }: AdminShellProps) {
  const navigate = useNavigate()

  const signOut = async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-coffee/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/" className="font-serif text-xl font-semibold text-ink">
              Janine Admin
            </Link>
            <p className="text-sm text-ink/54">Content management</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `shrink-0 rounded-full border px-4 py-2 text-sm ${
                    isActive
                      ? 'border-coffee bg-coffee text-white'
                      : 'border-coffee/15 bg-white/30 text-ink/70 hover:bg-white/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-coffee/15 px-4 py-2 text-sm text-ink/72 hover:bg-white/50"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-5xl text-ink">{title}</h1>
          <p className="mt-3 max-w-3xl text-ink/62">{description}</p>
        </div>
        {children}
      </section>
    </main>
  )
}
