import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PlantaoCritico, ProfissionalSugerido } from "@/types/supabase";

interface PlantoesCriticosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlantoesCriticosModal({ open, onOpenChange }: PlantoesCriticosModalProps) {
  const [plantaoSelecionado, setPlantaoSelecionado] = useState<string | null>(null);
  const [confirmacao, setConfirmacao] = useState<{
    plantaoId: string;
    profissional: ProfissionalSugerido;
    plantaoData?: string;
  } | null>(null);
  const queryClient = useQueryClient();

  // Realtime subscription para novos plantões críticos
  useEffect(() => {
    const channel = supabase
      .channel('plantoes-criticos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'plantoes'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["plantoes-criticos-detalhes"] });
          queryClient.invalidateQueries({ queryKey: ["plantoes-criticos-48h"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: plantoesCriticos = [], isLoading } = useQuery({
    queryKey: ["plantoes-criticos-detalhes"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_plantoes_vagos_48h");
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

  const alocarProfissionalMutation = useMutation({
    mutationFn: async ({ plantaoId, profissionalId }: { plantaoId: string; profissionalId: string }) => {
      const { data, error } = await supabase
        .from('escalas')
        .insert({
          plantao_id: plantaoId,
          profissional_id: profissionalId,
          status: 'confirmada'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Profissional alocado com sucesso!", {
        description: "O plantão foi preenchido e removido da lista crítica.",
      });
      queryClient.invalidateQueries({ queryKey: ["plantoes-criticos-detalhes"] });
      queryClient.invalidateQueries({ queryKey: ["plantoes-criticos-48h"] });
      queryClient.invalidateQueries({ queryKey: ["profissionais-sobrecarregados"] });
      setConfirmacao(null);
      setPlantaoSelecionado(null);
    },
    onError: (error) => {
      toast.error("Erro ao alocar profissional", {
        description: error.message,
      });
    },
  });

  const handleVoltar = () => {
    setPlantaoSelecionado(null);
  };

  const handleSelecionarProfissional = (profissional: ProfissionalSugerido, plantao?: PlantaoCritico) => {
    const plantaoData = plantoesCriticos.find(p => String(p.id) === plantaoSelecionado);
    setConfirmacao({
      plantaoId: plantaoSelecionado!,
      profissional,
      plantaoData: plantaoData?.data,
    });
  };

  const handleConfirmarAlocacao = () => {
    if (confirmacao) {
      alocarProfissionalMutation.mutate({
        plantaoId: confirmacao.plantaoId,
        profissionalId: confirmacao.profissional.id_profissional,
      });
    }
  };

  const getDiasRestantes = (data: string) => {
    const diff = new Date(data).getTime() - new Date().getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias;
  };

  const getBadgeVariant = (data: string) => {
    const dias = getDiasRestantes(data);
    if (dias <= 1) return "destructive";
    if (dias <= 2) return "default";
    return "secondary";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {plantaoSelecionado ? "Profissionais Sugeridos" : "Plantões Críticos (48h)"}
            </DialogTitle>
            <DialogDescription>
              {plantaoSelecionado 
                ? "Selecione um profissional para alocar ao plantão" 
                : "Plantões sem profissional alocado que precisam de atenção imediata"}
            </DialogDescription>
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
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Tudo certo!</h3>
                <p className="text-muted-foreground">
                  Nenhum plantão precisa de atenção no momento
                </p>
              </div>
            ) : (
              plantoesCriticos.map((plantao) => {
                const diasRestantes = getDiasRestantes(plantao.data);
                return (
                  <Card key={plantao.id} className="hover:shadow-md transition-shadow border-l-4 border-l-destructive">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-destructive" />
                          {new Date(plantao.data).toLocaleDateString("pt-BR")}
                        </CardTitle>
                        <Badge variant={getBadgeVariant(plantao.data)} className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {diasRestantes <= 0 ? "HOJE" : `${diasRestantes}d restantes`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {plantao.hora_inicio} - {plantao.hora_fim}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => setPlantaoSelecionado(String(plantao.id))}
                          className="gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          Alocar Profissional
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
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
                  className="hover:shadow-md hover:border-primary transition-all cursor-pointer"
                  onClick={() => handleSelecionarProfissional(profissional)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{profissional.nome}</h4>
                        <p className="text-sm text-muted-foreground">{profissional.cargo}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {profissional.horas_na_semana}h/sem
                        </Badge>
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

      {/* Modal de Confirmação */}
      <AlertDialog open={!!confirmacao} onOpenChange={() => setConfirmacao(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Alocação</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a alocar <strong>{confirmacao?.profissional.nome}</strong> ({confirmacao?.profissional.cargo}) 
              para o plantão do dia <strong>{confirmacao?.plantaoData && new Date(confirmacao.plantaoData).toLocaleDateString("pt-BR")}</strong>.
              <br /><br />
              Carga horária atual: <strong>{confirmacao?.profissional.horas_na_semana}h/semana</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmarAlocacao}
              disabled={alocarProfissionalMutation.isPending}
            >
              {alocarProfissionalMutation.isPending ? "Alocando..." : "Confirmar Alocação"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
