import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import { Link } from "react-router-dom";

export default function Hero() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;
  const even3Url = "https://www.even3.com.br/viii-semana-da-computacao-ufrj/";

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-cyan-50 via-background to-blue-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_22%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_80%_76%,rgba(59,130,246,0.2),transparent_40%)] dark:bg-[radial-gradient(circle_at_12%_22%,rgba(34,211,238,0.35),transparent_32%),radial-gradient(circle_at_80%_76%,rgba(59,130,246,0.3),transparent_40%)]" />
      <div className="absolute -top-32 -left-10 size-72 rounded-full bg-cyan-400/15 dark:bg-cyan-300/12 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-10 size-80 rounded-full bg-blue-500/15 dark:bg-blue-400/15 blur-3xl animate-pulse" />

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
            <p className="mt-5 text-base text-foreground/90 sm:text-lg">
              O principal evento estudantil de computação da UFRJ, conectando
              universidade, mercado e comunidade em uma programação com
              palestras, workshops, painéis e networking.
            </p>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Conheça as edições, veja os números históricos e acompanhe
              inscrições e novidades oficiais.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href={even3Url} target="_blank" rel="noopener noreferrer">
                  Inscreva-se no Even3
                </a>
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
