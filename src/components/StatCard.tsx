import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "destructive" | "warning" | "default";
  loading?: boolean;
  onClick?: () => void;
}

export function StatCard({ title, value, icon: Icon, variant, loading, onClick }: StatCardProps) {
  const variantClasses = {
    destructive: "bg-destructive/10 border-destructive/50",
    warning: "bg-warning/10 border-warning/50",
    default: "bg-card border-border",
  };

  const iconClasses = {
    destructive: "text-destructive",
    warning: "text-warning",
    default: "text-primary",
  };

  return (
    <Card 
      className={`${variantClasses[variant]} transition-all hover:shadow-lg ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
