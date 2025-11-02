import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricData {
  label: string;
  value: number;
  change?: number;
  changeType?: "up" | "down" | "neutral";
}

interface MetricsChartProps {
  title: string;
  description: string;
  metrics: MetricData[];
}

export function MetricsChart({ title, description, metrics }: MetricsChartProps) {
  const getTrendIcon = (type?: "up" | "down" | "neutral") => {
    switch (type) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-primary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
            {metric.change !== undefined && (
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.changeType)}
                <span className={`text-sm font-medium ${
                  metric.changeType === "up" ? "text-destructive" : 
                  metric.changeType === "down" ? "text-primary" : 
                  "text-muted-foreground"
                }`}>
                  {metric.change > 0 ? "+" : ""}{metric.change}%
                </span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}