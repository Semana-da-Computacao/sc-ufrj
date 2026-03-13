import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import type { EventEditionData } from "../data/types";

interface InstagramEmbed2026Props {
  data: EventEditionData;
}

function getInstagramEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== "instagram.com") {
      return null;
    }

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    if (pathParts.length === 0) {
      return null;
    }

    if (pathParts[0] === "p" || pathParts[0] === "reel" || pathParts[0] === "tv") {
      if (!pathParts[1]) {
        return null;
      }
      return `https://www.instagram.com/${pathParts[0]}/${pathParts[1]}/embed/captioned`;
    }

    return `https://www.instagram.com/${pathParts[0]}/embed`;
  } catch {
    return null;
  }
}

export default function InstagramEmbed2026({ data }: InstagramEmbed2026Props) {
  const instagramUrl = data.links.instagramEmbed ?? data.links.instagram;
  const embedUrl = getInstagramEmbedUrl(instagramUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <section id="instagram" className="relative bg-zinc-900 py-20 text-stone-100 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(21,128,61,0.18),transparent_35%),radial-gradient(circle_at_78%_70%,rgba(217,119,6,0.2),transparent_42%)]" />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Cobertura</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Instagram da edição 2026</h2>
          <p className="mt-3 text-stone-300">
            Acompanhe publicações, bastidores e destaques da Semana da Computação.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-8" delay={120}>
          <div className="mx-auto max-w-[580px] overflow-hidden rounded-3xl border border-stone-600/45 bg-black/50 p-3 shadow-xl shadow-black/35 backdrop-blur-sm sm:p-4">
            <iframe
              src={embedUrl}
              title="Instagram da Semana da Computação UFRJ"
              loading="lazy"
              className="h-[620px] w-full rounded-2xl bg-black sm:h-[700px]"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-6 flex justify-center" delay={200}>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-stone-500 text-stone-100 hover:bg-stone-100/10"
          >
            <a href={data.links.instagram} target="_blank" rel="noopener noreferrer">
              Abrir Instagram oficial
            </a>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
