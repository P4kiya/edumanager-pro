import { Download } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TarifsTab } from "@/components/finances/TarifsTab";
import { Button } from "@/components/ui/button";

export default function Finances() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finances</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les tarifs et paiements des élèves
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Exporter le rapport
          </Button>
        </div>

        <TarifsTab />
      </div>
    </DashboardLayout>
  );
}
