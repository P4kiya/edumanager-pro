import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { parentService, studentService, transactionService } from "@/services";
import type {
  FinancialSummaryDTO,
  PaymentMethod,
  StudentDTO,
  TransactionDTO,
  TransactionRequest,
  TransactionStatus,
  TransactionType,
  ParentDTO,
} from "@/types/api.types";

export default function Finances() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [parents, setParents] = useState<ParentDTO[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    type: "TUITION" as TransactionType,
    status: "PAID" as TransactionStatus,
    paymentMethod: "CASH" as PaymentMethod,
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [txPage, studentPage, parentRes, sum] = await Promise.all([
          transactionService.getAll(0, 200),
          studentService.getAll(0, 300),
          parentService.getAll(),
          transactionService.getSummary(academicYear),
        ]);
        setTransactions(txPage.content);
        setStudents(studentPage.content);
        setParents(parentRes);
        setSummary(sum);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données financières.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [academicYear]);

  const parentByStudentId = useMemo(() => {
    const map = new Map<number, number>();
    students.forEach((s) => {
      if (s.parentId) map.set(s.id, s.parentId);
    });
    return map;
  }, [students]);

  const createTransaction = async () => {
    if (!form.studentId || !form.amount) {
      toast({ title: "Champs requis", description: "Veuillez renseigner l'étudiant et le montant." });
      return;
    }

    const studentId = Number(form.studentId);
    const parentId = parentByStudentId.get(studentId);
    if (!parentId) {
      toast({ title: "Parent introuvable", description: "Aucun parent lié à cet étudiant.", variant: "destructive" });
      return;
    }

    const payload: TransactionRequest = {
      studentId,
      parentId,
      amount: Number(form.amount),
      type: form.type,
      status: form.status,
      dueDate: form.dueDate,
      description: form.description,
      academicYear,
      paymentMethod: form.paymentMethod,
      paidAt: form.status === "PAID" ? new Date().toISOString() : undefined,
    };

    try {
      const created = await transactionService.create(payload);
      setTransactions((prev) => [created, ...prev]);
      setDialogOpen(false);
      setForm({
        studentId: "",
        amount: "",
        type: "TUITION",
        status: "PAID",
        paymentMethod: "CASH",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Paiement enregistré", description: "La transaction a été créée avec succès." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de créer la transaction.", variant: "destructive" });
    }
  };

  const removeTransaction = async (tx: TransactionDTO) => {
    try {
      const payload: TransactionRequest = {
        studentId: tx.studentId,
        parentId: tx.parentId,
        amount: tx.amount,
        type: tx.type,
        status: "OVERDUE",
        dueDate: tx.dueDate,
        paidAt: tx.paidAt,
        description: `${tx.description ?? ""} (annulée)`.trim(),
        academicYear: tx.academicYear,
        paymentMethod: tx.paymentMethod,
      };
      const updated = await transactionService.update(tx.id, payload);
      setTransactions((prev) => prev.map((t) => (t.id === tx.id ? updated : t)));
      toast({ title: "Transaction annulée", description: "La transaction a été marquée en retard/annulée." });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'annuler la transaction.", variant: "destructive" });
    }
  };

  const formatMAD = (value: number) =>
    new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 2 }).format(value);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finances</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les paiements et le suivi financier
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger className="w-[140px] bg-card/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau paiement
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Exporter le rapport
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm text-muted-foreground">Revenu total</p>
            <p className="text-2xl font-bold text-emerald-400">{formatMAD(summary?.totalRevenue ?? 0)} MAD</p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-amber-400">{formatMAD(summary?.totalPending ?? 0)} MAD</p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm text-muted-foreground">En retard</p>
            <p className="text-2xl font-bold text-red-400">{formatMAD(summary?.totalOverdue ?? 0)} MAD</p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold text-primary">{summary?.transactionCount ?? 0}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Paiement</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement des transactions...
                  </td>
                </tr>
              )}
              {!isLoading && transactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Aucune transaction
                  </td>
                </tr>
              )}
              {!isLoading &&
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="px-4 py-3">{tx.studentName}</td>
                    <td className="px-4 py-3">{tx.parentName}</td>
                    <td className="px-4 py-3">{tx.type}</td>
                    <td className="px-4 py-3 font-semibold">{formatMAD(tx.amount)} MAD</td>
                    <td className="px-4 py-3">{tx.status}</td>
                    <td className="px-4 py-3">{tx.paymentMethod ?? "—"}</td>
                    <td className="px-4 py-3">{new Date(tx.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="destructive" size="sm" onClick={() => removeTransaction(tx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Nouveau paiement</DialogTitle>
            <DialogDescription>Créer une transaction financière</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Étudiant</Label>
              <Select value={form.studentId} onValueChange={(v) => setForm((p) => ({ ...p, studentId: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Sélectionner un étudiant" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.firstName} {s.lastName} — {s.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Montant (MAD)</Label>
              <Input
                type="number"
                min={1}
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as TransactionType }))}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="TUITION">TUITION</SelectItem>
                  <SelectItem value="INSCRIPTION">INSCRIPTION</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as TransactionStatus }))}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="PAID">PAID</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Méthode</Label>
              <Select value={form.paymentMethod} onValueChange={(v) => setForm((p) => ({ ...p, paymentMethod: v as PaymentMethod }))}>
                <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="CASH">CASH</SelectItem>
                  <SelectItem value="CHEQUE">CHEQUE</SelectItem>
                  <SelectItem value="BANK_TRANSFER">BANK_TRANSFER</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date d'échéance</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-secondary/50 border-border"
                placeholder="Ex: Frais trimestre 2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={createTransaction}>Créer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
