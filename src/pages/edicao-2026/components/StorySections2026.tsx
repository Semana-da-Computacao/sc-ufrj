import ScrollReveal from "@/components/scroll-reveal";
import type { EventEditionData } from "../data/types";
import { resolveAssetPath } from "../data/resolveAsset";

interface StorySections2026Props {
  data: EventEditionData;
}

export default function StorySections2026({ data }: StorySections2026Props) {
  if (!data.storySections.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-zinc-900 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(21,128,61,0.18),transparent_32%),radial-gradient(circle_at_86%_82%,rgba(120,53,15,0.2),transparent_42%)]" />
      <div className="relative container mx-auto px-4 space-y-8">
        {data.storySections.map((section, index) => (
          <ScrollReveal
            key={section.id}
            className="grid gap-4 rounded-3xl border border-stone-600/45 bg-black/35 p-4 md:p-5 lg:grid-cols-2"
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <img
              src={resolveAssetPath(section.imageUrl)}
              alt={section.title}
              className="h-60 w-full rounded-2xl object-cover md:h-72"
            />

            <div className="flex flex-col justify-center text-left p-1 md:p-2">
              {section.kicker ? (
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">{section.kicker}</p>
              ) : null}
              <h3 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">{section.title}</h3>
              <p className="mt-4 text-stone-200/90 leading-relaxed">{section.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
