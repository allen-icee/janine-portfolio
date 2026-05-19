import { BriefcaseBusiness, GraduationCap, Rocket } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'

const timeline = [
  {
    year: '2023',
    title: 'Started freelance support work',
    description: 'Focused on academic assistance, document polishing, and organized client delivery.',
  },
  {
    year: '2024',
    title: 'Expanded into creative services',
    description: 'Added video editing, design support, animation concepts, and visual presentation work.',
  },
  {
    year: '2025',
    title: 'Built stronger web systems',
    description: 'Moved toward modern websites, client-facing systems, and admin-ready content workflows.',
  },
]

const stack = ['Laravel', 'React', 'TypeScript', 'Tailwind CSS v4', 'Supabase', 'Vercel', 'Figma', 'Canva']

export function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title="A calm, polished process for busy clients."
        description="I help clients turn scattered ideas, files, and requirements into professional deliverables that feel clear, organized, and ready to present."
      />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-panel/72 p-6">
          <div className="mb-6 grid size-12 place-items-center rounded-md bg-cyan/12 text-cyan">
            <BriefcaseBusiness />
          </div>
          <h3 className="text-2xl font-semibold text-white">Freelancing mission</h3>
          <p className="mt-4 leading-7 text-white/64">
            My goal is to make professional work easier for clients: clearer documents, sharper websites,
            cleaner content, and a dependable handoff. I care about both the final output and the experience
            of getting there.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {stack.map((item) => (
              <span key={item} className="rounded-md border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/70">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const Icon = index === 0 ? GraduationCap : index === 1 ? Rocket : BriefcaseBusiness

            return (
              <div key={item.year} className="rounded-lg border border-white/10 bg-white/6 p-5">
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gold">{item.year}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 leading-7 text-white/60">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
