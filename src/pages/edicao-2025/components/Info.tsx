import ScrollReveal from "./ScrollReveal";

interface InfoProps {
  date: string;
  location: string;
}

export default function Info({ date, location }: InfoProps) {
  return (
    <section
      id="informacoes"
      className="relative overflow-hidden bg-linear-to-b from-background to-background/80 py-20 md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(30,64,175,0.15),transparent_40%)]" />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center" direction="up">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Informações Gerais</h2>
          <p className="text-muted-foreground">
            Tudo que você precisa saber para se organizar e aproveitar cada dia
            do evento.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
          <ScrollReveal className="event-card" delay={100} direction="left">
            <p className="text-xs tracking-[0.2em] uppercase text-cyan-600 dark:text-cyan-400">
              Data
            </p>
            <h3 className="mt-3 text-2xl font-semibold">{date}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Segunda a sexta com atividades ao longo do dia.
            </p>
          </ScrollReveal>

          <ScrollReveal className="event-card" delay={180} direction="right">
            <p className="text-xs tracking-[0.2em] uppercase text-cyan-600 dark:text-cyan-400">
              Local
            </p>
            <h3 className="mt-3 text-2xl font-semibold">{location}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Auditórios e laboratórios com infraestrutura completa.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
