import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Download, Mail, GraduationCap, Printer } from "lucide-react";

interface Transaction {
  id: number;
  student: {
    name: string;
    avatar: string;
    initials: string;
  };
  date: string;
  type: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  receiptNumber?: string;
  paymentMethod?: string;
  parentName?: string;
}

interface PaymentReceiptProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentReceipt({ transaction, open, onOpenChange }: PaymentReceiptProps) {
  if (!transaction) return null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const receiptNumber = transaction.receiptNumber || `FAC-2025-${String(transaction.id).padStart(3, "0")}`;
  const paymentMethod = transaction.paymentMethod || "Carte Bancaire (**** 4242)";
  const parentName = transaction.parentName || `Parent de ${transaction.student.name}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-popover border-border overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-foreground">Reçu de Paiement</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Receipt Card */}
          <div className="rounded-xl border border-border bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">EduManager</h3>
                    <p className="text-xs text-muted-foreground">Système de Gestion Scolaire</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  #{receiptNumber}
                </p>
              </div>
            </div>

            {/* Hero Section - Amount */}
            <div className="p-8 text-center bg-gradient-to-b from-emerald-500/5 to-transparent">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-400 font-medium mb-2">Paiement Confirmé</p>
              <p className="text-4xl font-bold text-foreground font-mono tracking-tight">
                {formatAmount(transaction.amount)}{" "}
                <span className="text-lg text-muted-foreground font-normal">MAD</span>
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Details Grid */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Payé par</p>
                  <p className="text-sm font-medium text-foreground">{parentName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium text-foreground">{transaction.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Méthode</p>
                  <p className="text-sm font-medium text-foreground">{paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Étudiant</p>
                  <p className="text-sm font-medium text-foreground">{transaction.student.name}</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div>
                <p className="text-xs text-muted-foreground mb-1">Motif</p>
                <p className="text-sm font-medium text-foreground">{transaction.type}</p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="px-6 pb-6">
              <div className="rounded-lg bg-secondary/30 p-4 border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  Ce reçu confirme le paiement effectué. Conservez-le pour vos archives.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Télécharger le PDF
            </Button>
            <Button variant="outline" className="w-full border-border bg-card/50" size="lg">
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par Email
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground" size="lg">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
