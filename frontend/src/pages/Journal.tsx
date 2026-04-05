import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Search,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Eye,
  Filter,
  X,
  ClipboardList,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActionType = "create" | "edit" | "delete" | "view" | "login" | "logout";

interface AuditEntry {
  id: number;
  agentName: string;
  agentId: number;
  action: ActionType;
  module: string;
  description: string;
  target?: string;
  timestamp: string; // ISO
  ip?: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockLogs: AuditEntry[] = [
  { id: 1,  agentId: 1, agentName: "Sarah El Mansouri", action: "login",  module: "Système",        description: "Connexion au système",                               ip: "192.168.1.45", timestamp: "2025-03-31T08:02:00" },
  { id: 2,  agentId: 1, agentName: "Sarah El Mansouri", action: "view",   module: "Étudiants",      description: "Consultation du dossier élève",                      target: "Sophie Martin (#1)",     timestamp: "2025-03-31T08:05:12" },
  { id: 3,  agentId: 1, agentName: "Sarah El Mansouri", action: "edit",   module: "Présences",      description: "Saisie des présences",                               target: "Classe 3ème A — 31/03/2025", timestamp: "2025-03-31T08:22:40" },
  { id: 4,  agentId: 2, agentName: "Karim Benali",      action: "login",  module: "Système",        description: "Connexion au système",                               ip: "192.168.1.12", timestamp: "2025-03-31T08:30:00" },
  { id: 5,  agentId: 2, agentName: "Karim Benali",      action: "create", module: "Étudiants",      description: "Ajout d'un nouvel étudiant",                         target: "Youssef Amrani",        timestamp: "2025-03-31T08:45:19" },
  { id: 6,  agentId: 1, agentName: "Sarah El Mansouri", action: "edit",   module: "Notes",          description: "Modification d'une note",                            target: "Lucas Bernard — Maths", timestamp: "2025-03-31T09:10:05" },
  { id: 7,  agentId: 2, agentName: "Karim Benali",      action: "view",   module: "Emploi du temps",description: "Consultation de l'emploi du temps",                   target: "2BAC-A",                timestamp: "2025-03-31T09:25:00" },
  { id: 8,  agentId: 1, agentName: "Sarah El Mansouri", action: "delete", module: "Étudiants",      description: "Suppression d'un dossier élève",                     target: "Mohammed El Fassi",     timestamp: "2025-03-31T10:00:33" },
  { id: 9,  agentId: 2, agentName: "Karim Benali",      action: "edit",   module: "Parents",        description: "Mise à jour des informations parent",                target: "El Amrani Mohammed",    timestamp: "2025-03-31T10:15:22" },
  { id: 10, agentId: 1, agentName: "Sarah El Mansouri", action: "create", module: "Notes",          description: "Création d'une évaluation",                          target: "Contrôle Physique — 5ème B", timestamp: "2025-03-31T10:40:00" },
  { id: 11, agentId: 3, agentName: "Amina Tazi",        action: "login",  module: "Système",        description: "Connexion au système",                               ip: "192.168.1.78", timestamp: "2025-03-31T11:00:00" },
  { id: 12, agentId: 3, agentName: "Amina Tazi",        action: "view",   module: "Finances",       description: "Consultation des tarifs",                            timestamp: "2025-03-31T11:03:15" },
  { id: 13, agentId: 3, agentName: "Amina Tazi",        action: "edit",   module: "Finances",       description: "Modification d'un tarif",                            target: "Frais de scolarité T3", timestamp: "2025-03-31T11:20:44" },
  { id: 14, agentId: 2, agentName: "Karim Benali",      action: "edit",   module: "Présences",      description: "Correction d'une absence",                           target: "Emma Dubois — 30/03",   timestamp: "2025-03-31T11:35:00" },
  { id: 15, agentId: 1, agentName: "Sarah El Mansouri", action: "logout", module: "Système",        description: "Déconnexion du système",                             ip: "192.168.1.45", timestamp: "2025-03-31T12:00:00" },
  { id: 16, agentId: 3, agentName: "Amina Tazi",        action: "create", module: "Finances",       description: "Création d'un paiement",                            target: "Thomas Petit — 15 000 MAD", timestamp: "2025-03-31T12:10:30" },
  { id: 17, agentId: 2, agentName: "Karim Benali",      action: "delete", module: "Emploi du temps",description: "Suppression d'un créneau horaire",                   target: "2BAC-B — Lundi 10h",    timestamp: "2025-03-31T13:05:00" },
  { id: 18, agentId: 1, agentName: "Sarah El Mansouri", action: "login",  module: "Système",        description: "Reconnexion au système",                             ip: "192.168.1.45", timestamp: "2025-03-31T14:00:00" },
  { id: 19, agentId: 1, agentName: "Sarah El Mansouri", action: "edit",   module: "Étudiants",      description: "Mise à jour du profil élève",                        target: "Sophie Martin (#1)",    timestamp: "2025-03-31T14:22:18" },
  { id: 20, agentId: 3, agentName: "Amina Tazi",        action: "logout", module: "Système",        description: "Déconnexion du système",                             ip: "192.168.1.78", timestamp: "2025-03-31T14:30:00" },
  { id: 21, agentId: 2, agentName: "Karim Benali",      action: "create", module: "Parents",        description: "Ajout d'un nouveau parent",                          target: "Rachid Ouhabi",         timestamp: "2025-03-31T15:00:00" },
  { id: 22, agentId: 1, agentName: "Sarah El Mansouri", action: "view",   module: "Notes",          description: "Consultation du bulletin",                           target: "T2 2024-2025",          timestamp: "2025-03-31T15:30:00" },
  { id: 23, agentId: 2, agentName: "Karim Benali",      action: "logout", module: "Système",        description: "Déconnexion du système",                             ip: "192.168.1.12", timestamp: "2025-03-31T16:00:00" },
  { id: 24, agentId: 1, agentName: "Sarah El Mansouri", action: "edit",   module: "Présences",      description: "Saisie des présences",                               target: "Classe 6ème A — 31/03/2025", timestamp: "2025-03-31T16:15:00" },
  { id: 25, agentId: 1, agentName: "Sarah El Mansouri", action: "logout", module: "Système",        description: "Déconnexion du système",                             ip: "192.168.1.45", timestamp: "2025-03-31T17:00:00" },
];

// ── Config ────────────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<ActionType, {
  label: string;
  icon: React.ElementType;
  badge: string;
  dot: string;
}> = {
  create: { label: "Création",      icon: Plus,    badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/25", dot: "bg-emerald-500" },
  edit:   { label: "Modification",  icon: Pencil,  badge: "bg-blue-500/15 text-blue-500 border-blue-500/25",         dot: "bg-blue-500"   },
  delete: { label: "Suppression",   icon: Trash2,  badge: "bg-red-500/15 text-red-500 border-red-500/25",            dot: "bg-red-500"    },
  view:   { label: "Consultation",  icon: Eye,     badge: "bg-slate-500/15 text-slate-400 border-slate-500/25",      dot: "bg-slate-400"  },
  login:  { label: "Connexion",     icon: LogIn,   badge: "bg-primary/15 text-primary border-primary/25",            dot: "bg-primary"    },
  logout: { label: "Déconnexion",   icon: LogOut,  badge: "bg-amber-500/15 text-amber-500 border-amber-500/25",      dot: "bg-amber-500"  },
};

const MODULE_COLORS: Record<string, string> = {
  "Système":          "bg-slate-500/10 text-slate-400 border-slate-500/20",
  "Étudiants":        "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Parents":          "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Présences":        "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Notes":            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Finances":         "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Emploi du temps":  "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Professeurs":      "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

function avatarColor(name: string) {
  const colors = [
    "bg-indigo-500/20 text-indigo-500",
    "bg-emerald-500/20 text-emerald-500",
    "bg-amber-500/20 text-amber-500",
    "bg-rose-500/20 text-rose-500",
    "bg-cyan-500/20 text-cyan-500",
    "bg-violet-500/20 text-violet-500",
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Journal() {
  const [search,        setSearch]        = useState("");
  const [filterAction,  setFilterAction]  = useState<string>("all");
  const [filterModule,  setFilterModule]  = useState<string>("all");
  const [filterAgent,   setFilterAgent]   = useState<string>("all");

  const allModules = [...new Set(mockLogs.map((l) => l.module))].sort();
  const allAgents  = [...new Set(mockLogs.map((l) => l.agentName))].sort();

  const filtered = useMemo(() => {
    return mockLogs
      .filter((log) => {
        if (filterAction !== "all" && log.action !== filterAction) return false;
        if (filterModule !== "all" && log.module !== filterModule)  return false;
        if (filterAgent  !== "all" && log.agentName !== filterAgent) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            log.description.toLowerCase().includes(q) ||
            log.agentName.toLowerCase().includes(q)   ||
            (log.target ?? "").toLowerCase().includes(q) ||
            log.module.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [search, filterAction, filterModule, filterAgent]);

  const hasFilters = filterAction !== "all" || filterModule !== "all" || filterAgent !== "all" || search;

  const clearFilters = () => {
    setSearch("");
    setFilterAction("all");
    setFilterModule("all");
    setFilterAgent("all");
  };

  // KPIs
  const todayStr   = "2025-03-31";
  const todayLogs  = mockLogs.filter((l) => l.timestamp.startsWith(todayStr));
  const activeAgents = new Set(todayLogs.map((l) => l.agentId)).size;
  const topModule  = Object.entries(
    mockLogs.reduce<Record<string, number>>((acc, l) => {
      if (l.module !== "Système") acc[l.module] = (acc[l.module] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, AuditEntry[]>();
    for (const log of filtered) {
      const day = log.timestamp.split("T")[0];
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(log);
    }
    return map;
  }, [filtered]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Journal d'activité</h1>
          <p className="text-sm text-muted-foreground">
            Historique complet de toutes les actions effectuées dans le système
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Actions aujourd'hui</span>
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{todayLogs.length}</p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">Utilisateurs actifs</span>
            </div>
            <p className="text-3xl font-bold text-emerald-500 font-mono">{activeAgents}</p>
          </div>

          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-sm text-muted-foreground">Module le plus actif</span>
            </div>
            <p className="text-lg font-bold text-amber-500 truncate">{topModule}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une action…"
              className="pl-9 bg-secondary/50 border-border"
            />
          </div>

          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-44 bg-secondary/50 border-border">
              <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              <SelectValue placeholder="Type d'action" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Toutes les actions</SelectItem>
              {(Object.keys(ACTION_CONFIG) as ActionType[]).map((a) => (
                <SelectItem key={a} value={a}>{ACTION_CONFIG[a].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-44 bg-secondary/50 border-border">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Tous les modules</SelectItem>
              {allModules.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger className="w-48 bg-secondary/50 border-border">
              <SelectValue placeholder="Utilisateur" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              {allAgents.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}

          <span className="ml-auto text-sm text-muted-foreground">
            {filtered.length} entrée{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Log timeline */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/50 p-12 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune action trouvée</p>
          </div>
        ) : (
          <div className="space-y-6">
            {[...grouped.entries()].map(([day, entries]) => (
              <div key={day}>
                {/* Day separator */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs font-medium text-muted-foreground px-2">
                    {formatDate(day)}
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                {/* Entries for this day */}
                <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden divide-y divide-border/40">
                  {entries.map((log) => {
                    const cfg = ACTION_CONFIG[log.action];
                    const Icon = cfg.icon;
                    const moduleColor = MODULE_COLORS[log.module] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";

                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                      >
                        {/* Agent avatar */}
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5",
                          avatarColor(log.agentName)
                        )}>
                          {initials(log.agentName)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm text-foreground">
                              {log.agentName}
                            </span>
                            <Badge className={cn("text-xs border py-0 gap-1", cfg.badge)}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                              {cfg.label}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs border py-0", moduleColor)}>
                              {log.module}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/80">{log.description}</p>
                          {log.target && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              → {log.target}
                            </p>
                          )}
                          {log.ip && (
                            <p className="text-xs text-muted-foreground/60 mt-0.5">
                              IP : {log.ip}
                            </p>
                          )}
                        </div>

                        {/* Action icon + time */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center",
                            log.action === "create" && "bg-emerald-500/10",
                            log.action === "edit"   && "bg-blue-500/10",
                            log.action === "delete" && "bg-red-500/10",
                            log.action === "view"   && "bg-slate-500/10",
                            log.action === "login"  && "bg-primary/10",
                            log.action === "logout" && "bg-amber-500/10",
                          )}>
                            <Icon className={cn(
                              "h-3.5 w-3.5",
                              log.action === "create" && "text-emerald-500",
                              log.action === "edit"   && "text-blue-500",
                              log.action === "delete" && "text-red-500",
                              log.action === "view"   && "text-slate-400",
                              log.action === "login"  && "text-primary",
                              log.action === "logout" && "text-amber-500",
                            )} />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">
                            {formatTime(log.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
