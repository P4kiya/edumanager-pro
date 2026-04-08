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
  const isPublicPage = location.pathname === "/login" || location.pathname === "/reset-password";
  const isAuthenticated = authService.isAuthenticated();
  const defaultPrivateRoute = authService.getDefaultRoute();
  const allowedRoutesByPermission: Array<{ permission: string; match: (pathname: string) => boolean }> = [
    { permission: "students", match: (pathname) => pathname === "/etudiants" || pathname.startsWith("/etudiants/") },
    { permission: "parents", match: (pathname) => pathname === "/parents" || pathname.startsWith("/parents/") },
    { permission: "presences", match: (pathname) => pathname === "/presences" },
    { permission: "notes", match: (pathname) => pathname === "/notes" },
    { permission: "finances", match: (pathname) => pathname === "/finances" },
    { permission: "emploi_du_temps", match: (pathname) => pathname === "/emploi-du-temps" },
    { permission: "professeurs", match: (pathname) => pathname === "/professeurs" },
    { permission: "__admin_only__", match: (pathname) => pathname === "/" || pathname === "/agents" || pathname.startsWith("/agents/") || pathname === "/journal" || pathname === "/parametres" },
  ];
  const hasRoutePermission = allowedRoutesByPermission.some(
    ({ permission, match }) => {
      if (!match(location.pathname)) return false;
      if (permission === "__admin_only__") return authService.isAdmin();
      return authService.hasPermission(permission);
    }
  );

  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && isPublicPage) {
    return <Navigate to={defaultPrivateRoute} replace />;
  }

  if (isAuthenticated && !hasRoutePermission) {
    return <Navigate to={defaultPrivateRoute} replace />;
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
            <Route path="*" element={<Navigate to={isAuthenticated ? defaultPrivateRoute : "/login"} replace />} />
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
