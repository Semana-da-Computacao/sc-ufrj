import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import { Link } from "react-router-dom";

export default function Sponsors() {
  const sponsors = [
    { name: "NVIDIA", category: "Master" },
    { name: "Google Cloud", category: "Master" },
    { name: "Rocketseat", category: "Gold" },
    { name: "AWS", category: "Gold" },
    { name: "Alura", category: "Gold" },
    { name: "Figma", category: "Silver" },
    { name: "MongoDB", category: "Silver" },
    { name: "Vercel", category: "Silver" },
  ];

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
          {sponsors.map((sponsor, index) => (
            <ScrollReveal
              key={sponsor.name}
              delay={70 + index * 45}
              className="rounded-2xl bg-background border border-border/70 shadow-sm p-4 text-center"
            >
              <div className="h-16 rounded-xl bg-linear-to-br from-emerald-500/15 via-cyan-500/10 to-amber-500/15 border border-border/60 flex items-center justify-center text-sm font-semibold">
                {sponsor.name}
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {sponsor.category}
              </p>
            </ScrollReveal>
          ))}
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
