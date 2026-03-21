/**
 * Página de gerenciamento completo de um evento
 * Tabs: Visão Geral · Programação · Palestrantes · Estandes · Inscritos · SEO · Certificados
 */
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Calendar, Users, Mic2, Store, Globe, Award,
  Plus, Pencil, Trash2, Eye, EyeOff, BarChart3,
  MapPin, Clock, ExternalLink, ChevronDown, ChevronUp,
  Linkedin, Github, Save, Building2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ActivityFormDialog } from "@/components/events/ActivityFormDialog";
import { SpeakerFormDialog } from "@/components/events/SpeakerFormDialog";
import { StandFormDialog } from "@/components/events/StandFormDialog";
import { LocationFormDialog } from "@/components/events/LocationFormDialog";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import api from "@/lib/api";
import {
  Event, EventDay, Activity, Speaker, Stand, EventRegistration, EventStats,
} from "@/types";
import {
  formatDate, formatDateShort, formatTime, formatHours, getInitials,
  activityTypeLabels, activityTypeIcons, activityLevelColors, activityLevelLabels,
  speakerRoleLabels, standCategoryLabels, registrationStatusLabels,
} from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number | string;
  icon: React.ComponentType<{ className?: string }>; color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Seção de um dia na programação ──────────────────────────────────────────
function DaySection({
  day, event, onRefresh, canEdit,
}: {
  day: EventDay; event: Event; onRefresh: () => void; canEdit: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [activityDialog, setActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [locationDialog, setLocationDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<{ id: string; name: string; capacity?: number; description?: string; building?: string; floor?: string; eventDayId: string } | undefined>();
  const [showLocations, setShowLocations] = useState(false);

  async function deleteActivity(activityId: string) {
    if (!confirm("Remover esta atividade? As presenças registradas também serão removidas.")) return;
    try {
      await api.delete(`/events/${event.id}/days/${day.id}/activities/${activityId}`);
      toast({ title: "Atividade removida" });
      onRefresh();
    } catch {
      toast({ title: "Erro ao remover atividade", variant: "destructive" });
    }
  }

  async function deleteLocation(locationId: string) {
    if (!confirm("Remover este local?")) return;
    try {
      await api.delete(`/events/${event.id}/days/${day.id}/locations/${locationId}`);
      toast({ title: "Local removido" });
      onRefresh();
    } catch {
      toast({ title: "Erro ao remover local", variant: "destructive" });
    }
  }

  async function deleteDay() {
    if (!confirm(`Remover o ${day.label || formatDateShort(day.date)} com todas suas atividades?`)) return;
    try {
      await api.delete(`/events/${event.id}/days/${day.id}`);
      toast({ title: "Dia removido" });
      onRefresh();
    } catch {
      toast({ title: "Erro ao remover dia", variant: "destructive" });
    }
  }

  const activities = day.activities ?? [];

  return (
    <Card className="overflow-hidden">
      {/* Header do dia */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold leading-none">
              {day.label || `Dia ${day.order + 1}`}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {formatDate(day.date)} · {activities.length} atividade{activities.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowLocations(!showLocations); }}
              >
                <MapPin className="h-3.5 w-3.5" />
                {day.locations?.length ?? 0} locais
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setEditingActivity(undefined); setActivityDialog(true); }}
              >
                <Plus className="h-3.5 w-3.5" />
                Atividade
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={deleteDay}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Locais do dia */}
      {showLocations && (
        <div className="border-b bg-muted/10 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Salas / Locais
            </p>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => { setEditingLocation(undefined); setLocationDialog(true); }}
              >
                <Plus className="h-3 w-3 mr-1" /> Adicionar
              </Button>
            )}
          </div>
          {day.locations && day.locations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {day.locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{loc.name}</span>
                  {loc.building && <span className="text-muted-foreground">· {loc.building}</span>}
                  {loc.capacity && <span className="text-muted-foreground">· {loc.capacity} lug.</span>}
                  {canEdit && (
                    <button
                      className="ml-1 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteLocation(loc.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhum local cadastrado neste dia.</p>
          )}
        </div>
      )}

      {/* Lista de atividades */}
      {expanded && (
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma atividade cadastrada</p>
            </div>
          ) : (
            <div className="divide-y">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 group">
                  {/* Horário */}
                  <div className="min-w-14 text-center">
                    <p className="text-sm font-bold text-primary">{formatTime(activity.startTime)}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(activity.endTime)}</p>
                  </div>

                  {/* Ícone do tipo */}
                  <div className="mt-0.5 text-lg">{activityTypeIcons[activity.type]}</div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{activity.title}</p>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {activityTypeLabels[activity.type]}
                      </Badge>
                      {activity.level && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${activityLevelColors[activity.level]}`}>
                          {activityLevelLabels[activity.level]}
                        </span>
                      )}
                    </div>

                    {/* Palestrantes vinculados */}
                    {activity.attendances && activity.attendances.length > 0 && (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {activity.attendances.map((link) => (
                          <div key={link.id} className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={link.speaker?.photoUrl} />
                              <AvatarFallback className="text-[9px]">
                                {link.speaker?.name ? getInitials(link.speaker.name) : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {link.speaker?.name}
                              {link.role !== "SPEAKER" && (
                                <span className="text-xs ml-1 opacity-60">({speakerRoleLabels[link.role]})</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Local e duração */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {activity.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {activity.location.name}
                        </span>
                      )}
                      {activity.durationHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatHours(activity.durationHours)}
                        </span>
                      )}
                      {activity.maxAttendees && (
                        <span>{activity.maxAttendees} vagas</span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  {canEdit && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditingActivity(activity); setActivityDialog(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteActivity(activity.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}

      {/* Dialogs */}
      <ActivityFormDialog
        open={activityDialog}
        onOpenChange={setActivityDialog}
        eventId={event.id}
        days={event.days ?? []}
        activity={editingActivity}
        defaultDayId={day.id}
        onSuccess={onRefresh}
      />
      <LocationFormDialog
        open={locationDialog}
        onOpenChange={setLocationDialog}
        eventId={event.id}
        dayId={day.id}
        location={editingLocation as any}
        onSuccess={onRefresh}
      />
    </Card>
  );
}

// ─── Tab: Inscritos ───────────────────────────────────────────────────────────
function RegistrationsTab({ eventId }: { eventId: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["registrations", eventId, page, search],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventId}/registrations`, {
        params: { page, limit: 30, ...(search ? { search } : {}) },
      });
      return data as { data: EventRegistration[]; total: number; totalPages: number };
    },
  });

  async function exportCSV() {
    const rows = [["Nome", "Email", "Instituição", "Inscrito em"]];
    (data?.data ?? []).forEach((r) => {
      rows.push([
        r.user?.name ?? "",
        r.user?.email ?? "",
        r.user?.institution ?? "",
        new Date(r.registeredAt).toLocaleDateString("pt-BR"),
      ]);
    });
    const csv = rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inscritos.csv";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Buscar por nome, email ou instituição..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{data?.total ?? 0} inscritos</span>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={!data?.data?.length}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Participante</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Instituição</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inscrito em</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-4 py-3">
                      <div className="h-8 bg-muted animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum inscrito encontrado
                  </td>
                </tr>
              ) : (
                data?.data?.map((reg) => (
                  <tr key={reg.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{reg.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{reg.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {reg.user?.institution || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateShort(reg.registeredAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={reg.status === "CONFIRMED" ? "success" : "secondary"}>
                        {registrationStatusLabels[reg.status] ?? reg.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground self-center">{page} / {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Palestrantes ────────────────────────────────────────────────────────
function SpeakersTab({ event, onRefresh, canEdit }: {
  event: Event; onRefresh: () => void; canEdit: boolean;
}) {
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<Speaker | undefined>();
  const [linkDialog, setLinkDialog] = useState<{ speaker: Speaker } | null>(null);
  const [linkActivityId, setLinkActivityId] = useState("");
  const [linkRole, setLinkRole] = useState("SPEAKER");

  const speakers = event.speakers ?? [];
  const allActivities = event.days?.flatMap((d) => d.activities ?? []) ?? [];

  async function deleteSpeaker(speakerId: string, name: string) {
    if (!confirm(`Remover ${name} do evento?`)) return;
    try {
      await api.delete(`/events/${event.id}/speakers/${speakerId}`);
      toast({ title: "Palestrante removido" });
      onRefresh();
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  }

  async function linkToActivity() {
    if (!linkDialog || !linkActivityId) return;
    try {
      await api.post(`/events/activities/${linkActivityId}/speakers`, {
        speakerId: linkDialog.speaker.id,
        role: linkRole,
      });
      toast({ title: "Palestrante vinculado à atividade!" });
      setLinkDialog(null);
      setLinkActivityId("");
      onRefresh();
    } catch (err: any) {
      toast({
        title: err?.response?.data?.error ?? "Erro ao vincular",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{speakers.length} palestrante{speakers.length !== 1 ? "s" : ""} cadastrado{speakers.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <Button onClick={() => { setEditing(undefined); setDialog(true); }}>
            <Plus className="h-4 w-4" /> Novo palestrante
          </Button>
        )}
      </div>

      {speakers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <Mic2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Nenhum palestrante cadastrado</p>
            {canEdit && (
              <Button variant="outline" className="mt-4" onClick={() => setDialog(true)}>
                Cadastrar primeiro palestrante
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <Card key={speaker.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={speaker.photoUrl} />
                    <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                      {getInitials(speaker.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{speaker.name}</p>
                    {speaker.title && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {speaker.title}
                      </p>
                    )}
                  </div>
                </div>

                {speaker.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{speaker.bio}</p>
                )}

                {/* Atividades vinculadas */}
                {speaker.activities && speaker.activities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Atividades:</p>
                    <div className="space-y-1">
                      {speaker.activities.map((link) => (
                        <div key={link.id} className="flex items-center gap-1.5 text-xs">
                          <span className="text-muted-foreground">{activityTypeIcons[link.activity?.type ?? "TALK"]}</span>
                          <span className="truncate">{link.activity?.title}</span>
                          {link.role !== "SPEAKER" && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                              {speakerRoleLabels[link.role]}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links sociais */}
                <div className="flex items-center gap-2 mb-3">
                  {speaker.linkedin && (
                    <a href={speaker.linkedin} target="_blank" rel="noopener" className="text-blue-600 hover:opacity-70">
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {speaker.github && (
                    <a href={speaker.github} target="_blank" rel="noopener" className="hover:opacity-70">
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {speaker.website && (
                    <a href={speaker.website} target="_blank" rel="noopener" className="text-muted-foreground hover:text-foreground">
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <Separator className="mb-3" />

                <div className="flex gap-2">
                  {canEdit && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setLinkDialog({ speaker })}
                      >
                        <Plus className="h-3.5 w-3.5" /> Vincular atividade
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setEditing(speaker); setDialog(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteSpeaker(speaker.id, speaker.name)}
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

      {/* Dialog: vincular palestrante a atividade */}
      {linkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-xl border p-6 max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold">Vincular {linkDialog.speaker.name}</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Atividade</Label>
                <select
                  value={linkActivityId}
                  onChange={(e) => setLinkActivityId(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                >
                  <option value="">Selecione...</option>
                  {allActivities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {activityTypeIcons[a.type]} {a.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Papel na atividade</Label>
                <select
                  value={linkRole}
                  onChange={(e) => setLinkRole(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                >
                  <option value="SPEAKER">Palestrante</option>
                  <option value="MODERATOR">Moderador</option>
                  <option value="PANELIST">Panelista</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setLinkDialog(null)}>Cancelar</Button>
              <Button size="sm" onClick={linkToActivity} disabled={!linkActivityId}>Vincular</Button>
            </div>
          </div>
        </div>
      )}

      <SpeakerFormDialog
        open={dialog}
        onOpenChange={setDialog}
        eventId={event.id}
        speaker={editing}
        onSuccess={onRefresh}
      />
    </div>
  );
}

// ─── Tab: Estandes ────────────────────────────────────────────────────────────
function StandsTab({ event, onRefresh, canEdit }: {
  event: Event; onRefresh: () => void; canEdit: boolean;
}) {
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState<Stand | undefined>();
  const stands = event.stands ?? [];

  const categoryColors: Record<string, string> = {
    COMPANY: "border-l-blue-400",
    UNIVERSITY: "border-l-purple-400",
    OPEN_SOURCE: "border-l-green-400",
    GOVERNMENT: "border-l-orange-400",
    OTHER: "border-l-gray-400",
  };

  async function deleteStand(standId: string, name: string) {
    if (!confirm(`Remover o estande "${name}"?`)) return;
    try {
      await api.delete(`/events/${event.id}/stands/${standId}`);
      toast({ title: "Estande removido" });
      onRefresh();
    } catch {
      toast({ title: "Erro ao remover estande", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{stands.length} estande{stands.length !== 1 ? "s" : ""} cadastrado{stands.length !== 1 ? "s" : ""}</p>
        {canEdit && (
          <Button onClick={() => { setEditing(undefined); setDialog(true); }}>
            <Plus className="h-4 w-4" /> Novo estande
          </Button>
        )}
      </div>

      {stands.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Nenhum estande cadastrado</p>
            {canEdit && (
              <Button variant="outline" className="mt-4" onClick={() => setDialog(true)}>
                Cadastrar primeiro estande
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stands.map((stand) => (
            <Card
              key={stand.id}
              className={`border-l-4 hover:shadow-md transition-shadow ${categoryColors[stand.category] ?? categoryColors.OTHER}`}
            >
              <CardContent className="pt-5">
                <div className="flex items-start gap-3 mb-3">
                  {stand.logoUrl ? (
                    <img src={stand.logoUrl} alt={stand.name} className="h-10 w-10 rounded object-contain border" />
                  ) : (
                    <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{stand.name}</p>
                    {stand.company && stand.company !== stand.name && (
                      <p className="text-xs text-muted-foreground truncate">{stand.company}</p>
                    )}
                    <Badge variant="outline" className="text-xs mt-1">
                      {standCategoryLabels[stand.category]}
                    </Badge>
                  </div>
                </div>

                {stand.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{stand.description}</p>
                )}

                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  {(stand.standNumber || stand.location) && (
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {[stand.standNumber && `#${stand.standNumber}`, stand.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {stand.contactEmail && (
                    <p>{stand.contactEmail}</p>
                  )}
                  {stand.website && (
                    <a href={stand.website} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-foreground">
                      <Globe className="h-3 w-3" /> {stand.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>

                {canEdit && (
                  <>
                    <Separator className="mb-3" />
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(stand); setDialog(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteStand(stand.id, stand.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StandFormDialog
        open={dialog}
        onOpenChange={setDialog}
        eventId={event.id}
        stand={editing}
        onSuccess={onRefresh}
      />
    </div>
  );
}

// ─── Tab: SEO ─────────────────────────────────────────────────────────────────
function SeoTab({ event, onRefresh }: { event: Event; onRefresh: () => void }) {
  const [form, setForm] = useState({
    bannerUrl: event.bannerUrl ?? "",
    seoTitle: event.seoTitle ?? "",
    seoDescription: event.seoDescription ?? "",
    seoKeywords: event.seoKeywords ?? "",
    ogImage: event.ogImage ?? "",
    location: event.location ?? "",
    maxCapacity: event.maxCapacity?.toString() ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/events/${event.id}`, {
        ...form,
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
      });
      toast({ title: "Configurações salvas!" });
      onRefresh();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      {/* ── Banner do evento ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Banner do evento</CardTitle>
          <CardDescription>
            Imagem principal exibida na landing page da edição. Proporção 16:9 recomendada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploadField
            value={form.bannerUrl}
            onChange={(b64) => update("bannerUrl", b64)}
            label="banner (16:9)"
            aspectRatio="16/9"
            hint="Salvo como base64 — max 1 MB após compressão. Recomendado: 1920×1080 px."
          />
        </CardContent>
      </Card>

      {/* ── Informações gerais ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ev-location">Local do evento</Label>
            <Input
              id="ev-location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="CT/UFRJ – Ilha do Fundão, Rio de Janeiro"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-cap">Capacidade máxima de inscrições</Label>
            <Input
              id="ev-cap"
              type="number"
              min="0"
              value={form.maxCapacity}
              onChange={(e) => update("maxCapacity", e.target.value)}
              placeholder="Sem limite"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── SEO ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO — Mecanismos de busca</CardTitle>
          <CardDescription>
            Metadados que aparecem no Google, redes sociais e ao compartilhar o link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ev-title">Título SEO</Label>
            <Input
              id="ev-title"
              value={form.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
              placeholder={event.name}
            />
            <p className="text-xs text-muted-foreground">
              {form.seoTitle.length}/60 caracteres · Aparece na aba do navegador e no Google
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">Descrição SEO</Label>
            <Textarea
              id="ev-desc"
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
              placeholder="Participe da maior semana de computação da UFRJ..."
              className="min-h-20"
            />
            <p className={`text-xs ${form.seoDescription.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
              {form.seoDescription.length}/160 caracteres
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-kw">Palavras-chave</Label>
            <Input
              id="ev-kw"
              value={form.seoKeywords}
              onChange={(e) => update("seoKeywords", e.target.value)}
              placeholder="computação, UFRJ, semana da computação, tecnologia, IA"
            />
          </div>

          {/* Imagem OG via upload */}
          <ImageUploadField
            value={form.ogImage}
            onChange={(b64) => update("ogImage", b64)}
            label="imagem OG (Open Graph) — 1200×630 px"
            aspectRatio="16/9"
            hint="Exibida ao compartilhar no WhatsApp, Twitter, LinkedIn..."
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving}>
        <Save className="h-4 w-4" />
        {saving ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isAdminOrCoordinator } = useAuth();

  // Estado para adicionar novo dia
  const [showAddDay, setShowAddDay] = useState(false);
  const [dayForm, setDayForm] = useState({ date: "", label: "" });
  const [activityDialogGlobal, setActivityDialogGlobal] = useState(false);

  const { data: event, isLoading, refetch } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Event }>(`/events/${id}`);
      return data.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["event-stats", id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: EventStats }>(`/events/${id}/stats`);
      return data.data;
    },
    enabled: !!id,
  });

  const togglePublish = useMutation({
    mutationFn: () => api.post(`/events/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      toast({ title: event?.isPublished ? "Evento despublicado" : "Evento publicado!" });
    },
  });

  async function addDay(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post(`/events/${id}/days`, dayForm);
      toast({ title: "Dia adicionado!" });
      setShowAddDay(false);
      setDayForm({ date: "", label: "" });
      refetch();
    } catch {
      toast({ title: "Erro ao adicionar dia", variant: "destructive" });
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/eventos")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold truncate">{event.name}</h1>
            <Badge variant={event.isPublished ? "success" : "secondary"}>
              {event.isPublished ? "Publicado" : "Rascunho"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(event.startDate)} — {formatDate(event.endDate)}
            {event.location && ` · ${event.location}`}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => togglePublish.mutate()}
              disabled={togglePublish.isPending}
            >
              {event.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {event.isPublished ? "Despublicar" : "Publicar"}
            </Button>
          )}
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <StatCard label="Inscritos" value={stats?.registrations ?? 0} icon={Users} color="bg-primary" />
        <StatCard label="Check-ins" value={stats?.attendances ?? 0} icon={BarChart3} color="bg-blue-500" />
        <StatCard label="Atividades" value={stats?.activities ?? 0} icon={Calendar} color="bg-violet-500" />
        <StatCard label="Palestrantes" value={stats?.speakers ?? 0} icon={Mic2} color="bg-orange-500" />
        <StatCard label="Estandes" value={stats?.stands ?? 0} icon={Store} color="bg-teal-500" />
        <StatCard label="Certificados" value={stats?.certificates ?? 0} icon={Award} color="bg-green-500" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schedule">
        <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="schedule" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Programação
          </TabsTrigger>
          <TabsTrigger value="speakers" className="gap-1.5">
            <Mic2 className="h-3.5 w-3.5" /> Palestrantes
          </TabsTrigger>
          <TabsTrigger value="stands" className="gap-1.5">
            <Store className="h-3.5 w-3.5" /> Estandes
          </TabsTrigger>
          <TabsTrigger value="registrations" className="gap-1.5">
            <Users className="h-3.5 w-3.5" /> Inscritos
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="seo" className="gap-1.5">
              <Globe className="h-3.5 w-3.5" /> SEO & Config
            </TabsTrigger>
          )}
          <TabsTrigger value="certificates" className="gap-1.5">
            <Award className="h-3.5 w-3.5" /> Certificados
          </TabsTrigger>
        </TabsList>

        {/* ─── Programação ─────────────────────────────────────── */}
        <TabsContent value="schedule" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 justify-end flex-wrap">
            {isAdminOrCoordinator && (
              <>
                <Button variant="outline" onClick={() => setShowAddDay(!showAddDay)}>
                  <Plus className="h-4 w-4" /> Adicionar dia
                </Button>
                <Button onClick={() => setActivityDialogGlobal(true)}>
                  <Plus className="h-4 w-4" /> Nova atividade
                </Button>
              </>
            )}
          </div>

          {showAddDay && (
            <form onSubmit={addDay} className="border rounded-xl p-4 space-y-3 bg-muted/20">
              <p className="text-sm font-medium">Novo dia</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={dayForm.date}
                    onChange={(e) => setDayForm((p) => ({ ...p, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Rótulo</Label>
                  <Input
                    placeholder="Dia 1 – Abertura"
                    value={dayForm.label}
                    onChange={(e) => setDayForm((p) => ({ ...p, label: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddDay(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm">Salvar dia</Button>
              </div>
            </form>
          )}

          {event.days && event.days.length > 0 ? (
            <div className="space-y-4">
              {event.days.map((day) => (
                <DaySection
                  key={day.id}
                  day={day}
                  event={event}
                  onRefresh={refetch}
                  canEdit={isAdminOrCoordinator}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum dia cadastrado ainda</p>
              </CardContent>
            </Card>
          )}

          {/* Dialog global de atividade (sem dia pré-selecionado) */}
          <ActivityFormDialog
            open={activityDialogGlobal}
            onOpenChange={setActivityDialogGlobal}
            eventId={event.id}
            days={event.days ?? []}
            onSuccess={refetch}
          />
        </TabsContent>

        {/* ─── Palestrantes ─────────────────────────────────────── */}
        <TabsContent value="speakers" className="mt-4">
          <SpeakersTab event={event} onRefresh={refetch} canEdit={isAdminOrCoordinator} />
        </TabsContent>

        {/* ─── Estandes ─────────────────────────────────────────── */}
        <TabsContent value="stands" className="mt-4">
          <StandsTab event={event} onRefresh={refetch} canEdit={isAdminOrCoordinator} />
        </TabsContent>

        {/* ─── Inscritos ────────────────────────────────────────── */}
        <TabsContent value="registrations" className="mt-4">
          <RegistrationsTab eventId={event.id} />
        </TabsContent>

        {/* ─── SEO & Config ─────────────────────────────────────── */}
        {isAdmin && (
          <TabsContent value="seo" className="mt-4">
            <SeoTab event={event} onRefresh={refetch} />
          </TabsContent>
        )}

        {/* ─── Certificados ─────────────────────────────────────── */}
        <TabsContent value="certificates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Templates de Certificado</CardTitle>
              <CardDescription>
                Configure os templates e gere certificados para os participantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {event.certificateTemplates && event.certificateTemplates.length > 0 ? (
                <div className="space-y-3">
                  {event.certificateTemplates.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Tipo: {t.type} · Mínimo: {t.minHours}h de presença
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          api
                            .post("/certificates/generate", {
                              eventId: event.id,
                              templateId: t.id,
                            })
                            .then(({ data }) =>
                              toast({
                                title: `${data.data.generated} certificados gerados!`,
                                description: `${data.data.skipped} participantes sem horas suficientes`,
                              })
                            )
                            .catch(() =>
                              toast({ title: "Erro ao gerar", variant: "destructive" })
                            )
                        }
                      >
                        <Award className="h-3.5 w-3.5" /> Gerar certificados
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>Nenhum template cadastrado</p>
                  <Button variant="outline" className="mt-3" asChild>
                    <Link to="/admin/certificados">Gerenciar templates</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
