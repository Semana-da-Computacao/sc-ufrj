import { useEffect, useState } from "react";
import { defaultEvent2025Data } from "./defaultEvent2025";
import type {
  Event2025Brand,
  Event2025Data,
  Event2025Day,
  Event2025Session,
  Event2025Sponsors,
  Event2025SponsorTier,
  Event2025Track,
} from "./types";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSession(value: unknown): value is Event2025Session {
  if (!value || typeof value !== "object") return false;
  const session = value as Record<string, unknown>;
  return (
    isString(session.time) &&
    isString(session.endTime) &&
    isString(session.title) &&
    isString(session.type) &&
    isString(session.speaker) &&
    isString(session.description)
  );
}

function isTrack(value: unknown): value is Event2025Track {
  if (!value || typeof value !== "object") return false;
  const track = value as Record<string, unknown>;
  return isString(track.name) && Array.isArray(track.sessions) && track.sessions.every(isSession);
}

function isBrand(value: unknown): value is Event2025Brand {
  if (!value || typeof value !== "object") return false;
  const brand = value as Record<string, unknown>;
  return (
    isString(brand.name) &&
    isString(brand.logoUrl) &&
    (brand.website === undefined || isString(brand.website))
  );
}

function isSponsorTier(value: unknown): value is Event2025SponsorTier {
  if (!value || typeof value !== "object") return false;
  const tier = value as Record<string, unknown>;
  return (
    (tier.type === 1 || tier.type === 2 || tier.type === 3) &&
    Array.isArray(tier.brands) &&
    tier.brands.every(isBrand)
  );
}

function isSponsors(value: unknown): value is Event2025Sponsors {
  if (!value || typeof value !== "object") return false;
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

function isDay(value: unknown): value is Event2025Day {
  if (!value || typeof value !== "object") return false;
  const day = value as Record<string, unknown>;
  return (
    isString(day.id) &&
    isString(day.day) &&
    isString(day.dateLabel) &&
    isString(day.theme) &&
    Array.isArray(day.tracks) &&
    day.tracks.every(isTrack)
  );
}

function isEvent2025Data(value: unknown): value is Event2025Data {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  const eventInfo = data.eventInfo as Record<string, unknown> | undefined;
  const sponsors = data.sponsors as Record<string, unknown> | undefined;

  return (
    !!eventInfo &&
    !!sponsors &&
    isString(eventInfo.date) &&
    isString(eventInfo.location) &&
    isString(eventInfo.about) &&
    isSponsors(sponsors) &&
    Array.isArray(data.schedule) &&
    data.schedule.every(isDay)
  );
}

export function useEvent2025Data() {
  const [data, setData] = useState<Event2025Data>(defaultEvent2025Data);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}2025/evento-2025.json`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`Falha ao carregar: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        if (active && isEvent2025Data(payload)) {
          setData(payload);
        }
      } catch {
        if (active) {
          setData(defaultEvent2025Data);
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
