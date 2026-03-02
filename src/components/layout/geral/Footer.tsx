import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="container mx-auto grid grid-cols-1 gap-x-8 gap-y-12 px-4 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5 md:pr-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logoSrc} alt="Logo Semana da Computacao" className="h-9" />
            <span className="text-lg font-bold text-white">Semana da Computacao UFRJ</span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
            Evento academico organizado por estudantes e docentes do Instituto de Computacao da
            UFRJ, conectando universidade, mercado e comunidade tech.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/semanadacomputacaoufrj/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 transition hover:border-pink-400/70 hover:text-pink-300"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/school/universidade-federal-do-rio-de-janeiro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 transition hover:border-sky-400/70 hover:text-sky-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 transition hover:border-red-400/70 hover:text-red-300"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/semana-da-computacao"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 transition hover:border-emerald-400/70 hover:text-emerald-300"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="md:col-span-3 md:pt-1">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            Navegacao
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/2026" className="transition hover:text-cyan-300">
                Edicao 2026
              </Link>
            </li>
            <li>
              <Link to="/2025" className="transition hover:text-cyan-300">
                Edicao 2025
              </Link>
            </li>
            <li>
              <Link to="/2019" className="transition hover:text-cyan-300">
                Edicao 2019
              </Link>
            </li>
            <li>
              <Link to="/links" className="transition hover:text-cyan-300">
                Pagina de Links
              </Link>
            </li>
            <li>
              <Link to="/#faq" className="transition hover:text-cyan-300">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 md:pt-1">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            Contato
          </h3>
          <ul className="space-y-4 text-sm text-slate-300">
            <li>
              <a
                href="mailto:semanadacomputacao@ic.ufrj.br"
                className="inline-flex items-center gap-2 transition hover:text-cyan-300"
              >
                <Mail className="h-4 w-4" />
                semanadacomputacao@ic.ufrj.br
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              23 a 27 de marco de 2026
            </li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="bg-cyan-600 text-white hover:bg-cyan-500">
              <a
                href="https://www.even3.com.br/ix-semana-da-computacao-ufrj-2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inscricao no Even3
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-800"
            >
              <Link to="/links">
                Ver todos os links
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-center text-xs text-slate-400 md:flex-row md:items-center md:justify-between md:text-sm">
          <p>&copy; {currentYear} Semana da Computacao UFRJ. Todos os direitos reservados.</p>
          <p>Ilha do Fundao, Rio de Janeiro - RJ</p>
        </div>
      </div>
    </footer>
  );
}
