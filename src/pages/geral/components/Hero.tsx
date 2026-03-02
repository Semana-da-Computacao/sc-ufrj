import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import { Link } from "react-router-dom";

export default function Hero() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;
  const even3Url = "https://www.even3.com.br/ix-semana-da-computacao-ufrj-2026/";

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-emerald-100 via-stone-100 to-amber-100 dark:from-zinc-950 dark:via-stone-950 dark:to-emerald-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_22%,rgba(22,163,74,0.2),transparent_32%),radial-gradient(circle_at_80%_76%,rgba(180,83,9,0.22),transparent_40%)] dark:bg-[radial-gradient(circle_at_12%_22%,rgba(34,197,94,0.25),transparent_32%),radial-gradient(circle_at_80%_76%,rgba(120,53,15,0.3),transparent_40%)]" />
      <div className="absolute -top-32 -left-10 size-72 rounded-full bg-emerald-500/15 dark:bg-emerald-300/12 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-10 size-80 rounded-full bg-amber-500/15 dark:bg-amber-400/15 blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal className="rounded-3xl border border-border/70 bg-card/80 p-7 text-card-foreground text-center shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-sm md:p-11">
            <img
              src={logoSrc}
              alt="Logo oficial da Semana da Computação UFRJ"
              className="max-w-40 sm:max-w-48 mx-auto"
            />
            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl">
              Semana da Computação UFRJ
            </h1>
            <p className="mt-4 inline-flex items-center rounded-full border border-emerald-700/40 bg-emerald-900/90 px-4 py-2 text-xs sm:text-sm tracking-[0.12em] text-emerald-100 uppercase">
              Destaque 2026 • The Last of Us - Temporada 2
            </p>
            <p className="mt-5 text-base text-foreground/90 sm:text-lg">
              O principal evento estudantil de computação da UFRJ, conectando
              universidade, mercado e comunidade em uma programação com
              palestras, workshops, painéis e networking.
            </p>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              A edição de 2026 terá trilhas simultâneas no auditório e em salas
              técnicas, com inscrições abertas no Even3.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={even3Url} target="_blank" rel="noopener noreferrer">
                  Inscrição 2026 no Even3
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/2026">Edição 2026</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/2025">Edição 2025</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/2019">Edição 2019</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
