import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Escala } from "@/types/supabase";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Plantão</DialogTitle>
            <DialogDescription className="space-y-2 pt-4">
              <div>
                <span className="font-semibold">Profissional:</span>{" "}
                {selectedEvent?.profissionais.nome}
              </div>
              <div>
                <span className="font-semibold">Cargo:</span>{" "}
                {selectedEvent?.profissionais.cargo}
              </div>
              <div>
                <span className="font-semibold">Horário:</span>{" "}
                {selectedEvent?.plantoes.hora_inicio} - {selectedEvent?.plantoes.hora_fim}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
