import ScrollReveal from "@/components/scroll-reveal";

export default function About() {
  return (
    <section id="sobre" className="relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(30,64,175,0.16),transparent_38%)]" />
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-3">
            O Que É a Semana da Computação UFRJ
          </h2>
          <p className="text-muted-foreground">
            Um evento anual criado por alunos e professores para ampliar a
            formação além da sala de aula.
          </p>
        </ScrollReveal>

        <ScrollReveal className="event-card mt-8 leading-relaxed" delay={100}>
          <p className="text-base md:text-lg">
            A Semana da Computação da UFRJ reúne estudantes, professores,
            pesquisadores e profissionais do mercado em uma agenda de conteúdo
            técnico e de carreira. Durante o evento, a comunidade participa de
            palestras, workshops, painéis e atividades práticas com foco em
            tecnologia, inovação e empregabilidade.
          </p>
          <p className="text-base md:text-lg mt-5">
            A proposta é aproximar universidade e indústria, fortalecer a
            comunidade de computação e criar um ambiente de troca de
            conhecimento, networking e oportunidades reais para quem quer
            crescer na área.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
