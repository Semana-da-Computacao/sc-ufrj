/**
 * Sidebar do painel admin — estilo IDE (JetBrains)
 * Itens de navegação filtrados por papel do usuário.
 * Indicador de item ativo via borda esquerda colorida (como editor ativo).
 */
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, QrCode,
  Award, LogOut, ChevronRight, Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: ("ADMIN" | "COORDINATOR" | "MEMBER")[];
  /** Comentário estilo IDE exibido abaixo do item */
  hint?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "dashboard",    href: "/admin/dashboard",    icon: LayoutDashboard },
  { label: "eventos",      href: "/admin/eventos",      icon: Calendar },
  { label: "check-in",     href: "/admin/checkin",      icon: QrCode,    roles: ["ADMIN", "COORDINATOR"] },
  { label: "certificados", href: "/admin/certificados", icon: Award,     roles: ["ADMIN", "COORDINATOR"] },
  { label: "usuarios",     href: "/admin/usuarios",     icon: Users,     roles: ["ADMIN"] },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const visible = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role as never)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col",
        "bg-sidebar border-r border-sidebar-border",
        "transition-transform duration-200",
        // Desktop: sempre visível
        "lg:translate-x-0",
        // Mobile: desliza conforme estado
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* ── Logo / cabeçalho ── */}
      <div className="flex items-center gap-3 px-4 h-12 border-b border-sidebar-border shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/20">
          <Cpu className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none">
          <span className="text-sm font-bold text-sidebar-foreground">SC-UFRJ</span>
          <span className="text-xs text-muted-foreground ml-1.5">admin</span>
        </div>
      </div>

      {/* ── Separador "comment" estilo IDE ── */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-muted-foreground/60 font-mono">
          {/* navigation */}
        </p>
      </div>

      {/* ── Navegação ── */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {visible.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
              )}
            >
              {/* Indicador de ativo — borda esquerda como editor tab */}
              {isActive && (
                <span className="absolute left-0 inset-y-1 w-0.5 rounded-r bg-sidebar-primary" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              <span className="flex-1 font-mono">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 text-sidebar-primary opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Usuário + logout ── */}
      <div className="border-t border-sidebar-border px-2 py-3 space-y-1">
        {/* Info do usuário */}
        <div className="flex items-center gap-2.5 rounded-sm px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/20 text-primary text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground/60 truncate">{user?.role?.toLowerCase()}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40 rounded-sm font-mono"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          logout()
        </Button>
      </div>
    </aside>
  );
}
