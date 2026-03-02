import ScrollReveal from "@/components/scroll-reveal";
import type { EventBrand, EventEditionData } from "../data/types";
import { resolveAssetPath } from "../data/resolveAsset";
import { cn } from "@/lib/utils";

interface Sponsors2026Props {
  data: EventEditionData;
}

function BrandCard({ brand, className, logoClassName }: { brand: EventBrand; className?: string; logoClassName?: string }) {
  const content = (
    <article className={cn("rounded-2xl border border-stone-600/40 bg-black/40 p-4 md:p-5", className)}>
      <img
        src={resolveAssetPath(brand.logoUrl)}
        alt={`Logo ${brand.name}`}
        className={cn("mx-auto w-full object-contain", logoClassName)}
      />
      <p className="mt-3 text-center text-sm text-stone-200">{brand.name}</p>
    </article>
  );

  if (brand.website) {
    return (
      <a href={brand.website} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-[1.01]">
        {content}
      </a>
    );
  }

  return content;
}

export default function Sponsors2026({ data }: Sponsors2026Props) {
  const { sponsors } = data;
  const orderedBrands = sponsors.tiers
    .slice()
    .sort((a, b) => a.type - b.type)
    .flatMap((tier) => tier.brands.map((brand) => ({ ...brand, priority: tier.type })));

  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-zinc-900 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(21,128,61,0.18),transparent_34%),radial-gradient(circle_at_82%_80%,rgba(120,53,15,0.2),transparent_42%)]" />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold">{sponsors.title}</h2>
          {sponsors.subtitle ? <p className="mt-3 text-stone-300">{sponsors.subtitle}</p> : null}
        </ScrollReveal>

        {orderedBrands.length > 0 ? (
          <ScrollReveal className="mt-8 rounded-3xl border border-stone-600/45 bg-black/35 p-5 md:p-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Patrocinadores</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {orderedBrands.map((brand) => (
                <BrandCard
                  key={`sponsor-${brand.priority}-${brand.name}`}
                  brand={brand}
                  className={cn(
                    brand.priority === 1 && "border-emerald-500/35 md:col-span-2",
                    brand.priority === 2 && "border-amber-600/35"
                  )}
                  logoClassName={cn(
                    brand.priority === 1 ? "h-20 md:h-24" : brand.priority === 2 ? "h-16 md:h-20" : "h-14 md:h-16"
                  )}
                />
              ))}
            </div>
          </ScrollReveal>
        ) : null}

        {sponsors.partners.length > 0 ? (
          <ScrollReveal className="mt-8 rounded-3xl border border-stone-600/45 bg-black/35 p-5 md:p-6" delay={140}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Parceiros</p>
              <h3 className="mt-2 text-xl md:text-2xl font-semibold">Instituições Parceiras</h3>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {sponsors.partners.map((brand) => (
                <BrandCard
                  key={`partner-${brand.name}`}
                  brand={brand}
                  logoClassName="h-12 md:h-14"
                />
              ))}
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
