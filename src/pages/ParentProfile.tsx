import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Mail,
  Users,
  GraduationCap,
  FileText,
  Printer,
  Send,
  Percent,
  ChevronRight,
} from "lucide-react";
import { parentsData } from "./Parents";
import { cn } from "@/lib/utils";

// Extended child data for the family view
const childrenDetails: Record<string, {
  moyenne: number;
  assiduite: number;
  soldeDu: number;
  prochainPaiement: string;
}> = {
  "E4509": { moyenne: 14.8, assiduite: 94, soldeDu: 15000, prochainPaiement: "15/02/2025" },
  "E4521": { moyenne: 15.2, assiduite: 97, soldeDu: 0, prochainPaiement: "15/04/2025" },
  "E4510": { moyenne: 12.5, assiduite: 88, soldeDu: 15000, prochainPaiement: "15/02/2025" },
  "E4511": { moyenne: 16.0, assiduite: 99, soldeDu: 15000, prochainPaiement: "15/02/2025" },
  "E4512": { moyenne: 14.0, assiduite: 95, soldeDu: 15000, prochainPaiement: "15/02/2025" },
  "E4513": { moyenne: 13.8, assiduite: 92, soldeDu: 0, prochainPaiement: "15/04/2025" },
  "E4514": { moyenne: 15.5, assiduite: 96, soldeDu: 15000, prochainPaiement: "15/02/2025" },
  "E4515": { moyenne: 14.2, assiduite: 93, soldeDu: 15000, prochainPaiement: "15/02/2025" },
  "E4516": { moyenne: 16.5, assiduite: 98, soldeDu: 15000, prochainPaiement: "15/02/2025" },
};

// Family payment history
const familyPayments = [
  { id: 1, enfant: "Youssef", date: "15/01/2025", motif: "Frais de scolarité T2", montant: 15000, statut: "paid" },
  { id: 2, enfant: "Sara", date: "15/01/2025", motif: "Frais de scolarité T2", montant: 15000, statut: "paid" },
  { id: 3, enfant: "Youssef", date: "15/10/2024", motif: "Frais de scolarité T1", montant: 15000, statut: "paid" },
  { id: 4, enfant: "Sara", date: "15/10/2024", motif: "Frais de scolarité T1", montant: 15000, statut: "paid" },
  { id: 5, enfant: "Youssef", date: "15/04/2025", motif: "Frais de scolarité T3", montant: 15000, statut: "pending" },
];

export default function ParentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const parent = parentsData.find((p) => p.id === id);

  if (!parent) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Parent non trouvé</p>
        </div>
      </DashboardLayout>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA").format(amount);
  };

  const hasSiblingDiscount = parent.enfants.length > 1;

  const getGradeColor = (note: number) => {
    if (note >= 14) return "text-emerald-400";
    if (note >= 10) return "text-amber-400";
    return "text-red-400";
  };

  // Calculate total owed across all children
  const totalOwed = parent.enfants.reduce((sum, enfant) => {
    const details = childrenDetails[enfant.id];
    return sum + (details?.soldeDu || 0);
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/parents")}
          className="text-muted-foreground hover:text-foreground gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux parents
        </Button>

        {/* Family Header */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={parent.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {parent.prenom[0]}{parent.nom[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  Famille {parent.nom}
                </h1>
                {hasSiblingDiscount && (
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 gap-1">
                    <Percent className="h-3 w-3" />
                    Réduction Fratrie: -10%
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {parent.enfants.length} enfant{parent.enfants.length > 1 ? "s" : ""} inscrit{parent.enfants.length > 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {parent.telephone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {parent.email}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Facture Familiale
              </Button>
            </div>
          </div>
        </div>

        {/* Section A: Children Cards */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Les Enfants
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parent.enfants.map((enfant) => {
              const details = childrenDetails[enfant.id];
              return (
                <div
                  key={enfant.id}
                  onClick={() => navigate(`/etudiants/${enfant.id}`)}
                  className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 cursor-pointer transition-all hover:bg-card/70 hover:border-primary/30 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={enfant.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {enfant.prenom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{enfant.prenom}</h3>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <Badge className="bg-primary/15 text-primary border-primary/25 mt-1">
                        {enfant.classe}
                      </Badge>
                    </div>
                  </div>

                  {details && (
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                      <div className="text-center">
                        <p className={cn("text-lg font-bold font-mono", getGradeColor(details.moyenne))}>
                          {details.moyenne}
                        </p>
                        <p className="text-xs text-muted-foreground">Moyenne</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold font-mono text-primary">
                          {details.assiduite}%
                        </p>
                        <p className="text-xs text-muted-foreground">Assiduité</p>
                      </div>
                      <div className="text-center">
                        <p className={cn("text-lg font-bold font-mono", details.soldeDu > 0 ? "text-amber-400" : "text-emerald-400")}>
                          {details.soldeDu > 0 ? formatAmount(details.soldeDu) : "OK"}
                        </p>
                        <p className="text-xs text-muted-foreground">Solde</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section B: Family Financial Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Financial Summary Card */}
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Résumé Financier Familial</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nombre d'enfants</span>
                <span className="font-medium text-foreground">{parent.enfants.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Solde total dû</span>
                <span className={cn("font-mono font-semibold", totalOwed > 0 ? "text-amber-400" : "text-emerald-400")}>
                  {totalOwed > 0 ? `${formatAmount(totalOwed)} MAD` : "À jour"}
                </span>
              </div>
              {hasSiblingDiscount && (
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground">Réduction fratrie appliquée</span>
                  <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25">
                    -10%
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 gap-2">
                <Printer className="h-4 w-4" />
                Télécharger PDF
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Envoyer par Email
              </Button>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Paiements Récents</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Enfant</TableHead>
                  <TableHead className="text-muted-foreground">Motif</TableHead>
                  <TableHead className="text-muted-foreground text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyPayments.slice(0, 4).map((payment) => (
                  <TableRow key={payment.id} className="border-border/50 hover:bg-white/5">
                    <TableCell className="font-medium text-foreground">{payment.enfant}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{payment.motif}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn("font-mono", payment.statut === "paid" ? "text-emerald-400" : "text-amber-400")}>
                        {formatAmount(payment.montant)} MAD
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
