import path from "path";
import * as fs from "node:fs/promises";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

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

const siteBaseUrl = "https://semana-da-computacao.github.io/sc-ufrj";

function resolveAbsoluteUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${siteBaseUrl}${value}`;
  }

  return `${siteBaseUrl}/${value.replace(/^\/+/, "")}`;
}

function upsertTag(
  html: string,
  selectorRegex: RegExp,
  tagFactory: () => string,
  content: string
) {
  const existing = html.match(selectorRegex)?.[0];
  if (existing) {
    return html.replace(existing, existing.replace(/content="[^"]*"/, `content="${content}"`));
  }
  return html.replace("</head>", `  ${tagFactory()}\n</head>`);
}

function upsertMeta(html: string, attribute: "name" | "property", key: string, content: string) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key.replace(":", "\\:")}"[^>]*>`, "i");
  return upsertTag(
    html,
    pattern,
    () => `<meta ${attribute}="${key}" content="${content}" />`,
    content
  );
}

function upsertCanonical(html: string, href: string) {
  const pattern = /<link\s+rel="canonical"[^>]*>/i;
  const existing = html.match(pattern)?.[0];
  if (existing) {
    return html.replace(existing, `<link rel="canonical" href="${href}" />`);
  }
  return html.replace("</head>", `  <link rel="canonical" href="${href}" />\n</head>`);
}

function upsertTitle(html: string, title: string) {
  if (/<title>.*<\/title>/i.test(html)) {
    return html.replace(/<title>.*<\/title>/i, `<title>${title}</title>`);
  }
  return html.replace("</head>", `  <title>${title}</title>\n</head>`);
}

function applySeoToHtml(html: string, seo: SeoConfig, routePath: string) {
  const canonical = seo.canonicalUrl ?? `${siteBaseUrl}${routePath === "/" ? "/" : routePath}`;
  const ogImage = seo.ogImage ? resolveAbsoluteUrl(seo.ogImage) : undefined;
  const twitterImage = seo.twitterImage
    ? resolveAbsoluteUrl(seo.twitterImage)
    : ogImage;

  let next = html;
  next = upsertTitle(next, seo.title);
  next = upsertCanonical(next, canonical);
  next = upsertMeta(next, "name", "description", seo.description);
  next = upsertMeta(next, "name", "keywords", seo.keywords ?? "");
  next = upsertMeta(next, "name", "robots", seo.noindex ? "noindex, nofollow" : "index, follow");
  next = upsertMeta(next, "property", "og:title", seo.title);
  next = upsertMeta(next, "property", "og:description", seo.description);
  next = upsertMeta(next, "property", "og:url", canonical);
  next = upsertMeta(next, "property", "og:type", seo.ogType ?? "website");
  next = upsertMeta(next, "property", "og:site_name", seo.siteName ?? "Semana da Computação UFRJ");
  if (ogImage) {
    next = upsertMeta(next, "property", "og:image", ogImage);
  }
  next = upsertMeta(next, "name", "twitter:title", seo.title);
  next = upsertMeta(next, "name", "twitter:description", seo.description);
  next = upsertMeta(next, "name", "twitter:card", seo.twitterCard ?? "summary_large_image");
  if (twitterImage) {
    next = upsertMeta(next, "name", "twitter:image", twitterImage);
  }
  return next;
}

function isSeoConfig(value: unknown): value is SeoConfig {
  if (!value || typeof value !== "object") return false;
  const seo = value as Record<string, unknown>;
  return typeof seo.title === "string" && typeof seo.description === "string";
}

async function loadSeoFromJson(filePath: string, nested = true) {
  const raw = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(raw) as Record<string, unknown>;
  const candidate = nested ? json.seo : json;
  return isSeoConfig(candidate) ? candidate : null;
}

function seoPrerenderPlugin(): Plugin {
  return {
    name: "seo-prerender-routes",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const templatePath = path.join(distDir, "index.html");

      let templateHtml = "";
      try {
        templateHtml = await fs.readFile(templatePath, "utf-8");
      } catch {
        return;
      }

      const routes: Array<{ path: "/" | "/2025" | "/2026" | "/2019"; file: string; nested: boolean }> = [
        { path: "/", file: path.resolve(__dirname, "public/home/home.json"), nested: true },
        { path: "/2025", file: path.resolve(__dirname, "public/2025/evento-2025.json"), nested: true },
        { path: "/2026", file: path.resolve(__dirname, "public/2026/evento-2026.json"), nested: true },
        { path: "/2019", file: path.resolve(__dirname, "public/2019/seo-2019.json"), nested: true },
      ];

      for (const route of routes) {
        try {
          const seo = await loadSeoFromJson(route.file, route.nested);
          if (!seo) continue;

          const html = applySeoToHtml(templateHtml, seo, route.path);

          if (route.path === "/") {
            await fs.writeFile(templatePath, html, "utf-8");
            continue;
          }

          const routeDir = path.join(distDir, route.path.replace(/^\/+/, ""));
          await fs.mkdir(routeDir, { recursive: true });
          await fs.writeFile(path.join(routeDir, "index.html"), html, "utf-8");
        } catch {
          // Keep build resilient if any optional SEO source is invalid/missing.
        }
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(() => ({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss(), seoPrerenderPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
