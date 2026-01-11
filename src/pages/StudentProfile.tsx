import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Phone,
  GraduationCap,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy student data
const studentData = {
  id: "E4509",
  prenom: "Youssef",
  nom: "El Amrani",
  classe: "2BAC-A",
  age: 17,
  statut: "actif",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
  email: "youssef.elamrani@email.com",
  telephone: "06 12 34 56 78",
  adresse: "45 Rue Hassan II, Casablanca",
  dateNaissance: "2007-03-15",
  parents: {
    id: "P001",
    pere: { nom: "Mohammed El Amrani", telephone: "06 11 22 33 44" },
    mere: { nom: "Fatima El Amrani", telephone: "06 55 66 77 88" },
  },
  siblings: [
    { id: "E4521", prenom: "Sara", classe: "1BAC-B", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
  ],
};

const overviewData = {
  moyenne: 14.8,
  assiduite: 94,
  prochainPaiement: "15 Février 2025",
  montantDu: 15000,
};

const grades = [
  { matiere: "Mathématiques", note: 16, coeff: 4, date: "10/01/2025", type: "Contrôle" },
  { matiere: "Physique-Chimie", note: 14.5, coeff: 3, date: "08/01/2025", type: "DS" },
  { matiere: "Français", note: 13, coeff: 2, date: "05/01/2025", type: "Oral" },
  { matiere: "Anglais", note: 15.5, coeff: 2, date: "03/01/2025", type: "Contrôle" },
  { matiere: "Histoire-Géo", note: 12, coeff: 2, date: "28/12/2024", type: "DS" },
  { matiere: "SVT", note: 17, coeff: 2, date: "20/12/2024", type: "TP" },
];

const bulletins = [
  { trimestre: "Trimestre 1", annee: "2024-2025", moyenne: 14.2, rang: "5/32", mention: "Bien" },
  { trimestre: "Trimestre 2", annee: "2023-2024", moyenne: 15.1, rang: "3/30", mention: "Bien" },
  { trimestre: "Trimestre 3", annee: "2023-2024", moyenne: 14.8, rang: "4/30", mention: "Bien" },
];

const payments = [
  { id: 1, date: "15/01/2025", motif: "Frais de scolarité T2", montant: 15000, statut: "paid" },
  { id: 2, date: "15/10/2024", motif: "Frais de scolarité T1", montant: 15000, statut: "paid" },
  { id: 3, date: "01/09/2024", motif: "Frais d'inscription", montant: 5000, statut: "paid" },
  { id: 4, date: "15/04/2025", motif: "Frais de scolarité T3", montant: 15000, statut: "pending" },
];

// Generate attendance heatmap data (last 6 months)
const generateAttendanceData = () => {
  const data: { date: string; status: "present" | "absent" | "late" | "none" }[] = [];
  const today = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      data.push({ date: date.toISOString().split("T")[0], status: "none" });
    } else {
      const rand = Math.random();
      let status: "present" | "absent" | "late" = "present";
      if (rand > 0.94) status = "absent";
      else if (rand > 0.88) status = "late";
      data.push({ date: date.toISOString().split("T")[0], status });
    }
  }
  return data;
};

const attendanceData = generateAttendanceData();

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA").format(amount);
  };

  const getGradeColor = (note: number) => {
    if (note >= 14) return "text-emerald-400";
    if (note >= 10) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/etudiants")}
          className="text-muted-foreground hover:text-foreground gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux étudiants
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-80 space-y-4">
            {/* Student Card */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={studentData.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {studentData.prenom[0]}{studentData.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground">
                  {studentData.prenom} {studentData.nom}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: #{studentData.id}
                </p>
              </div>
            </div>

            {/* Details Widget */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Classe</span>
                  <Badge className="bg-primary/15 text-primary border-primary/25">
                    {studentData.classe}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Âge</span>
                  <span className="text-sm font-medium text-foreground">{studentData.age} ans</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Statut</span>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-emerald-400 capitalize">{studentData.statut}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parents Widget */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Contacts Parents</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <button 
                      onClick={() => navigate(`/parents/${studentData.parents.id}`)}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                    >
                      {studentData.parents.pere.nom}
                    </button>
                    <p className="text-xs text-muted-foreground">Père</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{studentData.parents.pere.telephone}</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <button 
                      onClick={() => navigate(`/parents/${studentData.parents.id}`)}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                    >
                      {studentData.parents.mere.nom}
                    </button>
                    <p className="text-xs text-muted-foreground">Mère</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{studentData.parents.mere.telephone}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Siblings Widget */}
            {studentData.siblings.length > 0 && (
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Frères et Sœurs</h3>
                <div className="space-y-3">
                  {studentData.siblings.map((sibling) => (
                    <button
                      key={sibling.id}
                      onClick={() => navigate(`/etudiants/${sibling.id}`)}
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={sibling.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {sibling.prenom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {sibling.prenom}
                        </p>
                        <p className="text-xs text-muted-foreground">{sibling.classe}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-card/50 border border-border p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger value="academic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Académique
                </TabsTrigger>
                <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Assiduité
                </TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Financier
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                        <GraduationCap className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">Moyenne Générale</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400 font-mono">
                      {overviewData.moyenne}<span className="text-lg text-muted-foreground">/20</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Taux d'Assiduité</span>
                    </div>
                    <p className="text-3xl font-bold text-primary font-mono">
                      {overviewData.assiduite}<span className="text-lg text-muted-foreground">%</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                        <CreditCard className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">Prochain Paiement</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{overviewData.prochainPaiement}</p>
                    <p className="text-sm text-muted-foreground font-mono">{formatAmount(overviewData.montantDu)} MAD</p>
                  </div>
                </div>
              </TabsContent>

              {/* Academic Tab */}
              <TabsContent value="academic" className="space-y-6">
                {/* Recent Grades */}
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Notes Récentes</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Matière</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground text-right">Note</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade, idx) => (
                        <TableRow key={idx} className="border-border/50 hover:bg-white/5">
                          <TableCell className="font-medium text-foreground">{grade.matiere}</TableCell>
                          <TableCell className="text-muted-foreground">{grade.type}</TableCell>
                          <TableCell className="text-muted-foreground">{grade.date}</TableCell>
                          <TableCell className={cn("text-right font-mono font-semibold", getGradeColor(grade.note))}>
                            {grade.note}/20
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Bulletins */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Bulletins Scolaires</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {bulletins.map((bulletin, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 cursor-pointer transition-all hover:bg-card/70 hover:border-primary/30"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{bulletin.trimestre}</p>
                            <p className="text-xs text-muted-foreground">{bulletin.annee}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="text-2xl font-bold text-primary font-mono">{bulletin.moyenne}</p>
                            <p className="text-xs text-muted-foreground">Moyenne</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">{bulletin.rang}</p>
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 mt-1">
                              {bulletin.mention}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-6">
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-foreground">Calendrier d'Assiduité (6 derniers mois)</h3>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                        <span className="text-muted-foreground">Présent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-amber-500" />
                        <span className="text-muted-foreground">Retard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-red-500" />
                        <span className="text-muted-foreground">Absent</span>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-1" style={{ minWidth: "750px" }}>
                      {Array.from({ length: 26 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const dataIndex = weekIndex * 7 + dayIndex;
                            const day = attendanceData[dataIndex];
                            if (!day) return <div key={dayIndex} className="h-3 w-3" />;
                            
                            return (
                              <Tooltip key={dayIndex}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "h-3 w-3 rounded-sm transition-all hover:scale-125",
                                      day.status === "present" && "bg-emerald-500/80",
                                      day.status === "absent" && "bg-red-500/80",
                                      day.status === "late" && "bg-amber-500/80",
                                      day.status === "none" && "bg-border/30"
                                    )}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{day.date}</p>
                                  <p className="capitalize">{day.status === "none" ? "Week-end" : day.status === "present" ? "Présent" : day.status === "absent" ? "Absent" : "Retard"}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-2xl font-bold text-emerald-400 font-mono">
                          {attendanceData.filter(d => d.status === "present").length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Présences</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span className="text-2xl font-bold text-amber-400 font-mono">
                          {attendanceData.filter(d => d.status === "late").length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Retards</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-2xl font-bold text-red-400 font-mono">
                          {attendanceData.filter(d => d.status === "absent").length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Absences</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Financial Tab */}
              <TabsContent value="financial" className="space-y-4">
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Historique des Paiements</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Motif</TableHead>
                        <TableHead className="text-muted-foreground text-right">Montant</TableHead>
                        <TableHead className="text-muted-foreground">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id} className="border-border/50 hover:bg-white/5">
                          <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                          <TableCell className="font-medium text-foreground">{payment.motif}</TableCell>
                          <TableCell className="text-right font-mono font-medium text-foreground">
                            {formatAmount(payment.montant)} MAD
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "border",
                                payment.statut === "paid"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              )}
                            >
                              {payment.statut === "paid" ? "Payé" : "En attente"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
