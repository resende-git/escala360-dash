import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Escala } from "@/types/supabase";
import { useState } from "react";
import { format, differenceInHours, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Clock } from "lucide-react";
import { abrirWhatsApp } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ScheduleCalendarProps {
  data: Escala[];
  loading?: boolean;
}

export function ScheduleCalendar({ data, loading }: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Escala | null>(null);

  const eventsForDate = data.filter(
    (escala) =>
      selectedDate &&
      escala.plantoes.data === format(selectedDate, "yyyy-MM-dd")
  );

  // Verifica se o plantão está dentro do prazo de 12h para solicitar substituição
  const podesolicitarSubstituicao = (escala: Escala | null): boolean => {
    if (!escala) return false;
    
    try {
      const dataPlantao = parse(
        `${escala.plantoes.data} ${escala.plantoes.hora_inicio}`,
        "yyyy-MM-dd HH:mm:ss",
        new Date()
      );
      const horasRestantes = differenceInHours(dataPlantao, new Date());
      return horasRestantes >= 12;
    } catch (error) {
      console.error("Erro ao calcular diferença de horas:", error);
      return false;
    }
  };

  const handleSolicitarSubstituicao = () => {
    if (!selectedEvent) return;

    if (!podesolicitarSubstituicao(selectedEvent)) {
      toast({
        title: "Fora do prazo",
        description: "Substituições devem ser solicitadas com no mínimo 12 horas de antecedência.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você pode adicionar a lógica para abrir um modal de solicitação
    // ou chamar uma função RPC do Supabase
    toast({
      title: "Solicitação enviada",
      description: "Sua solicitação de substituição foi registrada.",
    });
    setSelectedEvent(null);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Escala Geral</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[350px] items-center justify-center">
              <div className="h-full w-full animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                locale={ptBR}
              />
              
              {eventsForDate.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Plantões para {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                  </h3>
                  {eventsForDate.map((escala) => (
                    <button
                      key={escala.id}
                      onClick={() => setSelectedEvent(escala)}
                      className="w-full rounded-lg border border-primary/20 bg-primary/10 p-3 text-left transition-all hover:bg-primary/20"
                    >
                      <div className="font-semibold text-primary">
                        {escala.profissionais.nome}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {escala.plantoes.hora_inicio} - {escala.plantoes.hora_fim}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Plantão</DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-foreground">Profissional:</span>
                    <div className="text-base text-foreground">
                      {selectedEvent?.profissionais.nome}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => abrirWhatsApp()}
                    className="h-8 w-8"
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
                
                <div>
                  <span className="text-sm font-semibold text-foreground">Cargo:</span>
                  <div className="text-base text-foreground">
                    {selectedEvent?.profissionais.cargo}
                  </div>
                </div>

                {selectedEvent?.profissionais.email && (
                  <div>
                    <span className="text-sm font-semibold text-foreground">Email:</span>
                    <div className="text-base text-foreground">
                      {selectedEvent?.profissionais.email}
                    </div>
                  </div>
                )}

                {selectedEvent?.profissionais.telefone && (
                  <div>
                    <span className="text-sm font-semibold text-foreground">Telefone:</span>
                    <div className="text-base text-foreground">
                      {selectedEvent?.profissionais.telefone}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-sm font-semibold text-foreground">Horário:</span>
                  <div className="text-base text-foreground">
                    {selectedEvent?.plantoes.hora_inicio} - {selectedEvent?.plantoes.hora_fim}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSolicitarSubstituicao}
                disabled={!podesolicitarSubstituicao(selectedEvent)}
                className="w-full"
                variant={podesolicitarSubstituicao(selectedEvent) ? "default" : "secondary"}
              >
                {podesolicitarSubstituicao(selectedEvent) ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Solicitar Substituição
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Fora do prazo (mínimo 12h)
                  </>
                )}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
