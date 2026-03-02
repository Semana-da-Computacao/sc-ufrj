import { ThemeProvider } from "./components/theme-provider";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/geral/HomePage";
import Edicao2025Page from "./pages/edicao-2025";
import Edicao2019Page from "./pages/edicao-2019";
import Edicao2026Page from "./pages/edicao-2026";
import Layout from "./components/layout/geral/Layout";
import Layout2025 from "./pages/edicao-2025/layout/Layout2025";
import Layout2026 from "./pages/edicao-2026/layout/Layout2026";
import LoginPage from "./pages/geral/LoginPage";

type SeoConfig = {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  siteName?: string;
  ogType?: "website" | "article" | "event";
  noindex?: boolean;
};

function ensureMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function ensureCanonical(href: string) {
  let link = document.head.querySelector(
    "link[rel='canonical']"
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function resolveAbsoluteUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${window.location.origin}${value}`;
  }

  return new URL(value, `${window.location.origin}${import.meta.env.BASE_URL}`).toString();
}

function App() {
  const location = useLocation();
  const [edition2026Seo, setEdition2026Seo] = useState<SeoConfig | null>(null);

  useEffect(() => {
    let active = true;

    if (location.pathname !== "/2026") {
      setEdition2026Seo(null);
      return () => {
        active = false;
      };
    }

    async function load2026Seo() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}2026/evento-2026.json`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          seo?: SeoConfig;
        };

        if (active && data.seo) {
          setEdition2026Seo(data.seo);
        }
      } catch {
        if (active) {
          setEdition2026Seo(null);
        }
      }
    }

    load2026Seo();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    const siteBaseUrl = "https://semana-da-computacao.github.io/sc-ufrj";
    const seoByPath: Record<string, SeoConfig> = {
      "/": {
        title: "Semana da Computação UFRJ | Evento Acadêmico de Tecnologia",
        description:
          "Site oficial da Semana da Computação UFRJ: programação, edições, inscrições no Even3, parceiros e conteúdos de tecnologia e carreira.",
        canonicalUrl: `${siteBaseUrl}/`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/2025": {
        title: "Edição 2025 | Semana da Computação UFRJ",
        description:
          "Conheça os detalhes da edição 2025 da Semana da Computação UFRJ: programação, informações gerais e atualizações.",
        canonicalUrl: `${siteBaseUrl}/2025`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/2026": {
        title: "Edição 2026 | Semana da Computação UFRJ",
        description:
          "Página oficial da edição 2026 da Semana da Computação UFRJ com tema The Last of Us, programação dinâmica e inscrições no Even3.",
        canonicalUrl: `${siteBaseUrl}/2026`,
        ogImage: "2026/seo-banner-2026.png",
        twitterImage: "2026/seo-banner-2026.png",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/2019": {
        title: "Edição 2019 (Histórica) | Semana da Computação UFRJ",
        description:
          "Página histórica da edição 2019 da Semana da Computação UFRJ com números, trilhas e dados de participação.",
        canonicalUrl: `${siteBaseUrl}/2019`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/fotos": {
        title: "Galeria de Fotos | Semana da Computação UFRJ",
        description:
          "Galeria de fotos da Semana da Computação UFRJ com registros das edições.",
        canonicalUrl: `${siteBaseUrl}/fotos`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/parceiros": {
        title: "Parceiros | Semana da Computação UFRJ",
        description:
          "Empresas e instituições parceiras da Semana da Computação UFRJ.",
        canonicalUrl: `${siteBaseUrl}/parceiros`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/inscricao": {
        title: "Inscrições | Semana da Computação UFRJ",
        description: "Acesse informações de inscrição da Semana da Computação UFRJ.",
        canonicalUrl: `${siteBaseUrl}/inscricao`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
      },
      "/admin": {
        title: "Admin | Semana da Computação UFRJ",
        description: "Área administrativa da Semana da Computação UFRJ.",
        canonicalUrl: `${siteBaseUrl}/admin`,
        ogImage: "Logo_SC_2025_DVPF.svg",
        twitterImage: "Logo_SC_2025_DVPF.svg",
        twitterCard: "summary_large_image",
        siteName: "Semana da Computação UFRJ",
        ogType: "website",
        noindex: true,
      },
    };

    const base = seoByPath[location.pathname] ?? seoByPath["/"];
    const current =
      location.pathname === "/2026" && edition2026Seo
        ? { ...base, ...edition2026Seo }
        : base;
    const canonical = current.canonicalUrl ?? `${window.location.origin}${window.location.pathname}`;
    document.title = current.title;

    ensureMeta("meta[name='description']", {
      name: "description",
      content: current.description,
    });
    ensureMeta("meta[property='og:title']", {
      property: "og:title",
      content: current.title,
    });
    ensureMeta("meta[property='og:description']", {
      property: "og:description",
      content: current.description,
    });
    ensureMeta("meta[property='og:url']", {
      property: "og:url",
      content: canonical,
    });
    if (current.ogImage) {
      ensureMeta("meta[property='og:image']", {
        property: "og:image",
        content: resolveAbsoluteUrl(current.ogImage),
      });
    }
    ensureMeta("meta[property='og:type']", {
      property: "og:type",
      content: current.ogType ?? "website",
    });
    ensureMeta("meta[property='og:site_name']", {
      property: "og:site_name",
      content: current.siteName ?? "Semana da Computação UFRJ",
    });
    ensureMeta("meta[name='twitter:title']", {
      name: "twitter:title",
      content: current.title,
    });
    ensureMeta("meta[name='twitter:description']", {
      name: "twitter:description",
      content: current.description,
    });
    ensureMeta("meta[name='twitter:card']", {
      name: "twitter:card",
      content: current.twitterCard ?? "summary_large_image",
    });
    if (current.twitterImage || current.ogImage) {
      ensureMeta("meta[name='twitter:image']", {
        name: "twitter:image",
        content: resolveAbsoluteUrl(current.twitterImage ?? current.ogImage ?? ""),
      });
    }
    ensureMeta("meta[name='keywords']", {
      name: "keywords",
      content:
        current.keywords ??
        "Semana da Computação UFRJ, evento de computação, tecnologia, palestras, workshops, inscrições",
    });
    ensureMeta("meta[name='robots']", {
      name: "robots",
      content: current.noindex ? "noindex, nofollow" : "index, follow",
    });
    ensureCanonical(canonical);
  }, [location.pathname, edition2026Seo]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/2019" element={<Edicao2019Page />} />
          <Route
            path="/fotos"
            element={<div>Galeria de Fotos - Em breve</div>}
          />
          <Route path="/parceiros" element={<div>Parceiros - Em breve</div>} />
          <Route path="/inscricao" element={<div>Inscrição - Em breve</div>} />
        </Route>

        <Route
          path="/2026"
          element={
            <Layout2026>
              <Edicao2026Page />
            </Layout2026>
          }
        />

        <Route
          path="/2025"
          element={
            <Layout2025>
              <Edicao2025Page />
            </Layout2025>
          }
        />

        {/* ROTAS DE ADMINISTRAÇÃO */}
        <Route path="/admin" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
