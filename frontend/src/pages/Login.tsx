import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authService.login({
        email: email.trim(),
        password,
      });

      authService.saveUser(user);
      toast.success(`Ravi de vous revoir, ${user.name}.`);
      navigate("/");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || "Email ou mot de passe invalide");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Abstract mesh gradient background */}
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
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glass card container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-border/40"
          style={{
            background: 'var(--glass-bg)',
            boxShadow: `
              0 20px 50px -10px hsl(var(--foreground) / 0.12),
              0 0 80px -20px hsl(var(--primary) / 0.15)
            `,
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">EduManager</h1>
            <p className="text-muted-foreground text-sm mt-2">Connexion Administrateur</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@edumanager.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 mt-6"
              style={{
                boxShadow: '0 0 20px -5px hsl(217 91% 60% / 0.4)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Forgot password link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Invite only notice */}
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

export default Login;
