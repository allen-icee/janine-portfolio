import { Link } from 'react-router'
import { adminCards } from '../data/site'
import { AdminGuard } from '../components/admin/AdminGuard'
import { AdminShell } from '../components/admin/AdminShell'

export function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminShell
        title="Content Dashboard"
        description="Manage the public profile, services, portfolio works, testimonials, FAQs, and messages."
      >
        <div className="mb-6 flex justify-end">
          <Link to="/" className="rounded-full border border-coffee/20 px-4 py-2 text-sm text-ink/70 transition hover:bg-white/40">
            View website
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {adminCards.map((card, index) => {
            const links = ['/admin/portfolio', '/admin/testimonials', '/admin/inquiries', '/admin/services', '/admin/clients']
            return (
            <article key={card.title} className="rounded-lg border border-coffee/10 bg-white/45 p-6">
              <div className="grid size-12 place-items-center rounded-md bg-taupe/15 text-coffee">
                <card.icon />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-ink">{card.title}</h2>
              <p className="mt-3 leading-7 text-ink/60">{card.description}</p>
              <Link to={links[index]} className="mt-5 inline-flex rounded-full border border-coffee/20 px-4 py-2 text-sm text-ink/68">
                Manage
              </Link>
            </article>
            )
          })}
        </div>
      </AdminShell>
    </AdminGuard>
  )
}
