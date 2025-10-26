import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PlantaoCritico, ProfissionalSugerido } from "@/types/supabase";

interface PlantoesCriticosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlantoesCriticosModal({ open, onOpenChange }: PlantoesCriticosModalProps) {
  const [plantaoSelecionado, setPlantaoSelecionado] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: plantoesCriticos = [], isLoading } = useQuery({
    queryKey: ["plantoes-criticos-detalhes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plantoes_criticos")
        .select("*");
      if (error) throw error;
      return (data || []) as PlantaoCritico[];
    },
    enabled: open,
  });

  const { data: profissionaisSugeridos = [], isLoading: loadingSugestoes } = useQuery({
    queryKey: ["profissionais-sugeridos", plantaoSelecionado],
    queryFn: async () => {
      if (!plantaoSelecionado) return [];
      const { data, error } = await supabase.rpc("sugerir_profissionais_para_plantao", {
        plantao_id_alvo: plantaoSelecionado,
      });
      if (error) throw error;
      return (data || []) as ProfissionalSugerido[];
    },
    enabled: !!plantaoSelecionado,
  });

  const handleVoltar = () => {
    setPlantaoSelecionado(null);
  };

  const handleSelecionarProfissional = (profissional: ProfissionalSugerido) => {
    toast.success(`${profissional.nome} selecionado para alocação`, {
      description: "Funcionalidade de confirmação será implementada em breve",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {plantaoSelecionado ? "Profissionais Sugeridos" : "Plantões Críticos (48h)"}
          </DialogTitle>
        </DialogHeader>

        {!plantaoSelecionado ? (
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : plantoesCriticos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum plantão crítico no momento
              </p>
            ) : (
              plantoesCriticos.map((plantao) => (
                <Card key={plantao.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-destructive" />
                      {new Date(plantao.data).toLocaleDateString("pt-BR")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {plantao.hora_inicio} - {plantao.hora_fim}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{plantao.tipo}</span>
                      <Button
                        size="sm"
                        onClick={() => setPlantaoSelecionado(plantao.id)}
                        className="gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Alocar Profissional
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={handleVoltar}>
              ← Voltar
            </Button>

            {loadingSugestoes ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : profissionaisSugeridos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum profissional disponível para este plantão
              </p>
            ) : (
              profissionaisSugeridos.map((profissional) => (
                <Card
                  key={profissional.id_profissional}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelecionarProfissional(profissional)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{profissional.nome}</h4>
                        <p className="text-sm text-muted-foreground">{profissional.cargo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{profissional.horas_na_semana}h</p>
                        <p className="text-xs text-muted-foreground">na semana</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
