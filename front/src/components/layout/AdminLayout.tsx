/**
 * Layout do painel administrativo
 * - Desktop: sidebar fixa (64) + conteúdo
 * - Mobile:  top-bar com hamburger + drawer lateral
 */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, Cpu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Toaster } from "@/components/ui/toaster";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Área principal */}
      <div className="flex flex-col flex-1 lg:ml-64 min-w-0">
        {/* Top-bar mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-12 border-b border-border bg-sidebar shrink-0 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Abrir menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground tracking-tight">
              SC-UFRJ <span className="text-muted-foreground font-normal">/ admin</span>
            </span>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
