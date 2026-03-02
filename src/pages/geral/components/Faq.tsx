import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ScrollReveal from "@/components/scroll-reveal";
import type { HomeFaqItem } from "../data/types";

interface FaqProps {
  title: string;
  subtitle: string;
  items: HomeFaqItem[];
}

export default function Faq({ title, subtitle, items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-14 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
        </ScrollReveal>

        <div className="mx-auto mt-8 max-w-4xl space-y-3">
          {items.map((item, index) => {
            const open = openIndex === index;
            return (
              <ScrollReveal key={`${item.question}-${index}`} delay={80 + index * 35}>
                <Card className="border-border/70 bg-card/80">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base md:text-lg">{item.question}</CardTitle>
                      {!open ? <CardDescription>Clique para expandir</CardDescription> : null}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={open ? "Recolher resposta" : "Expandir resposta"}
                      onClick={() => setOpenIndex(open ? null : index)}
                    >
                      <ChevronDown className={open ? "rotate-180 transition-transform" : "transition-transform"} />
                    </Button>
                  </CardHeader>
                  {open ? (
                    <CardContent className="pt-0 text-muted-foreground">
                      {item.answer}
                    </CardContent>
                  ) : null}
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
