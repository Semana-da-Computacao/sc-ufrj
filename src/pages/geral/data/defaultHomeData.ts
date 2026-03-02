import type { HomePageData } from "./types";

export const defaultHomeData: HomePageData = {
  hero: {
    badge: "Semana da Computação UFRJ",
    title: "Conectando universidade, tecnologia e mercado",
    subtitle:
      "A Semana da Computação reúne trilhas técnicas, carreira e networking com foco em formação prática.",
    primaryCtaLabel: "Inscrição 2026 no Even3",
    primaryCtaUrl: "https://www.even3.com.br/ix-semana-da-computacao-ufrj-2026/",
    secondaryCtaLabel: "Ver edição 2026",
    secondaryCtaUrl: "/2026",
  },
  stats: [
    { number: "15+", label: "Edições realizadas" },
    { number: "1000+", label: "Participantes por edição" },
    { number: "50+", label: "Palestras e workshops" },
    { number: "30+", label: "Empresas parceiras" },
  ],
  about: {
    title: "O que é a Semana da Computação UFRJ",
    subtitle: "Um evento anual criado para ampliar a formação além da sala de aula.",
    paragraphs: [
      "A Semana da Computação da UFRJ reúne estudantes, professores, pesquisadores e profissionais em uma agenda de conteúdo técnico e de carreira.",
      "A proposta é aproximar universidade e indústria, fortalecer a comunidade de computação e criar oportunidades reais para quem quer crescer na área.",
    ],
  },
  featuredEditions: [],
  committee: {
    title: "Comissão organizadora",
    subtitle: "Equipe responsável pela curadoria, logística e execução do evento.",
    members: [],
  },
  faq: {
    title: "Perguntas frequentes",
    subtitle: "Dúvidas comuns sobre inscrição, certificados e acesso.",
    items: [],
  },
};
