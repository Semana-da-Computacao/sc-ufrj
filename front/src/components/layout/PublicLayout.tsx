/**
 * Layout das páginas públicas (landing page e páginas de edição)
 * Header IDE-style + footer minimalista
 */
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Cpu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export function PublicLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  function handleAccess() {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    const dest =
      user?.role === "ADMIN" || user?.role === "COORDINATOR"
        ? "/admin/dashboard"
        : "/user/dashboard";
    navigate(dest);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Barra de status IDE (topo) ── */}
      <div className="h-1 bg-linear-to-r from-primary via-accent to-primary/40 shrink-0" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-sidebar/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6 h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div className="font-mono leading-none">
              <span className="text-sm font-bold text-foreground">SC</span>
              <span className="text-sm font-bold text-primary">.</span>
              <span className="text-sm text-muted-foreground">ufrj</span>
            </div>
          </Link>

          {/* Separador vertical */}
          <div className="h-4 w-px bg-border" />

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1 flex-1">
            {[
              { label: "2026", href: "/2026" },
              { label: "2025", href: "/2025" },
              { label: "2024", href: "/2024" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors font-mono"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAccess}
              className="text-xs font-mono gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {isAuthenticated() ? "painel" : "login"}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Conteúdo ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-sidebar/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">
              SC-UFRJ — Semana da Computação
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground/50 font-mono">
              © {new Date().getFullYear()} DCC-UFRJ
            </span>
            <Link
              to="/login"
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
