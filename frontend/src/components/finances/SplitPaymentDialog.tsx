import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SplitSquareHorizontal, Banknote, CheckSquare, ArrowLeftRight, MoreHorizontal } from "lucide-react";
import type { Tarif, MockParent, MockStudent, SplitLine, PaymentMethod } from "./types";

// ── Config ────────────────────────────────────────────────────────────────────

interface MethodConfig {
  label: string;
  icon: React.ElementType;
  refLabel: string;
  refPlaceholder: string;
  refRequired: boolean;
  color: string;
}

const METHOD_CONFIG: Record<PaymentMethod, MethodConfig> = {
  CASH: {
    label: "Espèces",
    icon: Banknote,
    refLabel: "N° Bon de caisse",
    refPlaceholder: "Optionnel",
    refRequired: false,
    color: "text-emerald-400",
  },
  CHEQUE: {
    label: "Chèque",
    icon: CheckSquare,
    refLabel: "N° Chèque",
    refPlaceholder: "Ex: 1234567",
    refRequired: true,
    color: "text-blue-400",
  },
  BANK_TRANSFER: {
    label: "Virement bancaire",
    icon: ArrowLeftRight,
    refLabel: "Référence de virement",
    refPlaceholder: "Ex: VIR-2025-00123",
    refRequired: true,
    color: "text-violet-400",
  },
  OTHER: {
    label: "Autre",
    icon: MoreHorizontal,
    refLabel: "Référence",
    refPlaceholder: "Optionnel",
    refRequired: false,
    color: "text-slate-400",
  },
};

const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "CHEQUE", "BANK_TRANSFER", "OTHER"];

const formatMAD = (n: number) => new Intl.NumberFormat("fr-MA").format(n);

// ── Props ─────────────────────────────────────────────────────────────────────

interface SplitPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parents: MockParent[];
  students: MockStudent[];
  tarifs: Tarif[];
  onConfirm: (
    splits: { studentId: number; amount: number }[],
    meta: {
      paymentMethod: PaymentMethod;
      reference: string;
      date: string;
      academicYear: string;
      parentId: number;
    }
  ) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SplitPaymentDialog({
  open,
  onOpenChange,
  parents,
  students,
  tarifs,
  onConfirm,
}: SplitPaymentDialogProps) {
  const [parentId, setParentId]           = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [date, setDate]                   = useState(() => new Date().toISOString().split("T")[0]);
  const [reference, setReference]         = useState("");
  const [academicYear, setAcademicYear]   = useState("2024-2025");
  const [lines, setLines]                 = useState<SplitLine[]>([]);

  const cfg = METHOD_CONFIG[paymentMethod];

  // When parent or year changes, rebuild split lines from children
  useEffect(() => {
    if (parentId === "") { setLines([]); return; }
    const parent = parents.find((p) => p.id === parentId);
    if (!parent) return;

    const newLines: SplitLine[] = parent.childrenIds.map((sid) => {
      const student = students.find((s) => s.id === sid);
      const tarif   = tarifs.find((t) => t.studentId === sid && t.academicYear === academicYear);
      return {
        studentId: sid,
        studentName: student?.name ?? `Étudiant #${sid}`,
        className: student?.className ?? "",
        tarifRemaining: tarif?.remainingAmount ?? 0,
        amount: tarif?.installmentAmount ? String(Math.round(tarif.installmentAmount)) : "",
        selected: true,
      };
    });
    setLines(newLines);
  }, [parentId, academicYear, parents, students, tarifs]);

  // Clear reference when method changes (different formats)
  useEffect(() => { setReference(""); }, [paymentMethod]);

  const totalAmount = lines
    .filter((l) => l.selected)
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  const setLineAmount = (studentId: number, value: string) =>
    setLines((prev) => prev.map((l) => (l.studentId === studentId ? { ...l, amount: value } : l)));

  const toggleLine = (studentId: number, checked: boolean) =>
    setLines((prev) => prev.map((l) => (l.studentId === studentId ? { ...l, selected: checked } : l)));

  const splitEqually = () => {
    const selected = lines.filter((l) => l.selected);
    if (selected.length === 0 || totalAmount === 0) return;
    const each      = Math.floor(totalAmount / selected.length);
    let remainder   = totalAmount - each * selected.length;
    setLines((prev) =>
      prev.map((l) => {
        if (!l.selected) return l;
        const amt = each + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        return { ...l, amount: String(amt) };
      })
    );
  };

  const canSubmit =
    parentId !== "" &&
    date &&
    lines.some((l) => l.selected && parseFloat(l.amount) > 0) &&
    (!cfg.refRequired || reference.trim() !== "");

  const handleSubmit = () => {
    if (!canSubmit) return;
    const splits = lines
      .filter((l) => l.selected && parseFloat(l.amount) > 0)
      .map((l) => ({ studentId: l.studentId, amount: parseFloat(l.amount) }));
    onConfirm(splits, {
      paymentMethod,
      reference: reference.trim(),
      date,
      academicYear,
      parentId: parentId as number,
    });
    onOpenChange(false);
    reset();
  };

  const reset = () => {
    setParentId("");
    setPaymentMethod("CASH");
    setReference("");
    setDate(new Date().toISOString().split("T")[0]);
    setLines([]);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement parent</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* ── Payment method ── */}
          <div className="space-y-1.5">
            <Label>Mode de paiement</Label>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_METHODS.map((m) => {
                const c  = METHOD_CONFIG[m];
                const Icon = c.icon;
                const active = paymentMethod === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-primary" : c.color}`} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Parent + Year ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Parent / Responsable</Label>
              <Select
                value={parentId === "" ? "" : String(parentId)}
                onValueChange={(v) => setParentId(Number(v))}
              >
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {parents.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Année scolaire</Label>
              <Input
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>

          {/* ── Date + Reference ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date du paiement</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                {cfg.refLabel}
                {cfg.refRequired && <span className="ml-1 text-red-400">*</span>}
              </Label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={cfg.refPlaceholder}
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>

          {/* ── Split lines ── */}
          {lines.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Répartition par enfant</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={splitEqually}
                >
                  <SplitSquareHorizontal className="h-3.5 w-3.5" />
                  Répartir équitablement
                </Button>
              </div>

              <div className="rounded-lg border border-border/50 overflow-hidden">
                <div className="grid grid-cols-[24px_1fr_auto_140px] gap-3 px-3 py-2 bg-secondary/30 text-xs text-muted-foreground">
                  <span />
                  <span>Étudiant</span>
                  <span className="text-right">Restant dû</span>
                  <span className="text-right">Montant (MAD)</span>
                </div>

                {lines.map((line) => (
                  <div
                    key={line.studentId}
                    className={`grid grid-cols-[24px_1fr_auto_140px] gap-3 px-3 py-2.5 items-center border-t border-border/30 transition-opacity ${
                      line.selected ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <Checkbox
                      checked={line.selected}
                      onCheckedChange={(c) => toggleLine(line.studentId, c as boolean)}
                    />
                    <div>
                      <p className="text-sm font-medium">{line.studentName}</p>
                      <p className="text-xs text-muted-foreground">{line.className}</p>
                    </div>
                    <span className="text-sm text-amber-400 font-mono whitespace-nowrap">
                      {formatMAD(line.tarifRemaining)} MAD
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={line.amount}
                      onChange={(e) => setLineAmount(line.studentId, e.target.value)}
                      disabled={!line.selected}
                      className="h-8 bg-secondary/50 border-border text-right font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {lines.length === 0 && parentId !== "" && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun enfant trouvé pour ce parent.
            </p>
          )}

          {/* ── Total + method badge ── */}
          {totalAmount > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                Total
                <Badge variant="outline" className={`text-xs border-border ${cfg.color}`}>
                  {cfg.label}
                </Badge>
              </div>
              <span className={`font-mono font-bold ${cfg.color}`}>
                {formatMAD(totalAmount)} MAD
              </span>
            </div>
          )}

          {/* Required reference warning */}
          {cfg.refRequired && reference.trim() === "" && parentId !== "" && (
            <p className="text-xs text-amber-400">
              ⚠ Le {cfg.refLabel.toLowerCase()} est requis pour un paiement par {cfg.label.toLowerCase()}.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Confirmer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
