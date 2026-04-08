import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  Wallet,
  BookOpen,
  ClipboardCheck,
  FileText,
  UsersRound,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { authService, schoolSettingsService } from "@/services";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord",  path: "/"                },
  { icon: ShieldCheck,     label: "Utilisateurs",      path: "/agents"          },
  { icon: ClipboardList,   label: "Journal",           path: "/journal"         },
  { icon: Wallet,          label: "Finances",          path: "/finances"        },
  { icon: GraduationCap,   label: "Étudiants",        path: "/etudiants"       },
  { icon: ClipboardCheck,  label: "Présences",         path: "/presences"       },
  { icon: FileText,        label: "Notes & Bulletins", path: "/notes"           },
  { icon: Calendar,        label: "Emploi du temps",   path: "/emploi-du-temps" },
  { icon: Users,           label: "Professeurs",       path: "/professeurs"     },
  { icon: UsersRound,      label: "Parents & Tuteurs", path: "/parents"         },
];

export function AppSidebar() {
  const location = useLocation();
  const [schoolName, setSchoolName] = useState("EduManager");
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const agentMenuPermissionMap: Record<string, string> = {
    "/finances": "finances",
    "/etudiants": "students",
    "/presences": "presences",
    "/notes": "notes",
    "/emploi-du-temps": "emploi_du_temps",
    "/professeurs": "professeurs",
    "/parents": "parents",
  };
  const visibleMenuItems = authService.isAdmin()
    ? menuItems
    : menuItems.filter((item) =>
        !!agentMenuPermissionMap[item.path] && authService.hasPermission(agentMenuPermissionMap[item.path])
      );

  useEffect(() => {
    const loadSchoolName = async () => {
      try {
        const settings = await schoolSettingsService.get();
        if (settings.schoolName?.trim()) {
          setSchoolName(settings.schoolName.trim());
        }
        setSchoolLogo(settings.logoData ?? null);
      } catch {
        // Keep fallback name if request fails.
      }
    };

    const onSchoolSettingsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ schoolName?: string; logoData?: string | null }>;
      if (customEvent.detail?.schoolName?.trim()) {
        setSchoolName(customEvent.detail.schoolName.trim());
      }
      if (typeof customEvent.detail?.logoData !== "undefined") {
        setSchoolLogo(customEvent.detail.logoData ?? null);
      }
    };

    loadSchoolName();
    window.addEventListener("school-settings-updated", onSchoolSettingsUpdated);

    return () => {
      window.removeEventListener("school-settings-updated", onSchoolSettingsUpdated);
    };
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {schoolLogo ? (
            <img
              src={schoolLogo}
              alt="Logo établissement"
              className="h-9 w-9 rounded-xl object-cover border border-primary/30"
            />
          ) : (
            <div className="h-9 w-9 bg-primary/15 rounded-xl flex items-center justify-center border border-primary/30">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          )}
          <span className="text-foreground font-bold text-lg tracking-tight">{schoolName}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
