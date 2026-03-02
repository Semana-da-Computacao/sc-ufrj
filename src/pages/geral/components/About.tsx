import ScrollReveal from "@/components/scroll-reveal";
import type { HomeAboutData } from "../data/types";

interface AboutProps {
  data: HomeAboutData;
}

export default function About({ data }: AboutProps) {
  return (
    <section id="sobre" className="relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(30,64,175,0.16),transparent_38%)]" />
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-3">
            {data.title}
          </h2>
          <p className="text-muted-foreground">{data.subtitle}</p>
        </ScrollReveal>

        <ScrollReveal className="event-card mt-8 leading-relaxed" delay={100}>
          {data.paragraphs.map((paragraph, index) => (
            <p
              key={`${paragraph.slice(0, 24)}-${index}`}
              className={index === 0 ? "text-base md:text-lg" : "text-base md:text-lg mt-5"}
            >
              {paragraph}
            </p>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
