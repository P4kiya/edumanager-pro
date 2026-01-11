import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-16 md:pl-64 transition-all duration-300">
        <TopBar />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
