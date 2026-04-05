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
import { Banknote, CheckSquare, ArrowLeftRight, MoreHorizontal } from "lucide-react";
import type { Tarif, PaymentMethod } from "./types";

// ── Config ────────────────────────────────────────────────────────────────────

const METHODS: { value: PaymentMethod; label: string; icon: React.ElementType; refLabel: string; refRequired: boolean; color: string }[] = [
  { value: "CASH",          label: "Espèces",          icon: Banknote,       refLabel: "N° Bon de caisse", refRequired: false, color: "text-emerald-400" },
  { value: "CHEQUE",        label: "Chèque",            icon: CheckSquare,    refLabel: "N° Chèque",        refRequired: true,  color: "text-blue-400" },
  { value: "BANK_TRANSFER", label: "Virement bancaire", icon: ArrowLeftRight, refLabel: "Réf. virement",    refRequired: true,  color: "text-violet-400" },
  { value: "OTHER",         label: "Autre",             icon: MoreHorizontal, refLabel: "Référence",        refRequired: false, color: "text-slate-400" },
];

const formatMAD = (n: number) => new Intl.NumberFormat("fr-MA").format(n);

// ── Props ─────────────────────────────────────────────────────────────────────

interface QuickPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarif: Tarif | null;
  onConfirm: (amount: number, method: PaymentMethod, reference: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function QuickPaymentDialog({ open, onOpenChange, tarif, onConfirm }: QuickPaymentDialogProps) {
  const [amount, setAmount]         = useState("");
  const [method, setMethod]         = useState<PaymentMethod>("CASH");
  const [reference, setReference]   = useState("");

  // Pre-fill with the expected instalment amount
  useEffect(() => {
    if (tarif) setAmount(String(Math.round(tarif.installmentAmount)));
    setMethod("CASH");
    setReference("");
  }, [tarif, open]);

  const cfg = METHODS.find((m) => m.value === method)!;
  const parsedAmount = parseFloat(amount) || 0;
  const canSubmit = parsedAmount > 0 && (!cfg.refRequired || reference.trim() !== "");

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm(parsedAmount, method, reference.trim());
    onOpenChange(false);
  };

  if (!tarif) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Paiement rapide</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Student info */}
          <div className="rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 text-sm">
            <p className="font-medium">{tarif.studentName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tarif.className} · Restant:{" "}
              <span className="text-amber-400 font-mono">{formatMAD(tarif.remainingAmount)} MAD</span>
            </p>
          </div>

          {/* Payment method */}
          <div className="space-y-1.5">
            <Label>Mode de paiement</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => { setMethod(m.value); setReference(""); }}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[11px] font-medium transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : m.color}`} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label>Montant (MAD)</Label>
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary/50 border-border font-mono"
            />
            {parsedAmount > tarif.remainingAmount && (
              <p className="text-xs text-amber-400">
                ⚠ Supérieur au reste dû ({formatMAD(tarif.remainingAmount)} MAD)
              </p>
            )}
          </div>

          {/* Reference */}
          <div className="space-y-1.5">
            <Label>
              {cfg.refLabel}
              {cfg.refRequired && <span className="ml-1 text-red-400">*</span>}
            </Label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={cfg.refRequired ? "Requis" : "Optionnel"}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Confirmer &amp; Reçu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
