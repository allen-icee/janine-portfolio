import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { categories, portfolioItems } from '../../data/site'
import type { PortfolioCategory, PortfolioItem } from '../../types/content'
import { Modal } from '../ui/Modal'
import { SectionHeading } from '../ui/SectionHeading'

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All')
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)
  const filteredItems =
    activeCategory === 'All' ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section id="portfolio" className="px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Portfolio"
        title="Work samples built around clarity and client outcomes."
        description="A curated view of research, web, creative, design, and documentation projects. Later, this section will be managed from the admin dashboard."
      />
      <div className="mx-auto mb-8 flex max-w-7xl gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-md border px-4 py-2 text-sm transition ${
              activeCategory === category
                ? 'border-gold/60 bg-gold text-ink'
                : 'border-white/10 bg-white/6 text-white/64 hover:border-cyan/50 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedProject(item)}
            className="group overflow-hidden rounded-lg border border-white/10 bg-panel/70 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan/50"
          >
            <div className="grid aspect-[16/10] place-items-center bg-[linear-gradient(135deg,#111827,#172033_50%,#0d111b)]">
              <span className="rounded-md border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white/74">
                {item.image}
              </span>
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-md bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">{item.category}</span>
                <ArrowUpRight className="text-white/40 transition group-hover:text-gold" size={18} />
              </div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 min-h-16 leading-7 text-white/58">{item.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/54">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedProject && (
        <Modal title={selectedProject.title} onClose={() => setSelectedProject(null)}>
          <div className="grid aspect-video place-items-center rounded-md border border-white/10 bg-[#0e1420] text-white/60">
            {selectedProject.image} preview
          </div>
          <p className="mt-5 leading-7 text-white/68">{selectedProject.description}</p>
          <div className="mt-5 rounded-md border border-gold/20 bg-gold/8 p-4">
            <p className="text-sm font-semibold text-gold">Client outcome</p>
            <p className="mt-2 leading-7 text-white/70">{selectedProject.outcome}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {selectedProject.technologies.map((tech) => (
              <span key={tech} className="rounded-md border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-white/68">
                {tech}
              </span>
            ))}
          </div>
        </Modal>
      )}
    </section>
  )
}
