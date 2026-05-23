import type { LucideIcon } from "lucide-react";

export type PortfolioCategory =
  | "All"
  | "Social Media"
  | "Graphic Design"
  | "Research"
  | "Data Analytics"
  | "Documentation"
  | "Proofs";

export type PortfolioItem = {
  id: number;
  title: string;
  category: Exclude<PortfolioCategory, "All">;
  summary: string;
  description: string;
  outcome: string;
  technologies: string[];
  image: string;
  coverUrl?: string;
  mediaUrls?: string[];
  beforeUrl?: string;
  afterUrl?: string;
};

export type Testimonial = {
  id: number;
  name: string;
  service: string;
  preview: string;
  feedback: string;
  rating: number;
  date: string;
};

export type ServicePackage = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type PublicProfile = {
  name: string;
  title: string;
  headline: string;
  tagline: string;
  email: string;
  secondaryEmail?: string;
  phone?: string;
  secondaryPhone?: string;
  location: string;
  availability: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
  cvUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  whatsappUrl?: string;
  telegramUrl?: string;
  messengerUrl?: string;
};

export interface PublicService {
  title: string;
  description: string;

  professionalBackground?: string;

  expertise?: string[];

  tools?: string[];

  toolTitle?: string;

  /* BETTER FALLBACK SYSTEM */
  toolFallbacks?: Record<string, string>;

  imageUrl?: string;

  iconName?: string;

  icon?: LucideIcon;
}

export type ProofItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  isFeatured?: boolean;
};

export type EducationItem = {
  id: string;
  title: string;
  institution: string;
  location?: string;
  details: string[];
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location?: string;
  duration?: string;
  details: string[];
};

export type ClientRecord = {
  id?: string;
  client_name: string;
  project_name?: string;
  service?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
};

export type FinancialRecord = {
  id?: string;
  client_id?: string | null;
  record_type: string;
  description: string;
  amount: number;
  currency: string;
  payment_status: string;
  record_date?: string;
  notes?: string;
};

export type TrustCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};
