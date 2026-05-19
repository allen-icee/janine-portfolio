import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { faqs } from '../../data/site'
import { SectionHeading } from '../ui/SectionHeading'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Clear answers before clients reach out."
        description="The goal is to reduce uncertainty and make it easier for a potential client to send a serious inquiry."
      />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div key={faq.question} className="rounded-lg border border-white/10 bg-panel/70">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <ChevronDown className={`shrink-0 text-white/50 transition ${isOpen ? 'rotate-180' : ''}`} size={18} />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-7 text-white/62">{faq.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
