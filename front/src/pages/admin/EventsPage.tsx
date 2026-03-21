/**
 * Listagem e criação de eventos
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Calendar, Users, Eye, EyeOff, Pencil, Trash2, Mic2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Event } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";

function CreateEventDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", year: new Date().getFullYear().toString(),
    startDate: "", endDate: "", description: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Auto-gera slug a partir do nome
      ...(field === "name" && !form.slug
        ? { slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + prev.year }
        : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/events", form);
      toast({ title: "Evento criado com sucesso!", variant: "default" });
      setOpen(false);
      setForm({ name: "", slug: "", year: new Date().getFullYear().toString(), startDate: "", endDate: "", description: "" });
      onSuccess();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Erro ao criar evento";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4" /> Novo Evento</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar novo evento</DialogTitle>
          <DialogDescription>Preencha as informações básicas do evento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Nome do evento *</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Semana da Computação 2026" required />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input id="slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="semana-computacao-2026" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Ano *</Label>
              <Input id="year" type="number" value={form.year} onChange={(e) => update("year", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Período *</Label>
              <div className="flex gap-2">
                <Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} required />
                <Input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} required />
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm min-h-20 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Descrição do evento..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar evento"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EventsPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", search],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event[] }>("/events", {
        params: search ? { search } : {},
      });
      return data.data;
    },
  });

  const togglePublish = useMutation({
    mutationFn: (eventId: string) => api.post(`/events/${eventId}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Status do evento atualizado" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: (eventId: string) => api.delete(`/events/${eventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Evento removido" });
    },
    onError: () => {
      toast({ title: "Erro ao remover evento", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-muted-foreground mt-1">{events?.length ?? 0} eventos cadastrados</p>
        </div>
        {isAdmin && (
          <CreateEventDialog onSuccess={() => queryClient.invalidateQueries({ queryKey: ["events"] })} />
        )}
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{event.name}</CardTitle>
                  <Badge variant={event.isPublished ? "success" : "secondary"} className="shrink-0">
                    {event.isPublished ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(event.startDate)} — {formatDate(event.endDate)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {event._count?.registrations ?? 0} inscritos
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {event._count?.days ?? 0} dias
                  </span>
                  {(event._count?.speakers ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Mic2 className="h-3.5 w-3.5" />
                      {event._count.speakers} palestrantes
                    </span>
                  )}
                  {(event._count?.stands ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Store className="h-3.5 w-3.5" />
                      {event._count.stands} estandes
                    </span>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/admin/eventos/${event.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                      Gerenciar
                    </Link>
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        title={event.isPublished ? "Despublicar" : "Publicar"}
                        onClick={() => togglePublish.mutate(event.id)}
                      >
                        {event.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja remover este evento?")) {
                            deleteEvent.mutate(event.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && events?.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Nenhum evento encontrado</p>
        </div>
      )}
    </div>
  );
}
