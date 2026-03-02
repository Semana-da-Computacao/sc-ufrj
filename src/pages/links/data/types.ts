export type LinkCardIcon =
  | "link"
  | "sparkles"
  | "youtube"
  | "instagram"
  | "linkedin"
  | "github"
  | "mail"
  | "calendar"
  | "map-pin"
  | "users"
  | "book"
  | "ticket"
  | "globe"
  | "mic"
  | "video";

export interface LinkItem {
  label: string;
  url: string;
  subtitle?: string;
  icon?: LinkCardIcon;
}

export interface LinksProfile {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  location?: string;
}

export interface LinksHeader {
  badge: string;
  title: string;
  subtitle: string;
  announcement?: string;
  heroVideoUrl?: string;
}

export interface BaseCard {
  id: string;
  type: "link" | "featured" | "video" | "grid" | "contact";
  title: string;
  description?: string;
  icon?: LinkCardIcon;
}

export interface LinkCard extends BaseCard {
  type: "link";
  url: string;
  ctaLabel?: string;
}

export interface FeaturedCard extends BaseCard {
  type: "featured";
  url: string;
  imageUrl?: string;
  ctaLabel?: string;
  meta?: string;
}

export interface VideoCard extends BaseCard {
  type: "video";
  videoUrl: string;
  ctaUrl?: string;
  ctaLabel?: string;
}

export interface GridCard extends BaseCard {
  type: "grid";
  columns?: 2 | 3 | 4;
  items: LinkItem[];
}

export interface ContactCard extends BaseCard {
  type: "contact";
  email?: string;
  whatsappUrl?: string;
  links: LinkItem[];
}

export type LinksCard = LinkCard | FeaturedCard | VideoCard | GridCard | ContactCard;

export interface LinksSection {
  id: string;
  title: string;
  subtitle?: string;
  layout?: "grid" | "list";
  cards: LinksCard[];
}

export interface LinksSeo {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  siteName?: string;
  ogType?: "website" | "article" | "event";
}

export interface LinksPageData {
  profile: LinksProfile;
  header: LinksHeader;
  primaryLinks: LinkItem[];
  sections: LinksSection[];
  footerNote?: string;
  seo?: LinksSeo;
}
