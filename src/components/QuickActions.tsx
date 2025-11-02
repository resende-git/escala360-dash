import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, FileText, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Ação em desenvolvimento",
      description: `A funcionalidade "${action}" será implementada em breve.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às funções mais utilizadas</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={() => handleAction("Criar Plantão")}
        >
          <Plus className="h-4 w-4" />
          Criar Plantão
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={() => handleAction("Adicionar Profissional")}
        >
          <UserPlus className="h-4 w-4" />
          Adicionar Profissional
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={() => handleAction("Atualizar Dados")}
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar Dados
        </Button>
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={() => handleAction("Exportar Relatório")}
        >
          <FileText className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </CardContent>
    </Card>
  );
}