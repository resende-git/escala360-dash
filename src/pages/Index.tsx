import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ClipboardList, Users, Calendar, LayoutDashboard, UserCog, Search, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StatCard } from "@/components/StatCard";
import { OverloadTable } from "@/components/OverloadTable";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { SubstituicoesModal } from "@/components/SubstituicoesModal";
import { PlantoesCriticosModal } from "@/components/PlantoesCriticosModal";
import { MetricsChart } from "@/components/MetricsChart";
import { QuickActions } from "@/components/QuickActions";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ProfissionalSobrecarga, Escala } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [modalSubstituicoesOpen, setModalSubstituicoesOpen] = useState(false);
  const [modalPlantoesCriticosOpen, setModalPlantoesCriticosOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("visao-geral");
  // Query para plantões críticos (48h)
  const { data: plantoesCriticos = [], isLoading: loadingCriticos } = useQuery({
    queryKey: ["plantoes-criticos"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_plantoes_vagos_48h");
      if (error) throw error;
      return data || [];
    },
  });

  // Query para substituições pendentes
  const { data: substituicoesPendentes = [], isLoading: loadingSubstituicoes } = useQuery({
    queryKey: ["substituicoes-pendentes"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_substituicoes_pendentes");
      if (error) throw error;
      return data || [];
    },
  });

  // Query para profissionais sobrecarregados
  const { data: profissionaisSobrecarga = [], isLoading: loadingSobrecarga } = useQuery({
    queryKey: ["profissionais-sobrecarga"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_profissionais_sobrecarregados");
      if (error) throw error;
      return (data || []) as ProfissionalSobrecarga[];
    },
  });

  // Query para escalas gerais
  const { data: escalas = [], isLoading: loadingEscalas } = useQuery({
    queryKey: ["escalas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("escalas")
        .select("*, plantoes(*), profissionais(nome, cargo, telefone, email)")
        .eq("status", "ativo");
      if (error) throw error;
      return (data || []) as Escala[];
    },
  });

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Escala360
              </h1>
              <p className="text-sm text-muted-foreground">Dashboard de Gestão de Plantões</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Buscar..." 
                  className="w-[200px] pl-9"
                />
              </div>
              <Badge variant="destructive" className="gap-1.5 px-3 py-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="font-semibold">{plantoesCriticos.length}</span>
                <span className="hidden sm:inline">Críticos</span>
              </Badge>
              <Badge variant="default" className="gap-1.5 px-3 py-1.5 bg-primary">
                <ClipboardList className="h-3.5 w-3.5" />
                <span className="font-semibold">{substituicoesPendentes.length}</span>
                <span className="hidden sm:inline">Pendentes</span>
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="visao-geral" className="flex items-center justify-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="plantoes" className="flex items-center justify-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Plantões</span>
              {plantoesCriticos.length > 0 && (
                <Badge variant="destructive" className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-bold">
                  {plantoesCriticos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="substituicoes" className="flex items-center justify-center gap-1.5">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Substituições</span>
              {substituicoesPendentes.length > 0 && (
                <Badge className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-[10px] font-bold">
                  {substituicoesPendentes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profissionais" className="flex items-center justify-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Profissionais</span>
            </TabsTrigger>
            <TabsTrigger value="calendario" className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendário</span>
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral Tab */}
          <TabsContent value="visao-geral" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard
                title="Plantões Críticos (48h)"
                value={plantoesCriticos.length}
                icon={AlertCircle}
                variant="destructive"
                loading={loadingCriticos}
                onClick={() => setActiveTab("plantoes")}
              />
              <StatCard
                title="Substituições Pendentes"
                value={substituicoesPendentes.length}
                icon={ClipboardList}
                variant="warning"
                loading={loadingSubstituicoes}
                onClick={() => setActiveTab("substituicoes")}
              />
              <StatCard
                title="Profissionais em Sobrecarga"
                value={profissionaisSobrecarga.length}
                icon={Users}
                variant="warning"
                loading={loadingSobrecarga}
                onClick={() => setActiveTab("profissionais")}
              />
            </div>

            {/* Charts & Actions Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <MetricsChart
                title="Tendências da Semana"
                description="Comparação com o período anterior"
                metrics={[
                  { label: "Plantões Vagos", value: plantoesCriticos.length, change: -15, changeType: "down" },
                  { label: "Substituições", value: substituicoesPendentes.length, change: 8, changeType: "up" },
                  { label: "Taxa de Ocupação", value: 87, change: 3, changeType: "down" },
                ]}
              />
              <QuickActions />
            </div>

            {/* Main Content Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <OverloadTable data={profissionaisSobrecarga} loading={loadingSobrecarga} />
              <ActivityFeed />
            </div>

            {/* Calendar Full Width */}
            <ScheduleCalendar data={escalas} loading={loadingEscalas} />
          </TabsContent>

          {/* Plantões Tab */}
          <TabsContent value="plantoes" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Plantões Críticos
                  </CardTitle>
                  <CardDescription>
                    Plantões sem profissional alocado nas próximas 48 horas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {plantoesCriticos.length} plantões precisam de atenção imediata
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Aloque profissionais antes que se tornem emergências
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setModalPlantoesCriticosOpen(true)}
                    className="w-full"
                    size="lg"
                  >
                    Gerenciar Plantões Críticos
                  </Button>
                </CardContent>
              </Card>
              <MetricsChart
                title="Status dos Plantões"
                description="Visão geral da situação"
                metrics={[
                  { label: "Críticos (48h)", value: plantoesCriticos.length },
                  { label: "Em Alerta (7d)", value: 12 },
                  { label: "Cobertos", value: escalas.length },
                ]}
              />
            </div>
          </TabsContent>

          {/* Substituições Tab */}
          <TabsContent value="substituicoes" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    Substituições Pendentes
                  </CardTitle>
                  <CardDescription>
                    Solicitações de troca de plantão aguardando aprovação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {substituicoesPendentes.length > 0 ? (
                    <div className="rounded-lg border border-warning/50 bg-warning/10 p-4">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="h-6 w-6 text-warning" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {substituicoesPendentes.length} solicitações aguardando análise
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Revise e aprove as trocas de plantão
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-primary/50 bg-primary/10 p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhuma substituição pendente no momento
                      </p>
                    </div>
                  )}
                  <Button 
                    onClick={() => setModalSubstituicoesOpen(true)}
                    className="w-full"
                    size="lg"
                    disabled={substituicoesPendentes.length === 0}
                  >
                    Gerenciar Substituições
                  </Button>
                </CardContent>
              </Card>
              <MetricsChart
                title="Histórico"
                description="Últimos 30 dias"
                metrics={[
                  { label: "Aprovadas", value: 24, changeType: "down" },
                  { label: "Rejeitadas", value: 3, changeType: "down" },
                  { label: "Pendentes", value: substituicoesPendentes.length },
                ]}
              />
            </div>
          </TabsContent>

          {/* Profissionais Tab */}
          <TabsContent value="profissionais" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-warning" />
                    Análise de Carga Horária
                  </CardTitle>
                  <CardDescription>
                    Profissionais com carga horária acima do limite recomendado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profissionaisSobrecarga.length > 0 ? (
                    <div className="mb-4 rounded-lg border border-warning/50 bg-warning/10 p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-warning" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {profissionaisSobrecarga.length} profissionais em sobrecarga
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Considere redistribuir os plantões para evitar esgotamento
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <OverloadTable data={profissionaisSobrecarga} loading={loadingSobrecarga} />
                </CardContent>
              </Card>
              <div className="space-y-6">
                <MetricsChart
                  title="Estatísticas"
                  description="Distribuição da equipe"
                  metrics={[
                    { label: "Em Sobrecarga", value: profissionaisSobrecarga.length },
                    { label: "Disponíveis", value: 18 },
                    { label: "Média h/semana", value: 32 },
                  ]}
                />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distribuição</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Médicos</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enfermeiros</span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Técnicos</span>
                      <span className="font-semibold">12</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Calendário Tab */}
          <TabsContent value="calendario" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-4">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Calendário de Escalas
                  </CardTitle>
                  <CardDescription>
                    Visualização completa dos plantões agendados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleCalendar data={escalas} loading={loadingEscalas} />
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resumo do Mês</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{escalas.length}</p>
                      <p className="text-xs text-muted-foreground">Plantões agendados</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-destructive">{plantoesCriticos.length}</p>
                      <p className="text-xs text-muted-foreground">Plantões vagos</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary">87%</p>
                      <p className="text-xs text-muted-foreground">Taxa de cobertura</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Legenda</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-primary" />
                      <span className="text-muted-foreground">Plantão coberto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-destructive" />
                      <span className="text-muted-foreground">Plantão vago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-warning" />
                      <span className="text-muted-foreground">Substituição pendente</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <SubstituicoesModal open={modalSubstituicoesOpen} onOpenChange={setModalSubstituicoesOpen} />
      <PlantoesCriticosModal open={modalPlantoesCriticosOpen} onOpenChange={setModalPlantoesCriticosOpen} />
    </div>
  );
};

export default Index;
