import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'

const services = ['Research Assistance', 'Web Development', 'Video Editing', 'Animation', 'UI/UX Design', 'Documentation']
const budgets = ['$30 - $100', '$100 - $300', '$300 - $700', '$700+', 'Not sure yet']

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <section id="contact" className="border-t border-white/10 bg-white/[0.03] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Make the first message easy."
        description="This form is ready for Laravel validation and Supabase inquiry storage in the next phase."
      />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-lg border border-white/10 bg-panel/72 p-6">
          <div className="grid size-12 place-items-center rounded-md bg-gold/12 text-gold">
            <Mail />
          </div>
          <h3 className="mt-5 text-2xl font-semibold text-white">Project inquiries</h3>
          <p className="mt-4 leading-7 text-white/62">
            Send the service, deadline, budget range, and what outcome you want. The cleaner the brief, the faster
            the quote.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/60">
            <p>Email: hello@janineportfolio.com</p>
            <p>Response time: Usually within 24 hours</p>
            <p>Availability: Open for freelance work</p>
          </div>
        </aside>
        <form
          className="rounded-lg border border-white/10 bg-panel/72 p-6"
          onSubmit={(event) => {
            event.preventDefault()
            setIsSubmitted(true)
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-label">
              Name
              <input required className="form-input" placeholder="Your name" />
            </label>
            <label className="form-label">
              Email
              <input required type="email" className="form-input" placeholder="you@example.com" />
            </label>
            <label className="form-label">
              Service Needed
              <select required className="form-input" defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </label>
            <label className="form-label">
              Budget Range
              <select className="form-input" defaultValue="">
                <option value="" disabled>
                  Select a range
                </option>
                {budgets.map((budget) => (
                  <option key={budget}>{budget}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="form-label mt-4">
            Message
            <textarea required className="form-input min-h-36 resize-y" placeholder="Tell me about your project..." />
          </label>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit">
              <Send className="mr-2" size={18} />
              Send Inquiry
            </Button>
            {isSubmitted && <p className="text-sm text-cyan">Message captured locally. Backend connection comes next.</p>}
          </div>
        </form>
      </div>
    </section>
  )
}
