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
import { isSupabaseConfigured, supabase } from './supabase'

export type PublicContent = {
  profile?: PublicProfile
  about?: {
    summary?: string
    mission?: string
  }
  categories?: PortfolioCategory[]
  services?: PublicService[]
  portfolioItems?: PortfolioItem[]
  testimonials?: Testimonial[]
  proofItems?: ProofItem[]
  educationItems?: EducationItem[]
  experienceItems?: ExperienceItem[]
  faqs?: {
    question: string
    answer: string
  }[]
}

export async function fetchPublicContent(): Promise<PublicContent> {
  if (!isSupabaseConfigured || !supabase) {
    return {}
  }

  const [
    settingsResult,
    categoriesResult,
    servicesResult,
    portfolioResult,
    testimonialsResult,
    proofsResult,
    educationResult,
    experienceResult,
    faqsResult,
  ] = await Promise.all([
    supabase.from('site_settings').select('setting_key, setting_value').in('setting_key', ['profile', 'about']),
    supabase.from('portfolio_categories').select('name').order('sort_order'),
    supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('portfolio_items').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
    supabase.from('proof_items').select('*').order('sort_order'),
    supabase.from('education_items').select('*').order('sort_order'),
    supabase.from('experience_items').select('*').order('sort_order'),
    supabase.from('faqs').select('question, answer').eq('is_active', true).order('sort_order'),
  ])

  const settings = new Map(
    settingsResult.data?.map((item) => [item.setting_key, item.setting_value]) ?? [],
  )

  return {
    profile: settings.get('profile') as PublicProfile | undefined,
    about: settings.get('about') as PublicContent['about'] | undefined,
    services: servicesResult.data?.map((service) => ({
      title: service.name,
      description: service.description,
      professionalBackground: service.professional_background ?? undefined,
      expertise: service.expertise ?? [],
      tools: service.tools ?? [],
      iconName: service.icon_name ?? undefined,
      imageUrl: service.image_url ?? undefined,
      priceRange: service.price_range ?? undefined,
    })),
    categories: categoriesResult.data?.length
      ? ([
          'All',
          ...categoriesResult.data.map((category) => category.name),
        ] as PortfolioCategory[])
      : undefined,
    portfolioItems: portfolioResult.data?.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category as Exclude<PortfolioCategory, 'All'>,
      summary: item.summary,
      description: item.description ?? item.summary,
      outcome: item.outcome ?? 'Client-ready project delivery.',
      technologies: item.technologies ?? [],
      image: item.category,
      coverUrl: item.cover_url ?? undefined,
      mediaUrls: item.media_urls ?? [],
      beforeUrl: item.before_url ?? undefined,
      afterUrl: item.after_url ?? undefined,
    })) ?? undefined,
    testimonials: testimonialsResult.data?.map((item) => ({
      id: item.id,
      name: item.client_name,
      service: item.service,
      preview: item.preview,
      feedback: item.feedback,
      rating: item.rating ?? 5,
      date: item.feedback_date ?? 'Recent',
    })),
    proofItems: proofsResult.data?.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? undefined,
      imageUrl: item.image_url ?? undefined,
      category: item.category,
      isFeatured: item.is_featured,
    })),
    educationItems: educationResult.data?.map((item) => ({
      id: item.id,
      title: item.title,
      institution: item.institution,
      location: item.location ?? undefined,
      details: item.details ?? [],
    })),
    experienceItems: experienceResult.data?.map((item) => ({
      id: item.id,
      company: item.company,
      role: item.role,
      location: item.location ?? undefined,
      duration: item.duration ?? undefined,
      details: item.details ?? [],
    })),
    faqs: faqsResult.data ?? [],
  }
}
