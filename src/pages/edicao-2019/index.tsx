import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/scroll-reveal";

const even3Url = "https://www.even3.com.br/viii-semana-da-computacao-ufrj/";

const highlights = [
  { label: "Inscritos (2018)", value: "1635" },
  { label: "Participantes externos", value: "700+" },
  { label: "Interesse em estágio", value: "831" },
  { label: "Dias de evento", value: "5" },
  { label: "Trilhas de conteúdo", value: "7" },
];

const tracks = [
  "Casa Stark",
  "Casa Martell",
  "Casa Lannister",
  "Casa Baratheon",
  "Casa Greyjoy",
  "Casa Arryn",
  "Casa Tyrell",
];

const interests = [
  "Big Data",
  "Desenvolvimento Mobile e Web",
  "Inteligência Artificial",
  "Empreendedorismo",
  "Criptomoedas",
  "Redes",
  "Blockchain",
  "IoT",
  "Mulher na Computação",
  "Jogos",
  "Mercado de trabalho",
  "Computação Científica",
  "Mercado Financeiro",
  "Deep Learning",
];

export default function Edicao2019Page() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative isolate overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 -z-20 bg-linear-to-br from-cyan-50 via-background to-blue-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_80%_78%,rgba(59,130,246,0.18),transparent_40%)] dark:bg-[radial-gradient(circle_at_18%_22%,rgba(14,165,233,0.32),transparent_35%),radial-gradient(circle_at_80%_78%,rgba(59,130,246,0.28),transparent_40%)]" />

        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <ScrollReveal className="rounded-3xl border border-border/70 bg-card/80 p-7 text-card-foreground shadow-2xl shadow-black/10 dark:shadow-black/35 backdrop-blur-sm md:p-11">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-300">
                5ª Edição • 26 a 30 de agosto de 2019 • Cidade Universitária, RJ
              </p>
              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Semana da Computação
                <span className="mt-1 block text-cyan-700 dark:text-cyan-300">Edição 2019</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base text-foreground/90 sm:text-lg">
                Página histórica baseada na proposta oficial de patrocínio da
                edição 2019. O evento foi organizado por alunos e professores
                de Ciência da Computação da UFRJ para conectar formação
                acadêmica, mercado de tecnologia e oportunidades reais de
                carreira.
              </p>
              <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
                A programação contou com palestras, workshops, mesas-redondas,
                competições, games e exposições para públicos da UFRJ, de
                outras universidades e também estudantes do ensino médio.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={even3Url} target="_blank" rel="noopener noreferrer">
                    Inscrições no Even3
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#numeros2019">Ver números</a>
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={100}
              direction="right"
              className="rounded-3xl border border-border/70 bg-card/90 p-6 text-card-foreground shadow-2xl shadow-black/10 dark:shadow-black/35 backdrop-blur-sm md:p-8"
            >
              <h2 className="text-lg font-semibold">Resumo da edição</h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-border/60 bg-background/65 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                    Tema
                  </p>
                  <p className="mt-1 text-sm">Game of Thrones</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/65 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                    Formato
                  </p>
                  <p className="mt-1 text-sm">
                    5 dias de atrações e 7 trilhas de conteúdo
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/65 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                    Foco
                  </p>
                  <p className="mt-1 text-sm">
                    Tecnologia, mercado e aproximação com empresas
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="numeros2019" className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Números da edição</h2>
            <p className="mt-3 text-muted-foreground">
              Dados históricos usados nesta página, extraídos da proposta de
              patrocínio de 2019.
            </p>
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {highlights.map((item, index) => (
              <ScrollReveal
                key={item.label}
                delay={80 + index * 70}
                className="event-card text-center"
              >
                <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(37,99,235,0.15),transparent_35%)]" />
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <ScrollReveal className="event-card h-full">
              <h3 className="text-2xl font-bold">7 trilhas por casas temáticas</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                O conteúdo foi dividido em casas inspiradas em Game of Thrones,
                cada uma abordando uma frente da computação.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {tracks.map((track, index) => (
                  <span
                    key={track}
                    className="rounded-lg border border-border/60 bg-background/65 px-3 py-2 text-sm"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {track}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={140} direction="right" className="event-card h-full">
              <h3 className="text-2xl font-bold">Temas mais votados</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Pesquisa de interesse dos participantes para orientar a grade.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {interests.map((topic, index) => (
                  <span
                    key={topic}
                    className="rounded-full border border-cyan-600/25 bg-cyan-500/10 px-3 py-1.5 text-xs sm:text-sm"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}
