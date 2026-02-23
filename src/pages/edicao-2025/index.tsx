import { Hero2025 } from "./components/Hero2025";
import Info from "./components/Info";
import Schedule from "./components/Schedule";
import Subscribe from "./components/Subscribe";

export default function Edicao2025Page() {
  const eventDetails = {
    date: "31 de Março a 04 de Abril de 2025",
    location: "CCMN - UFRJ, Ilha do Fundão",
    about:
      "A Semana da Computação da UFRJ reúne a comunidade acadêmica e o mercado em uma programação com palestras, workshops e espaços de networking. A proposta é aproximar teoria e prática com conteúdo ministrado por professores, ex-alunos e profissionais da área.",
    schedule: [
      {
        day: "Segunda-feira",
        theme: "Abertura e tendências em tecnologia",
        highlights: [
          "Recepção e abertura do evento",
          "Palestras com profissionais convidados",
          "Debates sobre cenário atual da computação",
        ],
      },
      {
        day: "Terça-feira",
        theme: "Desenvolvimento de software",
        highlights: [
          "Boas práticas de engenharia de software",
          "Workshops práticos de desenvolvimento",
          "Discussões sobre carreira em tecnologia",
        ],
      },
      {
        day: "Quarta-feira",
        theme: "Dados e Inteligência Artificial",
        highlights: [
          "Aplicações de IA no mercado",
          "Sessões técnicas com estudos de caso",
          "Mesa-redonda sobre ética e impacto social",
        ],
      },
      {
        day: "Quinta-feira",
        theme: "Design, Produto e UX",
        highlights: [
          "Integração entre produto e tecnologia",
          "Atividades colaborativas e oficinas",
          "Carreiras multidisciplinares em times tech",
        ],
      },
      {
        day: "Sexta-feira",
        theme: "Mercado e Futuro da Computação",
        highlights: [
          "Painéis com ex-alunos e empresas",
          "Networking entre estudantes e profissionais",
          "Encerramento e próximos passos da comunidade",
        ],
      },
    ],
  };

  return (
    <main className="relative">
      <Hero2025 />
      <Info
        date={eventDetails.date}
        location={eventDetails.location}
        about={eventDetails.about}
      />
      <Schedule schedule={eventDetails.schedule} />
      <Subscribe />
    </main>
  );
}
