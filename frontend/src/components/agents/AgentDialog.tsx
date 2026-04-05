import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "./types";

// ── Permission modules (structure ready — admin fills details later) ───────────

export const PERMISSION_MODULES = [
  { id: "students",        label: "Étudiants",          description: "Consulter et gérer les dossiers élèves" },
  { id: "parents",         label: "Parents & Tuteurs",   description: "Accès aux fiches parents" },
  { id: "presences",       label: "Présences",           description: "Saisie et consultation des présences" },
  { id: "notes",           label: "Notes & Bulletins",   description: "Saisie des notes et génération de bulletins" },
  { id: "finances",        label: "Finances",            description: "Gestion des tarifs et paiements" },
  { id: "emploi_du_temps", label: "Emploi du temps",     description: "Création et modification des plannings" },
  { id: "professeurs",     label: "Professeurs",         description: "Gestion des fiches professeurs" },
  { id: "parametres",      label: "Paramètres",          description: "Configuration du système" },
];

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: Agent | null;
  onSave: (data: Omit<Agent, "id" | "createdAt">) => void;
}

export function AgentDialog({ open, onOpenChange, agent, onSave }: AgentDialogProps) {
  const isEdit = !!agent;

  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [active,      setActive]      = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (agent) {
        setName(agent.name);
        setEmail(agent.email);
        setPhone(agent.phone ?? "");
        setPassword("");
        setActive(agent.status === "active");
        setPermissions(agent.permissions);
      } else {
        setName(""); setEmail(""); setPhone(""); setPassword(""); setActive(true); setPermissions([]);
      }
      setShowPwd(false);
    }
  }, [open, agent]);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setPermissions((prev) =>
      prev.length === PERMISSION_MODULES.length ? [] : PERMISSION_MODULES.map((m) => m.id)
    );
  };

  const canSubmit = name.trim() && email.trim() && (isEdit || password.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      name:        name.trim(),
      email:       email.trim(),
      phone:       phone.trim() || undefined,
      password:    password.trim() || undefined,
      status:      active ? "active" : "inactive",
      permissions,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'agent" : "Nouvel agent"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* ── Identity ── */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Informations personnelles
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Nom complet <span className="text-red-400">*</span></Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah El Mansouri"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email <span className="text-red-400">*</span></Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@edumanager.ma"
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Téléphone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label>
                {isEdit ? "Nouveau mot de passe" : "Mot de passe"}{" "}
                {!isEdit && <span className="text-red-400">*</span>}
                {isEdit && <span className="text-xs text-muted-foreground ml-1">(laisser vide pour ne pas modifier)</span>}
              </Label>
              <div className="relative">
                <Input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary/50 border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Status toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Compte actif</p>
                <p className="text-xs text-muted-foreground">L'agent peut se connecter au système</p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* ── Permissions ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Autorisations d'accès
              </p>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-primary hover:underline"
              >
                {permissions.length === PERMISSION_MODULES.length ? "Tout décocher" : "Tout cocher"}
              </button>
            </div>

            <div className="space-y-2">
              {PERMISSION_MODULES.map((mod) => {
                const checked = permissions.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => togglePermission(mod.id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all",
                      checked
                        ? "border-primary/40 bg-primary/8 text-foreground"
                        : "border-border/40 text-muted-foreground hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <p className={cn("text-sm font-medium", checked && "text-foreground")}>{mod.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                    </div>
                    <div className={cn(
                      "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                      checked ? "bg-primary border-primary" : "border-border"
                    )}>
                      {checked && (
                        <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isEdit ? "Enregistrer" : "Créer l'agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
