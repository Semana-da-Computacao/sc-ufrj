import ScrollReveal from "@/components/scroll-reveal";
import {
  ExternalLink,
  Globe,
  Instagram,
  Link2,
  MapPin,
  Mic,
  Ticket,
  Youtube,
} from "lucide-react";
import { LinksCardRenderer } from "./components/LinksCards";
import { useLinksData } from "./data/useLinksData";
import type { LinkCardIcon } from "./data/types";

function resolvePublicUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const normalized = value.startsWith("/") ? value.slice(1) : value;
  return `${import.meta.env.BASE_URL}${normalized}`;
}

function isHttpUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function getPrimaryIcon(icon?: LinkCardIcon) {
  switch (icon) {
    case "ticket":
      return Ticket;
    case "mic":
      return Mic;
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    case "globe":
      return Globe;
    case "link":
    default:
      return Link2;
  }
}

export default function LinksPage() {
  const { data, isLoading } = useLinksData();

  if (isLoading) {
    return (
      <main className="min-h-[70vh] bg-slate-950 px-4 py-16 text-center text-slate-200">
        Carregando central de links...
      </main>
    );
  }

  const avatarUrl = resolvePublicUrl(data.profile.avatarUrl);

  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.26),transparent_34%),radial-gradient(circle_at_80%_14%,rgba(217,119,6,0.22),transparent_36%),radial-gradient(circle_at_72%_84%,rgba(20,184,166,0.2),transparent_40%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(2,6,23,0.72),rgba(15,23,42,0.9),rgba(12,74,110,0.55))]" />

      <section className="container mx-auto px-4 py-14 md:py-20">
        <ScrollReveal className="mx-auto max-w-5xl rounded-3xl border border-white/20 bg-black/35 p-7 text-center shadow-xl backdrop-blur-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">{data.header.badge}</p>
          <img
            src={avatarUrl}
            alt={data.profile.name}
            className="mx-auto mt-5 size-24 rounded-full border-2 border-cyan-300/50 object-cover bg-slate-900"
          />
          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{data.header.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200 md:text-base">{data.header.subtitle}</p>
          <p className="mt-4 text-cyan-100/90">
            <strong>{data.profile.handle}</strong> - {data.profile.bio}
          </p>
          {data.profile.location ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-cyan-100/80">
              <MapPin className="size-4" />
              {data.profile.location}
            </p>
          ) : null}
          {data.header.announcement ? (
            <p className="mx-auto mt-4 max-w-xl rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
              {data.header.announcement}
            </p>
          ) : null}

          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.primaryLinks.map((link) => {
              const Icon = getPrimaryIcon(link.icon);
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target={isHttpUrl(link.url) ? "_blank" : undefined}
                  rel={isHttpUrl(link.url) ? "noopener noreferrer" : undefined}
                  className="group flex min-h-20 w-full items-start gap-3 rounded-2xl border border-cyan-200/25 bg-cyan-500/12 px-4 py-4 text-left transition hover:border-cyan-200/55 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200/35 bg-cyan-300/15 text-cyan-100">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-semibold leading-5 text-white">
                      {link.label}
                    </span>
                    {link.subtitle ? (
                      <span className="mt-1 block break-words text-xs leading-5 text-cyan-50/85">
                        {link.subtitle}
                      </span>
                    ) : null}
                  </span>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-cyan-100/70 transition group-hover:text-cyan-100" />
                </a>
              );
            })}
          </div>

          {data.header.heroVideoUrl ? (
            <a
              href={data.header.heroVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-100 underline underline-offset-2"
            >
              Abrir video principal
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </ScrollReveal>
      </section>

      <section className="container mx-auto space-y-12 px-4 pb-16 md:pb-20">
        {data.sections.map((section, sectionIndex) => (
          <section key={section.id}>
            <ScrollReveal>
              <div className="mb-6">
                <h2 className="text-2xl font-bold md:text-3xl">{section.title}</h2>
                {section.subtitle ? <p className="mt-2 text-sm text-slate-300">{section.subtitle}</p> : null}
              </div>
            </ScrollReveal>

            <div className={section.layout === "list" ? "grid gap-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
              {section.cards.map((card, cardIndex) => (
                <LinksCardRenderer
                  key={card.id}
                  card={card}
                  delay={Math.min((sectionIndex * 4 + cardIndex) * 70, 420)}
                />
              ))}
            </div>
          </section>
        ))}
      </section>

      {data.footerNote ? (
        <section className="border-t border-white/10 bg-black/35 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-slate-300">{data.footerNote}</div>
        </section>
      ) : null}
    </main>
  );
}
