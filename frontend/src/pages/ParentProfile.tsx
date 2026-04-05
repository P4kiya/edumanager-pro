import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  CreditCard,
  Users,
  BookOpen,
  TrendingUp,
  CreditCard as CINIcon,
  Globe,
  Calendar,
  User,
  Heart,
} from "lucide-react";
import { ObjectifBaseStudentsData } from "@/data/mockStudents";

// Mock parent data - in a real app this would come from a store/API
const mockParents = [
  {
    id: "P001",
    nom: "El Amrani",
    prenom: "Mohammed",
    email: "mohammed.elamrani@email.com",
    telephone: "06 11 22 33 44",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    soldeDu: 15000,
    adresse: "45 Rue Hassan II, Casablanca",
    profession: "Ingénieur",
    cin: "AB123456",
    nationalite: "Marocaine",
    dateNaissance: "1975-08-22",
    genre: "homme",
    situation: "marié",
    childrenIds: ["1", "3"],
  },
  {
    id: "P002",
    nom: "Dupont",
    prenom: "Claire",
    email: "claire.dupont@email.com",
    telephone: "06 22 33 44 55",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
    soldeDu: 0,
    adresse: "12 Rue de la Paix, Paris",
    profession: "Médecin",
    cin: "CD789012",
    nationalite: "Française",
    dateNaissance: "1982-03-15",
    genre: "femme",
    situation: "marié",
    childrenIds: ["2"],
  },
];

export default function ParentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const parent = mockParents.find((p) => p.id === id) ?? mockParents[0];
  const children = ObjectifBaseStudentsData.filter((s) =>
    parent.childrenIds.includes(s.id)
  );

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("fr-MA").format(amount);

  if (!parent) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Parent introuvable</h2>
          <Button onClick={() => navigate("/parents")}>Retour à la liste</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/parents")}
            className="text-muted-foreground hover:text-foreground gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux parents & tuteurs
          </Button>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="lg:w-96 space-y-4">
              {/* Parent Card */}
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={parent.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {parent.prenom[0]}{parent.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {parent.prenom} {parent.nom}
                    </h2>
                    <p className="text-sm text-muted-foreground">ID: #{parent.id}</p>
                  </div>
                  <Badge className={parent.soldeDu > 0
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                  }>
                    {parent.soldeDu > 0 ? `${formatAmount(parent.soldeDu)} MAD dû` : "À jour"}
                  </Badge>
                </div>
              </div>

              {/* Contact & Identity Info — 2-column grid */}
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Informations personnelles</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {[
                    { icon: Mail, label: "Email", value: parent.email, colSpan: true },
                    { icon: Phone, label: "Téléphone", value: parent.telephone },
                    { icon: CINIcon, label: "CIN", value: parent.cin || "—" },
                    { icon: Calendar, label: "Date de naissance", value: parent.dateNaissance ? new Date(parent.dateNaissance).toLocaleDateString("fr-FR") : "—" },
                    { icon: Globe, label: "Nationalité", value: parent.nationalite || "—" },
                    { icon: User, label: "Genre", value: parent.genre === "homme" ? "Homme" : parent.genre === "femme" ? "Femme" : "—" },
                    { icon: Heart, label: "Situation", value: parent.situation ? parent.situation.charAt(0).toUpperCase() + parent.situation.slice(1) : "—" },
                    { icon: Briefcase, label: "Profession", value: parent.profession || "—" },
                    { icon: MapPin, label: "Adresse", value: parent.adresse || "—", colSpan: true },
                  ].map(({ icon: Icon, label, value, colSpan }) => (
                    <div key={label} className={colSpan ? "col-span-2" : ""}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground pl-5 break-words">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Stats cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Enfants inscrits</span>
                  </div>
                  <p className="text-3xl font-bold text-primary font-mono">{children.length}</p>
                </div>
                <div className={`rounded-xl border p-5 ${parent.soldeDu > 0
                  ? "border-amber-500/20 bg-amber-500/10"
                  : "border-emerald-500/20 bg-emerald-500/10"
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${parent.soldeDu > 0 ? "bg-amber-500/20" : "bg-emerald-500/20"}`}>
                      <CreditCard className={`h-5 w-5 ${parent.soldeDu > 0 ? "text-amber-400" : "text-emerald-400"}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">Solde dû</span>
                  </div>
                  <p className={`text-2xl font-bold font-mono ${parent.soldeDu > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {parent.soldeDu > 0 ? `${formatAmount(parent.soldeDu)} MAD` : "0 MAD"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">Moyenne enfants</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-400 font-mono">14.8<span className="text-lg text-muted-foreground">/20</span></p>
                </div>
              </div>

              {/* Children section */}
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Enfants inscrits</h3>
                  <Badge className="ml-auto bg-primary/15 text-primary border-primary/25">
                    {children.length} élève{children.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {children.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Aucun enfant associé à ce parent
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {children.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => navigate(`/etudiants/${student.id}`)}
                        className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors group text-left"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {student.prenom[0]}{student.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {student.prenom} {student.nom}
                          </p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {student.classe}
                          </Badge>
                          <Badge className={student.statut === "actif"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/25"
                          }>
                            {student.statut === "actif" ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </button>
                    ))}
                    </div>
                )}
              </div>

              {/* Activity / Notes section */}
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Notes & Historique</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { date: "15/01/2025", text: "Réunion parents-professeurs — présent" },
                    { date: "10/01/2025", text: "Paiement T2 reçu — 15 000 MAD" },
                    { date: "02/01/2025", text: "Bulletin T1 consulté" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
