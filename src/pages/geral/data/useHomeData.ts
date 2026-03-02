import { useEffect, useState } from "react";
import { defaultHomeData } from "./defaultHomeData";
import type {
  HomeAboutData,
  HomeCommitteeMember,
  HomeFaqItem,
  HomeFeaturedEdition,
  HomeHeroData,
  HomePageData,
  HomeStatData,
} from "./types";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isHero(value: unknown): value is HomeHeroData {
  if (!value || typeof value !== "object") return false;
  const hero = value as Record<string, unknown>;
  return (
    isString(hero.badge) &&
    isString(hero.title) &&
    isString(hero.subtitle) &&
    isString(hero.primaryCtaLabel) &&
    isString(hero.primaryCtaUrl) &&
    isString(hero.secondaryCtaLabel) &&
    isString(hero.secondaryCtaUrl)
  );
}

function isStat(value: unknown): value is HomeStatData {
  if (!value || typeof value !== "object") return false;
  const stat = value as Record<string, unknown>;
  return isString(stat.number) && isString(stat.label);
}

function isAbout(value: unknown): value is HomeAboutData {
  if (!value || typeof value !== "object") return false;
  const about = value as Record<string, unknown>;
  return (
    isString(about.title) &&
    isString(about.subtitle) &&
    Array.isArray(about.paragraphs) &&
    about.paragraphs.every(isString)
  );
}

function isFeaturedEdition(value: unknown): value is HomeFeaturedEdition {
  if (!value || typeof value !== "object") return false;
  const edition = value as Record<string, unknown>;
  return (
    isString(edition.name) &&
    isString(edition.path) &&
    isString(edition.tagline) &&
    isString(edition.imageUrl)
  );
}

function isCommitteeMember(value: unknown): value is HomeCommitteeMember {
  if (!value || typeof value !== "object") return false;
  const member = value as Record<string, unknown>;
  return (
    isString(member.name) &&
    isString(member.role) &&
    isString(member.photoUrl) &&
    (member.linkedin === undefined || isString(member.linkedin)) &&
    (member.lattes === undefined || isString(member.lattes)) &&
    (member.github === undefined || isString(member.github)) &&
    (member.instagram === undefined || isString(member.instagram)) &&
    (member.site === undefined || isString(member.site)) &&
    (member.email === undefined || isString(member.email))
  );
}

function isFaqItem(value: unknown): value is HomeFaqItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return isString(item.question) && isString(item.answer);
}

function isHomeData(value: unknown): value is HomePageData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  const committee = data.committee as Record<string, unknown> | undefined;
  const faq = data.faq as Record<string, unknown> | undefined;

  return (
    isHero(data.hero) &&
    Array.isArray(data.stats) &&
    data.stats.every(isStat) &&
    isAbout(data.about) &&
    Array.isArray(data.featuredEditions) &&
    data.featuredEditions.every(isFeaturedEdition) &&
    !!committee &&
    isString(committee.title) &&
    isString(committee.subtitle) &&
    Array.isArray(committee.members) &&
    committee.members.every(isCommitteeMember) &&
    !!faq &&
    isString(faq.title) &&
    isString(faq.subtitle) &&
    Array.isArray(faq.items) &&
    faq.items.every(isFaqItem)
  );
}

export function useHomeData() {
  const [data, setData] = useState<HomePageData>(defaultHomeData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}home/home.json`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar home: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        if (active && isHomeData(payload)) {
          setData(payload);
        } else if (active) {
          setData(defaultHomeData);
        }
      } catch {
        if (active) {
          setData(defaultHomeData);
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
