import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInscriptions } from "@/components/dashboard/RecentInscriptions";
import { GraduationCap, Users, Wallet, UserCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statsData = [
  {
    title: "Total Étudiants",
    value: "2,847",
    change: 12.5,
    icon: GraduationCap,
    sparklineData: [30, 35, 32, 40, 45, 42, 48, 52, 55, 58, 62, 65],
  },
  {
    title: "Professeurs Actifs",
    value: "142",
    change: 4.2,
    icon: Users,
    sparklineData: [120, 122, 125, 128, 130, 132, 135, 138, 140, 141, 142, 142],
  },
  {
    title: "Revenu Mensuel",
    value: "45,230 €",
    change: 8.1,
    icon: Wallet,
    sparklineData: [35000, 38000, 42000, 40000, 43000, 45000, 44000, 46000, 45000, 44000, 45230, 45230],
  },
  {
    title: "Taux de Présence",
    value: "94.2%",
    change: -1.3,
    icon: UserCheck,
    sparklineData: [96, 95, 94, 95, 96, 95, 94, 93, 94, 95, 94, 94.2],
  },
];

const Index = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Vue d'ensemble</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bienvenue sur votre tableau de bord EduManager
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-fit justify-start text-left font-normal border-border bg-secondary/50 hover:bg-secondary text-foreground"
            >
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              {format(date, "d MMMM yyyy", { locale: fr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-border bg-card" align="end">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statsData.map((stat, index) => (
          <div 
            key={stat.title} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts and Table Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <RevenueChart />
        </div>
        <div className="xl:col-span-2 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <RecentInscriptions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
