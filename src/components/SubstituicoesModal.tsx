import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubstituicaoDetalhe } from "@/types/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import { abrirWhatsApp } from "@/lib/utils";

interface SubstituicoesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubstituicoesModal({ open, onOpenChange }: SubstituicoesModalProps) {
  const queryClient = useQueryClient();

  const { data: substituicoes = [], isLoading } = useQuery({
    queryKey: ["detalhes-substituicoes"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_detalhes_substituicoes_pendentes");
      if (error) throw error;
      return (data || []) as SubstituicaoDetalhe[];
    },
    enabled: open,
  });

  const aprovarMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("aprovar_substituicao", { id_da_substituicao: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substituicoes-pendentes"] });
      queryClient.invalidateQueries({ queryKey: ["detalhes-substituicoes"] });
      toast({
        title: "Substituição aprovada",
        description: "A substituição foi aprovada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar a substituição.",
        variant: "destructive",
      });
    },
  });

  const rejeitarMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("rejeitar_substituicao", { id_da_substituicao: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["substituicoes-pendentes"] });
      queryClient.invalidateQueries({ queryKey: ["detalhes-substituicoes"] });
      toast({
        title: "Substituição recusada",
        description: "A substituição foi recusada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível recusar a substituição.",
        variant: "destructive",
      });
    },
  });

  const handleAprovar = (id: string) => {
    aprovarMutation.mutate(id);
  };

  const handleRecusar = (id: string) => {
    rejeitarMutation.mutate(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Substituições</DialogTitle>
          <DialogDescription>
            Aprove ou recuse as solicitações de substituição de plantão
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : substituicoes.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Não há substituições pendentes.
          </div>
        ) : (
          <div className="space-y-4">
            {substituicoes.map((sub) => (
              <div
                key={sub.id_substituicao}
                className="rounded-lg border border-border bg-card p-4 space-y-3"
              >
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Solicitante:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sub.nome_solicitante}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => abrirWhatsApp()}
                        className="h-8 w-8"
                      >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Substituto:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sub.nome_substituto}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => abrirWhatsApp()}
                        className="h-8 w-8"
                      >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data do Plantão:</span>
                    <span className="font-medium">
                      {format(new Date(sub.data_plantao), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAprovar(sub.id_substituicao)}
                    disabled={aprovarMutation.isPending || rejeitarMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => handleRecusar(sub.id_substituicao)}
                    disabled={aprovarMutation.isPending || rejeitarMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
