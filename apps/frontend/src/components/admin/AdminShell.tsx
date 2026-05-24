import { ExternalLink, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import { setAdminAccessCache } from '../../lib/adminAccess'

type AdminShellProps = {
  children: ReactNode
  title?: string
  description?: string
  eyebrow?: string
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Portfolio', href: '/admin/portfolio' },
  { label: 'Proofs', href: '/admin/proofs' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'FAQs', href: '/admin/faqs' },
]

export function AdminShell({ children }: AdminShellProps) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const signOut = async () => {
    await supabase?.auth.signOut()
    setAdminAccessCache(null)
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-[#f9f6f3] text-[#3c232c]">
      <header className="sticky top-0 z-40 w-full px-4 pt-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[#f9f6f3] via-[#f9f6f3]/95 to-transparent" />

        <div className="relative mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 rounded-2xl border border-[#efdad0] bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl">
          <Link to="/admin/dashboard" className="group flex min-w-0 shrink-0 items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full border border-[#ad6a6c]/30 bg-[#e3d1d1]/30 text-[#ad6a6c] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md">
              <ShieldCheck size={20} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] bg-clip-text text-sm font-bold tracking-wide text-transparent">
                  JaneDesk
                </span>
                <span className="rounded-full bg-[#f8cdb4]/35 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#ad6a6c]">
                  Admin
                </span>
              </div>
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-[#3c232c]/70">
                Content Management
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `group relative text-sm font-bold tracking-wide transition-colors ${
                    isActive ? 'text-[#ad6a6c]' : 'text-[#3c232c]/70 hover:text-[#ad6a6c]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-[#ad6a6c] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full border border-[#efdad0] bg-white/60 px-4 py-2.5 text-sm font-bold tracking-wide text-[#3c232c]/75 transition-all hover:border-[#ad6a6c] hover:bg-white hover:text-[#ad6a6c]"
            >
              <ExternalLink size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              View Site
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
            >
              <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
              Sign out
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="grid size-10 place-items-center rounded-xl border border-[#efdad0] bg-white/60 text-[#3c232c] transition hover:bg-white lg:hidden"
            aria-label="Toggle admin navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-[#efdad0] bg-white/95 p-5 shadow-xl backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition ${
                      isActive
                        ? 'bg-[#f8cdb4]/25 text-[#ad6a6c]'
                        : 'text-[#3c232c] hover:bg-[#f8cdb4]/20 hover:text-[#ad6a6c]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="my-2 h-px w-full bg-[#e3d1d1]/50" />

              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#efdad0] bg-white px-4 py-3 text-sm font-bold text-[#3c232c] transition hover:border-[#ad6a6c] hover:text-[#ad6a6c]"
              >
                <ExternalLink size={16} />
                View Site
              </Link>

              <button
                type="button"
                onClick={signOut}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ad6a6c] to-[#3c232c] px-4 py-3.5 text-sm font-bold tracking-wide text-white transition hover:opacity-90"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </nav>
          </div>
        )}
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </section>
    </main>
  )
}
