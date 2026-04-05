import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Bell,
  CreditCard,
  Save,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TabId = "general" | "personnel" | "notifications" | "payments";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: "general", label: "Général", icon: Building2 },
  { id: "personnel", label: "Personnel", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Paiements", icon: CreditCard },
];

export default function Parametres() {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  // General settings state
  const [schoolName, setSchoolName] = useState("Lycée Mohammed V");
  const [address, setAddress] = useState("123 Avenue Hassan II, Casablanca, Maroc");
  const [phone, setPhone] = useState("+212 5 22 12 34 56");
  const [email, setEmail] = useState("contact@lyceemv.ma");
  const [adminName, setAdminName] = useState("Admin Principal");
  const [adminEmail, setAdminEmail] = useState("admin@lyceemv.ma");
  const [adminPhone, setAdminPhone] = useState("+212 6 00 00 00 00");
  const adminRole = "Administrateur";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [absenceAlerts, setAbsenceAlerts] = useState(true);

  // System info
  const [version, setVersion] = useState("Unknown");

  useEffect(() => {
    if (window.require) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.invoke("get-version").then(setVersion);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground">
            Configurez les paramètres de votre établissement
          </p>
        </div>

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              {/* General Tab */}
              {activeTab === "general" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Informations Générales
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Informations de base de votre établissement
                    </p>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Logo de l'établissement</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-lg border border-dashed border-border bg-secondary/50 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button variant="outline" className="border-border bg-secondary/50 hover:bg-secondary">
                        <Upload className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="schoolName" className="text-muted-foreground">
                        Nom de l'établissement
                      </Label>
                      <Input
                        id="schoolName"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-muted-foreground">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-muted-foreground">
                      Adresse
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-secondary/50 border-border focus:border-primary resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Version Section */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-2">Informations système</h3>
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Version de l'application</p>
                        <p className="text-sm text-muted-foreground">
                          Version installée actuellement
                        </p>
                      </div>
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-mono">
                        v{version}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Personnel Tab */}
              {activeTab === "personnel" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Informations administrateur
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Coordonnées du compte administrateur principal
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{adminName}</p>
                        <p className="text-sm text-muted-foreground">{adminRole}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="adminName" className="text-muted-foreground">
                        Nom complet
                      </Label>
                      <Input
                        id="adminName"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminRole" className="text-muted-foreground">
                        Rôle
                      </Label>
                      <Input
                        id="adminRole"
                        value={adminRole}
                        readOnly
                        disabled
                        className="bg-secondary/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail" className="text-muted-foreground">
                        Email administrateur
                      </Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPhone" className="text-muted-foreground">
                        Téléphone administrateur
                      </Label>
                      <Input
                        id="adminPhone"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">
                        Compte administrateur
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mettre à jour l'email et le mot de passe du compte admin
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="adminAccountEmail" className="text-muted-foreground">
                          Email de connexion
                        </Label>
                        <Input
                          id="adminAccountEmail"
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-muted-foreground">
                          Mot de passe actuel
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-muted-foreground">
                          Nouveau mot de passe
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="confirmPassword" className="text-muted-foreground">
                          Confirmer le nouveau mot de passe
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Préférences de Notifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Configurez comment vous recevez les alertes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Notifications par Email</p>
                        <p className="text-sm text-muted-foreground">
                          Recevez des mises à jour par email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Notifications SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Recevez des alertes urgentes par SMS
                        </p>
                      </div>
                      <Switch
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Rappels de Paiement</p>
                        <p className="text-sm text-muted-foreground">
                          Alertes pour les paiements en attente
                        </p>
                      </div>
                      <Switch
                        checked={paymentReminders}
                        onCheckedChange={setPaymentReminders}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Alertes d'Absence</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications pour les absences des élèves
                        </p>
                      </div>
                      <Switch
                        checked={absenceAlerts}
                        onCheckedChange={setAbsenceAlerts}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Configuration des Paiements
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Gérez vos informations bancaires et de paiement
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-[#635BFF]/20 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-[#635BFF]" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Stripe</p>
                          <p className="text-xs text-emerald-400">Connecté</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Acceptez les paiements par carte bancaire
                      </p>
                      <Button variant="outline" size="sm" className="border-border bg-secondary/50 hover:bg-secondary">
                        Configurer
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-muted-foreground">
                          Nom de la Banque
                        </Label>
                        <Input
                          id="bankName"
                          defaultValue="Attijariwafa Bank"
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rib" className="text-muted-foreground">
                          RIB
                        </Label>
                        <Input
                          id="rib"
                          defaultValue="007 810 0001234567890123 45"
                          className="bg-secondary/50 border-border focus:border-primary font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountHolder" className="text-muted-foreground">
                        Titulaire du Compte
                      </Label>
                      <Input
                        id="accountHolder"
                        defaultValue="Lycée Mohammed V - Casablanca"
                        className="bg-secondary/50 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sticky Save Button */}
              <div className="sticky bottom-0 border-t border-border/50 bg-card/95 backdrop-blur-sm p-4">
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
