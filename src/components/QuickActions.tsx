import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, FileText, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openPlantao, setOpenPlantao] = useState(false);
  const [openProfissional, setOpenProfissional] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para criar plantão
  const [plantaoData, setPlantaoData] = useState({
    data: "",
    hora_inicio: "",
    hora_fim: "",
    id_funcao: "",
    id_local: "",
  });

  // Estados para adicionar profissional
  const [profissionalData, setProfissionalData] = useState({
    nome: "",
    cargo: "",
    email: "",
  });

  const handleCriarPlantao = async () => {
    if (!plantaoData.data || !plantaoData.hora_inicio || !plantaoData.hora_fim) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("plantoes").insert([
        {
          data: plantaoData.data,
          hora_inicio: plantaoData.hora_inicio,
          hora_fim: plantaoData.hora_fim,
          id_funcao: plantaoData.id_funcao || null,
          id_local: plantaoData.id_local || null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Plantão criado!",
        description: "O plantão foi adicionado com sucesso.",
      });

      setOpenPlantao(false);
      setPlantaoData({ data: "", hora_inicio: "", hora_fim: "", id_funcao: "", id_local: "" });
      queryClient.invalidateQueries({ queryKey: ["plantoes-criticos"] });
      queryClient.invalidateQueries({ queryKey: ["escalas"] });
    } catch (error) {
      toast({
        title: "Erro ao criar plantão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdicionarProfissional = async () => {
    if (!profissionalData.nome || !profissionalData.cargo || !profissionalData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, cargo e email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("profissionais").insert([
        {
          nome: profissionalData.nome,
          cargo: profissionalData.cargo,
          email: profissionalData.email,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Profissional adicionado!",
        description: `${profissionalData.nome} foi adicionado à equipe.`,
      });

      setOpenProfissional(false);
      setProfissionalData({ nome: "", cargo: "", email: "" });
      queryClient.invalidateQueries({ queryKey: ["profissionais-sobrecarga"] });
    } catch (error) {
      toast({
        title: "Erro ao adicionar profissional",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAtualizarDados = () => {
    queryClient.invalidateQueries();
    toast({
      title: "Dados atualizados!",
      description: "Todas as informações foram recarregadas.",
    });
  };

  const handleExportarRelatorio = async () => {
    try {
      const { data: escalas, error } = await supabase
        .from("escalas")
        .select("*, plantoes(*), profissionais(nome, cargo)")
        .eq("status", "ativo");

      if (error) throw error;

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Profissional,Cargo,Data,Horário Início,Horário Fim\n";
      
      escalas?.forEach((escala: any) => {
        const profissional = escala.profissionais?.nome || "N/A";
        const cargo = escala.profissionais?.cargo || "N/A";
        const data = escala.plantoes?.data || "N/A";
        const inicio = escala.plantoes?.hora_inicio || "N/A";
        const fim = escala.plantoes?.hora_fim || "N/A";
        csvContent += `${profissional},${cargo},${data},${inicio},${fim}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio_escalas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado!",
        description: "O arquivo CSV foi baixado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao exportar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às funções mais utilizadas</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Dialog open={openPlantao} onOpenChange={setOpenPlantao}>
          <DialogTrigger asChild>
            <Button variant="outline" className="justify-start gap-2">
              <Plus className="h-4 w-4" />
              Criar Plantão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Plantão</DialogTitle>
              <DialogDescription>Adicione um novo plantão à escala</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={plantaoData.data}
                  onChange={(e) => setPlantaoData({ ...plantaoData, data: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hora_inicio">Hora Início</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={plantaoData.hora_inicio}
                    onChange={(e) => setPlantaoData({ ...plantaoData, hora_inicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora_fim">Hora Fim</Label>
                  <Input
                    id="hora_fim"
                    type="time"
                    value={plantaoData.hora_fim}
                    onChange={(e) => setPlantaoData({ ...plantaoData, hora_fim: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCriarPlantao} disabled={isLoading} className="w-full">
                {isLoading ? "Criando..." : "Criar Plantão"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openProfissional} onOpenChange={setOpenProfissional}>
          <DialogTrigger asChild>
            <Button variant="outline" className="justify-start gap-2">
              <UserPlus className="h-4 w-4" />
              Adicionar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Profissional</DialogTitle>
              <DialogDescription>Cadastre um novo membro da equipe</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Dr. João Silva"
                  value={profissionalData.nome}
                  onChange={(e) => setProfissionalData({ ...profissionalData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select
                  value={profissionalData.cargo}
                  onValueChange={(value) => setProfissionalData({ ...profissionalData, cargo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Médico">Médico</SelectItem>
                    <SelectItem value="Enfermeiro">Enfermeiro</SelectItem>
                    <SelectItem value="Técnico">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="profissional@hospital.com"
                  value={profissionalData.email}
                  onChange={(e) => setProfissionalData({ ...profissionalData, email: e.target.value })}
                />
              </div>
              <Button onClick={handleAdicionarProfissional} disabled={isLoading} className="w-full">
                {isLoading ? "Adicionando..." : "Adicionar Profissional"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={handleAtualizarDados}
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar Dados
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start gap-2"
          onClick={handleExportarRelatorio}
        >
          <FileText className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </CardContent>
    </Card>
  );
}