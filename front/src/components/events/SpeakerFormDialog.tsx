/**
 * Dialog de criação/edição de palestrantes
 */
import { useState, useEffect } from "react";
import { Mic2, Globe, Linkedin, Github } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import api from "@/lib/api";
import { Speaker } from "@/types";
import { getInitials } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

interface SpeakerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  speaker?: Speaker;
  onSuccess: () => void;
}

const defaultForm = {
  name: "", title: "", bio: "", photoUrl: "",
  email: "", linkedin: "", github: "", website: "",
};

export function SpeakerFormDialog({
  open, onOpenChange, eventId, speaker, onSuccess,
}: SpeakerFormDialogProps) {
  const isEditing = !!speaker;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (speaker) {
      setForm({
        name: speaker.name,
        title: speaker.title ?? "",
        bio: speaker.bio ?? "",
        photoUrl: speaker.photoUrl ?? "",
        email: speaker.email ?? "",
        linkedin: speaker.linkedin ?? "",
        github: speaker.github ?? "",
        website: speaker.website ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [speaker, open]);

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        title: form.title || undefined,
        bio: form.bio || undefined,
        photoUrl: form.photoUrl || undefined,
        email: form.email || undefined,
        linkedin: form.linkedin || undefined,
        github: form.github || undefined,
        website: form.website || undefined,
      };

      if (isEditing) {
        await api.put(`/events/${eventId}/speakers/${speaker!.id}`, payload);
        toast({ title: "Palestrante atualizado!" });
      } else {
        await api.post(`/events/${eventId}/speakers`, payload);
        toast({ title: "Palestrante cadastrado!" });
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao salvar palestrante", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic2 className="h-4 w-4" />
            {isEditing ? "Editar palestrante" : "Novo palestrante"}
          </DialogTitle>
          <DialogDescription>
            Palestrantes podem ser vinculados a múltiplas atividades (palestras, mesas redondas, workshops).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview do avatar + upload */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 shrink-0 rounded border border-border">
              <AvatarImage src={form.photoUrl} alt={form.name} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary font-mono">
                {form.name ? getInitials(form.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <ImageUploadField
                value={form.photoUrl}
                onChange={(b64) => update("photoUrl", b64)}
                label="foto do palestrante"
                aspectRatio="1/1"
                hint="Será salva como base64 — recomendado 400×400 px"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="sp-name">Nome completo *</Label>
              <Input
                id="sp-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Dr. João Silva"
                required
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="sp-title">Cargo / Título</Label>
              <Input
                id="sp-title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Engenheira de ML @ Google · Pesquisadora UFRJ"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="sp-bio">Mini-bio</Label>
              <Textarea
                id="sp-bio"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Breve descrição profissional..."
                className="min-h-20"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="sp-email">Email de contato</Label>
              <Input
                id="sp-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="palestrante@exemplo.com"
              />
            </div>

            {/* Links sociais */}
            <div className="space-y-1.5">
              <Label htmlFor="sp-linkedin" className="flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-600" /> LinkedIn
              </Label>
              <Input
                id="sp-linkedin"
                value={form.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sp-github" className="flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" /> GitHub
              </Label>
              <Input
                id="sp-github"
                value={form.github}
                onChange={(e) => update("github", e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="sp-website" className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Site pessoal
              </Label>
              <Input
                id="sp-website"
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
              {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar palestrante"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
