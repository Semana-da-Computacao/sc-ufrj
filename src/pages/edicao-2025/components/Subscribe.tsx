import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";
import { Link } from "react-router-dom";

export default function Subscribe() {
  return (
    <section
      id="inscricoes"
      className="relative overflow-hidden py-20 md:py-24 bg-linear-to-b from-background/90 to-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(2,132,199,0.16),transparent_38%),radial-gradient(circle_at_18%_70%,rgba(37,99,235,0.18),transparent_35%)]" />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl rounded-3xl border border-border/70 bg-card/80 p-6 md:p-10 text-center shadow-xl backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold">Próxima edição</h2>
          <p className="mt-3 text-muted-foreground">
            As inscrições da edição 2025 já foram encerradas. Acompanhe a
            edição atual e os canais oficiais para novidades.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-7">
              <Link to="/2026">Ver edição 2026</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-7">
              <a
                href="https://www.instagram.com/semanadacomputacaoufrj/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acompanhar no Instagram
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
