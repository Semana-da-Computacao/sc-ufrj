/**
 * Página de gerenciamento de usuários (apenas admin)
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Users, Shield, UserCheck, UserX, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import api from "@/lib/api";
import { User } from "@/types";
import { roleLabels } from "@/lib/utils";
import { toast } from "@/hooks/useToast";

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  COORDINATOR: "secondary",
  MEMBER: "outline",
};

export function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [qrDialogUser, setQrDialogUser] = useState<{ name: string; qrCodeUrl: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const { data } = await api.get("/users", {
        params: { page, limit: 20, ...(search ? { search } : {}) },
      });
      return data as { data: User[]; total: number; totalPages: number };
    },
  });

  const changeRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.put(`/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Papel atualizado com sucesso" });
    },
  });

  const deactivate = useMutation({
    mutationFn: (userId: string) => api.delete(`/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Usuário desativado" });
    },
  });

  async function showQRCode(user: User) {
    try {
      const { data } = await api.get(`/users/${user.id}/qrcode`);
      setQrDialogUser({ name: user.name, qrCodeUrl: data.data.qrCodeUrl });
    } catch {
      toast({ title: "Erro ao carregar QR code", variant: "destructive" });
    }
  }

  const users = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-1">{data?.total ?? 0} usuários cadastrados</p>
        </div>
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10"
        />
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Lista de usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">Usuário</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Papel</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Instituição</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inscrições</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={roleBadgeVariant[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.institution || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user._count?.registrations ?? 0}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.isActive ? "success" : "destructive"}>
                          {user.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Ver QR code"
                            onClick={() => showQRCode(user)}
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </Button>
                          {user.role !== "ADMIN" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title={user.role === "COORDINATOR" ? "Rebaixar para membro" : "Promover a coordenador"}
                              onClick={() =>
                                changeRole.mutate({
                                  userId: user.id,
                                  role: user.role === "COORDINATOR" ? "MEMBER" : "COORDINATOR",
                                })
                              }
                            >
                              {user.role === "COORDINATOR" ? (
                                <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                              ) : (
                                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </Button>
                          )}
                          {user.isActive && user.role !== "ADMIN" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm(`Desativar ${user.name}?`)) deactivate.mutate(user.id);
                              }}
                            >
                              <UserX className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {data.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>
            Próxima
          </Button>
        </div>
      )}

      {/* Dialog QR Code */}
      <Dialog open={!!qrDialogUser} onOpenChange={() => setQrDialogUser(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>{qrDialogUser?.name}</DialogDescription>
          </DialogHeader>
          {qrDialogUser?.qrCodeUrl && (
            <img
              src={qrDialogUser.qrCodeUrl}
              alt="QR Code"
              className="mx-auto rounded-lg border p-2"
              width={250}
              height={250}
            />
          )}
          <p className="text-xs text-muted-foreground">
            Este QR code identifica o participante no check-in
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
