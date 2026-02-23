import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";

export function Hero2025() {
  const instagramUrl = "https://www.instagram.com/semanadacomputacaoufrj/";
  const heroBackground = `${import.meta.env.BASE_URL}2025/bg-hero.gif`;

  return (
    <section className="relative w-full min-h-[88vh] lg:min-h-screen overflow-hidden flex items-center">
      <img
        src={heroBackground}
        alt="Fundo animado - Semana da Computação 2025"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/75">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.35),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(14,165,233,0.22),transparent_40%)]" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.25fr_0.75fr] gap-6 items-stretch">
          <ScrollReveal className="rounded-3xl border border-white/20 bg-card/30 p-7 md:p-12 text-card-foreground text-center lg:text-left shadow-2xl shadow-black/35 backdrop-blur-sm">
            <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-cyan-100 dark:text-cyan-200/90 mb-5">
              31 de Março a 04 de Abril de 2025 • UFRJ
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Semana da Computação
              <span className="block text-cyan-200 dark:text-cyan-300">UFRJ 2025</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-foreground/90 max-w-3xl">
              A Semana da Computação é o principal encontro estudantil de
              tecnologia da UFRJ, unindo comunidade acadêmica e mercado em uma
              programação com palestras, oficinas e rodas de conversa.
            </p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl">
              O evento foi criado para aproximar teoria e prática, apresentar
              diferentes trilhas de carreira e conectar estudantes com
              professores, ex-alunos e profissionais da área.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
              <Button asChild size="lg" aria-label="Acompanhar no Instagram">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8"
                >
                  Acompanhar no Instagram
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                aria-label="Ver programação"
              >
                <a href="#programacao" className="px-8">
                  Ver programação
                </a>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal
            className="rounded-3xl border border-white/20 bg-card/35 p-6 md:p-8 text-card-foreground shadow-2xl shadow-black/35 backdrop-blur-sm flex flex-col justify-between"
            delay={120}
            direction="right"
          >
            <div>
              <h2 className="text-xl font-bold">O que você encontra</h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground/90">
                <li className="rounded-xl border border-border/60 bg-background/35 px-3 py-2">
                  Palestras com especialistas e egressos da UFRJ
                </li>
                <li className="rounded-xl border border-border/60 bg-background/35 px-3 py-2">
                  Workshops práticos em temas atuais de computação
                </li>
                <li className="rounded-xl border border-border/60 bg-background/35 px-3 py-2">
                  Networking com estudantes, comunidade e empresas
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-2">
                31/03 a 04/04
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-2">
                09h às 17h
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-2">
                Presencial no CCMN
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
