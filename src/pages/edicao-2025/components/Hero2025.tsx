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
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="rounded-3xl border border-white/20 bg-card/30 p-7 md:p-12 text-card-foreground text-center shadow-2xl shadow-black/35 backdrop-blur-sm">
            <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-cyan-100 dark:text-cyan-200/90 mb-5">
              31 de Março a 04 de Abril de 2025 • UFRJ
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Semana da Computação
              <span className="block text-cyan-200 dark:text-cyan-300">UFRJ 2025</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-foreground/90 max-w-3xl mx-auto">
              A edição 2025 reuniu comunidade acadêmica e mercado em uma
              programação com palestras e oficinas.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        </div>
      </div>
    </section>
  );
}
