import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { authService, schoolSettingsService } from "@/services";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get("email")?.trim() ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [schoolName, setSchoolName] = useState("EduManager");
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);

  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);
  const isTokenFlow = !!token;

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const settings = await schoolSettingsService.get();
        if (settings.schoolName?.trim()) {
          setSchoolName(settings.schoolName.trim());
        }
        setSchoolLogo(settings.logoData ?? null);
      } catch {
        // Keep fallback branding if settings are unavailable.
      }
    };

    loadBranding();
  }, []);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }

    setIsRequestLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
      toast.success("Si cet email existe, un lien de réinitialisation a été envoyé.");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || "Impossible d'envoyer l'email de réinitialisation");
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Veuillez saisir un nouveau mot de passe");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("La confirmation du mot de passe ne correspond pas");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      toast.success("Mot de passe réinitialisé avec succès");
      navigate("/login", { replace: true });
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || "Impossible de réinitialiser le mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(217 91% 60% / 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, hsl(280 91% 55% / 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, hsl(200 91% 50% / 0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 30%, hsl(250 91% 65% / 0.35) 0%, transparent 50%)
            `,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-border/40"
          style={{
            background: "var(--glass-bg)",
            boxShadow: `
              0 20px 50px -10px hsl(var(--foreground) / 0.12),
              0 0 80px -20px hsl(var(--primary) / 0.15)
            `,
          }}
        >
          <div className="flex flex-col items-center mb-8">
            {schoolLogo ? (
              <img
                src={schoolLogo}
                alt="Logo établissement"
                className="w-14 h-14 rounded-xl object-cover mb-4 border border-primary/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{schoolName}</h1>
            <p className="text-muted-foreground text-sm mt-2">
              {isTokenFlow ? "Définir un nouveau mot de passe" : "Récupération du mot de passe"}
            </p>
          </div>

          {!isTokenFlow ? (
            <form className="space-y-5" onSubmit={handleSendLink}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@edumanager.ma"
                    className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 mt-6"
                type="submit"
                disabled={isRequestLoading}
                style={{ boxShadow: "0 0 20px -5px hsl(217 91% 60% / 0.4)" }}
              >
                {isRequestLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Envoyer le lien"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Après l&apos;envoi, vérifiez votre boîte mail (et les spams).
              </p>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-foreground/80">
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground/80">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 mt-6"
                type="submit"
                disabled={isLoading}
                style={{ boxShadow: "0 0 20px -5px hsl(217 91% 60% / 0.4)" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Retour à la connexion
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground/60">
              Système réservé aux utilisateurs autorisés uniquement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
