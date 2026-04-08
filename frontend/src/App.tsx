import { HashRouter, BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UpdateBanner } from "@/components/UpdateBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeadBranding } from "@/components/branding/HeadBranding";
import { Toaster } from "@/components/ui/sonner";
import { authService } from "@/services";

import Index from "@/pages/Index";
import Etudiants from "@/pages/Etudiants";
import Finances from "@/pages/Finances";
import Professeurs from "@/pages/Professeurs";
import Parametres from "@/pages/Parametres";
import Parents from "@/pages/Parents";
import EmploiDuTemps from "@/pages/EmploiDuTemps";
import Agents from "@/pages/Agents";
import AgentProfile from "@/pages/AgentProfile";
import Journal from "@/pages/Journal";
import Presences from "@/pages/Presences";
import Notes from "@/pages/Notes";
import Login from "@/pages/Login";
import StudentProfile from "@/pages/StudentProfile";
import ParentProfile from "@/pages/ParentProfile";
import ResetPassword from "@/pages/ResetPassword";

const isElectron = navigator.userAgent.toLowerCase().includes("electron");
const Router = isElectron ? HashRouter : BrowserRouter;

function AppContent() {
  const location = useLocation();
  const isUnauthorizedPage = location.pathname === "/unauthorized";
  const isPublicPage = location.pathname === "/login" || location.pathname === "/reset-password" || isUnauthorizedPage;
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && isPublicPage) {
    return <Navigate to={isAdmin ? "/" : "/unauthorized"} replace />;
  }

  if (isAuthenticated && !isPublicPage && !isAdmin) {
    if (location.pathname !== "/unauthorized") {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <div className="flex bg-background min-h-screen font-sans">
      <HeadBranding />
      {!isPublicPage && <UpdateBanner />}

      {!isPublicPage && <AppSidebar />}

      <main className={`flex-1 transition-all duration-300 ${isPublicPage ? "" : "ml-64"}`}>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/unauthorized"
              element={
                <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
                  <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center space-y-4">
                    <h1 className="text-2xl font-bold text-foreground">Accès refusé</h1>
                    <p className="text-sm text-muted-foreground">
                      Votre compte n&apos;a pas l&apos;autorisation d&apos;accéder à l&apos;interface administrateur.
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await authService.logoutRemote();
                        } catch {
                          // local logout still required even if remote logging fails
                        } finally {
                          authService.logout();
                          window.location.href = isElectron ? "#/login" : "/login";
                        }
                      }}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </div>
              }
            />
            <Route path="/" element={<Index />} />
            <Route path="/etudiants" element={<Etudiants />} />
            <Route path="/etudiants/:id" element={<StudentProfile />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/parents/:id" element={<ParentProfile />} />
            <Route path="/emploi-du-temps" element={<EmploiDuTemps />} />
            <Route path="/presences" element={<Presences />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/professeurs" element={<Professeurs />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:id" element={<AgentProfile />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? (isAdmin ? "/" : "/unauthorized") : "/login"} replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
