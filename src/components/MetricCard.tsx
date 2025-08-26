import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = "text-primary",
  className 
}: MetricCardProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn(
            "text-xs mt-1",
            change.trend === 'up' ? "text-success" : 
            change.trend === 'down' ? "text-destructive" : 
            "text-muted-foreground"
          )}>
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}