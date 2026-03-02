import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img
              src={logoSrc}
              alt="Logo Semana da Computação"
              className="h-6"
            />
            <span className="hidden font-bold sm:inline-block">
              Semana da Computação
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/2026">Edição 2026</Link>
            <Link to="/2025">Edição 2025</Link>
            <Link to="/2019">Edição 2019</Link>
            <Link to="/#sobre">Sobre</Link>
            <Link to="/#comissao">Comissão</Link>
            <Link to="/#faq">FAQ</Link>
            <Link to="/fotos">Galeria</Link>
            <Link to="/links">Links</Link>
          </nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <img
                src={logoSrc}
                alt="Logo Semana da Computação"
                className="h-6"
              />
              <span className="font-bold">Semana da Computação</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/2026" className="text-sm font-medium">
                Edição 2026
              </Link>
              <Link to="/2025" className="text-sm font-medium">
                Edição 2025
              </Link>
              <Link to="/2019" className="text-sm font-medium">
                Edição 2019
              </Link>
              <Link to="/#sobre" className="text-sm font-medium">
                Sobre
              </Link>
              <Link to="/#comissao" className="text-sm font-medium">
                Comissão
              </Link>
              <Link to="/#faq" className="text-sm font-medium">
                FAQ
              </Link>
              <Link to="/fotos" className="text-sm font-medium">
                Galeria
              </Link>
              <Link to="/links" className="text-sm font-medium">
                Links
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          <Button asChild>
            <a
              href="https://www.even3.com.br/ix-semana-da-computacao-ufrj-2026/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inscreva-se
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
