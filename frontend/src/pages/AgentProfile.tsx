import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldOff,
  Pencil,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Key,
} from "lucide-react";
import { AgentDialog, PERMISSION_MODULES } from "@/components/agents/AgentDialog";
import type { Agent } from "@/components/agents/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { agentService } from "@/services";
import type { AgentRequest } from "@/types/api.types";

const toUiAgent = (agent: {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  permissions: string[];
  createdAt: string;
}): Agent => ({
  id: agent.id,
  name: agent.name,
  email: agent.email,
  phone: agent.phone || "",
  status: agent.status === "ACTIVE" ? "active" : "inactive",
  permissions: agent.permissions || [],
  createdAt: agent.createdAt || new Date().toISOString(),
});

const mockActivity = [
  { date: "30/03/2025", text: "Connexion depuis 192.168.1.45" },
  { date: "29/03/2025", text: "Modification du dossier élève #1042" },
  { date: "28/03/2025", text: "Saisie de présences — Classe 3ème A" },
  { date: "27/03/2025", text: "Connexion depuis 192.168.1.45" },
  { date: "25/03/2025", text: "Exportation du bulletin T2" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const agentId = Number(id);

  useEffect(() => {
    const loadAgent = async () => {
      if (!Number.isFinite(agentId)) {
        toast.error("Identifiant utilisateur invalide");
        navigate("/agents");
        return;
      }

      try {
        setIsLoading(true);
        const response = await agentService.getById(agentId);
        setAgent(toUiAgent(response));
      } catch {
        toast.error("Impossible de charger le profil utilisateur");
        navigate("/agents");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [agentId, navigate]);

  const handleSave = async (data: Omit<Agent, "id" | "createdAt">) => {
    if (!agent) return;
    try {
      const payload: AgentRequest = {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        status: data.status === "active" ? "ACTIVE" : "INACTIVE",
        role: "AGENT",
        permissions: data.permissions || [],
        password: data.password || undefined,
      };

      const updated = await agentService.update(agent.id, payload);
      setAgent(toUiAgent(updated));
      toast.success("Agent modifié avec succès");
    } catch {
      toast.error("Impossible de modifier l'utilisateur");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-sm text-muted-foreground">Chargement du profil utilisateur...</div>
      </DashboardLayout>
    );
  }

  if (!agent) {
    return null;
  }

  const enabledPerms = PERMISSION_MODULES.filter((m) => agent.permissions.includes(m.id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate("/agents")}
          className="text-muted-foreground hover:text-foreground gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux agents
        </Button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left sidebar ── */}
          <div className="lg:w-80 space-y-4">
            {/* Identity card */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={cn(
                    "h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold",
                    avatarColor(agent.name)
                  )}
                >
                  {initials(agent.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{agent.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Agent administratif</p>
                </div>
                {agent.status === "active" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 border gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Actif
                  </Badge>
                ) : (
                  <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 border gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    Inactif
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Informations du compte</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground break-all">{agent.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium text-foreground">{agent.phone ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Membre depuis</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(agent.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Key className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Autorisations</p>
                    <p className="text-sm font-medium text-foreground">
                      {enabledPerms.length} / {PERMISSION_MODULES.length} modules
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full gap-2 mt-2"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                Modifier le compte
              </Button>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="flex-1 space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Modules actifs</span>
                </div>
                <p className="text-3xl font-bold text-primary font-mono">{enabledPerms.length}</p>
              </div>

              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Dernière connexion</span>
                </div>
                <p className="text-base font-semibold text-foreground">30/03/2025</p>
                <p className="text-xs text-muted-foreground">14:32</p>
              </div>

              <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Actions ce mois</span>
                </div>
                <p className="text-3xl font-bold text-amber-500 font-mono">47</p>
              </div>
            </div>

            {/* Permissions grid */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Autorisations d'accès</h3>
                <Badge className="ml-auto bg-primary/15 text-primary border-primary/25">
                  {enabledPerms.length} / {PERMISSION_MODULES.length}
                </Badge>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERMISSION_MODULES.map((mod) => {
                  const enabled = agent.permissions.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                        enabled
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/40 bg-card/30 opacity-60"
                      )}
                    >
                      <div className={cn(
                        "shrink-0",
                        enabled ? "text-primary" : "text-muted-foreground"
                      )}>
                        {enabled
                          ? <CheckCircle2 className="h-4 w-4" />
                          : <XCircle className="h-4 w-4" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium",
                          enabled ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {mod.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
                      </div>
                      {enabled ? (
                        <Badge className="shrink-0 bg-primary/15 text-primary border-primary/25 text-xs">
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 text-muted-foreground border-border text-xs">
                          Inactif
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity log */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5">
              <div className="flex items-center gap-3 mb-5">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Activité récente</h3>
              </div>
              <div className="space-y-3">
                {mockActivity.map((item, idx) => (
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

            {/* Danger zone */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="font-semibold text-foreground mb-1">Zone dangereuse</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ces actions sont irréversibles. Agissez avec prudence.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-amber-500/40 text-amber-500 hover:bg-amber-500/10 gap-2"
                  onClick={() => {
                    const next = agent.status === "active" ? "inactive" : "active";
                    setAgent((prev) => ({ ...prev, status: next }));
                    toast.success(next === "active" ? `${agent.name} réactivé` : `${agent.name} désactivé`);
                  }}
                >
                  {agent.status === "active" ? (
                    <><ShieldOff className="h-4 w-4" />Désactiver le compte</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" />Réactiver le compte</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500/40 text-red-500 hover:bg-red-500/10 gap-2"
                  onClick={() => navigate("/agents")}
                >
                  Supprimer le compte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <AgentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        agent={agent}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
}
