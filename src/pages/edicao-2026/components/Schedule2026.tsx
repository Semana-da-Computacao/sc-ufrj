import { useEffect, useMemo, useState } from "react";
import ScrollReveal from "@/components/scroll-reveal";
import type { EventEditionData } from "../data/types";
import { cn } from "@/lib/utils";
import { resolveAssetPath } from "../data/resolveAsset";
import {
  BarChart3,
  Briefcase,
  Cloud,
  Code2,
  Cpu,
  Database,
  Lock,
  Palette,
  type LucideIcon,
} from "lucide-react";

interface Schedule2026Props {
  data: EventEditionData;
}

type TimeSlot = "manha" | "tarde" | "noite";

function getSocialLinks(socials?: {
  lattes?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}) {
  if (!socials) {
    return [];
  }

  return [
    socials.lattes
      ? { label: "Lattes", href: socials.lattes }
      : null,
    socials.linkedin
      ? { label: "LinkedIn", href: socials.linkedin }
      : null,
    socials.instagram
      ? { label: "Instagram", href: socials.instagram }
      : null,
    socials.email
      ? { label: "Email", href: `mailto:${socials.email}` }
      : null,
  ].filter((item): item is { label: string; href: string } => item !== null);
}

function getTrailIcon(key?: string): LucideIcon {
  const iconByTrail: Record<string, LucideIcon> = {
    "ciencia-dados": BarChart3,
    dados: Database,
    webdev: Code2,
    backend: Database,
    frontend: Palette,
    ia: Cpu,
    seguranca: Lock,
    cloud: Cloud,
    carreira: Briefcase,
  };

  return iconByTrail[key ?? ""] ?? Code2;
}

function timeToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function getTimeSlot(value: string): TimeSlot {
  const minutes = timeToMinutes(value);
  if (minutes < 12 * 60) {
    return "manha";
  }
  if (minutes < 18 * 60) {
    return "tarde";
  }
  return "noite";
}

function slotLabel(slot: TimeSlot) {
  if (slot === "manha") return "Manhã";
  if (slot === "tarde") return "Tarde";
  return "Noite";
}

export default function Schedule2026({ data }: Schedule2026Props) {
  const firstDayId = data.days[0]?.id ?? "";
  const [selectedDayId, setSelectedDayId] = useState(firstDayId);
  const zombieLeft = resolveAssetPath(data.assets.zombieLeft);
  const zombieRight = resolveAssetPath(data.assets.zombieRight);

  const selectedDay = useMemo(
    () => data.days.find((day) => day.id === selectedDayId) ?? data.days[0],
    [data.days, selectedDayId]
  );
  const daySummary = useMemo(() => {
    if (!selectedDay) {
      return { sessions: 0, speakers: 0 };
    }

    const sessions = selectedDay.tracks.reduce((sum, track) => sum + track.sessions.length, 0);
    const speakers = new Set(
      selectedDay.tracks.flatMap((track) =>
        track.sessions.flatMap((session) =>
          (session.presenters ?? []).map((presenter) => presenter.name)
        )
      )
    ).size;

    return { sessions, speakers };
  }, [selectedDay]);

  useEffect(() => {
    if (!data.days.length) {
      return;
    }

    const stillExists = data.days.some((day) => day.id === selectedDayId);
    if (!stillExists) {
      setSelectedDayId(data.days[0].id);
    }
  }, [data.days, selectedDayId]);

  return (
    <section id="programacao" className="relative py-20 md:py-24 bg-stone-950 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(21,128,61,0.2),transparent_32%),radial-gradient(circle_at_12%_82%,rgba(120,53,15,0.22),transparent_38%)]" />
      <img
        src={zombieLeft}
        alt=""
        aria-hidden="true"
        className="zombie-appear-left absolute left-0 top-12 z-0 hidden w-[140px] opacity-25 xl:block"
      />
      <img
        src={zombieRight}
        alt=""
        aria-hidden="true"
        className="zombie-appear-right absolute right-0 bottom-10 z-0 hidden w-[150px] opacity-25 xl:block"
      />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Programação 2026</h2>
          <p className="mt-3 text-stone-300">
            Trilhas paralelas para você montar sua própria jornada durante a semana.
          </p>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {data.days.map((day) => {
            const isActive = day.id === selectedDay?.id;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDayId(day.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-emerald-700 border-emerald-500 text-white"
                    : "bg-black/30 border-stone-600 text-stone-200 hover:bg-stone-800"
                )}
              >
                {day.label} • {day.dateLabel}
              </button>
            );
          })}
        </div>

        {selectedDay ? (
          <div className="mt-10 space-y-6">
            <ScrollReveal className="px-5 py-4 text-center">
              <h3 className="text-xl font-bold">
                {selectedDay.label} - {selectedDay.dateLabel}
              </h3>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="rounded-full border border-stone-600/60 bg-black/45 px-3 py-1 text-stone-200">
                  {selectedDay.tracks.length} ambiente(s)
                </span>
                <span className="rounded-full border border-stone-600/60 bg-black/45 px-3 py-1 text-stone-200">
                  {daySummary.sessions} sessão(ões)
                </span>
                <span className="rounded-full border border-stone-600/60 bg-black/45 px-3 py-1 text-stone-200">
                  {daySummary.speakers} palestrante(s)
                </span>
              </div>
            </ScrollReveal>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {selectedDay.tracks.map((track, trackIndex) => {
                const sortedSessions = [...track.sessions].sort(
                  (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
                );
                const grouped = sortedSessions.reduce(
                  (acc, session) => {
                    const slot = getTimeSlot(session.time);
                    acc[slot].push(session);
                    return acc;
                  },
                  { manha: [], tarde: [], noite: [] } as Record<TimeSlot, typeof sortedSessions>
                );

                return (
                  <ScrollReveal
                    key={`${selectedDay.id}-${track.name}`}
                    className="rounded-2xl border border-stone-600/40 bg-black/45 p-5"
                    delay={trackIndex * 80}
                  >
                    <h4 className="text-lg font-semibold text-emerald-300">{track.name}</h4>
                    <div className="mt-4 space-y-4">
                      {(["manha", "tarde", "noite"] as TimeSlot[]).map((slot) => {
                        const sessionsBySlot = grouped[slot];
                        if (!sessionsBySlot.length) {
                          return null;
                        }

                        return (
                          <div key={`${track.name}-${slot}`} className="space-y-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">
                              {slotLabel(slot)}
                            </p>
                            {sessionsBySlot.map((session, sessionIndex) => (
                              <article
                                key={`${track.name}-${session.title}-${sessionIndex}`}
                                className="relative rounded-xl border border-stone-700/60 bg-zinc-900/70 p-3"
                              >
                                {session.trail ? (
                                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-stone-600/70 bg-black/55 px-2 py-1">
                                    {(() => {
                                      const TrailIcon = getTrailIcon(session.trail?.key);
                                      return <TrailIcon className="h-3.5 w-3.5 text-emerald-300" />;
                                    })()}
                                    <span className="text-[10px] uppercase tracking-[0.12em] text-stone-200">
                                      {session.trail.label}
                                    </span>
                                  </div>
                                ) : null}
                                <p className="text-xs uppercase tracking-[0.14em] text-amber-300">
                                  {session.time} - {session.endTime} • {session.type}
                                </p>
                                <h5 className="mt-2 font-semibold">{session.title}</h5>
                                <p className="mt-1 text-sm text-stone-300">{session.speaker}</p>
                                <p className="mt-2 text-sm text-stone-200">{session.description}</p>

                                {session.presenters && session.presenters.length > 0 ? (
                                  <div className="mt-4 space-y-3 border-t border-stone-700/50 pt-3">
                                    <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                                      Palestrantes
                                    </p>
                                    {session.presenters.map((presenter, presenterIndex) => {
                                      const socialLinks = getSocialLinks(presenter.socials);

                                      return (
                                        <div
                                          key={`${presenter.name}-${presenterIndex}`}
                                          className="rounded-lg border border-stone-700/60 bg-black/35 p-3"
                                        >
                                          <div className="flex items-start gap-3">
                                            {presenter.photoUrl ? (
                                              <img
                                                src={presenter.photoUrl}
                                                alt={`Foto de ${presenter.name}`}
                                                className="h-14 w-14 rounded-md object-cover"
                                              />
                                            ) : (
                                              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-stone-700 text-sm font-semibold">
                                                {presenter.name
                                                  .split(" ")
                                                  .slice(0, 2)
                                                  .map((part) => part[0]?.toUpperCase())
                                                  .join("")}
                                              </div>
                                            )}
                                            <div className="min-w-0">
                                              <p className="font-medium leading-tight">{presenter.name}</p>
                                              {presenter.role ? (
                                                <p className="mt-1 text-xs text-stone-300">{presenter.role}</p>
                                              ) : null}
                                            </div>
                                          </div>

                                          {socialLinks.length > 0 ? (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                              {socialLinks.map((link) => (
                                                <a
                                                  key={`${presenter.name}-${link.label}`}
                                                  href={link.href}
                                                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                                                  rel={
                                                    link.href.startsWith("mailto:")
                                                      ? undefined
                                                      : "noopener noreferrer"
                                                  }
                                                  className="rounded-full border border-stone-600/60 px-2 py-1 text-[11px] text-stone-200 hover:bg-stone-800"
                                                >
                                                  {link.label}
                                                </a>
                                              ))}
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </article>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        ) : (
          <ScrollReveal className="mt-8 rounded-2xl border border-stone-600/40 bg-black/45 p-6 text-center text-stone-300">
            A programação completa será liberada em breve.
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
