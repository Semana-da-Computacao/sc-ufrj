/**
 * Dialog de criação/edição de atividades
 * Adapta os campos conforme o tipo: TALK, WORKSHOP, PANEL, KEYNOTE, COFFEE_BREAK
 */
import { useState, useEffect } from "react";
import { PlusCircle, Save } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Activity, EventDay, EventLocation } from "@/types";
import { activityTypeLabels, activityTypeIcons, toTimeInputValue } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  days: EventDay[];
  activity?: Activity; // se informado, modo edição
  defaultDayId?: string;
  onSuccess: () => void;
}

const ACTIVITY_TYPES = ["KEYNOTE", "TALK", "WORKSHOP", "PANEL", "COFFEE_BREAK", "OTHER"] as const;
const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

const defaultForm = {
  title: "",
  description: "",
  type: "TALK",
  dayId: "",
  locationId: "",
  startTime: "09:00",
  endTime: "10:00",
  maxAttendees: "",
  streamUrl: "",
  level: "",
  tags: "",
};

export function ActivityFormDialog({
  open,
  onOpenChange,
  eventId,
  days,
  activity,
  defaultDayId,
  onSuccess,
}: ActivityFormDialogProps) {
  const isEditing = !!activity;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [locations, setLocations] = useState<EventLocation[]>([]);

  // Preenche formulário ao editar
  useEffect(() => {
    if (activity) {
      const day = days.find((d) => d.id === activity.eventDayId);
      setForm({
        title: activity.title,
        description: activity.description ?? "",
        type: activity.type,
        dayId: activity.eventDayId,
        locationId: activity.locationId ?? "",
        startTime: toTimeInputValue(activity.startTime),
        endTime: toTimeInputValue(activity.endTime),
        maxAttendees: activity.maxAttendees?.toString() ?? "",
        streamUrl: activity.streamUrl ?? "",
        level: activity.level ?? "",
        tags: activity.tags ? JSON.parse(activity.tags).join(", ") : "",
      });
      setLocations(day?.locations ?? []);
    } else {
      setForm({ ...defaultForm, dayId: defaultDayId ?? days[0]?.id ?? "" });
      const firstDay = days.find((d) => d.id === (defaultDayId ?? days[0]?.id));
      setLocations(firstDay?.locations ?? []);
    }
  }, [activity, open, days, defaultDayId]);

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleDayChange(dayId: string) {
    update("dayId", dayId);
    update("locationId", "");
    const day = days.find((d) => d.id === dayId);
    setLocations(day?.locations ?? []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.dayId) {
      toast({ title: "Selecione um dia", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const day = days.find((d) => d.id === form.dayId)!;
      const dateStr = new Date(day.date).toISOString().split("T")[0];

      const payload = {
        title: form.title,
        description: form.description || undefined,
        type: form.type,
        startTime: `${dateStr}T${form.startTime}:00`,
        endTime: `${dateStr}T${form.endTime}:00`,
        locationId: form.locationId || undefined,
        maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : undefined,
        streamUrl: form.streamUrl || undefined,
        level: form.level || undefined,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
      };

      if (isEditing) {
        await api.put(
          `/events/${eventId}/days/${activity!.eventDayId}/activities/${activity!.id}`,
          payload
        );
        toast({ title: "Atividade atualizada!" });
      } else {
        await api.post(`/events/${eventId}/days/${form.dayId}/activities`, payload);
        toast({ title: "Atividade criada!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao salvar atividade", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // Tipos que não precisam de todos os campos
  const isSimple = form.type === "COFFEE_BREAK" || form.type === "OTHER";
  const isPanelOrWorkshop = form.type === "PANEL" || form.type === "WORKSHOP";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {isEditing ? "Editar atividade" : "Nova atividade"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da atividade. O tipo define quais campos são relevantes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo de atividade */}
          <div className="space-y-2">
            <Label>Tipo de atividade *</Label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("type", t)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    form.type === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <span>{activityTypeIcons[t]}</span>
                  {activityTypeLabels[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="act-title">Título *</Label>
            <Input
              id="act-title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder={
                form.type === "COFFEE_BREAK" ? "Coffee Break" :
                form.type === "PANEL" ? "Mesa Redonda: Futuro da IA no Brasil" :
                form.type === "WORKSHOP" ? "Workshop: Introdução ao Rust" :
                "Título da palestra"
              }
              required
            />
          </div>

          {/* Descrição (oculta para coffee break) */}
          {!isSimple && (
            <div className="space-y-1.5">
              <Label htmlFor="act-desc">Descrição</Label>
              <Textarea
                id="act-desc"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Breve descrição do conteúdo..."
                className="min-h-20"
              />
            </div>
          )}

          {/* Dia, Horário e Local */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Dia do evento *</Label>
              <select
                value={form.dayId}
                onChange={(e) => handleDayChange(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                required
              >
                <option value="">Selecione o dia...</option>
                {days.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label || new Date(d.date).toLocaleDateString("pt-BR")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="act-start">Início *</Label>
              <Input
                id="act-start"
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="act-end">Fim *</Label>
              <Input
                id="act-end"
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Local / Sala</Label>
              <select
                value={form.locationId}
                onChange={(e) => update("locationId", e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
              >
                <option value="">Sem local definido</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}{l.building ? ` — ${l.building}` : ""}
                  </option>
                ))}
              </select>
              {locations.length === 0 && form.dayId && (
                <p className="text-xs text-muted-foreground">
                  Cadastre locais no dia selecionado para associar aqui
                </p>
              )}
            </div>
          </div>

          {/* Campos extras para workshops e panels */}
          {!isSimple && (
            <div className="grid grid-cols-2 gap-4">
              {isPanelOrWorkshop && (
                <div className="space-y-1.5">
                  <Label htmlFor="act-max">Vagas (opcional)</Label>
                  <Input
                    id="act-max"
                    type="number"
                    min="1"
                    value={form.maxAttendees}
                    onChange={(e) => update("maxAttendees", e.target.value)}
                    placeholder="Sem limite"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Nível</Label>
                <select
                  value={form.level}
                  onChange={(e) => update("level", e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                >
                  <option value="">Não definido</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l === "BEGINNER" ? "Iniciante" : l === "INTERMEDIATE" ? "Intermediário" : "Avançado"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="act-tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="act-tags"
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="Python, IA, Machine Learning"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="act-stream">Link de transmissão (YouTube/Twitch)</Label>
                <Input
                  id="act-stream"
                  type="url"
                  value={form.streamUrl}
                  onChange={(e) => update("streamUrl", e.target.value)}
                  placeholder="https://youtube.com/live/..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar atividade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
