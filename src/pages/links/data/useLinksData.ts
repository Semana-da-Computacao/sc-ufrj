import { useEffect, useState } from "react";
import { defaultLinksData } from "./defaultLinksData";
import type {
  ContactCard,
  FeaturedCard,
  GridCard,
  LinkCard,
  LinkCardIcon,
  LinkItem,
  LinksCard,
  LinksPageData,
  LinksSection,
  LinksSeo,
  VideoCard,
} from "./types";

const allowedIcons: Set<LinkCardIcon> = new Set([
  "link",
  "sparkles",
  "youtube",
  "instagram",
  "linkedin",
  "github",
  "mail",
  "calendar",
  "map-pin",
  "users",
  "book",
  "ticket",
  "globe",
  "mic",
  "video",
]);

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isIcon(value: unknown): value is LinkCardIcon {
  return isString(value) && allowedIcons.has(value as LinkCardIcon);
}

function isLinkItem(value: unknown): value is LinkItem {
  if (!isObject(value)) return false;

  return (
    isString(value.label) &&
    isString(value.url) &&
    (value.subtitle === undefined || isString(value.subtitle)) &&
    (value.icon === undefined || isIcon(value.icon))
  );
}

function isLinkCard(value: unknown): value is LinkCard {
  if (!isObject(value)) return false;

  return (
    value.type === "link" &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.url) &&
    (value.description === undefined || isString(value.description)) &&
    (value.ctaLabel === undefined || isString(value.ctaLabel)) &&
    (value.icon === undefined || isIcon(value.icon))
  );
}

function isFeaturedCard(value: unknown): value is FeaturedCard {
  if (!isObject(value)) return false;

  return (
    value.type === "featured" &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.url) &&
    (value.description === undefined || isString(value.description)) &&
    (value.imageUrl === undefined || isString(value.imageUrl)) &&
    (value.ctaLabel === undefined || isString(value.ctaLabel)) &&
    (value.meta === undefined || isString(value.meta)) &&
    (value.icon === undefined || isIcon(value.icon))
  );
}

function isVideoCard(value: unknown): value is VideoCard {
  if (!isObject(value)) return false;

  return (
    value.type === "video" &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.videoUrl) &&
    (value.description === undefined || isString(value.description)) &&
    (value.ctaUrl === undefined || isString(value.ctaUrl)) &&
    (value.ctaLabel === undefined || isString(value.ctaLabel)) &&
    (value.icon === undefined || isIcon(value.icon))
  );
}

function isGridCard(value: unknown): value is GridCard {
  if (!isObject(value)) return false;

  return (
    value.type === "grid" &&
    isString(value.id) &&
    isString(value.title) &&
    Array.isArray(value.items) &&
    value.items.every(isLinkItem) &&
    (value.description === undefined || isString(value.description)) &&
    (value.columns === undefined || value.columns === 2 || value.columns === 3 || value.columns === 4) &&
    (value.icon === undefined || isIcon(value.icon))
  );
}

function isContactCard(value: unknown): value is ContactCard {
  if (!isObject(value)) return false;

  return (
    value.type === "contact" &&
    isString(value.id) &&
    isString(value.title) &&
    Array.isArray(value.links) &&
    value.links.every(isLinkItem) &&
    (value.description === undefined || isString(value.description)) &&
    (value.email === undefined || isString(value.email)) &&
    (value.whatsappUrl === undefined || isString(value.whatsappUrl)) &&
    (value.icon === undefined || isIcon(value.icon))
  );
}

function isCard(value: unknown): value is LinksCard {
  return (
    isLinkCard(value) ||
    isFeaturedCard(value) ||
    isVideoCard(value) ||
    isGridCard(value) ||
    isContactCard(value)
  );
}

function isSection(value: unknown): value is LinksSection {
  if (!isObject(value)) return false;

  return (
    isString(value.id) &&
    isString(value.title) &&
    Array.isArray(value.cards) &&
    value.cards.every(isCard) &&
    (value.subtitle === undefined || isString(value.subtitle)) &&
    (value.layout === undefined || value.layout === "grid" || value.layout === "list")
  );
}

function isSeo(value: unknown): value is LinksSeo {
  if (!isObject(value)) return false;

  return (
    isString(value.title) &&
    isString(value.description) &&
    (value.keywords === undefined || isString(value.keywords)) &&
    (value.canonicalUrl === undefined || isString(value.canonicalUrl)) &&
    (value.ogImage === undefined || isString(value.ogImage)) &&
    (value.twitterImage === undefined || isString(value.twitterImage)) &&
    (value.twitterCard === undefined || value.twitterCard === "summary" || value.twitterCard === "summary_large_image") &&
    (value.siteName === undefined || isString(value.siteName)) &&
    (value.ogType === undefined || value.ogType === "website" || value.ogType === "article" || value.ogType === "event")
  );
}

function isLinksData(value: unknown): value is LinksPageData {
  if (!isObject(value)) return false;
  if (!isObject(value.profile)) return false;
  if (!isObject(value.header)) return false;

  const profile = value.profile;
  const header = value.header;

  return (
    isString(profile.name) &&
    isString(profile.handle) &&
    isString(profile.bio) &&
    isString(profile.avatarUrl) &&
    (profile.location === undefined || isString(profile.location)) &&
    isString(header.badge) &&
    isString(header.title) &&
    isString(header.subtitle) &&
    (header.announcement === undefined || isString(header.announcement)) &&
    (header.heroVideoUrl === undefined || isString(header.heroVideoUrl)) &&
    Array.isArray(value.primaryLinks) &&
    value.primaryLinks.every(isLinkItem) &&
    Array.isArray(value.sections) &&
    value.sections.every(isSection) &&
    (value.footerNote === undefined || isString(value.footerNote)) &&
    (value.seo === undefined || isSeo(value.seo))
  );
}

export function useLinksData() {
  const [data, setData] = useState<LinksPageData>(defaultLinksData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}links/links.json`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar links: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        if (active && isLinksData(payload)) {
          setData(payload);
        } else if (active) {
          setData(defaultLinksData);
        }
      } catch {
        if (active) {
          setData(defaultLinksData);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading };
}
