import { useRef, useState } from "react";
import { Plus, CreditCard, MoreHorizontal, Pencil, Trash2, Banknote, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { TarifDialog } from "./TarifDialog";
import { SplitPaymentDialog } from "./SplitPaymentDialog";
import { QuickPaymentDialog } from "./QuickPaymentDialog";
import { TarifReceipt } from "./TarifReceipt";
import type { Tarif, MockStudent, MockParent, ReceiptData, PaymentLine, PaymentMethod } from "./types";

// ── Mock data ────────────────────────────────────────────────────────────────

const mockStudents: MockStudent[] = [
  { id: 1, name: "Youssef El Amrani",   initials: "YE", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", className: "Terminale A", parentId: 1 },
  { id: 2, name: "Fatima Zahra Bennis", initials: "FZ", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face", className: "1ère Bac",    parentId: 2 },
  { id: 3, name: "Ahmed Tazi",          initials: "AT", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", className: "3ème",        parentId: 3 },
  { id: 4, name: "Khadija Tazi",        initials: "KT", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face", className: "5ème",        parentId: 3 },
  { id: 5, name: "Omar Benjelloun",     initials: "OB", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face", className: "2ème",        parentId: 4 },
  { id: 6, name: "Hiba Alaoui",         initials: "HA", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face", className: "Terminale B", parentId: 5 },
];

const mockParents: MockParent[] = [
  { id: 1, name: "M. El Amrani",    childrenIds: [1] },
  { id: 2, name: "Mme. Bennis",     childrenIds: [2] },
  { id: 3, name: "M. Tazi",         childrenIds: [3, 4] }, // 2 enfants
  { id: 4, name: "M. Benjelloun",   childrenIds: [5] },
  { id: 5, name: "Mme. Alaoui",     childrenIds: [6] },
];

const initialTarifs: Tarif[] = [
  {
    id: 1, studentId: 1, studentName: "Youssef El Amrani",
    studentAvatar: mockStudents[0].avatar, studentInitials: "YE",
    className: "Terminale A", academicYear: "2024-2025", enrollmentMonth: 9,
    totalAmount: 45000, amountPaid: 30000, remainingAmount: 15000,
    frequency: "TRIMESTRIAL", installmentCount: 3, installmentAmount: 15000,
    progressPercent: 66.7, description: "Frais de scolarité Terminale A",
  },
  {
    id: 2, studentId: 2, studentName: "Fatima Zahra Bennis",
    studentAvatar: mockStudents[1].avatar, studentInitials: "FZ",
    className: "1ère Bac", academicYear: "2024-2025", enrollmentMonth: 9,
    totalAmount: 36000, amountPaid: 36000, remainingAmount: 0,
    frequency: "MONTHLY", installmentCount: 10, installmentAmount: 3600,
    progressPercent: 100,
  },
  {
    // Famille Tazi — enfant 1
    id: 3, studentId: 3, studentName: "Ahmed Tazi",
    studentAvatar: mockStudents[2].avatar, studentInitials: "AT",
    className: "3ème", academicYear: "2024-2025", enrollmentMonth: 9,
    totalAmount: 30000, amountPaid: 10000, remainingAmount: 20000,
    frequency: "TRIMESTRIAL", installmentCount: 3, installmentAmount: 10000,
    progressPercent: 33.3, description: "Payé via chèque N° 1234567",
  },
  {
    // Famille Tazi — enfant 2 (même chèque de 20 000 DH divisé : 10 000 + 10 000)
    id: 4, studentId: 4, studentName: "Khadija Tazi",
    studentAvatar: mockStudents[3].avatar, studentInitials: "KT",
    className: "5ème", academicYear: "2024-2025", enrollmentMonth: 9,
    totalAmount: 25000, amountPaid: 10000, remainingAmount: 15000,
    frequency: "TRIMESTRIAL", installmentCount: 3, installmentAmount: 8334,
    progressPercent: 40, description: "Payé via chèque N° 1234567",
  },
  {
    id: 5, studentId: 5, studentName: "Omar Benjelloun",
    studentAvatar: mockStudents[4].avatar, studentInitials: "OB",
    className: "2ème", academicYear: "2024-2025", enrollmentMonth: 9,
    totalAmount: 28000, amountPaid: 0, remainingAmount: 28000,
    frequency: "MONTHLY", installmentCount: 10, installmentAmount: 2800,
    progressPercent: 0,
  },
  {
    id: 6, studentId: 6, studentName: "Hiba Alaoui",
    studentAvatar: mockStudents[5].avatar, studentInitials: "HA",
    className: "Terminale B", academicYear: "2024-2025", enrollmentMonth: 9,
    totalAmount: 45000, amountPaid: 15000, remainingAmount: 30000,
    frequency: "TRIMESTRIAL", installmentCount: 3, installmentAmount: 15000,
    progressPercent: 33.3,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatMAD = (n: number) => new Intl.NumberFormat("fr-MA").format(n);

const FREQ_LABEL: Record<string, string> = {
  MONTHLY: "Mensuel",
  TRIMESTRIAL: "Trimestriel",
  ANNUAL: "Annuel",
};

const METHOD_LABEL: Record<string, string> = {
  CASH: "espèces",
  CHEQUE: "chèque",
  BANK_TRANSFER: "virement",
  OTHER: "paiement",
};

function progressColor(pct: number) {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 60)  return "bg-blue-500";
  if (pct >= 30)  return "bg-amber-500";
  return "bg-red-500";
}

/** Builds a summary receipt from the tarif's current state (no session data needed). */
function buildTarifReceipt(
  tarif: Tarif,
  parents: MockParent[],
  receiptNumber: string
): ReceiptData {
  const parent = parents.find((p) => p.childrenIds.includes(tarif.studentId));
  const line: PaymentLine = {
    studentName: tarif.studentName,
    className: tarif.className,
    description: tarif.description ?? "Frais de scolarité",
    amount: tarif.amountPaid,
    remainingAfterPayment: tarif.remainingAmount,
  };
  return {
    receiptNumber,
    issuedAt: new Date().toISOString().split("T")[0],
    parentName: parent?.name ?? "Parent",
    academicYear: tarif.academicYear,
    paymentMethod: "OTHER",
    lines: [line],
    totalAmount: tarif.amountPaid,
    schoolName: "EduManager",
  };
}

function statusBadge(tarif: Tarif) {
  if (tarif.remainingAmount === 0)
    return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border">Soldé</Badge>;
  if (tarif.amountPaid === 0)
    return <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 border">Non commencé</Badge>;
  return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 border">En cours</Badge>;
}

// ── Component ────────────────────────────────────────────────────────────────

export function TarifsTab() {
  const [tarifs, setTarifs] = useState<Tarif[]>(initialTarifs);
  const [tarifDialogOpen, setTarifDialogOpen]         = useState(false);
  const [splitDialogOpen, setSplitDialogOpen]         = useState(false);
  const [quickPayDialogOpen, setQuickPayDialogOpen]   = useState(false);
  const [editingTarif, setEditingTarif]               = useState<Tarif | null>(null);
  const [deletingTarifId, setDeletingTarifId]         = useState<number | null>(null);
  const [quickPayTarif, setQuickPayTarif]             = useState<Tarif | null>(null);
  const [activeReceipt, setActiveReceipt]             = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen]                 = useState(false);
  const [lastReceipts, setLastReceipts]               = useState<Map<number, ReceiptData>>(new Map());
  const receiptCounterRef = useRef(1);

  // ── KPIs ──
  const totalExpected  = tarifs.reduce((s, t) => s + t.totalAmount, 0);
  const totalCollected = tarifs.reduce((s, t) => s + t.amountPaid, 0);
  const totalRemaining = tarifs.reduce((s, t) => s + t.remainingAmount, 0);

  // ── Helpers ──

  const generateReceiptNumber = (method: PaymentMethod) => {
    const prefix = { CASH: "ESP", CHEQUE: "CHQ", BANK_TRANSFER: "VIR", OTHER: "PAY" }[method];
    const n = String(receiptCounterRef.current++).padStart(4, "0");
    const year = new Date().getFullYear();
    return `${prefix}-${year}-${n}`;
  };

  const applyPayments = (splits: { studentId: number; amount: number }[]) => {
    setTarifs((prev) =>
      prev.map((t) => {
        const split = splits.find((s) => s.studentId === t.studentId);
        if (!split) return t;
        const newPaid      = t.amountPaid + split.amount;
        const newRemaining = Math.max(0, t.totalAmount - newPaid);
        const newProgress  = Math.min(100, Math.round((newPaid / t.totalAmount) * 1000) / 10);
        return { ...t, amountPaid: newPaid, remainingAmount: newRemaining, progressPercent: newProgress };
      })
    );
  };

  const openReceipt = (receipt: ReceiptData) => {
    setActiveReceipt(receipt);
    setReceiptOpen(true);
  };

  // ── Handlers ──

  const handleSaveTarif = (data: Omit<Tarif, "id" | "amountPaid" | "remainingAmount" | "progressPercent">) => {
    if (editingTarif) {
      setTarifs((prev) =>
        prev.map((t) =>
          t.id === editingTarif.id ? { ...t, ...data } : t
        )
      );
      toast.success("Tarif modifié avec succès");
    } else {
      const newTarif: Tarif = {
        ...data,
        id: Date.now(),
        amountPaid: 0,
        remainingAmount: data.totalAmount,
        progressPercent: 0,
      };
      setTarifs((prev) => [...prev, newTarif]);
      toast.success("Tarif créé avec succès");
    }
    setEditingTarif(null);
  };

  const handleDelete = (id: number) => {
    setTarifs((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tarif supprimé");
    setDeletingTarifId(null);
  };

  /** Quick single-student payment from the row action menu. */
  const handleQuickPayment = (amount: number, method: PaymentMethod, reference: string) => {
    if (!quickPayTarif) return;
    const tarif = quickPayTarif;

    applyPayments([{ studentId: tarif.studentId, amount }]);

    const newRemaining = Math.max(0, tarif.remainingAmount - amount);
    const parent = mockParents.find((p) => p.childrenIds.includes(tarif.studentId));

    const line: PaymentLine = {
      studentName: tarif.studentName,
      className: tarif.className,
      description: tarif.description ?? "Frais de scolarité",
      amount,
      remainingAfterPayment: newRemaining,
    };

    const receipt: ReceiptData = {
      receiptNumber: generateReceiptNumber(method),
      issuedAt: new Date().toISOString().split("T")[0],
      parentName: parent?.name ?? "Parent",
      academicYear: tarif.academicYear,
      paymentMethod: method,
      reference: reference || undefined,
      lines: [line],
      totalAmount: amount,
      schoolName: "EduManager",
    };

    setLastReceipts((prev) => new Map(prev).set(tarif.studentId, receipt));
    openReceipt(receipt);
    toast.success(`Paiement de ${formatMAD(amount)} MAD enregistré pour ${tarif.studentName}`);
    setQuickPayTarif(null);
  };

  /** Apply split payments coming from SplitPaymentDialog. */
  const handleSplitPayment = (
    splits: { studentId: number; amount: number }[],
    meta: { paymentMethod: string; reference: string; date: string; academicYear: string; parentId: number }
  ) => {
    // Snapshot remaining amounts before applying
    const tarifSnapshot = tarifs;

    applyPayments(splits);

    const parentName = mockParents.find((p) => p.id === meta.parentId)?.name ?? "Parent";
    const method = meta.paymentMethod as PaymentMethod;
    const total  = splits.reduce((s, x) => s + x.amount, 0);

    const lines: PaymentLine[] = splits.map((split) => {
      const tarif = tarifSnapshot.find((t) => t.studentId === split.studentId);
      return {
        studentName: tarif?.studentName ?? `Étudiant ${split.studentId}`,
        className:   tarif?.className ?? "",
        description: tarif?.description ?? "Frais de scolarité",
        amount: split.amount,
        remainingAfterPayment: Math.max(0, (tarif?.remainingAmount ?? split.amount) - split.amount),
      };
    });

    const receipt: ReceiptData = {
      receiptNumber: generateReceiptNumber(method),
      issuedAt: meta.date || new Date().toISOString().split("T")[0],
      parentName,
      academicYear: meta.academicYear,
      paymentMethod: method,
      reference: meta.reference || undefined,
      lines,
      totalAmount: total,
      schoolName: "EduManager",
    };

    setLastReceipts((prev) => {
      const m = new Map(prev);
      splits.forEach((s) => m.set(s.studentId, receipt));
      return m;
    });
    openReceipt(receipt);

    const methodStr = METHOD_LABEL[meta.paymentMethod] ?? "paiement";
    toast.success(`${formatMAD(total)} MAD en ${methodStr} enregistré pour ${parentName}`);
  };

  return (
    <div className="space-y-5">
      {/* ── Mini KPIs ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total attendu",     value: totalExpected,  color: "text-foreground" },
          { label: "Total encaissé",    value: totalCollected, color: "text-emerald-400" },
          { label: "Reste à percevoir", value: totalRemaining, color: "text-amber-400" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className={`mt-1 font-mono text-xl font-bold ${k.color}`}>
              {formatMAD(k.value)}{" "}
              <span className="text-xs font-normal text-muted-foreground">MAD</span>
            </p>
          </div>
        ))}
      </div>

      {/* ── Action bar ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tarifs.length} tarif{tarifs.length !== 1 ? "s" : ""} · Année scolaire 2024-2025
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border bg-secondary/50 hover:bg-secondary gap-2"
            onClick={() => setSplitDialogOpen(true)}
          >
            <CreditCard className="h-4 w-4" />
            Enregistrer un paiement
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => { setEditingTarif(null); setTarifDialogOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            Nouveau tarif
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Étudiant</TableHead>
              <TableHead className="text-muted-foreground">Total</TableHead>
              <TableHead className="text-muted-foreground">Payé</TableHead>
              <TableHead className="text-muted-foreground">Restant</TableHead>
              <TableHead className="text-muted-foreground">Fréquence</TableHead>
              <TableHead className="text-muted-foreground">Versement</TableHead>
              <TableHead className="text-muted-foreground min-w-[160px]">Progression</TableHead>
              <TableHead className="text-muted-foreground">Statut</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarifs.map((tarif) => (
              <TableRow
                key={tarif.id}
                className="border-border/50 hover:bg-muted/50 transition-colors"
              >
                {/* Student */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={tarif.studentAvatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {tarif.studentInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{tarif.studentName}</p>
                      <p className="text-xs text-muted-foreground">{tarif.className}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell className="font-mono font-medium text-foreground">
                  {formatMAD(tarif.totalAmount)}
                </TableCell>

                {/* Paid */}
                <TableCell className="font-mono text-emerald-400">
                  {formatMAD(tarif.amountPaid)}
                </TableCell>

                {/* Remaining */}
                <TableCell className={`font-mono ${tarif.remainingAmount > 0 ? "text-amber-400" : "text-muted-foreground"}`}>
                  {formatMAD(tarif.remainingAmount)}
                </TableCell>

                {/* Frequency */}
                <TableCell className="text-muted-foreground text-sm">
                  {FREQ_LABEL[tarif.frequency] ?? tarif.frequency}
                </TableCell>

                {/* Instalment */}
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {formatMAD(tarif.installmentAmount)} / versement
                </TableCell>

                {/* Progress bar */}
                <TableCell>
                  <div className="space-y-1">
                    <Progress
                      value={tarif.progressPercent}
                      className="h-2 bg-secondary"
                      indicatorClassName={progressColor(tarif.progressPercent)}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {tarif.progressPercent.toFixed(1)}%
                    </p>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>{statusBadge(tarif)}</TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      {tarif.remainingAmount > 0 && (
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-muted gap-2"
                          onClick={() => {
                            setQuickPayTarif(tarif);
                            setQuickPayDialogOpen(true);
                          }}
                        >
                          <Banknote className="h-4 w-4" />
                          Enregistrer un paiement
                        </DropdownMenuItem>
                      )}
                      {tarif.amountPaid > 0 && (
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-muted gap-2"
                          onClick={() => {
                            const receipt =
                              lastReceipts.get(tarif.studentId) ??
                              buildTarifReceipt(tarif, mockParents, generateReceiptNumber("OTHER"));
                            openReceipt(receipt);
                          }}
                        >
                          <Receipt className="h-4 w-4" />
                          Générer un reçu
                        </DropdownMenuItem>
                      )}
                      {(tarif.remainingAmount > 0 || tarif.amountPaid > 0) && (
                        <DropdownMenuSeparator className="bg-border/50" />
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-muted gap-2"
                        onClick={() => { setEditingTarif(tarif); setTarifDialogOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier le tarif
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-muted gap-2 text-red-400 focus:text-red-400"
                        onClick={() => setDeletingTarifId(tarif.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Dialogs ── */}
      <TarifDialog
        open={tarifDialogOpen}
        onOpenChange={setTarifDialogOpen}
        tarif={editingTarif}
        students={mockStudents}
        onSave={handleSaveTarif}
      />

      <SplitPaymentDialog
        open={splitDialogOpen}
        onOpenChange={setSplitDialogOpen}
        parents={mockParents}
        students={mockStudents}
        tarifs={tarifs}
        onConfirm={handleSplitPayment}
      />

      <QuickPaymentDialog
        open={quickPayDialogOpen}
        onOpenChange={setQuickPayDialogOpen}
        tarif={quickPayTarif}
        onConfirm={handleQuickPayment}
      />

      <TarifReceipt
        receipt={activeReceipt}
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
      />

      {/* Delete confirmation */}
      <AlertDialog open={deletingTarifId !== null} onOpenChange={(o) => !o && setDeletingTarifId(null)}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce tarif ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le tarif sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deletingTarifId && handleDelete(deletingTarifId)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
