/**
 * Dashboard do participante
 * Mostra: QR code de presença, inscrições ativas e certificados
 */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { QrCode, Calendar, Award, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface MyRegistration {
  id: string;
  status: string;
  event: {
    id: string;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    isPublished: boolean;
  };
}

interface MyCertificate {
  id: string;
  code: string;
  issuedAt: string;
  event: { id: string; name: string; year: number };
}

function CodeComment({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground/60 font-mono text-sm">{children}</span>;
}

export function UserDashboardPage() {
  const { user } = useAuth();

  const { data: registrations, isLoading: loadingReg } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: MyRegistration[] }>(
        "/registrations/me"
      );
      return data.data;
    },
  });

  const { data: certificates, isLoading: loadingCerts } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: MyCertificate[] }>(
        "/certificates/me"
      );
      return data.data;
    },
  });

  const activeReg = registrations?.filter((r) => r.status === "CONFIRMED") ?? [];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <CodeComment>{"// bem-vindo(a)"}</CodeComment>
        <h1 className="text-2xl font-bold text-foreground mt-1">
          Olá,{" "}
          <span className="text-primary">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          Área do participante — SC-UFRJ
        </p>
      </div>

      {/* ── QR Code + Resumo ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* QR Code card */}
        <Card className="lg:col-span-1 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono flex items-center gap-2 text-primary">
              <QrCode className="h-4 w-4" />
              meu qr code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.qrCodeToken ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded border border-border bg-white p-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${user.qrCodeToken}`}
                    alt="QR Code de presença"
                    className="h-36 w-36"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-mono text-center">
                  Apresente na entrada para registrar presença
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-mono text-center py-6">
                QR code não disponível
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="sm:col-span-1 lg:col-span-2 grid gap-3 content-start">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-5 text-center">
                <Calendar className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold font-mono text-accent">
                  {loadingReg ? "—" : activeReg.length}
                </p>
                <p className="text-xs text-muted-foreground font-mono">inscrições ativas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Award className="h-6 w-6 text-chart-3 mx-auto mb-2" />
                <p className="text-2xl font-bold font-mono text-chart-3">
                  {loadingCerts ? "—" : certificates?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground font-mono">certificados</p>
              </CardContent>
            </Card>
          </div>

          {/* Próximo evento */}
          {activeReg[0] && (
            <Card className="border-accent/20">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-mono mb-2">
                  <CodeComment>{"// próximo evento"}</CodeComment>
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {activeReg[0].event.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatDate(activeReg[0].event.startDate)}
                    </p>
                  </div>
                  <Badge variant="success" className="font-mono shrink-0">confirmado</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Inscrições ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CodeComment>{"// minhas inscrições"}</CodeComment>
            <h2 className="text-base font-semibold text-foreground mt-0.5">Eventos inscritos</h2>
          </div>
          <Button variant="outline" size="sm" asChild className="font-mono text-xs gap-1">
            <Link to="/user/eventos">
              ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {loadingReg ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded border border-border" />
            ))}
          </div>
        ) : registrations?.length === 0 ? (
          <div className="rounded border border-border bg-card p-8 text-center text-muted-foreground font-mono text-sm">
            <Calendar className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>Nenhuma inscrição ainda.</p>
            <Button variant="outline" size="sm" className="mt-4 font-mono" asChild>
              <Link to="/">ver eventos disponíveis</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {registrations?.slice(0, 5).map((reg) => (
              <div
                key={reg.id}
                className="flex items-center gap-3 rounded border border-border bg-card px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold font-mono shrink-0">
                  {reg.event.year}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{reg.event.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {formatDate(reg.event.startDate)} — {formatDate(reg.event.endDate)}
                  </p>
                </div>
                <Badge
                  variant={reg.status === "CONFIRMED" ? "success" : "secondary"}
                  className="font-mono text-xs shrink-0"
                >
                  {reg.status === "CONFIRMED" ? "confirmado" : reg.status.toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Certificados ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CodeComment>{"// meus certificados"}</CodeComment>
            <h2 className="text-base font-semibold text-foreground mt-0.5">Certificados</h2>
          </div>
          <Button variant="outline" size="sm" asChild className="font-mono text-xs gap-1">
            <Link to="/user/certificados">
              ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {loadingCerts ? (
          <div className="h-16 bg-muted animate-pulse rounded border border-border" />
        ) : certificates?.length === 0 ? (
          <div className="rounded border border-border bg-card p-6 text-center text-muted-foreground font-mono text-sm">
            <Award className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>Nenhum certificado disponível.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {certificates?.slice(0, 3).map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-3 rounded border border-border bg-card px-4 py-3"
              >
                <CheckCircle className="h-5 w-5 text-chart-3 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{cert.event.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    código: <span className="text-accent">{cert.code}</span>
                    {" · "}
                    {new Date(cert.issuedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="font-mono text-xs">
                  baixar
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
