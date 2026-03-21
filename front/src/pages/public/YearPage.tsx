/**
 * Landing page de uma edição específica do SC-UFRJ
 * Rota: /:ano  (ex: /2026)
 * Consome a API pública para exibir dados do evento com SEO
 */
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar, MapPin, Users, Mic2, Store, ArrowLeft,
  ArrowRight, Clock, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Event } from "@/types";
import { formatDate } from "@/lib/utils";

function CodeComment({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground/60 font-mono text-sm">{children}</span>;
}

function SkeletonCard() {
  return <div className="h-32 bg-muted animate-pulse rounded border border-border" />;
}

export function YearPage() {
  const { ano } = useParams<{ ano: string }>();
  const year = Number(ano);

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["public-event", year],
    queryFn: async () => {
      // Busca na API pública pelo ano
      const { data } = await api.get<{ success: boolean; data: Event[] }>(
        "/public/events",
        { params: { year } }
      );
      return data.data?.[0] ?? null;
    },
    enabled: !!year && !isNaN(year),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 space-y-8">
        <div className="h-48 bg-muted animate-pulse rounded border border-border" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-32 text-center space-y-4">
        <CodeComment>{"// 404 — edição não encontrada"}</CodeComment>
        <p className="text-2xl font-bold text-foreground">Edição {ano} não encontrada</p>
        <p className="text-muted-foreground font-mono text-sm">
          Esta edição ainda não foi publicada ou não existe.
        </p>
        <Button variant="outline" asChild className="mt-4 font-mono gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> voltar ao início
          </Link>
        </Button>
      </div>
    );
  }

  const totalActivities = event.days?.reduce(
    (sum, d) => sum + (d.activities?.length ?? 0), 0
  ) ?? 0;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Banner de fundo quando disponível */}
        {event.bannerUrl ? (
          <>
            <div className="absolute inset-0">
              <img
                src={event.bannerUrl}
                alt={`Banner ${event.name}`}
                className="h-full w-full object-cover"
              />
              {/* Gradiente sobre o banner para legibilidade */}
              <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/80 to-background/40" />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground font-mono gap-2 -ml-2">
              <Link to="/">
                <ArrowLeft className="h-3.5 w-3.5" /> todas as edições
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-5xl sm:text-7xl font-bold text-primary font-mono">{event.year}</span>
                <Badge
                  variant={event.isPublished ? "success" : "secondary"}
                  className="font-mono text-xs self-start mt-3"
                >
                  {event.isPublished ? "publicado" : "em breve"}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{event.name}</h1>
              {event.description && (
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="flex flex-col gap-2 min-w-50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>
                  {formatDate(event.startDate)} — {formatDate(event.endDate)}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline font-mono"
                >
                  <Globe className="h-4 w-4 shrink-0" />
                  site oficial
                </a>
              )}
            </div>
          </div>

          {/* CTAs */}
          {event.isPublished && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="font-mono gap-2" asChild>
                <Link to="/login">
                  inscrever-se <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats rápidas ── */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "inscritos",      value: event._count?.registrations ?? 0, icon: Users,    color: "text-accent" },
              { label: "atividades",     value: totalActivities,                  icon: Clock,    color: "text-primary" },
              { label: "palestrantes",   value: event._count?.speakers ?? 0,      icon: Mic2,     color: "text-chart-3" },
              { label: "estandes",       value: event._count?.stands ?? 0,        icon: Store,    color: "text-chart-4" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <p className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground font-mono">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dias / programação resumida ── */}
      {event.days && event.days.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
            <CodeComment>{"// programação"}</CodeComment>
            <h2 className="text-lg font-bold text-foreground mt-1 mb-6">Programação</h2>
            <div className="space-y-4">
              {event.days.map((day) => (
                <div key={day.id} className="rounded border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {day.label || formatDate(day.date)}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono ml-auto">
                      {day.activities?.length ?? 0} atividades
                    </span>
                  </div>
                  {day.activities && day.activities.length > 0 && (
                    <div className="space-y-1 pl-4 border-l border-border">
                      {day.activities.slice(0, 4).map((act) => (
                        <div key={act.id} className="flex items-center gap-2 text-xs text-muted-foreground font-mono py-0.5">
                          <span className="text-primary shrink-0">{act.type === "KEYNOTE" ? "⭐" : "▸"}</span>
                          <span className="flex-1 truncate text-foreground/70">{act.title}</span>
                        </div>
                      ))}
                      {(day.activities.length ?? 0) > 4 && (
                        <p className="text-xs text-muted-foreground font-mono pl-4 pt-1">
                          +{(day.activities.length ?? 0) - 4} outras atividades...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Palestrantes ── */}
      {event.speakers && event.speakers.length > 0 && (
        <section className="border-b border-border bg-card/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
            <CodeComment>{"// palestrantes"}</CodeComment>
            <h2 className="text-lg font-bold text-foreground mt-1 mb-6">Palestrantes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.speakers.slice(0, 8).map((speaker) => (
                <div key={speaker.id} className="flex items-center gap-3 rounded border border-border bg-card p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted text-foreground text-sm font-bold font-mono">
                    {speaker.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{speaker.name}</p>
                    {speaker.title && (
                      <p className="text-xs text-muted-foreground truncate font-mono">{speaker.title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA final ── */}
      <section className="border-t border-border bg-sidebar/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center space-y-4">
          <CodeComment>{"// garanta sua presença"}</CodeComment>
          <p className="text-xl font-bold text-foreground mt-2">Participe do SC-UFRJ {event.year}</p>
          <p className="text-muted-foreground font-mono text-sm">
            Entrada gratuita para toda a comunidade acadêmica e tech.
          </p>
          {event.isPublished && (
            <Button size="lg" className="mt-4 font-mono gap-2" asChild>
              <Link to="/login">
                inscrever-se <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
