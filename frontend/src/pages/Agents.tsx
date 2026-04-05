import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, MoreHorizontal, Pencil, Trash2,
  ShieldCheck, ShieldOff, Search, UserCog, Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AgentDialog, PERMISSION_MODULES } from "@/components/agents/AgentDialog";
import type { Agent } from "@/components/agents/types";
import { agentService } from "@/services";
import type { AgentDTO, AgentRequest } from "@/types/api.types";

const toUiAgent = (agent: AgentDTO): Agent => ({
  id: agent.id,
  name: agent.name,
  email: agent.email,
  phone: agent.phone || "",
  status: agent.status === "ACTIVE" ? "active" : "inactive",
  permissions: agent.permissions || [],
  createdAt: agent.createdAt || new Date().toISOString(),
});

const toAgentRequest = (data: Omit<Agent, "id" | "createdAt">): AgentRequest => ({
  name: data.name,
  email: data.email,
  phone: data.phone || "",
  password: data.password,
  status: data.status === "active" ? "ACTIVE" : "INACTIVE",
  permissions: data.permissions || [],
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function avatarColor(name: string) {
  const colors = [
    "bg-indigo-500/20 text-indigo-400",
    "bg-emerald-500/20 text-emerald-400",
    "bg-amber-500/20 text-amber-400",
    "bg-rose-500/20 text-rose-400",
    "bg-cyan-500/20 text-cyan-400",
    "bg-violet-500/20 text-violet-400",
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Agents() {
  const navigate = useNavigate();
  const [agents, setAgents]             = useState<Agent[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [search, setSearch]             = useState("");
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deletingId, setDeletingId]     = useState<number | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const response = await agentService.getAll();
        setAgents(response.map(toUiAgent));
      } catch (error) {
        toast.error("Impossible de charger les utilisateurs");
      } finally {
        setIsLoading(false);
      }
    };
    loadAgents();
  }, []);

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = agents.filter((a) => a.status === "active").length;
  const inactiveCount = agents.filter((a) => a.status === "inactive").length;

  // ── Handlers ──

  const handleSave = async (data: Omit<Agent, "id" | "createdAt">) => {
    try {
      const payload = toAgentRequest(data);
      if (editingAgent) {
        const updated = await agentService.update(editingAgent.id, payload);
        setAgents((prev) => prev.map((a) => (a.id === editingAgent.id ? toUiAgent(updated) : a)));
        toast.success("Utilisateur modifié avec succès");
      } else {
        const created = await agentService.create(payload);
        setAgents((prev) => [...prev, toUiAgent(created)]);
        toast.success(`Compte utilisateur créé pour ${data.name}`);
      }
      setEditingAgent(null);
    } catch (error) {
      toast.error("Échec de l'enregistrement de l'utilisateur");
    }
  };

  const handleToggleStatus = async (agent: Agent) => {
    const next = agent.status === "active" ? "inactive" : "active";
    try {
      const payload: AgentRequest = {
        name: agent.name,
        email: agent.email,
        phone: agent.phone || "",
        status: next === "active" ? "ACTIVE" : "INACTIVE",
        permissions: agent.permissions,
      };
      const updated = await agentService.update(agent.id, payload);
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? toUiAgent(updated) : a)));
      toast.success(next === "active" ? `${agent.name} réactivé` : `${agent.name} désactivé`);
    } catch (error) {
      toast.error("Impossible de mettre à jour le statut");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const agent = agents.find((a) => a.id === id);
      await agentService.delete(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
      toast.success(`Utilisateur ${agent?.name} supprimé`);
      setDeletingId(null);
    } catch (error) {
      toast.error("Impossible de supprimer l'utilisateur");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les comptes et autorisations des utilisateurs administratifs
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => { setEditingAgent(null); setDialogOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total utilisateurs", value: agents.length,  color: "text-foreground",   icon: UserCog     },
            { label: "Actifs",         value: activeCount,    color: "text-emerald-400",  icon: ShieldCheck },
            { label: "Inactifs",       value: inactiveCount,  color: "text-slate-400",    icon: ShieldOff   },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-2xl font-bold font-mono mt-0.5 ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + table */}
        <div className="space-y-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un utilisateur…"
              className="pl-9 bg-secondary/50 border-border"
            />
          </div>

          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Utilisateur</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-muted-foreground">Autorisations</TableHead>
                  <TableHead className="text-muted-foreground">Statut</TableHead>
                  <TableHead className="text-muted-foreground">Créé le</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                      Chargement des utilisateurs...
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((agent) => {
                  const perms = PERMISSION_MODULES.filter((m) =>
                    agent.permissions.includes(m.id)
                  );
                  const visiblePerms = perms.slice(0, 3);
                  const extra = perms.length - visiblePerms.length;

                  return (
                    <TableRow key={agent.id} className="border-border/50 hover:bg-muted/50 transition-colors">
                      {/* Agent */}
                      <TableCell>
                        <button
                          onClick={() => navigate(`/agents/${agent.id}`)}
                          className="flex items-center gap-3 text-left group"
                        >
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(agent.name)}`}>
                            {initials(agent.name)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {agent.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{agent.email}</p>
                          </div>
                        </button>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="text-sm text-muted-foreground">
                        {agent.phone ?? "—"}
                      </TableCell>

                      {/* Permissions */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {perms.length === 0 && (
                            <span className="text-xs text-muted-foreground">Aucune</span>
                          )}
                          {visiblePerms.map((p) => (
                            <Badge
                              key={p.id}
                              variant="outline"
                              className="text-xs border-primary/30 text-primary/80 bg-primary/5 py-0"
                            >
                              {p.label}
                            </Badge>
                          ))}
                          {extra > 0 && (
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground py-0">
                              +{extra}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {agent.status === "active" ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Actif
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 border gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Inactif
                          </Badge>
                        )}
                      </TableCell>

                      {/* Created */}
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(agent.createdAt).toLocaleDateString("fr-FR")}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-muted gap-2"
                              onClick={() => navigate(`/agents/${agent.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-muted gap-2"
                              onClick={() => { setEditingAgent(agent); setDialogOpen(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-muted gap-2"
                              onClick={() => handleToggleStatus(agent)}
                            >
                              {agent.status === "active" ? (
                                <><ShieldOff className="h-4 w-4" />Désactiver</>
                              ) : (
                                <><ShieldCheck className="h-4 w-4" />Réactiver</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-muted gap-2 text-red-400 focus:text-red-400"
                              onClick={() => setDeletingId(agent.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create / Edit dialog */}
      <AgentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agent={editingAgent}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deletingId !== null} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet agent ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte sera définitivement supprimé. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
