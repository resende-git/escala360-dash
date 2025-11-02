import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ClipboardList, Users, Calendar, LayoutDashboard, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/StatCard";
import { OverloadTable } from "@/components/OverloadTable";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { SubstituicoesModal } from "@/components/SubstituicoesModal";
import { PlantoesCriticosModal } from "@/components/PlantoesCriticosModal";
import { ProfissionalSobrecarga, Escala } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Index = () => {
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
        .select("*, plantoes(*), profissionais(nome, cargo)")
        .eq("status", "ativo");
      if (error) throw error;
      return (data || []) as Escala[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Escala360 - Dashboard de Gestão
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {plantoesCriticos.length} Críticos
              </Badge>
              <Badge variant="outline" className="gap-1">
                <ClipboardList className="h-3 w-3" />
                {substituicoesPendentes.length} Pendentes
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="visao-geral" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="plantoes" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Plantões</span>
              {plantoesCriticos.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {plantoesCriticos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="substituicoes" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Substituições</span>
              {substituicoesPendentes.length > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {substituicoesPendentes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profissionais" className="gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Profissionais</span>
            </TabsTrigger>
            <TabsTrigger value="calendario" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendário</span>
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral Tab */}
          <TabsContent value="visao-geral" className="space-y-6">
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

            <div className="grid gap-6 lg:grid-cols-2">
              <OverloadTable data={profissionaisSobrecarga} loading={loadingSobrecarga} />
              <ScheduleCalendar data={escalas} loading={loadingEscalas} />
            </div>
          </TabsContent>

          {/* Plantões Tab */}
          <TabsContent value="plantoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Plantões Críticos
                </CardTitle>
                <CardDescription>
                  Plantões sem profissional alocado nas próximas 48 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setModalPlantoesCriticosOpen(true)}
                  className="w-full"
                  size="lg"
                >
                  Gerenciar Plantões Críticos ({plantoesCriticos.length})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Substituições Tab */}
          <TabsContent value="substituicoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Substituições Pendentes
                </CardTitle>
                <CardDescription>
                  Solicitações de troca de plantão aguardando aprovação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setModalSubstituicoesOpen(true)}
                  className="w-full"
                  size="lg"
                >
                  Gerenciar Substituições ({substituicoesPendentes.length})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profissionais Tab */}
          <TabsContent value="profissionais" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Análise de Carga Horária
                </CardTitle>
                <CardDescription>
                  Profissionais com carga horária acima do limite recomendado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OverloadTable data={profissionaisSobrecarga} loading={loadingSobrecarga} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendário Tab */}
          <TabsContent value="calendario" className="space-y-4">
            <Card>
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
          </TabsContent>
        </Tabs>
      </main>

      <SubstituicoesModal open={modalSubstituicoesOpen} onOpenChange={setModalSubstituicoesOpen} />
      <PlantoesCriticosModal open={modalPlantoesCriticosOpen} onOpenChange={setModalPlantoesCriticosOpen} />
    </div>
  );
};

export default Index;
