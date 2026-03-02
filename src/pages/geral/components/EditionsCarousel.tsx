import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScrollReveal from "@/components/scroll-reveal";
import type { HomeFeaturedEdition } from "../data/types";

interface EditionsCarouselProps {
  items: HomeFeaturedEdition[];
}

function resolveImage(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export default function EditionsCarousel({ items }: EditionsCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = items.length;

  const current = useMemo(() => {
    if (total === 0) return null;
    return items[((index % total) + total) % total];
  }, [index, items, total]);

  if (!current) return null;

  return (
    <section id="edicoes" className="py-14 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Edições em destaque</h2>
          <p className="mt-3 text-muted-foreground">
            Navegue pelas edições e acesse a página completa de cada ano.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-8" delay={120}>
          <Card className="overflow-hidden border-border/70 bg-card/80 shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-56 md:min-h-full">
                <img
                  src={resolveImage(current.imageUrl)}
                  alt={`Capa da ${current.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">{current.name}</CardTitle>
                  <CardDescription className="text-base">{current.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Slide {((index % total) + total) % total + 1} de {total}
                </CardContent>
                <CardFooter className="mt-auto flex flex-wrap gap-2">
                  <Button asChild>
                    <Link to={current.path}>Abrir edição</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Slide anterior"
                    onClick={() => setIndex((value) => value - 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Próximo slide"
                    onClick={() => setIndex((value) => value + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
