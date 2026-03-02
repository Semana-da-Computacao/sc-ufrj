import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import { Link } from "react-router-dom";
import type { HomeHeroData } from "../data/types";

interface HeroProps {
  data: HomeHeroData;
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function Hero({ data }: HeroProps) {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-emerald-100 via-stone-100 to-amber-100 dark:from-zinc-950 dark:via-stone-950 dark:to-emerald-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_22%,rgba(22,163,74,0.2),transparent_32%),radial-gradient(circle_at_80%_76%,rgba(180,83,9,0.22),transparent_40%)] dark:bg-[radial-gradient(circle_at_12%_22%,rgba(34,197,94,0.25),transparent_32%),radial-gradient(circle_at_80%_76%,rgba(120,53,15,0.3),transparent_40%)]" />
      <div className="absolute -top-32 -left-10 size-72 rounded-full bg-emerald-500/15 dark:bg-emerald-300/12 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-10 size-80 rounded-full bg-amber-500/15 dark:bg-amber-400/15 blur-3xl animate-pulse" />
      <div className="absolute inset-0 -z-10 opacity-25 bg-[linear-gradient(130deg,transparent_0%,rgba(255,255,255,0.35)_18%,transparent_32%,transparent_100%)] dark:opacity-10" />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal className="rounded-3xl border border-border/70 bg-card/80 p-7 text-card-foreground text-center shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-sm md:p-11">
            <img
              src={logoSrc}
              alt="Logo oficial da Semana da Computação UFRJ"
              className="max-w-40 sm:max-w-48 mx-auto"
            />
            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-5xl">
              {data.title}
            </h1>
            <p className="mt-4 inline-flex items-center rounded-full border border-emerald-700/40 bg-emerald-900/90 px-4 py-2 text-xs sm:text-sm tracking-[0.12em] text-emerald-100 uppercase">
              {data.badge}
            </p>
            <p className="mt-5 text-base text-foreground/90 sm:text-lg">
              {data.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {isExternal(data.primaryCtaUrl) ? (
                <Button asChild size="lg">
                  <a href={data.primaryCtaUrl} target="_blank" rel="noopener noreferrer">
                    {data.primaryCtaLabel}
                  </a>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link to={data.primaryCtaUrl}>{data.primaryCtaLabel}</Link>
                </Button>
              )}
              {isExternal(data.secondaryCtaUrl) ? (
                <Button asChild size="lg" variant="outline">
                  <a href={data.secondaryCtaUrl} target="_blank" rel="noopener noreferrer">
                    {data.secondaryCtaLabel}
                  </a>
                </Button>
              ) : (
                <Button asChild size="lg" variant="outline">
                  <Link to={data.secondaryCtaUrl}>{data.secondaryCtaLabel}</Link>
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
