import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: Date;
}

export function ActivityFeed() {
  // Mock data - em produção isso viria do backend
  const activities: Activity[] = [
    {
      id: "1",
      type: "success",
      message: "Plantão alocado para Dr. João Silva",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
    },
    {
      id: "2",
      type: "warning",
      message: "3 novos plantões críticos identificados",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos atrás
    },
    {
      id: "3",
      type: "success",
      message: "Substituição aprovada para o dia 15/03",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 horas atrás
    },
    {
      id: "4",
      type: "error",
      message: "Falha ao processar escala automática",
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 horas atrás
    },
  ];

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas atualizações do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.timestamp, { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </p>
            </div>
            <Badge variant={getBadgeVariant(activity.type)} className="shrink-0">
              {activity.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}