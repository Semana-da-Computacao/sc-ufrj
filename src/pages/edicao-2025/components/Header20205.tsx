import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header2025() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-lg supports-backdrop-filter:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logoSrc}
              alt="Logo Semana da Computação"
              className="h-7"
            />
            <span className="hidden font-bold sm:inline-block">SC UFRJ 2025</span>
          </Link>
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <a href="#informacoes" className="text-foreground/85 hover:text-foreground">
              Informações
            </a>
            <a href="#programacao" className="text-foreground/85 hover:text-foreground">
              Programação
            </a>
            <a href="#inscricoes" className="text-foreground/85 hover:text-foreground">
              Inscrições
            </a>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[86%] sm:max-w-sm">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logoSrc}
                alt="Logo Semana da Computação"
                className="h-6"
              />
              <span className="font-bold">Semana da Computação</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              <a href="#informacoes" className="text-sm font-medium">
                Informações
              </a>
              <a href="#programacao" className="text-sm font-medium">
                Programação
              </a>
              <a href="#inscricoes" className="text-sm font-medium">
                Inscrições
              </a>
              <Button variant="outline" asChild>
                <Link to="/">← Voltar para início</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex items-center justify-end space-x-3">
          <ModeToggle />
          <Button asChild>
            <Link to="/inscricao">Inscreva-se</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/">← Voltar</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
