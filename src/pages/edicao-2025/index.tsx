import { Hero2025 } from "./components/Hero2025";
import Info from "./components/Info";
import Schedule from "./components/Schedule";
import Subscribe from "./components/Subscribe";

export default function Edicao2025Page() {
  const eventDetails = {
    date: "21 a 25 de Outubro de 2025",
    location: "Instituto de Computação - UFRJ",
    schedule: [
      {
        day: "Segunda-feira",
        theme: "Inovação e Tecnologia",
        highlights: [
          "Cerimônia de Abertura",
          "Keynote: O Futuro da IA",
          "Workshop: Machine Learning na Prática",
        ],
      },
      {
        day: "Terça-feira",
        theme: "Desenvolvimento e DevOps",
        highlights: [
          "Palestra: Arquitetura de Microserviços",
          "Workshop: Docker & Kubernetes",
          "Painel: Carreira em Tech",
        ],
      },
      {
        day: "Quarta-feira",
        theme: "Dados e Inteligência Artificial",
        highlights: [
          "Talk: IA Generativa aplicada a produtos",
          "Workshop: Engenharia de Prompts",
          "Mesa-redonda: Ética e privacidade",
        ],
      },
      {
        day: "Quinta-feira",
        theme: "Design, Produto e UX",
        highlights: [
          "Palestra: Produto guiado por métricas",
          "Workshop: Prototipação rápida",
          "Painel: Carreiras multidisciplinares",
        ],
      },
      {
        day: "Sexta-feira",
        theme: "Mercado e Futuro da Computação",
        highlights: [
          "Keynote de encerramento",
          "Sessão de networking com empresas",
          "Desafio final e premiações",
        ],
      },
    ],
  };

  return (
    <main className="relative">
      <Hero2025 />
      <Info date={eventDetails.date} location={eventDetails.location} />
      <Schedule schedule={eventDetails.schedule} />
      <Subscribe />
    </main>
  );
}
