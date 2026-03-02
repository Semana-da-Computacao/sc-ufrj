import { useEffect, useState } from "react";
import { defaultEvent2026Data } from "./defaultEvent2026";
import type {
  EventBrand,
  EventDay,
  EventEditionData,
  EventPresenter,
  EventPresentationSubmission,
  EventSeo,
  EventSponsorTier,
  EventSponsors,
  EventStorySection,
  EventTrail,
  EventTrack,
  EventSession,
} from "./types";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isSession(value: unknown): value is EventSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Record<string, unknown>;
  return (
    isString(session.time) &&
    isString(session.endTime) &&
    isString(session.title) &&
    isString(session.speaker) &&
    isString(session.type) &&
    isString(session.description) &&
    (session.trail === undefined || isTrail(session.trail)) &&
    (session.presenters === undefined ||
      (Array.isArray(session.presenters) && session.presenters.every(isPresenter)))
  );
}

function isTrail(value: unknown): value is EventTrail {
  if (!value || typeof value !== "object") {
    return false;
  }

  const trail = value as Record<string, unknown>;
  return isString(trail.key) && isString(trail.label);
}

function isPresenter(value: unknown): value is EventPresenter {
  if (!value || typeof value !== "object") {
    return false;
  }

  const presenter = value as Record<string, unknown>;
  if (!isString(presenter.name)) {
    return false;
  }

  const socials = presenter.socials;
  if (socials !== undefined) {
    if (!socials || typeof socials !== "object") {
      return false;
    }

    const profile = socials as Record<string, unknown>;
    if (profile.lattes !== undefined && !isString(profile.lattes)) {
      return false;
    }
    if (profile.linkedin !== undefined && !isString(profile.linkedin)) {
      return false;
    }
    if (profile.instagram !== undefined && !isString(profile.instagram)) {
      return false;
    }
    if (profile.email !== undefined && !isString(profile.email)) {
      return false;
    }
  }

  return (
    (presenter.role === undefined || isString(presenter.role)) &&
    (presenter.photoUrl === undefined || isString(presenter.photoUrl))
  );
}

function isTrack(value: unknown): value is EventTrack {
  if (!value || typeof value !== "object") {
    return false;
  }

  const track = value as Record<string, unknown>;
  return (
    isString(track.name) &&
    Array.isArray(track.sessions) &&
    track.sessions.every(isSession)
  );
}

function isBrand(value: unknown): value is EventBrand {
  if (!value || typeof value !== "object") {
    return false;
  }

  const brand = value as Record<string, unknown>;
  return (
    isString(brand.name) &&
    isString(brand.logoUrl) &&
    (brand.website === undefined || isString(brand.website))
  );
}

function isSponsorTier(value: unknown): value is EventSponsorTier {
  if (!value || typeof value !== "object") {
    return false;
  }

  const tier = value as Record<string, unknown>;
  return (
    (tier.type === 1 || tier.type === 2 || tier.type === 3) &&
    isString(tier.label) &&
    (tier.description === undefined || isString(tier.description)) &&
    Array.isArray(tier.brands) &&
    tier.brands.every(isBrand)
  );
}

function isSponsors(value: unknown): value is EventSponsors {
  if (!value || typeof value !== "object") {
    return false;
  }

  const sponsors = value as Record<string, unknown>;
  return (
    isString(sponsors.title) &&
    (sponsors.subtitle === undefined || isString(sponsors.subtitle)) &&
    Array.isArray(sponsors.tiers) &&
    sponsors.tiers.every(isSponsorTier) &&
    Array.isArray(sponsors.partners) &&
    sponsors.partners.every(isBrand)
  );
}

function isSeo(value: unknown): value is EventSeo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const seo = value as Record<string, unknown>;
  const twitterCard = seo.twitterCard;
  const ogType = seo.ogType;

  return (
    isString(seo.title) &&
    isString(seo.description) &&
    (seo.keywords === undefined || isString(seo.keywords)) &&
    (seo.canonicalUrl === undefined || isString(seo.canonicalUrl)) &&
    isString(seo.ogImage) &&
    (seo.twitterImage === undefined || isString(seo.twitterImage)) &&
    (twitterCard === undefined ||
      twitterCard === "summary" ||
      twitterCard === "summary_large_image") &&
    (seo.siteName === undefined || isString(seo.siteName)) &&
    (ogType === undefined || ogType === "website" || ogType === "article" || ogType === "event")
  );
}

function isPresentationSubmission(value: unknown): value is EventPresentationSubmission {
  if (!value || typeof value !== "object") {
    return false;
  }

  const submission = value as Record<string, unknown>;
  return (
    isString(submission.title) &&
    isString(submission.description) &&
    isString(submission.deadline) &&
    isString(submission.date) &&
    isString(submission.time) &&
    isString(submission.location) &&
    isString(submission.contactEmail) &&
    isString(submission.formUrl)
  );
}

function isStorySection(value: unknown): value is EventStorySection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const section = value as Record<string, unknown>;
  return (
    isString(section.id) &&
    (section.kicker === undefined || isString(section.kicker)) &&
    isString(section.title) &&
    isString(section.description) &&
    isString(section.imageUrl)
  );
}

function isDay(value: unknown): value is EventDay {
  if (!value || typeof value !== "object") {
    return false;
  }

  const day = value as Record<string, unknown>;
  return (
    isString(day.id) &&
    isString(day.label) &&
    isString(day.dateLabel) &&
    Array.isArray(day.tracks) &&
    day.tracks.every(isTrack)
  );
}

function isEventEditionData(value: unknown): value is EventEditionData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;
  const hero = data.hero as Record<string, unknown> | undefined;
  const eventInfo = data.eventInfo as Record<string, unknown> | undefined;
  const links = data.links as Record<string, unknown> | undefined;
  const presentationSubmission = data.presentationSubmission as Record<string, unknown> | undefined;
  const theme = data.theme as Record<string, unknown> | undefined;
  const assets = data.assets as Record<string, unknown> | undefined;
  const seo = data.seo as Record<string, unknown> | undefined;
  const sponsors = data.sponsors as Record<string, unknown> | undefined;

  return (
    typeof data.year === "number" &&
    !!theme &&
    isString(theme.name) &&
    isString(theme.visualDirection) &&
    !!hero &&
    isString(hero.badge) &&
    isString(hero.title) &&
    isString(hero.subtitle) &&
    isString(hero.description) &&
    Array.isArray(hero.highlights) &&
    hero.highlights.every(isString) &&
    !!eventInfo &&
    isString(eventInfo.dateRangeLabel) &&
    isString(eventInfo.location) &&
    isString(eventInfo.status) &&
    isString(eventInfo.description) &&
    !!links &&
    isString(links.even3) &&
    isString(links.instagram) &&
    !!presentationSubmission &&
    isPresentationSubmission(presentationSubmission) &&
    !!assets &&
    isString(assets.heroFallbackGif) &&
    isString(assets.heroRightImage) &&
    isString(assets.zombieLeft) &&
    isString(assets.zombieRight) &&
    (seo === undefined || isSeo(seo)) &&
    !!sponsors &&
    isSponsors(sponsors) &&
    Array.isArray(data.storySections) &&
    data.storySections.every(isStorySection) &&
    Array.isArray(data.days) &&
    data.days.every(isDay)
  );
}

function mergeEventEditionData(value: unknown): EventEditionData {
  if (!isObject(value)) {
    return defaultEvent2026Data;
  }

  const theme = isObject(value.theme) ? value.theme : {};
  const hero = isObject(value.hero) ? value.hero : {};
  const eventInfo = isObject(value.eventInfo) ? value.eventInfo : {};
  const links = isObject(value.links) ? value.links : {};
  const presentationSubmission = isObject(value.presentationSubmission)
    ? value.presentationSubmission
    : {};
  const assets = isObject(value.assets) ? value.assets : {};
  const seo = isSeo(value.seo) ? value.seo : defaultEvent2026Data.seo;
  const sponsors = isSponsors(value.sponsors) ? value.sponsors : defaultEvent2026Data.sponsors;
  const storySections = Array.isArray(value.storySections)
    ? value.storySections.filter(isStorySection)
    : defaultEvent2026Data.storySections;
  const days = Array.isArray(value.days) ? value.days.filter(isDay) : [];

  return {
    year: typeof value.year === "number" ? value.year : defaultEvent2026Data.year,
    theme: {
      name: isString(theme.name) ? theme.name : defaultEvent2026Data.theme.name,
      visualDirection: isString(theme.visualDirection)
        ? theme.visualDirection
        : defaultEvent2026Data.theme.visualDirection,
    },
    hero: {
      badge: isString(hero.badge) ? hero.badge : defaultEvent2026Data.hero.badge,
      title: isString(hero.title) ? hero.title : defaultEvent2026Data.hero.title,
      subtitle: isString(hero.subtitle) ? hero.subtitle : defaultEvent2026Data.hero.subtitle,
      description: isString(hero.description)
        ? hero.description
        : defaultEvent2026Data.hero.description,
      highlights:
        Array.isArray(hero.highlights) && hero.highlights.every(isString)
          ? hero.highlights
          : defaultEvent2026Data.hero.highlights,
    },
    eventInfo: {
      dateRangeLabel: isString(eventInfo.dateRangeLabel)
        ? eventInfo.dateRangeLabel
        : defaultEvent2026Data.eventInfo.dateRangeLabel,
      location: isString(eventInfo.location)
        ? eventInfo.location
        : defaultEvent2026Data.eventInfo.location,
      status: isString(eventInfo.status) ? eventInfo.status : defaultEvent2026Data.eventInfo.status,
      description: isString(eventInfo.description)
        ? eventInfo.description
        : defaultEvent2026Data.eventInfo.description,
    },
    links: {
      even3: isString(links.even3) ? links.even3 : defaultEvent2026Data.links.even3,
      instagram: isString(links.instagram)
        ? links.instagram
        : defaultEvent2026Data.links.instagram,
    },
    presentationSubmission: {
      title: isString(presentationSubmission.title)
        ? presentationSubmission.title
        : defaultEvent2026Data.presentationSubmission.title,
      description: isString(presentationSubmission.description)
        ? presentationSubmission.description
        : defaultEvent2026Data.presentationSubmission.description,
      deadline: isString(presentationSubmission.deadline)
        ? presentationSubmission.deadline
        : defaultEvent2026Data.presentationSubmission.deadline,
      date: isString(presentationSubmission.date)
        ? presentationSubmission.date
        : defaultEvent2026Data.presentationSubmission.date,
      time: isString(presentationSubmission.time)
        ? presentationSubmission.time
        : defaultEvent2026Data.presentationSubmission.time,
      location: isString(presentationSubmission.location)
        ? presentationSubmission.location
        : defaultEvent2026Data.presentationSubmission.location,
      contactEmail: isString(presentationSubmission.contactEmail)
        ? presentationSubmission.contactEmail
        : defaultEvent2026Data.presentationSubmission.contactEmail,
      formUrl: isString(presentationSubmission.formUrl)
        ? presentationSubmission.formUrl
        : defaultEvent2026Data.presentationSubmission.formUrl,
    },
    assets: {
      heroFallbackGif: isString(assets.heroFallbackGif)
        ? assets.heroFallbackGif
        : defaultEvent2026Data.assets.heroFallbackGif,
      heroRightImage: isString(assets.heroRightImage)
        ? assets.heroRightImage
        : defaultEvent2026Data.assets.heroRightImage,
      zombieLeft: isString(assets.zombieLeft)
        ? assets.zombieLeft
        : defaultEvent2026Data.assets.zombieLeft,
      zombieRight: isString(assets.zombieRight)
        ? assets.zombieRight
        : defaultEvent2026Data.assets.zombieRight,
    },
    seo,
    sponsors,
    storySections,
    days,
  };
}

export function useEvent2026Data() {
  const [data, setData] = useState<EventEditionData>(defaultEvent2026Data);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}2026/evento-2026.json`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`Falha ao carregar arquivo: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        if (isMounted) {
          setData(isEventEditionData(payload) ? payload : mergeEventEditionData(payload));
        }
      } catch {
        if (isMounted) {
          setData(defaultEvent2026Data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}
