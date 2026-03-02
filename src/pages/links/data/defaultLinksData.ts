import type { LinksPageData } from "./types";

export const defaultLinksData: LinksPageData = {
  profile: {
    name: "Semana da Computacao UFRJ",
    handle: "@semanadacomputacaoufrj",
    bio: "Links oficiais da Semana da Computacao UFRJ: inscricoes, programacao, videos e contato.",
    avatarUrl: "Logo_SC_2025_DVPF.svg",
    location: "Ilha do Fundao, Rio de Janeiro",
  },
  header: {
    badge: "Central de Links",
    title: "Acesse tudo da Semana da Computacao",
    subtitle: "Uma pagina unica com links de inscricao, programacao, videos e redes.",
    announcement: "Atualizado automaticamente via JSON.",
    heroVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  primaryLinks: [
    {
      label: "Inscricao no Even3",
      subtitle: "Garanta sua vaga na edicao mais recente",
      url: "https://www.even3.com.br/",
      icon: "ticket",
    },
    {
      label: "Instagram Oficial",
      subtitle: "Bastidores e anuncios",
      url: "https://www.instagram.com/semanadacomputacaoufrj/",
      icon: "instagram",
    },
    {
      label: "Canal no YouTube",
      subtitle: "Palestras e conteudo tecnico",
      url: "https://www.youtube.com/",
      icon: "youtube",
    },
  ],
  sections: [
    {
      id: "destaques",
      title: "Destaques da Semana",
      subtitle: "Os links mais importantes para agora.",
      layout: "grid",
      cards: [
        {
          id: "call-for-talks",
          type: "featured",
          title: "Inscricoes para Apresentar",
          description: "Envie sua proposta de apresentacao para a edicao 2026.",
          meta: "Prazo: 09/03/2026 as 23:59",
          url: "https://forms.gle/WQqS2bn8137Xvnz47",
          ctaLabel: "Enviar proposta",
          icon: "mic",
        },
        {
          id: "programacao-2026",
          type: "link",
          title: "Programacao 2026",
          description: "Confira trilhas, horarios e palestrantes da edicao.",
          url: "/2026#programacao",
          ctaLabel: "Ver programacao",
          icon: "calendar",
        },
      ],
    },
    {
      id: "videos",
      title: "Videos e Conteudos",
      subtitle: "Cards com embed de YouTube ou links externos.",
      layout: "grid",
      cards: [
        {
          id: "video-teaser",
          type: "video",
          title: "Teaser da Edicao",
          description: "Assista ao video de abertura e compartilhe com sua turma.",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          ctaUrl: "https://www.youtube.com/@semanadacomputacaoufrj",
          ctaLabel: "Abrir canal",
          icon: "video",
        },
      ],
    },
    {
      id: "links-rapidos",
      title: "Grid de Links Rapidos",
      subtitle: "Monte seu proprio linktree com quantos botoes quiser.",
      layout: "grid",
      cards: [
        {
          id: "grid-principal",
          type: "grid",
          title: "Navegacao Rapida",
          description: "Acesso em grade para recursos e paginas importantes.",
          columns: 3,
          icon: "sparkles",
          items: [
            { label: "Home", url: "/", icon: "globe" },
            { label: "Edicao 2026", url: "/2026", icon: "calendar" },
            { label: "Edicao 2025", url: "/2025", icon: "calendar" },
            { label: "Edicao 2019", url: "/2019", icon: "book" },
            { label: "Instagram", url: "https://www.instagram.com/semanadacomputacaoufrj/", icon: "instagram" },
            { label: "YouTube", url: "https://www.youtube.com/", icon: "youtube" },
          ],
        },
      ],
    },
    {
      id: "contato",
      title: "Contato e Redes",
      subtitle: "Canais oficiais para tirar duvidas e acompanhar novidades.",
      layout: "list",
      cards: [
        {
          id: "fale-com-comissao",
          type: "contact",
          title: "Fale com a Comissao",
          description: "Use os canais oficiais para duvidas sobre inscricoes, apoio e palestras.",
          email: "semanadacomputacao@ic.ufrj.br",
          links: [
            {
              label: "Instagram",
              url: "https://www.instagram.com/semanadacomputacaoufrj/",
              icon: "instagram",
            },
            {
              label: "LinkedIn",
              url: "https://www.linkedin.com/school/universidade-federal-do-rio-de-janeiro/",
              icon: "linkedin",
            },
            {
              label: "GitHub",
              url: "https://github.com/semana-da-computacao",
              icon: "github",
            },
          ],
          icon: "mail",
        },
      ],
    },
  ],
  footerNote: "Semana da Computacao UFRJ - central oficial de links e conteudos.",
  seo: {
    title: "Links Oficiais | Semana da Computacao UFRJ",
    description: "Pagina de links da Semana da Computacao UFRJ com inscricoes, videos, redes sociais e contato.",
    keywords: "Semana da Computacao UFRJ, links, inscricao, youtube, instagram, evento",
    canonicalUrl: "https://semana-da-computacao.github.io/sc-ufrj/links",
    ogImage: "Logo_SC_2025_DVPF.svg",
    twitterImage: "Logo_SC_2025_DVPF.svg",
    twitterCard: "summary_large_image",
    siteName: "Semana da Computacao UFRJ",
    ogType: "website",
  },
};
