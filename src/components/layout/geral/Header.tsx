import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img
              src="/Logo_SC_2025_DVPF.svg"
              alt="Logo Semana da Computação"
              className="h-6"
            />
            <span className="hidden font-bold sm:inline-block">
              Semana da Computação
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/2025">Edição 2025</Link>
            <Link to="/#sobre">Sobre</Link>
            <Link to="/#parceiros">Parceiros</Link>
            <Link to="/fotos">Galeria</Link>
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
                src="/Logo_SC_2025_DVPF.svg"
                alt="Logo Semana da Computação"
                className="h-6"
              />
              <span className="font-bold">Semana da Computação</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/2025" className="text-sm font-medium">
                Edição 2025
              </Link>
              <Link to="/#sobre" className="text-sm font-medium">
                Sobre
              </Link>
              <Link to="/#parceiros" className="text-sm font-medium">
                Parceiros
              </Link>
              <Link to="/fotos" className="text-sm font-medium">
                Galeria
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          <Button asChild>
            <Link to="/inscricao">Inscreva-se</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
