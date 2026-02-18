import { useState, useEffect } from "react";
import { Search, Bell, CheckCircle, AlertTriangle, Info, CircleDot, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: number;
  icon: "success" | "warning" | "info";
  title: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    icon: "success",
    title: "Nouveau paiement reçu",
    time: "Il y a 5 min",
    isRead: false,
  },
  {
    id: 2,
    icon: "info",
    title: "Nouvelle inscription : Sarah Connor",
    time: "Il y a 2h",
    isRead: false,
  },
  {
    id: 3,
    icon: "warning",
    title: "Maintenance du serveur prévue",
    time: "Hier",
    isRead: true,
  },
  {
    id: 4,
    icon: "info",
    title: "Rapport mensuel disponible",
    time: "Il y a 3 jours",
    isRead: true,
  },
];

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const iconColorMap = {
  success: "text-green-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export function TopBar() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "dark";
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="h-10 w-full rounded-lg border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/50 transition-colors hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>


          <Popover>
            <PopoverTrigger asChild>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/50 transition-colors hover:bg-secondary">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[350px] border-border bg-[#111827] p-0 shadow-xl shadow-black/40 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Tout marquer comme lu
                </button>
              </div>

              {/* Notification List */}
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((notification) => {
                  const IconComponent = iconMap[notification.icon];
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5 cursor-pointer ${
                        notification.isRead ? "opacity-60" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className="mt-0.5">
                        <IconComponent
                          className={`h-4 w-4 ${iconColorMap[notification.icon]}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            notification.isRead
                              ? "text-muted-foreground"
                              : "text-foreground font-medium"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {notification.time}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <CircleDot className="h-2.5 w-2.5 text-primary mt-1.5 fill-primary" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 px-4 py-2.5">
                <button className="w-full text-center text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* User */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-1.5">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
              <AvatarFallback className="bg-primary/20 text-primary text-sm">ML</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">Marc Leblanc</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
