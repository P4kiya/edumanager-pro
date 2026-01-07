import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Calendar, 
  Wallet, 
  Settings, 
  LogOut,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/" },
  { icon: GraduationCap, label: "Étudiants", href: "/etudiants" },
  { icon: Users, label: "Professeurs", href: "/professeurs" },
  { icon: Calendar, label: "Emploi du temps", href: "/emploi-du-temps" },
  { icon: Wallet, label: "Finances", href: "/finances" },
  { icon: Settings, label: "Paramètres", href: "/parametres" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-semibold text-foreground">EduManager</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn("nav-link", location.pathname === item.href && "active")}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <button className="nav-link w-full text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
