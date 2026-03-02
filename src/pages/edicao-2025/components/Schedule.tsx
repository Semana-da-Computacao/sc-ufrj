import { useMemo, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import type { Event2025Day } from "../data/types";

interface ScheduleProps {
  schedule: Event2025Day[];
}

export default function Schedule({ schedule }: ScheduleProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const activeDay = useMemo(
    () => schedule[selectedDay] ?? schedule[0],
    [schedule, selectedDay]
  );

  return (
    <section id="programacao" className="relative py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_36%),radial-gradient(circle_at_18%_78%,rgba(37,99,235,0.12),transparent_36%)]" />
      <div className="relative max-w-5xl mx-auto px-4">
        <ScrollReveal className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Programação</h2>
          <p className="mt-3 text-muted-foreground">
            Navegue por dia para ver os destaques da edição 2025.
          </p>
        </ScrollReveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {schedule.map((day, index) => (
            <button
              key={`${day.day}-${index}`}
              type="button"
              onClick={() => setSelectedDay(index)}
              className={
                index === selectedDay
                  ? "rounded-full border border-cyan-500 bg-cyan-600 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground/85 hover:bg-muted"
              }
            >
              {day.day}
            </button>
          ))}
        </div>

        {activeDay ? (
          <ScrollReveal className="mt-8 rounded-3xl border border-border/70 bg-card/80 p-6 md:p-8 shadow-xl backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-semibold">{activeDay.theme}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeDay.tracks.length} ambiente(s) com atividades.
            </p>

            <div className="mt-5 grid gap-4">
              {activeDay.tracks.map((track) => (
                <article
                  key={`${activeDay.id}-${track.name}`}
                  className="rounded-2xl border border-border/70 bg-background/70 p-4"
                >
                  <h4 className="text-base md:text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                    {track.name}
                  </h4>
                  <div className="mt-3 space-y-3">
                    {track.sessions.map((session, index) => (
                      <div
                        key={`${track.name}-${session.title}-${index}`}
                        className="rounded-xl border border-border/70 bg-card/70 px-3 py-3"
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-cyan-600 dark:text-cyan-400">
                          {session.time} - {session.endTime} • {session.type}
                        </p>
                        <h5 className="mt-1 font-semibold">{session.title}</h5>
                        <p className="text-sm text-muted-foreground">{session.speaker}</p>
                        <p className="mt-1 text-sm">{session.description}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal className="mt-8 rounded-2xl border border-border/70 bg-card/80 p-6 text-center text-muted-foreground">
            Programação em atualização.
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
