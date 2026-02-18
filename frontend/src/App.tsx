import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UpdateBanner } from "@/components/UpdateBanner";

import Index from "@/pages/Index";
import Etudiants from "@/pages/Etudiants";
import Finances from "@/pages/Finances";
import Professeurs from "@/pages/Professeurs";
import Parametres from "@/pages/Parametres";
import Parents from "@/pages/Parents";
import EmploiDuTemps from "@/pages/EmploiDuTemps";
import Presences from "@/pages/Presences";
import Notes from "@/pages/Notes";

function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen font-sans">
        <UpdateBanner />
        
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/etudiants" element={<Etudiants />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/emploi-du-temps" element={<EmploiDuTemps />} />
            <Route path="/presences" element={<Presences />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/professeurs" element={<Professeurs />} />
            <Route path="/parametres" element={<Parametres />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
