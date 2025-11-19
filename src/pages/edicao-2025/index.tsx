import { Hero2025 } from "./components/Hero2025";
import Info from "./components/Info";
import Schedule from "./components/Schedule";
import Subscribe from "./components/Subscribe";

export default function Edicao2025Page() {
  const eventDetails = {
    date: "21 a 25 de Outubro de 2025",
    location: "Instituto de Computação - UFRJ",
    about: "A Semana da Computação é um evento anual que reúne especialistas, estudantes e entusiastas da área de tecnologia. Em 2025, o evento focará em inovações tecnológicas, desenvolvimento de software e tendências emergentes no setor de computação.",
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
      // Outros dias serão adicionados
    ],
  };

  return (
    <>
      <Hero2025 />
      <Info date={eventDetails.date} location={eventDetails.location} about={eventDetails.about} />
      <Schedule schedule={eventDetails.schedule} />
      <Subscribe />
    </>
  );
}
