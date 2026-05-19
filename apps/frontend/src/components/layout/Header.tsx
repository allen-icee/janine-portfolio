import { Menu, Shield } from 'lucide-react'
import { LinkButton } from '../ui/Button'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#portfolio' },
  { label: 'Feedback', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md border border-gold/35 bg-gold/10 text-sm font-bold text-gold">
            J
          </span>
          <span className="text-sm font-semibold text-white">Janine Portfolio</span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-white/66 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <a href="/admin/login" className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white">
            <Shield size={16} />
            Admin
          </a>
          <LinkButton href="#contact">Hire Me</LinkButton>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-md border border-white/10 text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}
