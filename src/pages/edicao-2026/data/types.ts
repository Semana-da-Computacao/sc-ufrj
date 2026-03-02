export interface PresenterSocials {
  lattes?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}

export interface EventPresenter {
  name: string;
  role?: string;
  photoUrl?: string;
  socials?: PresenterSocials;
}

export interface EventTrail {
  key: string;
  label: string;
}

export interface EventSession {
  time: string;
  endTime: string;
  title: string;
  speaker: string;
  type: string;
  description: string;
  trail?: EventTrail;
  presenters?: EventPresenter[];
}

export interface EventTrack {
  name: string;
  sessions: EventSession[];
}

export interface EventDay {
  id: string;
  label: string;
  dateLabel: string;
  tracks: EventTrack[];
}

export interface EventTheme {
  name: string;
  visualDirection: string;
}

export interface EventHero {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface EventInfo {
  dateRangeLabel: string;
  location: string;
  status: string;
  description: string;
}

export interface EventLinks {
  even3: string;
  instagram: string;
}

export interface EventPresentationSubmission {
  title: string;
  description: string;
  deadline: string;
  date: string;
  time: string;
  location: string;
  contactEmail: string;
  formUrl: string;
}

export interface EventAssets {
  heroFallbackGif: string;
  heroRightImage: string;
  zombieLeft: string;
  zombieRight: string;
}

export interface EventSeo {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  siteName?: string;
  ogType?: "website" | "article" | "event";
}

export interface EventStorySection {
  id: string;
  kicker?: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface EventBrand {
  name: string;
  logoUrl: string;
  website?: string;
}

export interface EventSponsorTier {
  type: 1 | 2 | 3;
  label: string;
  description?: string;
  brands: EventBrand[];
}

export interface EventSponsors {
  title: string;
  subtitle?: string;
  tiers: EventSponsorTier[];
  partners: EventBrand[];
}

export interface EventEditionData {
  year: number;
  theme: EventTheme;
  hero: EventHero;
  eventInfo: EventInfo;
  links: EventLinks;
  presentationSubmission: EventPresentationSubmission;
  assets: EventAssets;
  seo?: EventSeo;
  sponsors: EventSponsors;
  storySections: EventStorySection[];
  days: EventDay[];
}
