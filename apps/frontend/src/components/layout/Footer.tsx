import { Copy, ExternalLink, Mail, MapPin } from 'lucide-react'
import { profile } from '../../data/site'

export function Footer() {
  const copyEmail = () => navigator.clipboard.writeText(profile.email)

  return (
    <footer className="border-t border-white/10 bg-[#080b12] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{profile.name}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/56">
            <MapPin size={16} />
            {profile.location}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-gold/50 hover:text-white"
          >
            <Copy size={16} />
            Copy email
          </button>
          <a href={`mailto:${profile.email}`} className="footer-link" aria-label="Email Janine">
            <Mail size={18} />
          </a>
          <a href="https://github.com/duedat3" className="footer-link" aria-label="GitHub profile">
            <ExternalLink size={18} />
          </a>
          <a href="https://www.linkedin.com" className="footer-link" aria-label="LinkedIn profile">
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
