import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", inscriptions: 45, revenus: 12000 },
  { month: "Fév", inscriptions: 52, revenus: 15000 },
  { month: "Mar", inscriptions: 48, revenus: 14500 },
  { month: "Avr", inscriptions: 70, revenus: 22000 },
  { month: "Mai", inscriptions: 65, revenus: 20000 },
  { month: "Juin", inscriptions: 80, revenus: 28000 },
  { month: "Juil", inscriptions: 55, revenus: 18000 },
  { month: "Août", inscriptions: 90, revenus: 32000 },
  { month: "Sept", inscriptions: 120, revenus: 45000 },
  { month: "Oct", inscriptions: 95, revenus: 38000 },
  { month: "Nov", inscriptions: 85, revenus: 34000 },
  { month: "Déc", inscriptions: 78, revenus: 30000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-primary">
            Inscriptions: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-sm text-success">
            Revenus: <span className="font-semibold">{payload[1].value.toLocaleString('fr-FR')} €</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Inscriptions & Revenus</h3>
        <p className="text-sm text-muted-foreground">Évolution sur les 12 derniers mois</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="inscriptionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="revenusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222, 30%, 18%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="inscriptions"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fill="url(#inscriptionsGradient)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenus"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
              fill="url(#revenusGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Inscriptions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Revenus</span>
        </div>
      </div>
    </div>
  );
}
