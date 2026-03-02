import type { EventEditionData } from "./types";

export const defaultEvent2026Data: EventEditionData = {
  year: 2026,
  theme: {
    name: "The Last of Us - Temporada 2",
    visualDirection: "Visual pós-apocalíptico com foco em natureza retomando o urbano",
  },
  hero: {
    badge: "13 a 17 de abril de 2026 • CCMN/UFRJ",
    title: "Semana da Computação UFRJ 2026",
    subtitle: "When You Are Lost in the Darkness",
    description:
      "Conteúdo será carregado automaticamente do arquivo de configuração da edição 2026.",
    highlights: ["Programação dinâmica", "Auditório + Salas", "Inscrição via Even3"],
  },
  eventInfo: {
    dateRangeLabel: "13 a 17 de abril de 2026",
    location: "CCMN - UFRJ, Ilha do Fundão",
    status: "Em atualização",
    description:
      "Caso o arquivo JSON esteja indisponível, este conteúdo de fallback é exibido.",
  },
  links: {
    even3: "https://www.even3.com.br/",
    instagram: "https://www.instagram.com/semanadacomputacaoufrj/",
  },
  presentationSubmission: {
    title: "Inscrições para apresentar",
    description: "Submeta sua apresentação para participar da programação da edição 2026.",
    deadline: "Até 23:59 de 09/03/2026",
    date: "23 a 27 de março de 2026",
    time: "9h às 17h",
    location: "Ilha do Fundão - UFRJ",
    contactEmail: "semanadacomputacao@ic.ufrj.br",
    formUrl: "https://forms.gle/WQqS2bn8137Xvnz47",
  },
  assets: {
    heroFallbackGif: "2026/bg-hero.gif",
    heroRightImage: "2026/hero-right.png",
    zombieLeft: "2026/zombie-left.png",
    zombieRight: "2026/zombie-right.png",
  },
  seo: {
    title: "Edição 2026 | Semana da Computação UFRJ",
    description:
      "Página oficial da edição 2026 da Semana da Computação UFRJ com programação completa, patrocinadores, palestrantes e inscrições no Even3.",
    keywords:
      "Semana da Computação UFRJ 2026, evento de computação, UFRJ, programação, palestras, workshops, Even3",
    canonicalUrl: "https://semana-da-computacao.github.io/sc-ufrj/2026",
    ogImage: "2026/seo-banner-2026.png",
    twitterImage: "2026/seo-banner-2026.png",
    twitterCard: "summary_large_image",
    siteName: "Semana da Computação UFRJ",
    ogType: "website",
  },
  sponsors: {
    title: "Patrocinadores e Parceiros",
    subtitle: "Empresas e instituições que fortalecem a edição 2026.",
    tiers: [],
    partners: [],
  },
  storySections: [
    {
      id: "jornada",
      kicker: "A jornada",
      title: "Do campus ao mercado, sem atalhos",
      description:
        "A edição 2026 foi desenhada para conectar fundamentos técnicos com decisões reais de produto e carreira.",
      imageUrl:
        "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=1400&q=80",
    },
  ],
  days: [],
};
