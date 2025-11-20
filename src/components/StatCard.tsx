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
    destructive: "bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/30 hover:border-destructive/50",
    warning: "bg-gradient-to-br from-warning/5 to-warning/10 border-warning/30 hover:border-warning/50",
    default: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 hover:border-primary/50",
  };

  const iconContainerClasses = {
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    default: "bg-primary/10 text-primary",
  };

  return (
    <Card 
      className={`${variantClasses[variant]} transition-all duration-300 hover:shadow-elevated border-2 ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-foreground/80">
          {title}
        </CardTitle>
        <div className={`p-2.5 rounded-xl ${iconContainerClasses[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-10 w-20 animate-pulse rounded-lg bg-muted" />
        ) : (
          <div className="text-4xl font-bold text-foreground tracking-tight">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
