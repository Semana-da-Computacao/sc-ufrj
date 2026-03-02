import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  Mic,
  Sparkles,
  Ticket,
  Users,
  Video,
  Youtube,
} from "lucide-react";
import type { LinkCardIcon, LinkItem, LinksCard } from "../data/types";

function resolvePublicUrl(value?: string) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const normalized = value.startsWith("/") ? value.slice(1) : value;
  return `${import.meta.env.BASE_URL}${normalized}`;
}

function isHttpUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function getIcon(icon?: LinkCardIcon) {
  switch (icon) {
    case "sparkles":
      return Sparkles;
    case "youtube":
      return Youtube;
    case "instagram":
      return Instagram;
    case "linkedin":
      return Linkedin;
    case "github":
      return Github;
    case "mail":
      return Mail;
    case "calendar":
      return Calendar;
    case "map-pin":
      return MapPin;
    case "users":
      return Users;
    case "book":
      return BookOpen;
    case "ticket":
      return Ticket;
    case "globe":
      return Globe;
    case "mic":
      return Mic;
    case "video":
      return Video;
    case "link":
    default:
      return Link2;
  }
}

function iconBadge(icon?: LinkCardIcon) {
  const Icon = getIcon(icon);
  return (
    <span className="inline-flex size-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-cyan-100">
      <Icon className="size-4" />
    </span>
  );
}

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube-nocookie.com/embed/${id}`;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return `https://www.youtube-nocookie.com${parsed.pathname}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function LinkGridItem({ item }: { item: LinkItem }) {
  const Icon = getIcon(item.icon);

  return (
      <a
      href={item.url}
      target={isHttpUrl(item.url) ? "_blank" : undefined}
      rel={isHttpUrl(item.url) ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-sm text-white/90 transition hover:border-cyan-300/60 hover:bg-cyan-500/10"
    >
      <Icon className="size-4 text-cyan-200" />
      <span className="flex-1">{item.label}</span>
      <ExternalLink className="size-3 opacity-50 transition group-hover:opacity-100" />
    </a>
  );
}

export function LinksCardRenderer({ card, delay = 0 }: { card: LinksCard; delay?: number }) {
  if (card.type === "video") {
    const embedUrl = getYoutubeEmbedUrl(card.videoUrl);

    return (
      <ScrollReveal delay={delay} className="h-full">
        <article className="h-full rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-cyan-900/50 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            {iconBadge(card.icon)}
          </div>
          {card.description ? <p className="mb-4 text-sm text-cyan-50/80">{card.description}</p> : null}
          {embedUrl ? (
            <div className="overflow-hidden rounded-xl border border-white/20 aspect-video">
              <iframe
                src={embedUrl}
                title={card.title}
                loading="lazy"
                className="h-full w-full"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={card.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-200 underline underline-offset-2"
            >
              Abrir video
              <ExternalLink className="size-4" />
            </a>
          )}
          {card.ctaUrl ? (
            <div className="mt-4">
              <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                <a href={card.ctaUrl} target="_blank" rel="noopener noreferrer">
                  {card.ctaLabel ?? "Ver mais"}
                </a>
              </Button>
            </div>
          ) : null}
        </article>
      </ScrollReveal>
    );
  }

  if (card.type === "grid") {
    const columnsClass =
      card.columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : card.columns === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-2 lg:grid-cols-3";

    return (
      <ScrollReveal delay={delay} className="h-full">
        <article className="h-full rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-blue-900/50 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            {iconBadge(card.icon)}
          </div>
          {card.description ? <p className="mb-4 text-sm text-blue-50/80">{card.description}</p> : null}
          <div className={`grid gap-3 ${columnsClass}`}>
            {card.items.map((item) => (
              <LinkGridItem key={`${card.id}-${item.label}`} item={item} />
            ))}
          </div>
        </article>
      </ScrollReveal>
    );
  }

  if (card.type === "contact") {
    return (
      <ScrollReveal delay={delay} className="h-full">
        <article className="h-full rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-emerald-900/45 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            {iconBadge(card.icon)}
          </div>
          {card.description ? <p className="text-sm text-emerald-50/80">{card.description}</p> : null}
          {card.email ? (
            <a
              href={`mailto:${card.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-100 underline underline-offset-2"
            >
              <Mail className="size-4" />
              {card.email}
            </a>
          ) : null}
          {card.whatsappUrl ? (
            <div className="mt-4">
              <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-white">
                <a href={card.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          ) : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {card.links.map((link) => (
              <LinkGridItem key={`${card.id}-${link.label}`} item={link} />
            ))}
          </div>
        </article>
      </ScrollReveal>
    );
  }

  if (card.type === "featured") {
    const imageUrl = resolvePublicUrl(card.imageUrl);

    return (
      <ScrollReveal delay={delay} className="h-full">
        <article className="h-full rounded-3xl border border-amber-300/30 bg-gradient-to-br from-slate-900/95 to-amber-900/55 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            {iconBadge(card.icon)}
          </div>
          {card.meta ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-amber-200">{card.meta}</p> : null}
          {card.description ? <p className="mb-4 text-sm text-amber-50/85">{card.description}</p> : null}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card.title}
              loading="lazy"
              className="mb-4 h-36 w-full rounded-xl border border-white/20 object-cover"
            />
          ) : null}
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-500 text-black">
            <a href={card.url} target={isHttpUrl(card.url) ? "_blank" : undefined} rel={isHttpUrl(card.url) ? "noopener noreferrer" : undefined}>
              {card.ctaLabel ?? "Abrir"}
            </a>
          </Button>
        </article>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal delay={delay} className="h-full">
      <article className="h-full rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-indigo-900/50 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{card.title}</h3>
          {iconBadge(card.icon)}
        </div>
        {card.description ? <p className="mb-4 text-sm text-indigo-50/85">{card.description}</p> : null}
        <Button asChild size="sm" className="bg-indigo-500 hover:bg-indigo-400 text-white">
          <a href={card.url} target={isHttpUrl(card.url) ? "_blank" : undefined} rel={isHttpUrl(card.url) ? "noopener noreferrer" : undefined}>
            {card.ctaLabel ?? "Acessar link"}
          </a>
        </Button>
      </article>
    </ScrollReveal>
  );
}
