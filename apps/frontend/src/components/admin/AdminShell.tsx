import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

type AdminShellProps = {
  children: ReactNode
  title: string
  description: string
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Portfolio', href: '/admin/portfolio' },
  { label: 'Proofs', href: '/admin/proofs' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'FAQs', href: '/admin/faqs' },
]

export function AdminShell({ children, title, description }: AdminShellProps) {
  const navigate = useNavigate()

  const signOut = async () => {
    await supabase?.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-[#f9f6f3] text-[#3c232c]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: '1px solid #efdad0',
            background: '#fffaf7',
            color: '#3c232c',
          },
        }}
      />
      <header className="sticky top-0 z-40 border-b border-[#efdad0] bg-[#f9f6f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/" className="font-serif text-xl font-bold text-[#3c232c]">
              Janine Admin
            </Link>
            <p className="text-sm text-[#3c232c]/55">Portfolio content management</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `shrink-0 rounded-full border px-4 py-2 text-sm ${
                    isActive
                      ? 'border-[#ad6a6c] bg-[#ad6a6c] text-white'
                      : 'border-[#efdad0] bg-white/50 text-[#3c232c]/70 hover:border-[#ad6a6c] hover:bg-white'
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#efdad0] bg-white/50 px-4 py-2 text-sm text-[#3c232c]/72 hover:border-[#ad6a6c] hover:bg-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[#3c232c] sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-[#3c232c]/65">{description}</p>
        </div>
        {children}
      </section>
    </main>
  )
}
