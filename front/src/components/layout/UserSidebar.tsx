/**
 * Sidebar do painel do participante
 * Accent azul (diferencia do admin laranja)
 */
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, QrCode, Award, LogOut, Cpu, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "dashboard",    href: "/user/dashboard",    icon: LayoutDashboard },
  { label: "meus eventos", href: "/user/eventos",      icon: Calendar },
  { label: "meu qr code",  href: "/user/qrcode",       icon: QrCode },
  { label: "certificados", href: "/user/certificados", icon: Award },
];

interface UserSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function UserSidebar({ open, onClose }: UserSidebarProps) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-56 flex-col",
        "bg-sidebar border-r border-sidebar-border",
        "transition-transform duration-200",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-12 border-b border-sidebar-border shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-accent/20">
          <Cpu className="h-4 w-4 text-accent" />
        </div>
        <div className="leading-none">
          <span className="text-sm font-bold text-sidebar-foreground">SC-UFRJ</span>
          <span className="text-xs text-muted-foreground ml-1.5">participant</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-muted-foreground/60 font-mono">
          {/* my area */}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
              {isActive && (
                <span className="absolute left-0 inset-y-1 w-0.5 rounded-r bg-accent" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-accent" : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              <span className="flex-1 font-mono">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 text-accent opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-2 py-3 space-y-1">
        <div className="flex items-center gap-2.5 rounded-sm px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent/20 text-accent text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground/60 truncate">participante</p>
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
