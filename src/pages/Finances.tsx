import { useState } from "react";
import {
  Banknote,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: number;
  student: {
    name: string;
    avatar: string;
    initials: string;
  };
  date: string;
  type: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

const transactions: Transaction[] = [
  {
    id: 1,
    student: {
      name: "Youssef El Amrani",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      initials: "YE",
    },
    date: "15 Jan 2025",
    type: "Frais de scolarité",
    amount: 15000,
    status: "paid",
  },
  {
    id: 2,
    student: {
      name: "Fatima Zahra Bennis",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
      initials: "FZ",
    },
    date: "14 Jan 2025",
    type: "Transport",
    amount: 2500,
    status: "pending",
  },
  {
    id: 3,
    student: {
      name: "Ahmed Tazi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
      initials: "AT",
    },
    date: "10 Jan 2025",
    type: "Frais de scolarité",
    amount: 15000,
    status: "overdue",
  },
  {
    id: 4,
    student: {
      name: "Salma Idrissi",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      initials: "SI",
    },
    date: "12 Jan 2025",
    type: "Cantine",
    amount: 1200,
    status: "paid",
  },
  {
    id: 5,
    student: {
      name: "Omar Benjelloun",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      initials: "OB",
    },
    date: "08 Jan 2025",
    type: "Activités parascolaires",
    amount: 800,
    status: "pending",
  },
  {
    id: 6,
    student: {
      name: "Hiba Alaoui",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
      initials: "HA",
    },
    date: "05 Jan 2025",
    type: "Frais de scolarité",
    amount: 15000,
    status: "overdue",
  },
];

const statusConfig = {
  paid: {
    label: "Payé",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  pending: {
    label: "En attente",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  overdue: {
    label: "En retard",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

const kpiData = [
  {
    title: "Revenu Total",
    value: "1,250,000",
    currency: "MAD",
    change: "+12.5%",
    trend: "up",
    icon: Banknote,
    accentColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    title: "En Attente",
    value: "185,000",
    currency: "MAD",
    change: "23 factures",
    trend: "neutral",
    icon: Clock,
    accentColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    title: "Impayés",
    value: "45,000",
    currency: "MAD",
    change: "8 factures",
    trend: "down",
    icon: AlertTriangle,
    accentColor: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
];

export default function Finances() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA").format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finances</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les paiements et les transactions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Exporter le rapport
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {kpiData.map((kpi) => (
            <div
              key={kpi.title}
              className={`rounded-xl border ${kpi.borderColor} ${kpi.bgColor} p-6 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bgColor}`}
                >
                  <kpi.icon className={`h-5 w-5 ${kpi.accentColor}`} />
                </div>
                {kpi.trend === "up" && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    {kpi.change}
                  </div>
                )}
                {kpi.trend === "down" && (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <TrendingDown className="h-3 w-3" />
                    {kpi.change}
                  </div>
                )}
                {kpi.trend === "neutral" && (
                  <span className="text-xs text-muted-foreground">
                    {kpi.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className={`mt-1 font-mono text-2xl font-bold ${kpi.accentColor}`}>
                  {kpi.value}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    {kpi.currency}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "paid", "pending", "overdue"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={
                selectedFilter === filter
                  ? ""
                  : "border-border bg-secondary/50 hover:bg-secondary"
              }
            >
              {filter === "all" && "Tous"}
              {filter === "paid" && "Payés"}
              {filter === "pending" && "En attente"}
              {filter === "overdue" && "En retard"}
            </Button>
          ))}
        </div>

        {/* Transaction Table */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Étudiant</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Montant
                </TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-muted-foreground w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .filter(
                  (t) => selectedFilter === "all" || t.status === selectedFilter
                )
                .map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-border/50 hover:bg-white/5 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={transaction.student.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {transaction.student.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {transaction.student.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.type}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-foreground">
                      {formatAmount(transaction.amount)} MAD
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${statusConfig[transaction.status].className} border`}
                      >
                        {statusConfig[transaction.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/10"
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#111827] border-border"
                        >
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger Facture
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
