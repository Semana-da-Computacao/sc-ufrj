import { ThemeProvider } from "./components/theme-provider";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/geral/HomePage";
import Edicao2025Page from "./pages/edicao-2025";
import Edicao2019Page from "./pages/edicao-2019";
import Layout from "./components/layout/geral/Layout";
import Layout2025 from "./pages/edicao-2025/layout/Layout2025";
import LoginPage from "./pages/geral/LoginPage";

type SeoConfig = {
  title: string;
  description: string;
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

function App() {
  const location = useLocation();

  useEffect(() => {
    const seoByPath: Record<string, SeoConfig> = {
      "/": {
        title: "Semana da Computação UFRJ | Evento Acadêmico de Tecnologia",
        description:
          "Site oficial da Semana da Computação UFRJ: programação, edições, inscrições no Even3, parceiros e conteúdos de tecnologia e carreira.",
      },
      "/2025": {
        title: "Edição 2025 | Semana da Computação UFRJ",
        description:
          "Conheça os detalhes da edição 2025 da Semana da Computação UFRJ: programação, informações gerais e atualizações.",
      },
      "/2019": {
        title: "Edição 2019 (Histórica) | Semana da Computação UFRJ",
        description:
          "Página histórica da edição 2019 da Semana da Computação UFRJ com números, trilhas e dados de participação.",
      },
      "/fotos": {
        title: "Galeria de Fotos | Semana da Computação UFRJ",
        description:
          "Galeria de fotos da Semana da Computação UFRJ com registros das edições.",
      },
      "/parceiros": {
        title: "Parceiros | Semana da Computação UFRJ",
        description:
          "Empresas e instituições parceiras da Semana da Computação UFRJ.",
      },
      "/inscricao": {
        title: "Inscrições | Semana da Computação UFRJ",
        description: "Acesse informações de inscrição da Semana da Computação UFRJ.",
      },
      "/admin": {
        title: "Admin | Semana da Computação UFRJ",
        description: "Área administrativa da Semana da Computação UFRJ.",
        noindex: true,
      },
    };

    const current = seoByPath[location.pathname] ?? seoByPath["/"];
    const canonical = `${window.location.origin}${window.location.pathname}`;
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
    ensureMeta("meta[name='twitter:title']", {
      name: "twitter:title",
      content: current.title,
    });
    ensureMeta("meta[name='twitter:description']", {
      name: "twitter:description",
      content: current.description,
    });
    ensureMeta("meta[name='robots']", {
      name: "robots",
      content: current.noindex ? "noindex, nofollow" : "index, follow",
    });
    ensureCanonical(canonical);
  }, [location.pathname]);

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
