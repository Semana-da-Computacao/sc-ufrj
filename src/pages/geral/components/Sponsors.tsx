import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import { Link } from "react-router-dom";

export default function Sponsors() {
  return (
    <section id="parceiros" className="bg-muted/40 py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-3">
            Parceiros e Patrocinadores
          </h2>
          <p className="text-muted-foreground">
            Empresas e instituições que ajudam a potencializar o evento.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {/* Adicione aqui os logos dos patrocinadores */}
          <ScrollReveal
            delay={70}
            className="aspect-square bg-background rounded-2xl border border-border/70 shadow-sm flex items-center justify-center p-4 text-sm text-muted-foreground"
          >
            Logo Patrocinador 1
          </ScrollReveal>
          <ScrollReveal
            delay={130}
            className="aspect-square bg-background rounded-2xl border border-border/70 shadow-sm flex items-center justify-center p-4 text-sm text-muted-foreground"
          >
            Logo Patrocinador 2
          </ScrollReveal>
          <ScrollReveal
            delay={190}
            className="aspect-square bg-background rounded-2xl border border-border/70 shadow-sm flex items-center justify-center p-4 text-sm text-muted-foreground"
          >
            Logo Patrocinador 3
          </ScrollReveal>
          <ScrollReveal
            delay={250}
            className="aspect-square bg-background rounded-2xl border border-border/70 shadow-sm flex items-center justify-center p-4 text-sm text-muted-foreground"
          >
            Logo Patrocinador 4
          </ScrollReveal>
        </div>

        <ScrollReveal className="text-center mt-8" delay={300}>
          <Button variant="outline" asChild>
            <Link to="/parceiros">Conheça Todos os Nossos Parceiros</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
