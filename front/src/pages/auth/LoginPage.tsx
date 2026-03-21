/**
 * Página de login — estilo IDE/terminal
 * Após autenticação redireciona por papel: admin → /admin/dashboard, member → /user/dashboard
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, Eye, EyeOff, Lock, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Linha de status superior */}
      <div className="fixed top-0 inset-x-0 h-0.5 bg-linear-to-r from-primary via-accent to-primary/30" />

      <div className="w-full max-w-sm space-y-6">
        {/* ── Logo ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded border border-primary/30 bg-primary/10">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 font-mono">
              <span className="text-lg font-bold text-foreground">SC</span>
              <span className="text-lg font-bold text-primary">.</span>
              <span className="text-lg text-muted-foreground">ufrj</span>
            </div>
            <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">
              Semana da Computação
            </p>
          </div>
        </div>

        {/* ── Card de login ── */}
        <div className="rounded border border-border bg-card shadow-xl">
          {/* Barra de título do "editor" */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">auth.login()</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Instrução comentada */}
            <p className="text-xs text-muted-foreground/60 font-mono">
              {/* insira suas credenciais */}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-mono text-xs text-muted-foreground">
                  email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 font-mono text-sm"
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-mono text-xs text-muted-foreground">
                  senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 font-mono text-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff className="h-3.5 w-3.5" />
                      : <Eye className="h-3.5 w-3.5" />
                    }
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive font-mono">
                  {/* error: */} {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full font-mono gap-2"
                disabled={loading}
              >
                {loading ? "autenticando..." : "entrar →"}
              </Button>
            </form>

            <div className="pt-2 border-t border-border">
              <Link
                to="/cadastro"
                className="block text-center text-xs text-muted-foreground hover:text-accent transition-colors font-mono"
              >
                novo participante? cadastre-se aqui
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/40 font-mono">
          © {new Date().getFullYear()} Semana da Computação UFRJ
        </p>
      </div>
    </div>
  );
}
