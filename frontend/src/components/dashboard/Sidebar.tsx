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
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/" },
  { icon: GraduationCap, label: "Étudiants", href: "/etudiants" },
  { icon: UsersRound, label: "Parents & Tuteurs", href: "/parents" },
  { icon: Calendar, label: "Emploi du temps", href: "/emploi-du-temps" },
  { icon: ClipboardCheck, label: "Présences", href: "/presences" },
  { icon: FileText, label: "Notes & Bulletins", href: "/notes" },
  { icon: Users, label: "Professeurs", href: "/professeurs" },
  { icon: Wallet, label: "Finances", href: "/finances" },
  { icon: Settings, label: "Paramètres", href: "/parametres" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 md:w-64 border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 md:px-6 py-6 border-b border-sidebar-border justify-center md:justify-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground hidden md:block">EduManager</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 md:px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "nav-link justify-center md:justify-start",
                    location.pathname === item.href && "active"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium hidden md:block">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden bg-popover border border-border">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 md:px-4 py-4 border-t border-sidebar-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleLogout}
                className="nav-link w-full justify-center md:justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium hidden md:block">Déconnexion</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="md:hidden bg-popover border border-border">
              Déconnexion
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
