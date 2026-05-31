// src/types/content.ts

import type { LucideIcon } from "lucide-react";

export type PortfolioCategory = "All" | (string & {});

export type PortfolioItem = {
  id: number | string;
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
  id: number | string;
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
  toolFallbacks?: Record<string, string>;
  imageUrl?: string;
  priceRange?: string;
  iconName?: string;
  icon?: LucideIcon;
}

export type ProofItem = {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  isFeatured?: boolean;
  sort_order: number;
};

export type EducationItem = {
  id?: string;
  title: string;
  institution: string;
  location?: string;
  details: string[];
  sort_order: number;
};

export type ExperienceItem = {
  id?: string;
  company: string;
  role: string;
  location?: string;
  duration?: string;
  details: string[];
  sort_order: number;
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

export type RateItem = {
  id?: string;
  name: string;
  rate: string;
  sortOrder: number;
  isActive?: boolean;
};

export type RateServiceGroup = {
  id?: string;
  title: string;
  description?: string;
  note?: string;
  sortOrder: number;
  isActive?: boolean;
  rates: RateItem[];
};

export type RateCategory = {
  id?: string;
  title: string;
  description?: string;
  iconName?: string;
  note?: string;
  inclusions?: string[];
  sortOrder: number;
  isActive?: boolean;
  groups: RateServiceGroup[];
};
