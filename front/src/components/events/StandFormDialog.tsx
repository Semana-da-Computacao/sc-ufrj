/**
 * Dialog de criação/edição de estandes
 */
import { useState, useEffect } from "react";
import { Store } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import api from "@/lib/api";
import { Stand, StandCategory } from "@/types";
import { standCategoryLabels } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface StandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  stand?: Stand;
  onSuccess: () => void;
}

const CATEGORIES: StandCategory[] = ["COMPANY", "UNIVERSITY", "OPEN_SOURCE", "GOVERNMENT", "OTHER"];

const categoryColors: Record<StandCategory, string> = {
  COMPANY: "bg-blue-100 text-blue-800 border-blue-200",
  UNIVERSITY: "bg-purple-100 text-purple-800 border-purple-200",
  OPEN_SOURCE: "bg-green-100 text-green-800 border-green-200",
  GOVERNMENT: "bg-orange-100 text-orange-800 border-orange-200",
  OTHER: "bg-gray-100 text-gray-800 border-gray-200",
};

const defaultForm = {
  name: "", company: "", description: "", logoUrl: "",
  contactEmail: "", contactPhone: "", website: "",
  category: "COMPANY" as StandCategory,
  standNumber: "", location: "",
};

export function StandFormDialog({
  open, onOpenChange, eventId, stand, onSuccess,
}: StandFormDialogProps) {
  const isEditing = !!stand;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (stand) {
      setForm({
        name: stand.name,
        company: stand.company ?? "",
        description: stand.description ?? "",
        logoUrl: stand.logoUrl ?? "",
        contactEmail: stand.contactEmail ?? "",
        contactPhone: stand.contactPhone ?? "",
        website: stand.website ?? "",
        category: stand.category as StandCategory,
        standNumber: stand.standNumber ?? "",
        location: stand.location ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [stand, open]);

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        company: form.company || undefined,
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined,
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        website: form.website || undefined,
        category: form.category,
        standNumber: form.standNumber || undefined,
        location: form.location || undefined,
      };

      if (isEditing) {
        await api.put(`/events/${eventId}/stands/${stand!.id}`, payload);
        toast({ title: "Estande atualizado!" });
      } else {
        await api.post(`/events/${eventId}/stands`, payload);
        toast({ title: "Estande cadastrado!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao salvar estande", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            {isEditing ? "Editar estande" : "Novo estande"}
          </DialogTitle>
          <DialogDescription>
            Cadastre empresas, universidades e organizações que terão estandes no evento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update("category", cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                    form.category === cat
                      ? categoryColors[cat] + " ring-2 ring-offset-1 ring-current"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {standCategoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="st-name">Nome do estande *</Label>
              <Input
                id="st-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Estande da Google"
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="st-company">Empresa / Organização</Label>
              <Input
                id="st-company"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Google Brasil"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="st-desc">Descrição</Label>
              <Textarea
                id="st-desc"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="O que será apresentado no estande..."
                className="min-h-17.5"
              />
            </div>

            <div className="col-span-2">
              <ImageUploadField
                value={form.logoUrl}
                onChange={(b64) => update("logoUrl", b64)}
                label="logo do estande"
                aspectRatio="16/9"
                hint="Será salva como base64 — recomendado fundo transparente (PNG)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="st-number">Número do estande</Label>
              <Input
                id="st-number"
                value={form.standNumber}
                onChange={(e) => update("standNumber", e.target.value)}
                placeholder="A1, B3..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="st-location">Localização</Label>
              <Input
                id="st-location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Hall B, entrada principal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="st-email">Email de contato</Label>
              <Input
                id="st-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="st-phone">Telefone</Label>
              <Input
                id="st-phone"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="(21) 99999-9999"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="st-website">Site</Label>
              <Input
                id="st-website"
                type="url"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar estande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
