/**
 * Página de Check-in via QR Code
 * Coordenadores e admins usam esta página para registrar presenças
 */
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { QrCode, CheckCircle2, XCircle, Search, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QRScanner, QRManualInput } from "@/components/shared/QRScanner";
import api from "@/lib/api";
import { Event, Activity } from "@/types";
import { formatTime, activityTypeLabels } from "@/lib/utils";

interface CheckInResult {
  success: boolean;
  message: string;
  userName?: string;
}

export function CheckInPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [scannerActive, setScannerActive] = useState(false);
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const [recentCheckins, setRecentCheckins] = useState<Array<{ name: string; time: string; success: boolean }>>([]);

  // Busca eventos disponíveis
  const { data: events } = useQuery({
    queryKey: ["events-checkin"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event[] }>("/events");
      return data.data;
    },
  });

  // Busca atividades do evento selecionado
  const { data: selectedEvent } = useQuery({
    queryKey: ["event-checkin", selectedEventId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event }>(`/events/${selectedEventId}`);
      return data.data;
    },
    enabled: !!selectedEventId,
  });

  // Agrupa todas as atividades do evento
  const allActivities: Activity[] = selectedEvent?.days?.flatMap((d) => d.activities ?? []) ?? [];

  const handleScan = useCallback(
    async (qrCodeToken: string) => {
      if (!selectedActivityId) {
        setLastResult({ success: false, message: "Selecione uma atividade primeiro!" });
        return;
      }

      try {
        const { data } = await api.post("/attendance/checkin", {
          qrCodeToken,
          activityId: selectedActivityId,
        });

        const result = {
          success: true,
          message: data.message,
          userName: data.data?.user?.name,
        };
        setLastResult(result);

        setRecentCheckins((prev) => [
          { name: data.data?.user?.name || qrCodeToken, time: new Date().toLocaleTimeString("pt-BR"), success: true },
          ...prev.slice(0, 9),
        ]);
      } catch (err: unknown) {
        const error = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        const result = {
          success: false,
          message: error || "Erro ao registrar presença",
        };
        setLastResult(result);
        setRecentCheckins((prev) => [
          { name: "Desconhecido", time: new Date().toLocaleTimeString("pt-BR"), success: false },
          ...prev.slice(0, 9),
        ]);
      }

      // Limpa o resultado após 3s
      setTimeout(() => setLastResult(null), 3000);
    },
    [selectedActivityId]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Check-in via QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Escaneie o QR code do participante para registrar presença
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coluna esquerda — configuração */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurar Check-in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selecionar evento */}
              <div className="space-y-1.5">
                <Label>Evento</Label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setSelectedActivityId("");
                  }}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">Selecione o evento...</option>
                  {events?.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              {/* Selecionar atividade */}
              {allActivities.length > 0 && (
                <div className="space-y-1.5">
                  <Label>Atividade</Label>
                  <select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">Selecione a atividade...</option>
                    {allActivities.map((a) => (
                      <option key={a.id} value={a.id}>
                        {formatTime(a.startTime)} — {a.title} ({activityTypeLabels[a.type]})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Botão ativar scanner */}
              <Button
                className="w-full"
                disabled={!selectedActivityId}
                onClick={() => setScannerActive(!scannerActive)}
                variant={scannerActive ? "destructive" : "default"}
              >
                <QrCode className="h-4 w-4" />
                {scannerActive ? "Parar Scanner" : "Iniciar Scanner"}
              </Button>

              {/* Check-in manual */}
              {selectedActivityId && (
                <div className="space-y-1.5">
                  <Label>Check-in manual (email ou token)</Label>
                  <QRManualInput onSubmit={handleScan} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resultado do último check-in */}
          {lastResult && (
            <Card className={lastResult.success ? "border-green-400 bg-green-50 dark:bg-green-950/20" : "border-red-400 bg-red-50 dark:bg-red-950/20"}>
              <CardContent className="flex items-center gap-3 pt-4">
                {lastResult.success ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 shrink-0" />
                )}
                <div>
                  {lastResult.userName && (
                    <p className="font-medium text-sm">{lastResult.userName}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{lastResult.message}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna direita — scanner + histórico */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scanner</CardTitle>
              <CardDescription>
                Aponte a câmera para o QR code do participante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QRScanner onScan={handleScan} isActive={scannerActive && !!selectedActivityId} />
            </CardContent>
          </Card>

          {/* Histórico recente */}
          {recentCheckins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Últimos check-ins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {recentCheckins.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-sm rounded px-2 py-1.5 hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        {c.success ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span>{c.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{c.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
