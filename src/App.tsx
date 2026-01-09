import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Etudiants from "./pages/Etudiants";
import StudentProfile from "./pages/StudentProfile";
import EmploiDuTemps from "./pages/EmploiDuTemps";
import Presences from "./pages/Presences";
import Notes from "./pages/Notes";
import Professeurs from "./pages/Professeurs";
import Finances from "./pages/Finances";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/etudiants" element={<Etudiants />} />
          <Route path="/etudiants/:id" element={<StudentProfile />} />
          <Route path="/emploi-du-temps" element={<EmploiDuTemps />} />
          <Route path="/presences" element={<Presences />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/professeurs" element={<Professeurs />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/parametres" element={<Parametres />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
