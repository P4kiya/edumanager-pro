import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Calendar, 
  Wallet, 
  Settings, 
  LogOut,
  BookOpen,
  ClipboardCheck,
  FileText,
  UsersRound
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/" },
  { icon: GraduationCap, label: "Étudiants", path: "/etudiants" },
  { icon: UsersRound, label: "Parents & Tuteurs", path: "/parents" },
  { icon: Calendar, label: "Emploi du temps", path: "/emploi-du-temps" },
  { icon: ClipboardCheck, label: "Présences", path: "/presences" },
  { icon: FileText, label: "Notes & Bulletins", path: "/notes" },
  { icon: Users, label: "Professeurs", path: "/professeurs" },
  { icon: Wallet, label: "Finances", path: "/finances" },
  { icon: Settings, label: "Paramètres", path: "/parametres" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0A0F1C] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
            <BookOpen className="h-5 w-5 text-indigo-500" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">EduManager</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full" />
              )}
              <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 group-hover:text-red-400" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
