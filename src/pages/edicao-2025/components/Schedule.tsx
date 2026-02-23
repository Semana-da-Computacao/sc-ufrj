import ScrollReveal from "./ScrollReveal";

interface ScheduleDay {
  day: string;
  theme: string;
  highlights: string[];
}

interface ScheduleProps {
  schedule: ScheduleDay[];
}

export default function Schedule({ schedule }: ScheduleProps) {
  return (
    <section id="programacao" className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Programação</h2>
          <p className="text-muted-foreground">
            Trilhas pensadas para conectar teoria, mercado e prática.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 max-w-6xl mx-auto">
          {schedule.map((day, index) => (
            <ScrollReveal
              key={`${day.day}-${day.theme}`}
              delay={120 + index * 60}
              className="event-card"
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <p className="text-xs tracking-[0.2em] uppercase text-cyan-600 dark:text-cyan-400">
                {day.day}
              </p>
              <h3 className="font-semibold text-xl mt-3">{day.theme}</h3>

              <ul className="mt-4 grid gap-2">
                {day.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
