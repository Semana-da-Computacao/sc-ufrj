import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  const logoSrc = `${import.meta.env.BASE_URL}Logo_SC_2025_DVPF.svg`;

  return (
    <main className="flex flex-col items-center justify-center mx-auto min-h-[90svh] p-4">
      <div className="max-w-xl text-center mb-16">
        <img
          src={logoSrc}
          alt="Logo Semana da Computação"
          className="max-w-xs mx-auto mb-8"
        />
        <h1 className="sr-only">Semana da Computação - UFRJ</h1>
        <h2 className="text-2xl font-semibold mb-6">
          O maior evento acadêmico de Computação do Rio de Janeiro
        </h2>
        <p className="text-lg mb-8">
          Conectando estudantes, profissionais e pesquisadores em uma semana de
          inovação, conhecimento e networking.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/2025">Edição 2025</Link>
          </Button>
          <Button variant="outline">
            <Link to="/fotos">Galeria de Fotos</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
