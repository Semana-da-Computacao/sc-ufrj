export interface HomeHeroData {
  badge: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
}

export interface HomeStatData {
  number: string;
  label: string;
}

export interface HomeAboutData {
  title: string;
  subtitle: string;
  paragraphs: string[];
}

export interface HomeFeaturedEdition {
  name: string;
  path: string;
  tagline: string;
  imageUrl: string;
}

export interface HomeCommitteeMember {
  name: string;
  role: string;
  photoUrl: string;
  linkedin?: string;
  lattes?: string;
  github?: string;
  instagram?: string;
  site?: string;
  email?: string;
}

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeSeoData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  siteName?: string;
  ogType?: "website" | "article" | "event";
  noindex?: boolean;
}

export interface HomePageData {
  hero: HomeHeroData;
  stats: HomeStatData[];
  about: HomeAboutData;
  featuredEditions: HomeFeaturedEdition[];
  committee: {
    title: string;
    subtitle: string;
    members: HomeCommitteeMember[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: HomeFaqItem[];
  };
  seo?: HomeSeoData;
}
