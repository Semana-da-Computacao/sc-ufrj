/**
 * Dashboard principal — visão geral de todos os eventos e métricas
 */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, Users, Award, QrCode, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Event } from "@/types";
import { formatDate } from "@/lib/utils";

interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalUsers: number;
  totalCertificates: number;
}

function StatCard({
  title, value, description, icon: Icon, color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event[] }>("/events");
      return data.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DashboardStats }>("/users?limit=1");
      return {
        totalEvents: events?.length ?? 0,
        publishedEvents: events?.filter((e) => e.isPublished).length ?? 0,
        totalUsers: data.total ?? 0,
        totalCertificates: 0,
      };
    },
    enabled: isAdmin && !!events,
  });

  const recentEvents = events?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao painel da Semana da Computação UFRJ
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link to="/admin/eventos">
              <Plus className="h-4 w-4" />
              Novo Evento
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Eventos"
            value={events?.length ?? 0}
            description={`${stats?.publishedEvents ?? 0} publicados`}
            icon={Calendar}
            color="bg-primary"
          />
          <StatCard
            title="Participantes"
            value={stats?.totalUsers ?? "—"}
            description="Cadastrados no sistema"
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Check-ins"
            value="—"
            description="Presenças registradas"
            icon={QrCode}
            color="bg-green-500"
          />
          <StatCard
            title="Certificados"
            value="—"
            description="Emitidos no total"
            icon={Award}
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Eventos recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Eventos</CardTitle>
              <CardDescription>
                {isAdmin ? "Todos os eventos do sistema" : "Eventos que você coordena"}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/eventos">
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum evento encontrado</p>
              {isAdmin && (
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/admin/eventos">Criar primeiro evento</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/admin/eventos/${event.id}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {event.year}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.startDate)} — {formatDate(event.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {event._count?.registrations ?? 0} inscritos
                    </span>
                    <Badge variant={event.isPublished ? "success" : "secondary"}>
                      {event.isPublished ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
