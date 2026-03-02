import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  if (items.length === 0) return null;

  return (
    <section id="edicoes" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Edições em destaque</h2>
          <p className="mt-4 text-muted-foreground">
            Navegue pelas edições e acesse a página completa de cada ano.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-10 md:mt-12" delay={120}>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="mx-auto w-full max-w-5xl px-3 sm:px-12 lg:px-14"
          >
            <CarouselContent>
              {items.map((edition) => (
                <CarouselItem key={edition.path}>
                  <Card className="overflow-hidden border-border/70 bg-card/80 shadow-xl">
                    <div className="grid md:grid-cols-2">
                      <div className="relative flex min-h-56 items-center justify-center md:min-h-full">
                        <div className="flex aspect-[16/10] w-full items-center justify-center px-3 py-3 md:px-5 md:py-5">
                        <img
                          src={resolveImage(edition.imageUrl)}
                          alt={`Capa da ${edition.name}`}
                          className="h-full w-full object-contain"
                        />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <CardHeader className="pb-2 md:pb-3">
                          <CardTitle className="text-2xl md:text-3xl">{edition.name}</CardTitle>
                          <CardDescription className="pt-1 text-base leading-relaxed">
                            {edition.tagline}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2 text-sm leading-relaxed text-muted-foreground">
                          Explore o conteúdo completo desta edição.
                        </CardContent>
                        <CardFooter className="mt-auto pt-5">
                          <Button asChild>
                            <Link to={edition.path}>Abrir edição</Link>
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-1 sm:left-1 lg:-left-3" />
            <CarouselNext className="-right-1 sm:right-1 lg:-right-3" />
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
