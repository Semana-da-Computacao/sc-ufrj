import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";
import type { EventEditionData } from "../data/types";

interface Subscribe2026Props {
  data: EventEditionData;
}

export default function Subscribe2026({ data }: Subscribe2026Props) {
  const submission = data.presentationSubmission;

  return (
    <section id="inscricoes" className="relative py-20 md:py-24 bg-zinc-900 text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(21,128,61,0.2),transparent_35%),radial-gradient(circle_at_82%_76%,rgba(120,53,15,0.25),transparent_42%)]" />
      <div className="relative container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-3xl rounded-3xl border border-stone-600/45 bg-black/50 p-7 md:p-10 text-center shadow-xl shadow-black/35 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold">Inscrições 2026</h2>
          <p className="mt-3 text-stone-300">
            Garanta sua vaga no Even3 e faça parte da edição mais imersiva da Semana da Computação.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-600 text-white">
              <a href={data.links.even3} target="_blank" rel="noopener noreferrer">
                Ir para o Even3
              </a>
            </Button>
            <Button asChild size="lg" className="bg-amber-700 hover:bg-amber-600 text-white">
              <a href={submission.formUrl} target="_blank" rel="noopener noreferrer">
                {submission.title}
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-stone-500 text-stone-100 hover:bg-stone-100/10"
            >
              <a href={data.links.instagram} target="_blank" rel="noopener noreferrer">
                Acompanhar no Instagram
              </a>
            </Button>
          </div>

          <div className="mt-7 rounded-2xl border border-amber-500/30 bg-amber-900/15 p-5 text-left">
            <p className="text-amber-100 font-semibold">{submission.description}</p>
            <p className="mt-2 text-stone-200">
              O formulário ficará aberto até <strong>{submission.deadline}</strong>.
            </p>
            <p className="mt-2 text-stone-300">Data: {submission.date}</p>
            <p className="text-stone-300">Horário: {submission.time}</p>
            <p className="text-stone-300">Local: {submission.location}</p>
            <p className="mt-2 text-stone-200">
              Em caso de dúvidas:{" "}
              <a
                href={`mailto:${submission.contactEmail}`}
                className="underline underline-offset-2 hover:text-amber-200"
              >
                {submission.contactEmail}
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
