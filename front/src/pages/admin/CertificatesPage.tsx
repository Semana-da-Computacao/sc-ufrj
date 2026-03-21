/**
 * Página de gerenciamento de certificados
 * Geração em lote, templates e validação
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Award, Plus, Download, ExternalLink, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { Event, Certificate, CertificateTemplate } from "@/types";
import { certTypeLabels, formatDate } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

function CreateTemplateDialog({ eventId, onSuccess }: { eventId: string; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "PARTICIPATION", minHours: "4", htmlTemplate: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/certificates/templates", { ...form, eventId });
      toast({ title: "Template criado!" });
      setOpen(false);
      onSuccess();
    } catch {
      toast({ title: "Erro ao criar template", variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" /> Novo Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar template de certificado</DialogTitle>
          <DialogDescription>
            O HTML do template suporta as variáveis: {"{{name}}"}, {"{{event}}"}, {"{{hours}}"}, {"{{date}}"}, {"{{dates}}"}, {"{{code}}"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome do template *</Label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Certificado de Participação" required />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full rounded-md border px-3 py-2 text-sm">
                {Object.entries(certTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Horas mínimas para receber</Label>
              <Input type="number" min="0" step="0.5" value={form.minHours}
                onChange={(e) => setForm(p => ({ ...p, minHours: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>HTML do template *</Label>
              <textarea
                value={form.htmlTemplate}
                onChange={(e) => setForm(p => ({ ...p, htmlTemplate: e.target.value }))}
                required
                className="w-full rounded-md border px-3 py-2 text-sm font-mono min-h-50 resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="<!DOCTYPE html><html>..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Criar template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CertificatesPage() {
  const queryClient = useQueryClient();
  const [selectedEventId, setSelectedEventId] = useState("");
  const [generateEventId, setGenerateEventId] = useState("");
  const [generateTemplateId, setGenerateTemplateId] = useState("");

  const { data: events } = useQuery({
    queryKey: ["events-certs"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event[] }>("/events");
      return data.data;
    },
  });

  const { data: certificates, isLoading: certsLoading } = useQuery({
    queryKey: ["certificates", selectedEventId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Certificate[] }>(
        `/certificates/event/${selectedEventId}`
      );
      return data.data;
    },
    enabled: !!selectedEventId,
  });

  const { data: selectedEvent } = useQuery({
    queryKey: ["event-for-certs", selectedEventId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event }>(
        `/events/${selectedEventId}`
      );
      return data.data;
    },
    enabled: !!selectedEventId,
  });

  const generateCerts = useMutation({
    mutationFn: () =>
      api.post("/certificates/generate", {
        eventId: generateEventId,
        templateId: generateTemplateId,
      }),
    onSuccess: ({ data }) => {
      toast({
        title: "Certificados gerados!",
        description: `${data.data.generated} gerados · ${data.data.skipped} sem horas suficientes`,
      });
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
    onError: () => toast({ title: "Erro ao gerar certificados", variant: "destructive" }),
  });

  const templates: CertificateTemplate[] = selectedEvent?.certificateTemplates ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Certificados</h1>
        <p className="text-muted-foreground mt-1">Geração e gestão de certificados dos participantes</p>
      </div>

      {/* Geração em lote */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gerar Certificados em Lote</CardTitle>
          <CardDescription>
            Certifica automaticamente todos os participantes com horas suficientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            A geração verifica as horas mínimas do template e ignora participantes sem presença suficiente
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Evento</Label>
              <select
                value={generateEventId}
                onChange={(e) => { setGenerateEventId(e.target.value); setGenerateTemplateId(""); }}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Selecione o evento...</option>
                {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Template</Label>
              <select
                value={generateTemplateId}
                onChange={(e) => setGenerateTemplateId(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                disabled={!generateEventId}
              >
                <option value="">Selecione o template...</option>
                {events?.find(e => e.id === generateEventId)?.certificateTemplates?.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <Button
            onClick={() => generateCerts.mutate()}
            disabled={!generateEventId || !generateTemplateId || generateCerts.isPending}
          >
            <Award className="h-4 w-4" />
            {generateCerts.isPending ? "Gerando..." : "Gerar Certificados"}
          </Button>
        </CardContent>
      </Card>

      {/* Consulta de certificados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Certificados Emitidos</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Selecione o evento...</option>
                {events?.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              {selectedEventId && (
                <CreateTemplateDialog
                  eventId={selectedEventId}
                  onSuccess={() => queryClient.invalidateQueries({ queryKey: ["event-for-certs"] })}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedEventId ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Selecione um evento para ver os certificados</p>
            </div>
          ) : certsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Participante</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Template</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Horas</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Emitido em</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {certificates?.map((cert) => (
                    <tr key={cert.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{cert.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p>{cert.template?.name}</p>
                          <Badge variant="outline" className="text-xs">{certTypeLabels[cert.template?.type ?? ""]}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{cert.totalHours}h</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(cert.issuedAt)}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/api/certificates/${cert.id}/render`, "_blank")}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {certificates?.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">Nenhum certificado emitido ainda</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
