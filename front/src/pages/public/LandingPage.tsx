/**
 * Landing page principal — SC-UFRJ
 * Visão geral do evento; estilo IDE / terminal
 */
import { Link } from "react-router-dom";
import { Terminal, Cpu, Users, Calendar, Mic2, Store, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Dados estáticos das edições ── */
const EDITIONS = [
  { year: 2026, status: "upcoming", theme: "IA & Computação do Futuro",  registrations: null },
  { year: 2025, status: "past",     theme: "Open Source & Comunidade",   registrations: 1240 },
  { year: 2024, status: "past",     theme: "Segurança e Infraestrutura", registrations: 980  },
  { year: 2023, status: "past",     theme: "Cloud & Plataformas",        registrations: 870  },
];

const STATS = [
  { label: "edições realizadas", value: "10+",  icon: Calendar, color: "text-primary" },
  { label: "participantes",      value: "5k+",  icon: Users,    color: "text-accent" },
  { label: "palestrantes",       value: "200+", icon: Mic2,     color: "text-chart-3" },
  { label: "empresas parceiras", value: "80+",  icon: Store,    color: "text-chart-4" },
];

function CodeComment({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted-foreground/70 font-mono text-sm">{children}</span>
  );
}

export function LandingPage() {
  return (
    <div className="relative">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Grid background sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-32">
          {/* Linha de cabeçalho estilo comentário de arquivo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/15">
              <Terminal className="h-4 w-4 text-primary" />
            </div>
            <CodeComment>// src/events/semana-computacao.ts</CodeComment>
          </div>

          {/* Título principal */}
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm font-mono text-primary">export const event = &#123;</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground pl-4 sm:pl-8">
              Semana da{" "}
              <span className="text-primary">Computação</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-muted-foreground pl-4 sm:pl-8">
              UFRJ
            </p>
            <div className="pl-4 sm:pl-8 space-y-1">
              <CodeComment>
                {"  // O maior evento de tecnologia da UFRJ"}
              </CodeComment>
              <p className="text-base sm:text-lg text-foreground/80 font-mono">
                <span className="text-muted-foreground">  location: </span>
                <span className="text-chart-3">"Cidade Universitária, RJ"</span>
                <span className="text-muted-foreground">,</span>
              </p>
              <p className="text-base sm:text-lg text-foreground/80 font-mono">
                <span className="text-muted-foreground">  format: </span>
                <span className="text-chart-3">"palestras · workshops · estandes"</span>
              </p>
            </div>
            <p className="text-sm font-mono text-primary">&#125;</p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" className="gap-2 font-mono" asChild>
              <Link to="/2026">
                <ArrowRight className="h-4 w-4" />
                ver edição 2026
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 font-mono" asChild>
              <Link to="/login">
                <ExternalLink className="h-4 w-4" />
                área do participante
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <p className={`text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground font-mono">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Edições ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="mb-8">
          <CodeComment>// edições do evento</CodeComment>
          <h2 className="text-xl font-bold text-foreground mt-1">Edições</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EDITIONS.map((ed) => (
            <Link
              key={ed.year}
              to={`/${ed.year}`}
              className="group relative flex flex-col gap-3 rounded border border-border bg-card p-4 hover:border-primary/50 hover:bg-card/80 transition-all"
            >
              {/* Indicador de status */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground font-mono group-hover:text-primary transition-colors">
                  {ed.year}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono ${
                    ed.status === "upcoming"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {ed.status === "upcoming" ? "em breve" : "realizado"}
                </span>
              </div>

              {ed.theme && (
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  {/* {ed.theme} */}
                  <CodeComment>{"// " + ed.theme}</CodeComment>
                </p>
              )}

              {ed.registrations && (
                <p className="text-xs text-accent font-mono mt-auto">
                  {ed.registrations.toLocaleString("pt-BR")} participantes
                </p>
              )}

              <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="border-t border-border bg-sidebar/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-primary" />
            <CodeComment>{"// cadastre-se e participe"}</CodeComment>
          </div>
          <p className="text-2xl font-bold text-foreground">
            Faça parte da próxima edição
          </p>
          <p className="text-muted-foreground font-mono text-sm max-w-md mx-auto">
            Palestras, workshops, networking e muito mais. Gratuito para toda a comunidade.
          </p>
          <Button size="lg" className="mt-4 font-mono gap-2" asChild>
            <Link to="/login">
              inscreva-se agora <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
