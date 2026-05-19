import { BadgeCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useState } from 'react'
import { testimonials } from '../../data/site'
import type { Testimonial } from '../../types/content'
import { Modal } from '../ui/Modal'
import { SectionHeading } from '../ui/SectionHeading'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const current = testimonials[index]

  const move = (direction: number) => {
    setIndex((value) => (value + direction + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="border-y border-white/10 bg-white/[0.03] px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Client feedback"
        title="Trust-building reviews with real project context."
        description="Testimonials will be managed from Supabase later, but the interaction pattern is ready now."
      />
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => setSelectedTestimonial(current)}
          className="w-full rounded-lg border border-white/10 bg-panel/80 p-6 text-left transition hover:border-gold/45"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-md bg-cyan/12 text-lg font-bold text-cyan">
                {current.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{current.name}</h3>
                  <BadgeCheck size={17} className="text-cyan" />
                </div>
                <p className="mt-1 text-sm text-white/54">{current.service}</p>
              </div>
            </div>
            <div className="flex gap-1 text-gold">
              {Array.from({ length: current.rating }).map((_, starIndex) => (
                <Star key={`${current.id}-${starIndex}`} size={18} fill="currentColor" />
              ))}
            </div>
          </div>
          <p className="mt-6 text-2xl font-medium leading-9 text-white">{current.preview}</p>
          <p className="mt-4 text-sm text-white/50">Click to read full feedback</p>
        </button>
        <div className="mt-5 flex justify-center gap-3">
          <button type="button" onClick={() => move(-1)} className="carousel-button" aria-label="Previous testimonial">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => move(1)} className="carousel-button" aria-label="Next testimonial">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {selectedTestimonial && (
        <Modal title={`${selectedTestimonial.name} feedback`} onClose={() => setSelectedTestimonial(null)}>
          <div className="mb-4 flex items-center gap-2 text-gold">
            {Array.from({ length: selectedTestimonial.rating }).map((_, starIndex) => (
              <Star key={`${selectedTestimonial.id}-modal-${starIndex}`} size={18} fill="currentColor" />
            ))}
          </div>
          <p className="leading-7 text-white/70">{selectedTestimonial.feedback}</p>
          <div className="mt-5 grid gap-3 rounded-md border border-white/10 bg-white/6 p-4 sm:grid-cols-2">
            <p className="text-sm text-white/56">
              Service <span className="block pt-1 font-semibold text-white">{selectedTestimonial.service}</span>
            </p>
            <p className="text-sm text-white/56">
              Date <span className="block pt-1 font-semibold text-white">{selectedTestimonial.date}</span>
            </p>
          </div>
        </Modal>
      )}
    </section>
  )
}
