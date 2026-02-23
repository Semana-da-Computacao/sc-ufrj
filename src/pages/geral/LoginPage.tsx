// LoginPage.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IceCream } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  // Tipagem explícita para os estados
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Pode ser string (mensagem de erro) ou null
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const navigate = useNavigate();

  // Tipagem do evento de formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);


  };

  return (
    <>
      <main className="max-w-sm p-4 bg-accent rounded-lg mx-auto mt-32 space-y-4">
        {/* Adicionado um parágrafo para exibir o erro */}
        {error && <p className="text-sm text-center text-red-500 font-medium">{error}</p>}

        <img src="/Logo_SC_2025_DVPF.svg" alt="logomarca da SC UFRJ" className="w-32 mx-auto" />

        {/* Adicionado o `onSubmit` e removido o `action=""` desnecessário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoggingIn}
          />
          <Input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoggingIn}
          />

          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>

          <Button variant="outline" className="w-full mt-4" disabled={isLoggingIn}>
            <IceCream className="mr-2 h-4 w-4" /> Entrar com Google
          </Button>
        </form>
      </main>

      <footer className="absolute bottom-0 left-1/2 -translate-x-1/2 p-4">Semana da Computacao UFRJ &copy; </footer>
    </>
  );
}