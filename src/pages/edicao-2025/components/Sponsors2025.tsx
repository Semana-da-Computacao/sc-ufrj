import ScrollReveal from "./ScrollReveal";
import type { Event2025Data, Event2025Brand } from "../data/types";

interface Sponsors2025Props {
  data: Event2025Data;
}

function assetPath(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

function BrandCard({
  brand,
  className = "",
  logoClassName = "",
}: {
  brand: Event2025Brand;
  className?: string;
  logoClassName?: string;
}) {
  const content = (
    <article className={`rounded-2xl border border-border/70 bg-card/80 p-4 ${className}`}>
      <img
        src={assetPath(brand.logoUrl)}
        alt={`Logo ${brand.name}`}
        className={`mx-auto h-14 w-full object-contain ${logoClassName}`}
      />
      <p className="mt-3 text-center text-sm text-muted-foreground">{brand.name}</p>
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

export default function Sponsors2025({ data }: Sponsors2025Props) {
  const { sponsors } = data;
  const orderedBrands = sponsors.tiers
    .slice()
    .sort((a, b) => a.type - b.type)
    .flatMap((tier) => tier.brands.map((brand) => ({ ...brand, priority: tier.type })));

  if (orderedBrands.length === 0 && sponsors.partners.length === 0) return null;

  return (
    <section id="patrocinadores" className="relative py-14 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(56,189,248,0.14),transparent_38%),radial-gradient(circle_at_88%_78%,rgba(30,64,175,0.14),transparent_40%)]" />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold">{sponsors.title}</h2>
          {sponsors.subtitle ? <p className="mt-3 text-muted-foreground">{sponsors.subtitle}</p> : null}
        </ScrollReveal>

        {orderedBrands.length > 0 ? (
          <ScrollReveal className="mt-8 rounded-3xl border border-border/70 bg-card/70 p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {orderedBrands.map((brand) => (
                <BrandCard
                  key={`sponsor-2025-${brand.priority}-${brand.name}`}
                  brand={brand}
                  className={
                    brand.priority === 1
                      ? "md:col-span-2 border-cyan-500/30"
                      : brand.priority === 2
                        ? "border-blue-500/30"
                        : ""
                  }
                  logoClassName={
                    brand.priority === 1 ? "h-20 md:h-24" : brand.priority === 2 ? "h-16 md:h-20" : "h-14 md:h-16"
                  }
                />
              ))}
            </div>
          </ScrollReveal>
        ) : null}

        {sponsors.partners.length > 0 ? (
          <ScrollReveal className="mt-6 rounded-3xl border border-border/70 bg-card/70 p-5 md:p-6" delay={120}>
            <h3 className="text-center text-lg md:text-xl font-semibold">Parceiros</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {sponsors.partners.map((brand) => (
                <BrandCard key={`partner-2025-${brand.name}`} brand={brand} logoClassName="h-12 md:h-14" />
              ))}
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
