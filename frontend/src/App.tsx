import { HashRouter, BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UpdateBanner } from "@/components/UpdateBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

// Check if the app is running in an Electron environment
const isElectron = navigator.userAgent.toLowerCase().includes('electron');
const Router = isElectron ? HashRouter : BrowserRouter;

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex bg-background min-h-screen font-sans">
      {!isLoginPage && <UpdateBanner />}

      {/* Sidebar */}
      {!isLoginPage && <AppSidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isLoginPage ? "" : "ml-64"}`}>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
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
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
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
      </Router>
    </ErrorBoundary>
  );
}

export default App;
