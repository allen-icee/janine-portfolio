import { Icon } from '@iconify/react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Mail,
  Menu,
  MessageCircle,
  Send,
  Star,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Helmet } from 'react-helmet-async'
import {
  categories,
  educationItems,
  experienceItems,
  faqs,
  packages,
  portfolioItems,
  profile,
  proofItems,
  services,
  skills,
  stats,
  testimonials,
  trustCards,
} from '../data/site'
import { fetchPublicContent } from '../lib/publicContent'
import type {
  EducationItem,
  ExperienceItem,
  PortfolioCategory,
  PortfolioItem,
  ProofItem,
  PublicProfile,
  PublicService,
  Testimonial,
} from '../types/content'

const aboutFallback = {
  summary:
    'I am a results-driven Virtual Assistant with expertise in social media management, graphic design and illustration, virtual research, data analytics, and data management support. With experience in both corporate and freelance environments, I bring structure, precision, and strategic thinking to every project. I create high-quality visual assets, manage brand-aligned digital platforms, and transform complex data into actionable insights that drive informed decisions.',
  mission:
    'I operate with a high standard of professionalism, confidentiality, and attention to detail, consistently delivering projects on time and with measurable impact. Whether supporting entrepreneurs, global clients, or academic professionals, I combine creative intelligence with analytical rigor and operational efficiency to help you achieve your goals and elevate your business.',
}

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Works', href: '#portfolio' },
  { label: 'Proofs', href: '#proofs' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function imageOrPlaceholder(url: string | undefined, label: string, className = '') {
  if (url) {
    return <img src={url} alt={label} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  }

  return (
    <div className={`grid h-full min-h-48 place-items-center bg-[linear-gradient(135deg,#f3eadc,#b39b87)] ${className}`}>
      <div className="rounded-3xl border border-white/45 bg-white/20 px-8 py-6 text-center backdrop-blur">
        <p className="font-serif text-4xl text-coffee">JD</p>
        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ink/55">{label}</p>
      </div>
    </div>
  )
}

export function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [category, setCategory] = useState<PortfolioCategory>('All')
  const [activeService, setActiveService] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [editableProfile, setEditableProfile] = useState<PublicProfile>(profile)
  const [aboutContent, setAboutContent] = useState(aboutFallback)
  const [editableServices, setEditableServices] = useState<PublicService[]>(services)
  const [editablePortfolioItems, setEditablePortfolioItems] = useState<PortfolioItem[]>(portfolioItems)
  const [editableTestimonials, setEditableTestimonials] = useState<Testimonial[]>(testimonials)
  const [editableProofs, setEditableProofs] = useState<ProofItem[]>(proofItems)
  const [editableEducation, setEditableEducation] = useState<EducationItem[]>(educationItems)
  const [editableExperience, setEditableExperience] = useState<ExperienceItem[]>(experienceItems)
  const [editableFaqs, setEditableFaqs] = useState(faqs)

  const projects = useMemo(
    () =>
      category === 'All'
        ? editablePortfolioItems
        : editablePortfolioItems.filter((project) => project.category === category),
    [category, editablePortfolioItems],
  )
  const activeServiceItem = editableServices[activeService % editableServices.length]
  const activeTestimonialItem = editableTestimonials[activeTestimonial % editableTestimonials.length]
  const contactLinks: Array<{ label: string; href?: string; icon: string }> = [
    { label: 'Facebook', href: editableProfile.facebookUrl, icon: 'logos:facebook' },
    { label: 'Instagram', href: editableProfile.instagramUrl, icon: 'skill-icons:instagram' },
    { label: 'LinkedIn', href: editableProfile.linkedinUrl, icon: 'skill-icons:linkedin' },
    { label: 'WhatsApp', href: editableProfile.whatsappUrl, icon: 'logos:whatsapp-icon' },
    { label: 'Telegram', href: editableProfile.telegramUrl, icon: 'logos:telegram' },
    { label: 'Messenger', href: editableProfile.messengerUrl, icon: 'logos:messenger' },
  ]

  useEffect(() => {
    const loadContent = async () => {
      const content = await fetchPublicContent()

      if (content.profile) setEditableProfile({ ...profile, ...content.profile })
      if (content.about) setAboutContent({ ...aboutFallback, ...content.about })
      if (content.services?.length) {
        setEditableServices(content.services.map((service, index) => ({ ...services[index % services.length], ...service })))
      }
      if (content.portfolioItems?.length) setEditablePortfolioItems(content.portfolioItems)
      if (content.testimonials?.length) setEditableTestimonials(content.testimonials)
      if (content.proofItems?.length) setEditableProofs(content.proofItems)
      if (content.educationItems?.length) setEditableEducation(content.educationItems)
      if (content.experienceItems?.length) setEditableExperience(content.experienceItems)
      if (content.faqs?.length) setEditableFaqs(content.faqs)
    }

    void loadContent()
  }, [])

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success('Message form is ready. Laravel submission wiring comes next.')
  }

  return (
    <>
      <Helmet>
        <title>{editableProfile.name} | Premium Virtual Assistant</title>
        <meta
          name="description"
          content="Premium virtual assistant services for social media management, graphic design, research, analytics, and documentation."
        />
        <meta property="og:title" content={`${editableProfile.name} | Premium Virtual Assistant`} />
        <meta property="og:description" content={editableProfile.tagline} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Toaster position="top-right" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#17110d]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="font-serif text-lg font-semibold sm:text-xl">
            {editableProfile.name}
          </a>
          <nav className="hidden items-center gap-7 text-sm text-white/70 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="/admin/login" className="text-sm text-white/55 hover:text-white">
              Admin
            </a>
            <a href="#contact" className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-white">
              Hire Me
            </a>
          </div>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-white/12 lg:hidden"
            onClick={() => setMobileNavOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 bg-[#17110d] px-4 lg:hidden"
            >
              <div className="grid gap-1 py-4">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} className="rounded-xl px-3 py-3 text-white/75">
                    {item.label}
                  </a>
                ))}
                <a href="/admin/login" className="rounded-xl px-3 py-3 text-white/55">Admin</a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="overflow-hidden">
        <section className="relative bg-[#17110d] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(210,177,121,0.22),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.12),transparent_22%)]" />
          <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <p className="mb-5 inline-flex rounded-full border border-gold/25 bg-white/8 px-4 py-2 text-sm text-gold">
                {editableProfile.availability}
              </p>
              <p className="font-serif text-lg text-white/70">{editableProfile.name} | {editableProfile.title}</p>
              <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-8xl">
                {editableProfile.headline}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">{editableProfile.tagline}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-bold text-ink transition hover:-translate-y-0.5 hover:bg-white">
                  Hire Me <ArrowRight className="ml-2" size={18} />
                </a>
                <a href="#portfolio" className="inline-flex items-center justify-center rounded-full border border-white/18 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                  View Portfolio
                </a>
                {editableProfile.cvUrl && (
                  <a href={editableProfile.cvUrl} className="inline-flex items-center justify-center rounded-full border border-white/18 px-6 py-3 font-bold text-white/80 transition hover:bg-white/10">
                    <Download className="mr-2" size={18} /> Download CV
                  </a>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs text-white/70 sm:text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }}>
              <div className="relative mx-auto max-w-md rounded-[2rem] border border-white/12 bg-white/10 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  {imageOrPlaceholder(editableProfile.heroImageUrl, 'Hero Image')}
                </div>
                <div className="absolute -bottom-5 left-6 right-6 rounded-2xl border border-white/12 bg-[#211813]/90 p-4 shadow-2xl backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/54">Client-ready support</p>
                      <p className="font-serif text-xl">{editableProfile.title}</p>
                    </div>
                    <BadgeCheck className="text-gold" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-cream px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-coffee/10 bg-white/50 p-5 shadow-sm">
                <p className="font-serif text-4xl text-ink">{stat.value}</p>
                <p className="mt-1 text-sm text-ink/58">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="bg-[linear-gradient(180deg,#f2eadf,#e5d8c8)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-coffee/65">Services</p>
                <h2 className="mt-3 font-serif text-4xl text-ink sm:text-6xl">Expertise that feels organized.</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setActiveService((value) => (value - 1 + editableServices.length) % editableServices.length)} className="carousel-button">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => setActiveService((value) => (value + 1) % editableServices.length)} className="carousel-button">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="grid gap-3">
                {editableServices.map((service, index) => (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => setActiveService(index)}
                    className={`rounded-3xl border p-5 text-left transition ${
                      activeService === index ? 'border-coffee bg-white shadow-xl' : 'border-coffee/10 bg-white/35 hover:bg-white/55'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon icon={service.iconName ?? 'solar:star-bold-duotone'} className="text-3xl text-coffee" />
                      <h3 className="font-serif text-2xl text-ink">{service.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink/62">{service.description}</p>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.article
                  key={activeServiceItem.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="rounded-[2rem] border border-coffee/10 bg-white/55 p-5 shadow-[0_24px_70px_rgba(73,55,39,0.12)] sm:p-7"
                >
                  <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                      <div className="aspect-[16/10] overflow-hidden rounded-3xl border border-coffee/10">
                        {imageOrPlaceholder(activeServiceItem.imageUrl, activeServiceItem.title)}
                      </div>
                      <h3 className="mt-6 font-serif text-3xl text-ink">{activeServiceItem.title}</h3>
                      <p className="mt-3 leading-7 text-ink/66">{activeServiceItem.professionalBackground ?? activeServiceItem.description}</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl text-ink">Tools & skills</h4>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {(activeServiceItem.tools ?? []).map((tool) => (
                          <span key={tool} className="grid size-12 place-items-center rounded-2xl bg-cream text-3xl shadow-sm">
                            <Icon icon={tool} />
                          </span>
                        ))}
                      </div>
                      <ul className="mt-6 space-y-3 text-ink/72">
                        {(activeServiceItem.expertise ?? [activeServiceItem.description]).map((item) => (
                          <li key={item} className="flex gap-3 leading-7">
                            <BadgeCheck className="mt-1 shrink-0 text-coffee" size={18} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a href="#portfolio" className="mt-8 inline-flex rounded-full bg-taupe px-6 py-3 font-semibold text-white transition hover:bg-coffee">
                        View Sample Projects
                      </a>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="bg-[#17110d] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trustCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <card.icon className="text-gold" />
                <h3 className="mt-4 font-serif text-2xl">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-coffee/65">Portfolio</p>
                <h2 className="mt-3 font-serif text-4xl text-ink sm:text-6xl">Selected works and outcomes.</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                      category === item ? 'border-coffee bg-coffee text-white' : 'border-coffee/20 bg-white/45 text-ink/70'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
              {projects.map((project, index) => (
                <button
                  key={`${project.title}-${index}`}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="mb-5 w-full break-inside-avoid overflow-hidden rounded-[1.75rem] border border-coffee/10 bg-white/55 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {imageOrPlaceholder(project.coverUrl, project.title)}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-coffee/70">{project.category}</p>
                    <h3 className="mt-2 font-serif text-2xl text-ink">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink/62">{project.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tool) => (
                        <span key={tool} className="rounded-full bg-panel px-3 py-1 text-xs text-coffee">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="proofs" className="bg-[linear-gradient(180deg,#e4d8c8,#f4ede3)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-coffee/65">Proofs</p>
              <h2 className="mt-3 font-serif text-4xl italic text-ink sm:text-6xl">
                Scalable proof gallery for client trust.
              </h2>
              <p className="mt-5 text-ink/62">
                Add proof screenshots, work samples, delivery confirmations, or testimonial graphics from the admin dashboard.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {editableProofs.map((proof) => (
                <article key={proof.id} className="overflow-hidden rounded-3xl border border-coffee/10 bg-white/55 shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden">{imageOrPlaceholder(proof.imageUrl, proof.title)}</div>
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-coffee/65">{proof.category}</p>
                    <h3 className="mt-2 font-serif text-xl text-ink">{proof.title}</h3>
                    {proof.description && <p className="mt-2 text-sm leading-6 text-ink/58">{proof.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-coffee/65">About</p>
              <h2 className="mt-3 font-serif text-5xl text-ink sm:text-6xl">A precise creative operator.</h2>
              <div className="mt-8 space-y-5 text-lg leading-8 text-ink/72">
                <p>{aboutContent.summary}</p>
                <p>{aboutContent.mission}</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-coffee/10 bg-white/45 shadow-xl">
              <div className="aspect-[4/3]">{imageOrPlaceholder(editableProfile.aboutImageUrl, 'About Image')}</div>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-7xl gap-6 lg:grid-cols-2">
            <TimelineBlock title="Educational Background" items={editableEducation} />
            <ExperienceBlock items={editableExperience} />
          </div>
        </section>

        <section className="bg-[#17110d] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold/70">Testimonials</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-6xl">What clients say.</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setActiveTestimonial((value) => (value - 1 + editableTestimonials.length) % editableTestimonials.length)} className="carousel-button border-white/20 text-white">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => setActiveTestimonial((value) => (value + 1) % editableTestimonials.length)} className="carousel-button border-white/20 text-white">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTestimonial(activeTestimonialItem)}
              className="w-full rounded-[2rem] border border-white/10 bg-white/8 p-6 text-left shadow-2xl backdrop-blur sm:p-8"
            >
              <div className="mb-5 flex gap-1 text-gold">
                {Array.from({ length: activeTestimonialItem.rating }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif text-2xl italic leading-10 sm:text-3xl">"{activeTestimonialItem.preview}"</p>
              <div className="mt-7 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-gold font-bold text-ink">
                  {activeTestimonialItem.name.slice(0, 1)}
                </div>
                <div>
                  <p className="font-semibold">{activeTestimonialItem.name}</p>
                  <p className="text-sm text-white/54">{activeTestimonialItem.service}</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-coffee/65">Packages</p>
              <h2 className="mt-3 font-serif text-4xl text-ink sm:text-6xl">Flexible support tiers.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {packages.map((item) => (
                <article key={item.name} className={`rounded-[2rem] border p-6 ${item.highlighted ? 'border-coffee bg-coffee text-white shadow-xl' : 'border-coffee/10 bg-white/45 text-ink'}`}>
                  <p className="text-sm font-bold uppercase tracking-wide opacity-70">{item.name}</p>
                  <p className="mt-3 font-serif text-4xl">{item.price}</p>
                  <p className="mt-4 min-h-16 leading-7 opacity-75">{item.description}</p>
                  <ul className="mt-6 space-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm">
                        <BadgeCheck size={17} className="mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[linear-gradient(180deg,#f4ede3,#e4d8c8)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-serif text-4xl text-ink sm:text-6xl">Questions before we start?</h2>
            <div className="mt-10 space-y-3">
              {editableFaqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={faq.question} className="rounded-3xl border border-coffee/10 bg-white/50">
                    <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                      <span className="font-serif text-xl text-ink">{faq.question}</span>
                      <ChevronDown className={`shrink-0 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 leading-7 text-ink/62">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#17110d] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold/70">Contact</p>
              <h2 className="mt-3 font-serif text-5xl sm:text-6xl">Work with me now.</h2>
              <p className="mt-5 leading-8 text-white/62">
                Send the service, timeline, budget range, and project details. You can replace these links anytime from admin profile settings.
              </p>
              <div className="mt-8 grid gap-3">
                <ContactRow icon="solar:letter-bold-duotone" label="Email" value={editableProfile.email} onCopy={() => copyValue(editableProfile.email)} />
                {editableProfile.secondaryEmail && <ContactRow icon="solar:letter-bold-duotone" label="Alt Email" value={editableProfile.secondaryEmail} onCopy={() => copyValue(editableProfile.secondaryEmail ?? '')} />}
                {editableProfile.phone && <ContactRow icon="solar:phone-bold-duotone" label="Phone" value={editableProfile.phone} onCopy={() => copyValue(editableProfile.phone ?? '')} />}
                {editableProfile.secondaryPhone && <ContactRow icon="solar:phone-bold-duotone" label="Alt Phone" value={editableProfile.secondaryPhone} onCopy={() => copyValue(editableProfile.secondaryPhone ?? '')} />}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {contactLinks.map(({ label, href, icon }) => (
                  href ? (
                    <a key={label} href={href} className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/8 text-2xl transition hover:-translate-y-1 hover:bg-white/14" aria-label={label}>
                      <Icon icon={icon} />
                    </a>
                  ) : null
                ))}
              </div>
            </div>
            <form onSubmit={submitContact} className="rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-label text-white">
                  Name
                  <input className="form-input" required placeholder="Your name" />
                </label>
                <label className="form-label text-white">
                  Email
                  <input className="form-input" type="email" required placeholder="you@example.com" />
                </label>
                <label className="form-label text-white">
                  Service Needed
                  <select className="form-input" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {editableServices.map((service) => <option key={service.title}>{service.title}</option>)}
                  </select>
                </label>
                <label className="form-label text-white">
                  Budget Range
                  <select className="form-input" defaultValue="">
                    <option value="" disabled>Select a range</option>
                    <option>Below PHP 2,000</option>
                    <option>PHP 2,000 - PHP 5,000</option>
                    <option>PHP 5,000 - PHP 15,000</option>
                    <option>PHP 15,000+</option>
                    <option>Not sure yet</option>
                  </select>
                </label>
              </div>
              <label className="form-label mt-4 text-white">
                Message
                <textarea className="form-input min-h-36 resize-y" required placeholder="Tell me about your project..." />
              </label>
              <button className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 font-bold text-ink transition hover:bg-white">
                <Send className="mr-2" size={18} /> Send Inquiry
              </button>
              <p className="mt-3 text-center text-xs text-white/48">Never submit passwords through this form.</p>
            </form>
          </div>
        </section>
      </main>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <a href="#contact" className="grid size-12 place-items-center rounded-full bg-gold text-ink shadow-xl transition hover:-translate-y-1" aria-label="Contact form">
          <MessageCircle size={20} />
        </a>
        <a href={`mailto:${editableProfile.email}`} className="grid size-12 place-items-center rounded-full border border-white/10 bg-[#17110d] text-white shadow-xl transition hover:-translate-y-1" aria-label="Email">
          <Mail size={20} />
        </a>
      </div>

      <footer className="border-t border-coffee/10 bg-cream px-4 py-8 text-sm text-ink/70 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>Copyright (c) 2026 {editableProfile.name} | {editableProfile.title}</p>
          <p>{editableProfile.location}</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
        {selectedTestimonial && (
          <TestimonialModal testimonial={selectedTestimonial} onClose={() => setSelectedTestimonial(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

function TimelineBlock({ title, items }: { title: string; items: EducationItem[] }) {
  return (
    <section className="rounded-[2rem] border border-coffee/10 bg-white/45 p-6">
      <h3 className="font-serif text-3xl text-ink">{title}</h3>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <article key={item.id} className="border-l-2 border-coffee/25 pl-4">
            <h4 className="font-serif text-xl text-ink">{item.title}</h4>
            <p className="mt-1 text-sm font-semibold text-coffee">{item.institution}</p>
            {item.location && <p className="text-sm text-ink/55">{item.location}</p>}
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-ink/66">
              {item.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function ExperienceBlock({ items }: { items: ExperienceItem[] }) {
  return (
    <section className="rounded-[2rem] border border-coffee/10 bg-white/45 p-6">
      <h3 className="font-serif text-3xl text-ink">Work Experience</h3>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <article key={item.id} className="border-l-2 border-coffee/25 pl-4">
            <h4 className="font-serif text-xl text-ink">{item.company}</h4>
            <p className="mt-1 text-sm font-semibold text-coffee">{item.role}</p>
            <p className="text-sm text-ink/55">{[item.location, item.duration].filter(Boolean).join(' | ')}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-ink/66">
              {item.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function ContactRow({ icon, label, value, onCopy }: { icon: string; label: string; value: string; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/8 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon icon={icon} className="shrink-0 text-2xl text-gold" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-white/42">{label}</p>
          <p className="truncate text-sm text-white/80 sm:text-base">{value}</p>
        </div>
      </div>
      <button type="button" onClick={onCopy} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/65 hover:text-white" aria-label={`Copy ${label}`}>
        <Copy size={16} />
      </button>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: PortfolioItem; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.article initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }} className="max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-cream p-5 shadow-2xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-coffee/70">{project.category}</p>
            <h3 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{project.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-coffee/15">
            <X size={18} />
          </button>
        </div>
        <div className="aspect-video overflow-hidden rounded-3xl">{imageOrPlaceholder(project.coverUrl, project.title)}</div>
        <p className="mt-5 leading-7 text-ink/70">{project.description}</p>
        <div className="mt-5 rounded-3xl bg-white/55 p-5">
          <p className="font-semibold text-coffee">Client outcome</p>
          <p className="mt-2 leading-7 text-ink/70">{project.outcome}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tool) => <span key={tool} className="rounded-full bg-panel px-3 py-1 text-sm text-coffee">{tool}</span>)}
        </div>
      </motion.article>
    </motion.div>
  )
}

function TestimonialModal({ testimonial, onClose }: { testimonial: Testimonial; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.article initial={{ y: 24, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.98 }} className="w-full max-w-xl rounded-[2rem] bg-cream p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-3xl text-ink">{testimonial.name}</h3>
            <p className="mt-1 text-coffee">{testimonial.service}</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-coffee/15">
            <X size={18} />
          </button>
        </div>
        <div className="mb-4 flex gap-1 text-coffee">
          {Array.from({ length: testimonial.rating }).map((_, index) => <Star key={index} size={18} fill="currentColor" />)}
        </div>
        <p className="leading-7 text-ink/72">{testimonial.feedback}</p>
        <p className="mt-5 text-sm text-ink/48">{testimonial.date}</p>
      </motion.article>
    </motion.div>
  )
}
