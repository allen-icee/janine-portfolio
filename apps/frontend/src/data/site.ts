// apps\frontend\src\data\site.ts
import {
  BookOpen,
  Clock,
  Database,
  MessageCircle,
  PenTool,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
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
} from "../types/content";

export const profile: PublicProfile = {
  name: "Janine Dequiros",
  title: "Virtual Assistant",
  headline: "Plan and grow, I'll run the show.",
  tagline:
    "I deliver professional, detail-driven support with discretion and efficiency, helping entrepreneurs and professionals achieve their goals and grow with confidence.",
  email: "janedeqz@gmail.com",
  secondaryEmail: "janine.dequiros.18@gmail.com",
  phone: "+63 991 688 1778",
  secondaryPhone: "+63 967 278 9012",
  location: "Tarlac City, Philippines",
  availability: "Available for freelance work",
  heroImageUrl: "",
  aboutImageUrl: "",
  cvUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  whatsappUrl: "",
  telegramUrl: "",
  messengerUrl: "",
};

export const skills = [
  "Social Media Management",
  "Graphic Design and Illustration",
  "Virtual Research Consultant",
  "Data and Analytics Virtual Assistant",
  "Academic Research Support",
  "Documentation",
];

export const stats = [
  { label: "Projects Completed", value: "60+" },
  { label: "Happy Clients", value: "35+" },
  { label: "Years Experience", value: "3+" },
  { label: "Success Rate", value: "98%" },
];

export const services: PublicService[] = [
  {
    title: "Social Media Management",
    description:
      "I can help you grow your online presence with meaningful content and real engagement.",
    professionalBackground:
      "Social media is the frontline of brand communication. I help businesses grow their online presence by crafting meaningful content, managing communities, and analyzing engagement trends. My approach ensures your brand resonates with the right audience while driving real interactions and measurable results.",
    expertise: [
      "Experience creating, scheduling, and managing content for social media platforms.",
      "Skilled in boosting engagement, growing followers, and maintaining consistent brand voice.",
      "Able to analyze metrics and provide actionable insights to improve performance.",
    ],
    toolTitle: "Social Media Platforms & Tools:",
    tools: [
      "logos:facebook",
      "skill-icons:instagram",
      "logos:tiktok-icon",
      "custom-meta",
      "logos:google-analytics",
      "logos:figma",
    ],
    toolFallbacks: {
      "custom-meta": "/tools/meta.png",
    },
    iconName: "solar:users-group-rounded-bold-duotone",
    icon: Users,
    imageUrl: "/services/social-media.png",
  },
  {
    title: "Graphic Design and Illustrator",
    description:
      "I create high-impact visuals and custom digital art that truly reflect your brand's personality.",
    professionalBackground:
      "Visuals are key to capturing attention and communicating your brand identity. I design custom graphics, logos, marketing materials, and digital illustrations that are both aesthetically appealing and strategically aligned with your goals. Each project is crafted to reflect your brand personality and leave a lasting impression.",
    expertise: [
      "Strong foundation in creating original digital graphics, illustrations, and multimedia assets.",
      "Experienced with tools like Canva, Adobe Creative Suite, and Procreate.",
      "Able to produce brand-aligned visuals for marketing, social media, and academic projects.",
    ],
    toolTitle: "Design & Illustration Tools:",
    tools: [
      "custom-canva",
      "logos:adobe-illustrator",
      "logos:adobe-photoshop",
      "custom-procreate",
      "custom-ibispaint",
      "logos:figma",
    ],
    toolFallbacks: {
      "custom-canva": "/tools/canva.png",
      "custom-procreate": "/tools/procreate.png",
      "custom-ibispaint": "/tools/ibispaint.png",
    },
    iconName: "solar:palette-bold-duotone",
    icon: PenTool,
    imageUrl: "/services/graphic-design.png",
  },
  {
    title: "Virtual Research Consultant",
    description:
      "I deliver clear, data-backed insights through thorough market research.",
    professionalBackground:
      "Data-driven decisions are crucial for business growth. I provide thorough market research, competitor analysis, and consumer insights that help you understand your industry landscape. My services translate complex data into actionable recommendations for strategy development and business planning.",
    expertise: [
      "Experienced in conducting in-depth research for business, academic, and creative projects.",
      "Skilled at compiling, organizing, and summarizing information into actionable insights.",
      "Familiar with online databases, academic journals, and industry-specific sources.",
    ],
    toolTitle: "Research & Productivity Tools:",
    tools: [
      "custom-google-docs",
      "custom-jstor",
      "custom-googlescholar",
      "custom-microsoft-office",
      "custom-wps",
      "custom-gmail",
    ],
    toolFallbacks: {
      "custom-google-docs": "/tools/google-docs.png",
      "custom-jstor": "/tools/jstor.png",
      "custom-googlescholar": "/tools/googlescholar.png",
      "custom-microsoft-office": "/tools/microsoft-office.png",
      "custom-wps": "/tools/wps.png",
      "custom-gmail": "/tools/gmail.png",
    },
    iconName: "solar:notebook-bookmark-bold-duotone",
    icon: BookOpen,
    imageUrl: "/services/virtual-assistant.png",
  },
  {
    title: "Data & Analytics Virtual Assistant",
    description:
      "I turn complex data into clear insights that help your business grow and aid research data.",
    professionalBackground:
      "Data without interpretation is just numbers. I assist in collecting, organizing, and analyzing data to provide meaningful insights that inform business decisions. From dashboards to visual reports, I ensure your data is clear, accurate, and actionable, supporting both operational and strategic goals.",
    expertise: [
      "Proficient in collecting, organizing, and analyzing data for business or academic purposes.",
      "Skilled in transforming complex datasets into clear, actionable reports.",
      "Experienced with spreadsheets, reporting tools, and maintaining accuracy under deadlines.",
    ],
    toolTitle: "Data Management & Analytics Tools:",
    tools: [
      "custom-excel",
      "custom-gsheet",
      "custom-gdatastudio",
      "custom-gforms",
      "custom-mforms",
      "custom-iso",
    ],
    toolFallbacks: {
      "custom-excel": "/tools/excel.png",
      "custom-gsheet": "/tools/gsheet.png",
      "custom-gdatastudio": "/tools/gdatastudio.png",
      "custom-gforms": "/tools/gforms.png",
      "custom-mforms": "/tools/mforms.png",
      "custom-iso": "/tools/iso.png",
    },
    iconName: "solar:chart-2-bold-duotone",
    icon: Database,

    imageUrl: "/services/data-analytics.png",
  },
];

export const categories: PortfolioCategory[] = [
  "All",
  "Social Media",
  "Graphic Design",
  "Research",
  "Data Analytics",
  "Documentation",
  "Proofs",
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Undergraduate Tracer Study",
    category: "Research",
    summary:
      "Research assistance from data gathering to documentation and analysis.",
    description:
      "Organized research notes, refined paper structure, citation clean-up, and final formatting for a client with a tight academic deadline.",
    outcome:
      "Improved clarity, faster review process, and a submission-ready document.",
    technologies: ["Microsoft Word", "Microsoft Excel", "Google Workspace"],
    image: "Research",
    coverUrl: "",
  },
  {
    id: 2,
    title: "TikTok Art Growth & Engagement",
    category: "Social Media",
    summary:
      "Managed a focused TikTok account with content direction and engagement tracking.",
    description:
      "Planned content direction, posting rhythm, and engagement checks for an art-focused TikTok presence.",
    outcome:
      "Improved consistency, clearer creative direction, and stronger audience interaction.",
    technologies: ["TikTok App", "TikTok Studio", "CapCut"],
    image: "Social",
    coverUrl: "",
  },
  {
    id: 3,
    title: "Digital Illustration Collection",
    category: "Graphic Design",
    summary:
      "Custom digital illustrations for personal and branded creative use.",
    description:
      "Created original digital illustrations and reusable branded visuals for personal and promotional use.",
    outcome:
      "Delivered polished creative assets that could be reused across social channels and presentations.",
    technologies: ["Canva", "Illustrator", "Procreate"],
    image: "Design",
    coverUrl: "",
  },
  {
    id: 4,
    title: "Likert Scale & ANOVA Study",
    category: "Data Analytics",
    summary:
      "Survey data analysis with interpretation and results documentation.",
    description:
      "Cleaned survey data, organized Likert-scale results, and supported ANOVA interpretation for research documentation.",
    outcome:
      "Made the findings easier to review, explain, and include in the final paper.",
    technologies: ["Microsoft Excel", "Google Sheets", "SPSS"],
    image: "Analytics",
    coverUrl: "",
  },
  {
    id: 5,
    title: "Research Capsule Proposal",
    category: "Research",
    summary:
      "Proposal development, documentation, revisions, and audit preparation.",
    description:
      "Prepared proposal sections, organized supporting data, and refined documentation for review.",
    outcome:
      "Improved readability and helped the proposal feel complete and submission-ready.",
    technologies: ["Microsoft Word", "Microsoft Excel", "Google Workspace"],
    image: "Proposal",
    coverUrl: "",
  },
  {
    id: 6,
    title: "Proofs of Legitimacy Archive",
    category: "Proofs",
    summary:
      "Client feedback, transaction screenshots, and completed work proof gallery.",
    description:
      "Organized proof screenshots, client messages, and completed work references in one archive.",
    outcome:
      "Made trust signals easier for new clients to review before starting a project.",
    technologies: ["Testimonials", "Client Feedback", "Proofs"],
    image: "Proofs",
    coverUrl: "",
  },
];

export const proofItems: ProofItem[] = [
  {
    id: "proof-1",
    title: "Client testimonial screenshots",
    description:
      "A curated proof gallery can be uploaded and managed from the admin dashboard.",
    category: "Client Feedback",
    imageUrl: "",
    isFeatured: true,
    sort_order: 0,
  },
  {
    id: "proof-2",
    title: "Completed task proofs",
    description:
      "Use this area for screenshots, client messages, and delivery confirmations.",
    category: "Completed Work",
    imageUrl: "",
    isFeatured: true,
    sort_order: 1,
  },
];

export const educationItems: EducationItem[] = [
  {
    id: "education-1",
    title: "Bachelor of Secondary Education Major in English",
    institution: "Gerona Junior College Inc.",
    location: "Gerona, Tarlac City",
    details: [
      "Bachelor of Secondary Education Major in English",
      "Graduated CUMLAUDE",
      "Highest GWA - 1.41",
      "Overall Best in Research Presentation, Manuscript, Defense and Final Paper",
    ],
    sort_order: 0,
  },
  {
    id: "education-2",
    title: "Accountancy, Business and Management (ABM)",
    institution: "Corazon C. Aquino High School",
    location: "Gerona, Tarlac City",
    details: [
      "Senior High School",
      "Graduated WITH HONORS",
      "Highest Grade - 94",
      "Champion in Animation (Division Level)",
    ],
    sort_order: 1,
  },
  {
    id: "education-3",
    title: "Junior High School",
    institution: "Corazon C. Aquino High School",
    location: "Gerona, Tarlac City",
    details: ["Graduated WITH HONORS", "Highest Grade - 93"],
    sort_order: 2,
  },
  {
    id: "education-4",
    title: "Elementary/Primary",
    institution: "San Antonio Elementary School",
    location: "Gerona, Tarlac City",
    details: [
      "Highest Grade - 90",
      "Graduated SALUTATORIAN",
      "1st Place in Cartooning (Division Level)",
    ],
    sort_order: 3,
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    id: "experience-1",
    company: "Infosys BPM",
    role: "Process Executive & Complaints Resolution/Intake Specialist",
    location: "SM Clark, Mabalacat, Pampanga",
    duration: "One (1) year and three (3) months",
    details: [
      "CS100 Top 1 Trainee",
      "Mock Calls Top Trainee",
      "Top Agent since January 2025 until February 2026",
      "Most Recognizable Agent for doing extra mile",
    ],
    sort_order: 0,
  },
  {
    id: "experience-2",
    company: "ACTION AMAKU",
    role: "Freelancer / Commissioner, Academic Research Specialist",
    location: "Work from home - Tarlac City",
    duration: "Three (3) years and three (3) months",
    details: [
      "Doing various tasks or projects for different clients from different places and different grade level.",
      "Mostly focusing on Researches / Thesis",
      "Doing art related commissions such as 2D animations and cute illustrations.",
    ],
    sort_order: 1,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rhane Aquino",
    service: "Virtual Assistant Support",
    preview:
      "Working with Janine was the best decision I made for my business.",
    feedback:
      "The work was organized, thoughtful, and easy to review. Communication was clear from start to finish, and the final document felt polished and reliable.",
    suggestion: "",
    rating: 5,
    date: "March 2026",
  },
  {
    id: 2,
    name: "Client Feedback",
    service: "Research Consultant",
    preview: "She just gets it, and gets it done.",
    feedback:
      "I needed something clean and client-facing. Janine delivered a design that felt modern, fast, and professional without unnecessary clutter.",
    suggestion:
      "Maybe provide a few more layout options to choose from initially.",
    rating: 5,
    date: "February 2026",
  },
  {
    id: 3,
    name: "Verified Client",
    service: "Design and Documentation",
    preview: "Everything was delivered with quality and care.",
    feedback:
      "The pacing, captions, and transitions made the videos feel much more professional. Revisions were handled quickly and carefully.",
    suggestion: "",
    rating: 5,
    date: "January 2026",
  },
];

export const packages: ServicePackage[] = [
  {
    name: "Starter",
    price: "Project-based",
    description:
      "Best for simple edits, short documents, or quick task support.",
    features: ["1 focused deliverable", "Clear timeline", "Basic revision"],
  },
  {
    name: "Growth",
    price: "Custom quote",
    description:
      "For polished client-ready work with stronger structure and refinement.",
    features: ["Multi-step project", "Priority updates", "Two revisions"],
    highlighted: true,
  },
  {
    name: "Full Support",
    price: "Custom",
    description:
      "For larger research, web, content, or documentation projects.",
    features: [
      "Project strategy",
      "Extended support",
      "Launch or handoff help",
    ],
  },
];

export const trustCards: TrustCard[] = [
  {
    title: "Fast Response",
    description:
      "Clear replies, smooth updates, and no guessing about project status.",
    icon: MessageCircle,
  },
  {
    title: "Quality Work",
    description:
      "Every deliverable is reviewed for clarity, polish, and client readiness.",
    icon: Sparkles,
  },
  {
    title: "Deadline Oriented",
    description:
      "Scope and timeline are handled carefully from the first message.",
    icon: Clock,
  },
  {
    title: "Reliable Process",
    description:
      "Simple onboarding, revision-friendly delivery, and organized handoff.",
    icon: ShieldCheck,
  },
];

export const faqs = [
  {
    question: "How much are your rates?",
    answer:
      "Rates depend on the service, scope, urgency, and number of revisions. Small tasks can start from basic packages, while larger projects get a custom quote.",
  },
  {
    question: "How long do projects take?",
    answer:
      "Simple tasks can be completed quickly, while research, development, or larger creative projects need a clear timeline after scope review.",
  },
  {
    question: "What services do you offer?",
    answer:
      "Research assistance, social media management, graphic design, illustration, data analytics, documentation, and academic support.",
  },
  {
    question: "Can you revise work?",
    answer:
      "Yes. Revision terms are included in each package so the final result matches the agreed direction.",
  },
  {
    question: "Do you accept rush projects?",
    answer:
      "Rush work may be accepted depending on availability and complexity. Urgent projects should include the deadline in the first message.",
  },
];
