import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  sparklineData?: number[];
}

export function StatsCard({ title, value, change, icon: Icon, sparklineData = [] }: StatsCardProps) {
  const isPositive = change >= 0;
  
  // Generate sparkline path
  const generateSparkline = (data: number[]) => {
    if (data.length === 0) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const step = width / (data.length - 1);
    
    return data
      .map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / range) * height;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isPositive ? "+" : ""}{change}%</span>
        </div>
        
        {sparklineData.length > 0 && (
          <svg viewBox="0 0 80 24" className="h-6 w-20">
            <path
              d={generateSparkline(sparklineData)}
              fill="none"
              stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-60"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
