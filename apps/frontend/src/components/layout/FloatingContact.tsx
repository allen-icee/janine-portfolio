import { Mail, MessageCircle } from 'lucide-react'

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href="#contact"
        className="grid size-12 place-items-center rounded-md border border-gold/40 bg-gold text-ink shadow-xl transition hover:-translate-y-1"
        aria-label="Open contact section"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href="mailto:hello@janineportfolio.com"
        className="grid size-12 place-items-center rounded-md border border-white/12 bg-panel/90 text-white shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-cyan/60"
        aria-label="Send email"
      >
        <Mail size={20} />
      </a>
    </div>
  )
}
