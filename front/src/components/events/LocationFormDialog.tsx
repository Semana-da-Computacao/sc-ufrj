/**
 * Dialog de criação/edição de locais (salas, auditórios)
 */
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { EventLocation } from "@/types";
import { toast } from "@/hooks/useToast";

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  dayId: string;
  location?: EventLocation;
  onSuccess: () => void;
}

const defaultForm = { name: "", capacity: "", description: "", building: "", floor: "" };

export function LocationFormDialog({
  open, onOpenChange, eventId, dayId, location, onSuccess,
}: LocationFormDialogProps) {
  const isEditing = !!location;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (location) {
      setForm({
        name: location.name,
        capacity: location.capacity?.toString() ?? "",
        description: location.description ?? "",
        building: location.building ?? "",
        floor: location.floor ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [location, open]);

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        description: form.description || undefined,
        building: form.building || undefined,
        floor: form.floor || undefined,
      };

      if (isEditing) {
        await api.put(
          `/events/${eventId}/days/${dayId}/locations/${location!.id}`,
          payload
        );
        toast({ title: "Local atualizado!" });
      } else {
        await api.post(`/events/${eventId}/days/${dayId}/locations`, payload);
        toast({ title: "Local cadastrado!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao salvar local", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {isEditing ? "Editar local" : "Novo local / sala"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="loc-name">Nome *</Label>
            <Input
              id="loc-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Auditório Principal, Sala 201..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="loc-building">Bloco / Prédio</Label>
              <Input
                id="loc-building"
                value={form.building}
                onChange={(e) => update("building", e.target.value)}
                placeholder="Bloco H"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-floor">Andar</Label>
              <Input
                id="loc-floor"
                value={form.floor}
                onChange={(e) => update("floor", e.target.value)}
                placeholder="Térreo, 2º andar..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-cap">Capacidade</Label>
              <Input
                id="loc-cap"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                placeholder="300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loc-desc">Observação</Label>
              <Input
                id="loc-desc"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Acessível, ar-cond..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEditing ? "Salvar" : "Adicionar local"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
