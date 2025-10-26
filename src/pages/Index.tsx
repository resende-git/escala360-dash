import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ClipboardList, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/StatCard";
import { OverloadTable } from "@/components/OverloadTable";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { SubstituicoesModal } from "@/components/SubstituicoesModal";
import { PlantoesCriticosModal } from "@/components/PlantoesCriticosModal";
import { ProfissionalSobrecarga, Escala } from "@/types/supabase";

const Index = () => {
  const [modalSubstituicoesOpen, setModalSubstituicoesOpen] = useState(false);
  const [modalPlantoesCriticosOpen, setModalPlantoesCriticosOpen] = useState(false);
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Escala360 - Dashboard de Gestão
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Plantões Críticos (48h)"
              value={plantoesCriticos.length}
              icon={AlertCircle}
              variant="destructive"
              loading={loadingCriticos}
              onClick={() => setModalPlantoesCriticosOpen(true)}
            />
            <StatCard
              title="Substituições Pendentes"
              value={substituicoesPendentes.length}
              icon={ClipboardList}
              variant="warning"
              loading={loadingSubstituicoes}
              onClick={() => setModalSubstituicoesOpen(true)}
            />
            <StatCard
              title="Profissionais em Sobrecarga"
              value={profissionaisSobrecarga.length}
              icon={Users}
              variant="warning"
              loading={loadingSobrecarga}
            />
          </div>

          {/* Table and Calendar */}
          <div className="grid gap-6 lg:grid-cols-2">
            <OverloadTable data={profissionaisSobrecarga} loading={loadingSobrecarga} />
            <ScheduleCalendar data={escalas} loading={loadingEscalas} />
          </div>
        </div>
      </main>

      <SubstituicoesModal open={modalSubstituicoesOpen} onOpenChange={setModalSubstituicoesOpen} />
      <PlantoesCriticosModal open={modalPlantoesCriticosOpen} onOpenChange={setModalPlantoesCriticosOpen} />
    </div>
  );
};

export default Index;
