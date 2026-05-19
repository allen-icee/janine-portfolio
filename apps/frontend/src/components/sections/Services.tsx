import { Check } from 'lucide-react'
import { packages, services, trustCards } from '../../data/site'
import { SectionHeading } from '../ui/SectionHeading'

export function Services() {
  return (
    <section id="services" className="border-y border-white/10 bg-white/[0.03] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Services"
        title="Client-ready services with a premium finish."
        description="Choose focused support for academic, creative, technical, and business-facing deliverables."
      />
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="group rounded-lg border border-white/10 bg-panel/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan/45">
            <div className="mb-5 grid size-12 place-items-center rounded-md bg-cyan/10 text-cyan">
              <service.icon size={22} />
            </div>
            <h3 className="text-xl font-semibold text-white">{service.title}</h3>
            <p className="mt-3 leading-7 text-white/60">{service.description}</p>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-5 lg:grid-cols-3">
        {packages.map((item) => (
          <article
            key={item.name}
            className={`rounded-lg border p-6 ${
              item.highlighted ? 'border-gold/50 bg-gold/10' : 'border-white/10 bg-panel/70'
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan">{item.name}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.price}</p>
            <p className="mt-3 min-h-16 leading-7 text-white/62">{item.description}</p>
            <div className="mt-6 space-y-3">
              {item.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-white/70">
                  <Check size={16} className="text-gold" />
                  {feature}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {trustCards.map((card) => (
          <article key={card.title} className="rounded-lg border border-white/10 bg-white/6 p-5">
            <card.icon className="text-gold" size={22} />
            <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/58">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
