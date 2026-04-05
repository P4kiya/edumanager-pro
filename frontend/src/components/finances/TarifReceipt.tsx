import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, X, GraduationCap, CheckCircle2 } from "lucide-react";
import type { ReceiptData } from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatMAD = (n: number) =>
  new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const METHOD_LABEL: Record<string, string> = {
  CASH:          "Espèces",
  CHEQUE:        "Chèque",
  BANK_TRANSFER: "Virement bancaire",
  OTHER:         "Autre",
};

const METHOD_BADGE: Record<string, string> = {
  CASH:          "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CHEQUE:        "bg-blue-500/15 text-blue-400 border-blue-500/30",
  BANK_TRANSFER: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  OTHER:         "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

// ── Print HTML ────────────────────────────────────────────────────────────────

function buildPrintHTML(r: ReceiptData): string {
  const methodStr = r.reference
    ? `${METHOD_LABEL[r.paymentMethod] ?? r.paymentMethod} — Réf. ${r.reference}`
    : METHOD_LABEL[r.paymentMethod] ?? r.paymentMethod;

  const linesHTML = r.lines
    .map(
      (l) => `
      <tr>
        <td>${l.description}</td>
        <td>${l.studentName}</td>
        <td style="text-align:center">${l.className}</td>
        <td style="text-align:right;font-family:monospace;font-weight:600">${formatMAD(l.amount)} MAD</td>
      </tr>`
    )
    .join("");

  const remainingHTML = r.lines
    .map(
      (l) => `
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
        <span>${l.studentName} — ${l.className}</span>
        <span style="font-family:monospace;font-weight:600">${formatMAD(l.remainingAfterPayment)} MAD</span>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>Reçu ${r.receiptNumber}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#1a1a1a;background:#fff;padding:20px}
    @media print{body{padding:0}@page{margin:12mm;size:A5 portrait}}
    .receipt{max-width:148mm;margin:0 auto;border:1px solid #d1d5db}

    /* Header */
    .hdr{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:#f8f9fa;border-bottom:2px solid #e5e7eb}
    .logo{display:flex;align-items:center;gap:10px}
    .logo-box{width:36px;height:36px;background:#4f46e5;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:18px}
    .school-name{font-size:15px;font-weight:700;color:#111}
    .school-sub{font-size:10px;color:#6b7280;margin-top:1px}
    .hdr-right{text-align:right;font-size:11px;color:#6b7280;font-family:monospace;line-height:1.5}
    .hdr-right strong{color:#111}

    /* Title bar */
    .title{background:#4f46e5;color:#fff;text-align:center;padding:10px;font-size:14px;font-weight:700;letter-spacing:1.5px}

    /* Amount */
    .amount-wrap{text-align:center;padding:18px;background:#f0fdf4;border-bottom:1px solid #bbf7d0}
    .amount-label{font-size:11px;color:#16a34a;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
    .amount-value{font-size:30px;font-weight:700;font-family:monospace;color:#15803d;margin-top:4px}
    .amount-currency{font-size:14px;font-weight:400;color:#16a34a}

    /* Info grid */
    .info{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 18px;border-bottom:1px solid #e5e7eb}
    .info label{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;display:block}
    .info p{font-size:12px;font-weight:600;margin-top:2px}

    /* Table */
    .tbl-wrap{padding:14px 18px}
    .tbl-title{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#9ca3af;margin-bottom:8px}
    table{width:100%;border-collapse:collapse}
    thead th{background:#f8f9fa;padding:7px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:#6b7280;border-bottom:2px solid #d1d5db;text-align:left}
    tbody td{padding:8px 10px;font-size:12px;border-bottom:1px solid #f3f4f6}
    .total-row td{background:#fffbeb;padding:9px 10px;font-weight:700;border-top:2px solid #fcd34d;font-size:13px}

    /* Remaining */
    .remaining{padding:10px 18px;background:#eff6ff;border-top:1px solid #bfdbfe;border-bottom:1px solid #bfdbfe}
    .remaining-title{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#1d4ed8;font-weight:600;margin-bottom:6px}

    /* Signatures */
    .sigs{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px 18px}
    .sig-box{border:1px dashed #d1d5db;border-radius:4px;padding:8px;min-height:58px}
    .sig-label{font-size:10px;color:#9ca3af;margin-bottom:14px}

    /* Footer */
    .footer{padding:8px 18px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:10px;color:#9ca3af}
  </style>
</head>
<body>
<div class="receipt">

  <div class="hdr">
    <div class="logo">
      <div class="logo-box">E</div>
      <div>
        <div class="school-name">${r.schoolName}</div>
        <div class="school-sub">Système de Gestion Scolaire</div>
      </div>
    </div>
    <div class="hdr-right">
      <div>N° <strong>${r.receiptNumber}</strong></div>
      <div>${formatDate(r.issuedAt)}</div>
    </div>
  </div>

  <div class="title">REÇU DE PAIEMENT</div>

  <div class="amount-wrap">
    <div class="amount-label">✓ Paiement confirmé</div>
    <div class="amount-value">${formatMAD(r.totalAmount)} <span class="amount-currency">MAD</span></div>
  </div>

  <div class="info">
    <div><label>Payeur</label><p>${r.parentName}</p></div>
    <div><label>Année scolaire</label><p>${r.academicYear}</p></div>
    <div><label>Mode de règlement</label><p>${methodStr}</p></div>
    <div><label>Date d'émission</label><p>${formatDate(r.issuedAt)}</p></div>
  </div>

  <div class="tbl-wrap">
    <div class="tbl-title">Détail des paiements</div>
    <table>
      <thead>
        <tr>
          <th>Désignation</th>
          <th>Étudiant</th>
          <th style="text-align:center">Classe</th>
          <th style="text-align:right">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${linesHTML}
        <tr class="total-row">
          <td colspan="3" style="text-align:right">TOTAL</td>
          <td style="text-align:right;font-family:monospace">${formatMAD(r.totalAmount)} MAD</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="remaining">
    <div class="remaining-title">Soldes restants après paiement</div>
    ${remainingHTML}
  </div>

  <div class="sigs">
    <div class="sig-box"><div class="sig-label">Signature du responsable financier</div></div>
    <div class="sig-box"><div class="sig-label">Cachet de l'établissement</div></div>
  </div>

  <div class="footer">
    Ce reçu est valable comme preuve de paiement — Conservez-le pour vos archives.
  </div>

</div>
<script>window.addEventListener('load',function(){window.print()});</script>
</body>
</html>`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TarifReceiptProps {
  receipt: ReceiptData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TarifReceipt({ receipt, open, onOpenChange }: TarifReceiptProps) {
  if (!receipt) return null;

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=794,height=1123");
    if (!win) return;
    win.document.write(buildPrintHTML(receipt));
    win.document.close();
    win.focus();
  };

  const methodLabel = METHOD_LABEL[receipt.paymentMethod] ?? receipt.paymentMethod;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle>Reçu de paiement</DialogTitle>
        </DialogHeader>

        {/* ── Visual receipt card ── */}
        <div className="rounded-xl border border-border bg-gradient-to-b from-card/80 to-card/40 overflow-hidden text-sm">

          {/* School header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <GraduationCap className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{receipt.schoolName}</p>
                <p className="text-[10px] text-muted-foreground">Reçu de paiement</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] text-muted-foreground">N° {receipt.receiptNumber}</p>
              <p className="text-[11px] text-muted-foreground">{formatDate(receipt.issuedAt)}</p>
            </div>
          </div>

          {/* Amount hero */}
          <div className="py-6 text-center bg-emerald-500/5 border-b border-emerald-500/10">
            <CheckCircle2 className="h-9 w-9 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Paiement confirmé</p>
            <p className="mt-1 font-mono text-3xl font-bold text-foreground">
              {formatMAD(receipt.totalAmount)}{" "}
              <span className="text-base font-normal text-muted-foreground">MAD</span>
            </p>
          </div>

          <Separator className="bg-border/50" />

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Payeur</p>
              <p className="font-medium mt-0.5">{receipt.parentName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Année scolaire</p>
              <p className="font-medium mt-0.5">{receipt.academicYear}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Mode de règlement</p>
              <Badge variant="outline" className={`mt-1 text-xs border ${METHOD_BADGE[receipt.paymentMethod]}`}>
                {methodLabel}
              </Badge>
            </div>
            {receipt.reference && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Référence</p>
                <p className="font-mono font-medium mt-0.5">{receipt.reference}</p>
              </div>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* Payment lines */}
          <div className="px-5 py-4 space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-3">Détail des paiements</p>
            {receipt.lines.map((line, i) => (
              <div key={i} className="flex items-start justify-between py-2 border-b border-border/30 last:border-0 gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{line.studentName}</p>
                  <p className="text-xs text-muted-foreground">{line.className} · {line.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-semibold text-emerald-400">{formatMAD(line.amount)} MAD</p>
                  <p className="text-[11px] text-muted-foreground">
                    Restant: <span className="text-amber-400 font-mono">{formatMAD(line.remainingAfterPayment)} MAD</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-5 pb-5">
            <div className="rounded-lg bg-secondary/30 border border-border/50 px-4 py-3 text-center">
              <p className="text-[11px] text-muted-foreground">
                Ce reçu est valable comme preuve de paiement — Conservez-le pour vos archives.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button className="flex-1 gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Imprimer / Enregistrer PDF
          </Button>
          <Button variant="outline" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
