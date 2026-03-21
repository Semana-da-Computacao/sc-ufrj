/**
 * Página de cadastro de participantes
 * Qualquer pessoa pode se cadastrar como membro
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, User, Mail, Lock, Building, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "@/hooks/useToast";

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    institution: "", phone: "", cpf: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        institution: form.institution || undefined,
        phone: form.phone || undefined,
        cpf: form.cpf || undefined,
      });

      toast({
        title: "Cadastro realizado!",
        description: "Você já pode fazer login no sistema.",
        variant: "default",
      });

      // Se veio o QR code, mostra brevemente
      if (data.data?.qrCodeUrl) {
        sessionStorage.setItem("newUserQR", data.data.qrCodeUrl);
      }

      navigate("/login");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Erro ao realizar cadastro";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sidebar to-sidebar/80 p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sidebar-primary shadow-lg">
            <Cpu className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cadastro de Participante</h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-2">
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Cadastre-se para se inscrever nos eventos e receber seu certificado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name" placeholder="Seu nome completo"
                      value={form.name} onChange={(e) => update("name", e.target.value)}
                      className="pl-10" required autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email" type="email" placeholder="seu@email.com"
                      value={form.email} onChange={(e) => update("email", e.target.value)}
                      className="pl-10" required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password" type="password" placeholder="Mínimo 8 caracteres"
                      value={form.password} onChange={(e) => update("password", e.target.value)}
                      className="pl-10" required minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                  <Input
                    id="confirmPassword" type="password" placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="institution">Instituição</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="institution" placeholder="UFRJ, UERJ..."
                      value={form.institution} onChange={(e) => update("institution", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone" placeholder="(21) 99999-9999"
                      value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Criar conta"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                Já tem conta? Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
