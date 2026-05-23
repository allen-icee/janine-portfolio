import { Link } from 'react-router'
import { HelpCircle, Image, MessageSquareQuote, PanelsTopLeft } from 'lucide-react'
import { AdminGuard } from '../components/admin/AdminGuard'
import { AdminShell } from '../components/admin/AdminShell'

const adminCards = [
  {
    title: 'Portfolio',
    description: 'Create projects, manage categories, and upload cover images.',
    href: '/admin/portfolio',
    icon: PanelsTopLeft,
  },
  {
    title: 'Proofs',
    description: 'Upload client proof screenshots and organize proof entries.',
    href: '/admin/proofs',
    icon: Image,
  },
  {
    title: 'Testimonials',
    description: 'Review client feedback and remove entries when needed.',
    href: '/admin/testimonials',
    icon: MessageSquareQuote,
  },
  {
    title: 'FAQs',
    description: 'Create, edit, reorder, and publish frequently asked questions.',
    href: '/admin/faqs',
    icon: HelpCircle,
  },
]

export function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminShell
        title="Content Dashboard"
        description="Manage portfolio entries, proof images, client feedback, and frequently asked questions."
      >
        <div className="mb-6 flex justify-end">
          <Link to="/" className="rounded-full border border-[#efdad0] bg-white/60 px-4 py-2 text-sm text-[#3c232c]/70 transition hover:border-[#ad6a6c] hover:bg-white">
            View website
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {adminCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-[#efdad0] bg-white/60 p-6 shadow-sm backdrop-blur">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#f8cdb4]/25 text-[#ad6a6c]">
                <card.icon />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-bold text-[#3c232c]">{card.title}</h2>
              <p className="mt-3 leading-7 text-[#3c232c]/60">{card.description}</p>
              <Link to={card.href} className="mt-5 inline-flex rounded-full border border-[#efdad0] px-4 py-2 text-sm font-semibold text-[#3c232c]/68 hover:border-[#ad6a6c] hover:bg-white">
                Manage
              </Link>
            </article>
          ))}
        </div>
      </AdminShell>
    </AdminGuard>
  )
}
