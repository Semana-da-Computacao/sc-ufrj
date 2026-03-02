import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import type { EventEditionData } from "../data/types";
import { resolveAssetPath } from "../data/resolveAsset";

interface Hero2026Props {
  data: EventEditionData;
}

export function Hero2026({ data }: Hero2026Props) {
  const heroBackground = resolveAssetPath(data.assets.heroFallbackGif);
  const heroImage = resolveAssetPath(data.assets.heroRightImage);
  const zombieLeft = resolveAssetPath(data.assets.zombieLeft);
  const zombieRight = resolveAssetPath(data.assets.zombieRight);

  return (
    <section className="relative isolate overflow-hidden min-h-[70vh] lg:min-h-[70vh] flex items-center">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-40 h-full w-screen -translate-x-1/2 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 -z-20 bg-black/45" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_84%_80%,rgba(180,83,9,0.2),transparent_40%)]" />
      <img
        src={zombieLeft}
        alt=""
        aria-hidden="true"
        className="zombie-appear-left absolute left-0 bottom-0 z-10 hidden w-[170px] max-w-[20vw] opacity-70 lg:block xl:w-[220px]"
      />
      <img
        src={zombieRight}
        alt=""
        aria-hidden="true"
        className="zombie-appear-right absolute right-0 bottom-0 z-10 hidden w-[180px] max-w-[22vw] opacity-75 lg:block xl:w-[230px]"
      />
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-4 bottom-0 z-0 hidden h-[78%] max-h-[520px] w-auto opacity-70 md:block"
      />

      <div className="relative z-20 container mx-auto px-4 py-16 md:py-20">
        <ScrollReveal className="max-w-3xl text-stone-100 text-center md:text-left">
          <p className="uppercase tracking-[0.26em] text-xs sm:text-sm text-emerald-200/90 mb-5">
            {data.hero.badge}
          </p>
          <h1 className="tlou-title text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
            {data.hero.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-200/90 max-w-2xl mx-auto tlou-body">
            {data.hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white">
              <a href={data.links.even3} target="_blank" rel="noopener noreferrer">
                Inscreva-se no Even3
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-stone-500 text-stone-100 hover:bg-stone-100/10"
            >
              <a href="#programacao">Ver programação completa</a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
