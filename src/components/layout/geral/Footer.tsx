import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  Github,
} from "lucide-react";

export default function Footer() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;

  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 mx-auto">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logoSrc}
              alt="Logo Semana da Computação"
              className="h-8"
            />
            <span className="font-bold text-lg">Semana da Computação</span>
          </Link>
          <p className="text-sm">
            O maior evento acadêmico de Computação do Rio de Janeiro.
          </p>
          <div className="flex gap-4">
            <Link to="#">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link to="#">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link to="#">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link to="#">
              <Youtube className="h-6 w-6" />
            </Link>
            <Link to="#">
              <Github className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/2025" className="text-sm hover:underline">
                  Edição 2025
                </Link>
              </li>
              <li>
                <Link to="/#sobre" className="text-sm hover:underline">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/#parceiros" className="text-sm hover:underline">
                  Parceiros
                </Link>
              </li>
              <li>
                <Link to="/fotos" className="text-sm hover:underline">
                  Galeria
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contato@sc.ufrj.br"
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  contato@sc.ufrj.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Fique por dentro</h3>
          <p className="text-sm mb-4">
            Inscreva-se na nossa newsletter para receber as últimas novidades.
          </p>
          <div className="flex gap-2">
            <Input type="email" placeholder="Seu e-mail" />
            <Button>Inscrever</Button>
          </div>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t text-center text-sm mx-auto">
        <p>
          &copy; 2025 Semana da Computação - UFRJ. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
