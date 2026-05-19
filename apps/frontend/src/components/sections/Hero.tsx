import { ArrowRight, CheckCircle2, Download, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { profile, skills, stats } from '../../data/site'
import { LinkButton } from '../ui/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(255,255,255,0.06)_0,transparent_24%,rgba(113,219,255,0.08)_72%,transparent_100%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-gold/25 bg-gold/8 px-3 py-2 text-sm text-gold">
            <Sparkles size={16} />
            {profile.availability}
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] text-white md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-5 text-xl font-medium text-cyan md:text-2xl">{profile.title}</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">{profile.tagline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#contact">
              Hire Me
              <ArrowRight className="ml-2" size={18} />
            </LinkButton>
            <LinkButton href="#portfolio" variant="secondary">
              View Portfolio
            </LinkButton>
            <LinkButton href="/cv-janine.pdf" variant="ghost">
              <Download className="mr-2" size={18} />
              Download CV
            </LinkButton>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="rounded-md border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/72"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-lg border border-white/12 bg-white/7 p-4 shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[linear-gradient(145deg,#151b28,#0b0f17)]">
              <div className="absolute inset-x-8 top-8 rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-sm text-white/56">Profile snapshot</p>
                <p className="mt-2 text-2xl font-semibold text-white">Premium freelance support</p>
              </div>
              <div className="absolute inset-x-8 bottom-8 rounded-lg border border-gold/20 bg-ink/74 p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid size-14 place-items-center rounded-md bg-gold text-xl font-bold text-ink">JD</div>
                  <div>
                    <p className="font-semibold text-white">Janine Dequiros</p>
                    <p className="text-sm text-white/56">Research, creative, and web projects</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Reliable communication', 'Clean client-ready output', 'Revision-friendly process'].map((item) => (
                    <p key={item} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 size={16} className="text-cyan" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/10 bg-white/6 p-5">
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-white/56">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
