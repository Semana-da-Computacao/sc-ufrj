import ScrollReveal from "@/components/scroll-reveal";
import type { EventEditionData } from "../data/types";
import { resolveAssetPath } from "../data/resolveAsset";

interface Info2026Props {
  data: EventEditionData;
}

export default function Info2026({ data }: Info2026Props) {
  const zombieLeft = resolveAssetPath(data.assets.zombieLeft);
  const zombieRight = resolveAssetPath(data.assets.zombieRight);

  return (
    <section id="informacoes" className="relative overflow-hidden py-20 md:py-24 bg-zinc-950 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(21,128,61,0.28),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(120,53,15,0.24),transparent_40%)]" />
      <img
        src={zombieLeft}
        alt=""
        aria-hidden="true"
        className="zombie-appear-left absolute left-0 bottom-0 z-0 hidden w-[120px] opacity-30 lg:block"
      />
      <img
        src={zombieRight}
        alt=""
        aria-hidden="true"
        className="zombie-appear-right absolute right-0 top-10 z-0 hidden w-[120px] opacity-25 lg:block"
      />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Informações Gerais</h2>
          <p className="text-stone-300">
            Uma travessia intensiva entre conteúdo técnico, visão de mercado e decisões de carreira.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
          <ScrollReveal className="rounded-2xl border border-stone-600/40 bg-black/40 p-5 md:p-6" delay={80} direction="left">
            <p className="text-xs tracking-[0.2em] uppercase text-emerald-300">Data</p>
            <h3 className="mt-3 text-2xl font-semibold">{data.eventInfo.dateRangeLabel}</h3>
          </ScrollReveal>

          <ScrollReveal className="rounded-2xl border border-stone-600/40 bg-black/40 p-5 md:p-6" delay={160}>
            <p className="text-xs tracking-[0.2em] uppercase text-emerald-300">Local</p>
            <h3 className="mt-3 text-2xl font-semibold">{data.eventInfo.location}</h3>
          </ScrollReveal>

          <ScrollReveal className="rounded-2xl border border-stone-600/40 bg-black/40 p-5 md:p-6" delay={240} direction="right">
            <p className="text-xs tracking-[0.2em] uppercase text-emerald-300">Status</p>
            <h3 className="mt-3 text-2xl font-semibold">{data.eventInfo.status}</h3>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-6 max-w-5xl mx-auto rounded-2xl border border-stone-600/40 bg-black/40 p-6 md:p-7 text-sm sm:text-base leading-relaxed text-stone-200" delay={320}>
          {data.eventInfo.description}
        </ScrollReveal>
      </div>
    </section>
  );
}
