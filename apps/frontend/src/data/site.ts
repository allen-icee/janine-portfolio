import {
  BookOpen,
  Clock,
  Database,
  FileText,
  HandCoins,
  LayoutDashboard,
  MessageCircle,
  PenTool,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import type {
  EducationItem,
  ExperienceItem,
  PortfolioCategory,
  PortfolioItem,
  ProofItem,
  PublicProfile,
  PublicService,
  ServicePackage,
  Testimonial,
  TrustCard,
} from '../types/content'

export const profile: PublicProfile = {
  name: 'Janine Dequiros',
  title: 'Virtual Assistant',
  headline: "Plan and grow, I'll run the show.",
  tagline:
    'I deliver professional, detail-driven support with discretion and efficiency, helping entrepreneurs and professionals achieve their goals and grow with confidence.',
  email: 'janedeqz@gmail.com',
  secondaryEmail: 'janine.dequiros.18@gmail.com',
  phone: '+63 991 688 1778',
  secondaryPhone: '+63 967 278 9012',
  location: 'Tarlac City, Philippines',
  availability: 'Available for freelance work',
  heroImageUrl: '',
  aboutImageUrl: '',
  cvUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  githubUrl: '',
  whatsappUrl: '',
  telegramUrl: '',
  messengerUrl: '',
}

export const skills = [
  'Social Media Management',
  'Graphic Design and Illustration',
  'Virtual Research Consultant',
  'Data and Analytics Virtual Assistant',
  'Academic Research Support',
  'Documentation',
]

export const stats = [
  { label: 'Projects Completed', value: '60+' },
  { label: 'Happy Clients', value: '35+' },
  { label: 'Years Experience', value: '3+' },
  { label: 'Success Rate', value: '98%' },
]

export const services: PublicService[] = [
  {
    title: 'Social Media Management',
    description: 'Meaningful content, scheduling, engagement support, and consistent brand voice.',
    professionalBackground:
      'Social media is the frontline of brand communication. I help businesses grow their online presence by crafting meaningful content, managing communities, and analyzing engagement trends.',
    expertise: [
      'Experience creating, scheduling, and managing content for social media platforms.',
      'Skilled in boosting engagement, growing followers, and maintaining consistent brand voice.',
      'Able to analyze metrics and provide actionable insights to improve performance.',
    ],
    tools: ['simple-icons:instagram', 'logos:google-analytics', 'logos:facebook', 'logos:figma'],
    iconName: 'solar:users-group-rounded-bold-duotone',
    icon: Users,
  },
  {
    title: 'Graphic Design and Illustrator',
    description: 'High-impact visuals, custom digital art, posters, and brand-aligned creative assets.',
    professionalBackground:
      'Visuals are key to capturing attention and communicating brand identity. I design custom graphics, logos, marketing materials, and digital illustrations aligned with your goals.',
    expertise: [
      'Strong foundation in creating original digital graphics, illustrations, and multimedia assets.',
      'Experienced with tools like Canva, Adobe Creative Suite, and Procreate.',
      'Able to produce brand-aligned visuals for marketing, social media, and academic projects.',
    ],
    tools: ['simple-icons:canva', 'devicon:illustrator', 'devicon:photoshop', 'simple-icons:procreate'],
    iconName: 'solar:palette-bold-duotone',
    icon: PenTool,
  },
  {
    title: 'Virtual Research Consultant',
    description: 'Clear, data-backed insights through market research, academic support, and synthesis.',
    professionalBackground:
      'Data-driven decisions are crucial for growth. I provide market research, competitor analysis, academic research, and information synthesis that translate complexity into action.',
    expertise: [
      'Experienced in conducting in-depth research for business, academic, and creative projects.',
      'Skilled at compiling, organizing, and summarizing information into actionable insights.',
      'Familiar with online databases, academic journals, and industry-specific sources.',
    ],
    tools: ['logos:google-docs', 'logos:gmail-icon', 'logos:microsoft-icon', 'logos:google-scholar'],
    iconName: 'solar:notebook-bookmark-bold-duotone',
    icon: BookOpen,
  },
  {
    title: 'Data & Analytics Virtual Assistant',
    description: 'Data collection, organization, spreadsheet work, analysis, and clear reporting.',
    professionalBackground:
      'Data without interpretation is just numbers. I assist in collecting, organizing, and analyzing data to provide meaningful insights for operational and strategic decisions.',
    expertise: [
      'Proficient in collecting, organizing, and analyzing data for business or academic purposes.',
      'Skilled in transforming complex datasets into clear, actionable reports.',
      'Experienced with spreadsheets, reporting tools, and maintaining accuracy under deadlines.',
    ],
    tools: ['logos:microsoft-excel', 'logos:google-sheets', 'logos:google-forms', 'simple-icons:ibm'],
    iconName: 'solar:chart-2-bold-duotone',
    icon: Database,
  },
]

export const categories: PortfolioCategory[] = [
  'All',
  'Social Media',
  'Graphic Design',
  'Research',
  'Data Analytics',
  'Documentation',
  'Proofs',
]

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Undergraduate Tracer Study',
    category: 'Research',
    summary: 'Research assistance from data gathering to documentation and analysis.',
    description:
      'Organized research notes, refined paper structure, citation clean-up, and final formatting for a client with a tight academic deadline.',
    outcome: 'Improved clarity, faster review process, and a submission-ready document.',
    technologies: ['Microsoft Word', 'Microsoft Excel', 'Google Workspace'],
    image: 'Research',
    coverUrl: '',
  },
  {
    id: 2,
    title: 'TikTok Art Growth & Engagement',
    category: 'Social Media',
    summary: 'Managed a focused TikTok account with content direction and engagement tracking.',
    description:
      'A modern portfolio and booking experience designed to turn casual visitors into serious inquiries.',
    outcome: 'Reduced inquiry friction with a direct contact flow and sharper service positioning.',
    technologies: ['TikTok App', 'TikTok Studio', 'CapCut'],
    image: 'Social',
    coverUrl: '',
  },
  {
    id: 3,
    title: 'Digital Illustration Collection',
    category: 'Graphic Design',
    summary: 'Custom digital illustrations for personal and branded creative use.',
    description:
      'Created a set of high-retention video cuts for promotional use, including captions and motion accents.',
    outcome: 'More polished client presentation and reusable content across social channels.',
    technologies: ['Canva', 'Illustrator', 'Procreate'],
    image: 'Design',
    coverUrl: '',
  },
  {
    id: 4,
    title: 'Likert Scale & ANOVA Study',
    category: 'Data Analytics',
    summary: 'Survey data analysis with interpretation and results documentation.',
    description:
      'Designed a clean visual sequence with scene planning, animation timing, and concise storytelling.',
    outcome: 'Made a complex offer easier to understand in less than a minute.',
    technologies: ['Microsoft Excel', 'Google Sheets', 'SPSS'],
    image: 'Analytics',
    coverUrl: '',
  },
  {
    id: 5,
    title: 'Research Capsule Proposal',
    category: 'Research',
    summary: 'Proposal development, documentation, revisions, and audit preparation.',
    description:
      'Reworked a cluttered interface into a calmer, more professional tool surface for repeated use.',
    outcome: 'Improved readability and made key actions easier to find.',
    technologies: ['Microsoft Word', 'Microsoft Excel', 'Google Workspace'],
    image: 'Proposal',
    coverUrl: '',
  },
  {
    id: 6,
    title: 'Proofs of Legitimacy Archive',
    category: 'Proofs',
    summary: 'Client feedback, transaction screenshots, and completed work proof gallery.',
    description:
      'Built a clean documentation set covering system features, usage notes, screenshots, and delivery details.',
    outcome: 'Easier client handoff and fewer repeated support questions.',
    technologies: ['Testimonials', 'Client Feedback', 'Proofs'],
    image: 'Proofs',
    coverUrl: '',
  },
]

export const proofItems: ProofItem[] = [
  {
    id: 'proof-1',
    title: 'Client testimonial screenshots',
    description: 'A curated proof gallery can be uploaded and managed from the admin dashboard.',
    category: 'Client Feedback',
    imageUrl: '',
    isFeatured: true,
  },
  {
    id: 'proof-2',
    title: 'Completed task proofs',
    description: 'Use this area for screenshots, client messages, and delivery confirmations.',
    category: 'Completed Work',
    imageUrl: '',
    isFeatured: true,
  },
]

export const educationItems: EducationItem[] = [
  {
    id: 'education-1',
    title: 'Bachelor of Secondary Education Major in English',
    institution: 'Gerona Junior College Inc.',
    location: 'Gerona, Tarlac City',
    details: [
      'Bachelor of Secondary Education Major in English',
      'Graduated CUMLAUDE',
      'Highest GWA - 1.41',
      'Overall Best in Research Presentation, Manuscript, Defense and Final Paper',
    ],
  },
  {
    id: 'education-2',
    title: 'Accountancy, Business and Management (ABM)',
    institution: 'Corazon C. Aquino High School',
    location: 'Gerona, Tarlac City',
    details: ['Senior High School', 'Graduated WITH HONORS', 'Highest Grade - 94', 'Champion in Animation (Division Level)'],
  },
  {
    id: 'education-3',
    title: 'Junior High School',
    institution: 'Corazon C. Aquino High School',
    location: 'Gerona, Tarlac City',
    details: ['Graduated WITH HONORS', 'Highest Grade - 93'],
  },
  {
    id: 'education-4',
    title: 'Elementary/Primary',
    institution: 'San Antonio Elementary School',
    location: 'Gerona, Tarlac City',
    details: ['Highest Grade - 90', 'Graduated SALUTATORIAN', '1st Place in Cartooning (Division Level)'],
  },
]

export const experienceItems: ExperienceItem[] = [
  {
    id: 'experience-1',
    company: 'Infosys BPM',
    role: 'Process Executive & Complaints Resolution/Intake Specialist',
    location: 'SM Clark, Mabalacat, Pampanga',
    duration: 'One (1) year and three (3) months',
    details: [
      'CS100 Top 1 Trainee',
      'Mock Calls Top Trainee',
      'Top Agent since January 2025 until February 2026',
      'Most Recognizable Agent for doing extra mile',
    ],
  },
  {
    id: 'experience-2',
    company: 'ACTION AMAKU',
    role: 'Freelancer / Commissioner, Academic Research Specialist',
    location: 'Work from home - Tarlac City',
    duration: 'Three (3) years and three (3) months',
    details: [
      'Doing various tasks or projects for different clients from different places and different grade level.',
      'Mostly focusing on Researches / Thesis',
      'Doing art related commissions such as 2D animations and cute illustrations.',
    ],
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rhane Aquino',
    service: 'Virtual Assistant Support',
    preview: 'Working with Janine was the best decision I made for my business.',
    feedback:
      'The work was organized, thoughtful, and easy to review. Communication was clear from start to finish, and the final document felt polished and reliable.',
    rating: 5,
    date: 'March 2026',
  },
  {
    id: 2,
    name: 'Client Feedback',
    service: 'Research Consultant',
    preview: 'She just gets it, and gets it done.',
    feedback:
      'I needed something clean and client-facing. Janine delivered a design that felt modern, fast, and professional without unnecessary clutter.',
    rating: 5,
    date: 'February 2026',
  },
  {
    id: 3,
    name: 'Verified Client',
    service: 'Design and Documentation',
    preview: 'Everything was delivered with quality and care.',
    feedback:
      'The pacing, captions, and transitions made the videos feel much more professional. Revisions were handled quickly and carefully.',
    rating: 5,
    date: 'January 2026',
  },
]

export const packages: ServicePackage[] = [
  {
    name: 'Starter',
    price: 'Project-based',
    description: 'Best for simple edits, short documents, or quick task support.',
    features: ['1 focused deliverable', 'Clear timeline', 'Basic revision'],
  },
  {
    name: 'Growth',
    price: 'Custom quote',
    description: 'For polished client-ready work with stronger structure and refinement.',
    features: ['Multi-step project', 'Priority updates', 'Two revisions'],
    highlighted: true,
  },
  {
    name: 'Full Support',
    price: 'Custom',
    description: 'For larger research, web, content, or documentation projects.',
    features: ['Project strategy', 'Extended support', 'Launch or handoff help'],
  },
]

export const trustCards: TrustCard[] = [
  {
    title: 'Fast Response',
    description: 'Clear replies, smooth updates, and no guessing about project status.',
    icon: MessageCircle,
  },
  {
    title: 'Quality Work',
    description: 'Every deliverable is reviewed for clarity, polish, and client readiness.',
    icon: Sparkles,
  },
  {
    title: 'Deadline Oriented',
    description: 'Scope and timeline are handled carefully from the first message.',
    icon: Clock,
  },
  {
    title: 'Reliable Process',
    description: 'Simple onboarding, revision-friendly delivery, and organized handoff.',
    icon: ShieldCheck,
  },
]

export const faqs = [
  {
    question: 'How much are your rates?',
    answer:
      'Rates depend on the service, scope, urgency, and number of revisions. Small tasks can start from basic packages, while larger projects get a custom quote.',
  },
  {
    question: 'How long do projects take?',
    answer:
      'Simple tasks can be completed quickly, while research, development, or larger creative projects need a clear timeline after scope review.',
  },
  {
    question: 'What services do you offer?',
    answer:
      'Research assistance, web development, video editing, animation, UI/UX design, documentation, and academic support.',
  },
  {
    question: 'Can you revise work?',
    answer:
      'Yes. Revision terms are included in each package so the final result matches the agreed direction.',
  },
  {
    question: 'Do you accept rush projects?',
    answer:
      'Rush work may be accepted depending on availability and complexity. Urgent projects should include the deadline in the first message.',
  },
]

export const adminCards = [
  {
    title: 'Portfolio Works',
    description: 'Create, update, and feature selected client projects.',
    icon: LayoutDashboard,
  },
  {
    title: 'Testimonials',
    description: 'Manage reviews, ratings, and verified client feedback.',
    icon: Sparkles,
  },
  {
    title: 'Messages',
    description: 'Review inquiries, budgets, services requested, and status.',
    icon: MessageCircle,
  },
  {
    title: 'Services & FAQs',
    description: 'Keep packages, pricing ranges, and common questions current.',
    icon: FileText,
  },
  {
    title: 'Clients & Profit',
    description: 'Audit completed clients, income, expenses, and payment status.',
    icon: HandCoins,
  },
]
