import ScrollReveal from "@/components/scroll-reveal";
import type { HomeStatData } from "../data/types";

interface StatsProps {
  items: HomeStatData[];
}

export default function Stats({ items }: StatsProps) {

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal className="text-center mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold md:text-4xl">Nossos Números</h2>
          <p className="mt-3 text-muted-foreground">
            Indicadores que mostram o impacto da Semana da Computação na
            formação e na comunidade tecnológica.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
          {items.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              delay={80 + index * 60}
              className="event-card text-center"
            >
              <div className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base">{stat.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
