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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Tarif, MockStudent, PaymentFrequency } from "./types";

// ── Config ────────────────────────────────────────────────────────────────────

const FREQUENCY_OPTIONS: { value: PaymentFrequency; label: string }[] = [
  { value: "MONTHLY",     label: "Mensuel"     },
  { value: "TRIMESTRIAL", label: "Trimestriel" },
  { value: "ANNUAL",      label: "Annuel"      },
];

/** Months in academic-year order (Sep → Jun). */
const SCHOOL_MONTHS = [
  { value: 9,  label: "Septembre" },
  { value: 10, label: "Octobre"   },
  { value: 11, label: "Novembre"  },
  { value: 12, label: "Décembre"  },
  { value: 1,  label: "Janvier"   },
  { value: 2,  label: "Février"   },
  { value: 3,  label: "Mars"      },
  { value: 4,  label: "Avril"     },
  { value: 5,  label: "Mai"       },
  { value: 6,  label: "Juin"      },
];

/**
 * How many instalments remain from `enrollmentMonth` to end of year.
 *
 * School year: September (9) → June (6).
 *  - MONTHLY:     count the months left (Sep=10, Oct=9 … Jun=1)
 *  - TRIMESTRIAL: count the trimesters left
 *      T1 Sep–Nov → 3 | T2 Dec–Feb → 2 | T3 Mar–Jun → 1
 *  - ANNUAL:      always 1
 */
function computeInstallmentCount(frequency: PaymentFrequency, month: number): number {
  if (frequency === "ANNUAL") return 1;
  if (frequency === "MONTHLY") {
    if (month >= 9) return 19 - month;            // Sep→10 … Dec→7
    if (month <= 6) return Math.max(1, 7 - month); // Jan→6 … Jun→1
    return 1;
  }
  // TRIMESTRIAL
  if (month >= 9 && month <= 11) return 3;         // T1 start
  if (month === 12 || month <= 2) return 2;        // T2 start
  return 1;                                        // T3 start (Mar–Jun)
}

function trimestrialLabel(count: number) {
  if (count === 3) return "T1 + T2 + T3";
  if (count === 2) return "T2 + T3";
  return "T3";
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TarifDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tarif?: Tarif | null;
  students: MockStudent[];
  onSave: (data: Omit<Tarif, "id" | "amountPaid" | "remainingAmount" | "progressPercent">) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TarifDialog({ open, onOpenChange, tarif, students, onSave }: TarifDialogProps) {
  const isEdit = !!tarif;

  const [studentId,      setStudentId]      = useState<number | "">("");
  const [academicYear,   setAcademicYear]   = useState("2024-2025");
  const [totalAmount,    setTotalAmount]    = useState("");
  const [frequency,      setFrequency]      = useState<PaymentFrequency>("TRIMESTRIAL");
  const [enrollmentMonth, setEnrollmentMonth] = useState<number>(9);
  const [description,    setDescription]   = useState("");

  useEffect(() => {
    if (tarif) {
      setStudentId(tarif.studentId);
      setAcademicYear(tarif.academicYear);
      setTotalAmount(String(tarif.totalAmount));
      setFrequency(tarif.frequency);
      setEnrollmentMonth(tarif.enrollmentMonth);
      setDescription(tarif.description ?? "");
    } else {
      setStudentId("");
      setAcademicYear("2024-2025");
      setTotalAmount("");
      setFrequency("TRIMESTRIAL");
      setEnrollmentMonth(9);
      setDescription("");
    }
  }, [tarif, open]);

  const total            = parseFloat(totalAmount) || 0;
  const installmentCount = computeInstallmentCount(frequency, enrollmentMonth);
  const installmentAmount = installmentCount > 0 ? total / installmentCount : total;

  const monthLabel = SCHOOL_MONTHS.find((m) => m.value === enrollmentMonth)?.label ?? "";

  const installmentSummary = () => {
    if (frequency === "ANNUAL") return "1 versement annuel";
    if (frequency === "MONTHLY") return `${installmentCount} versement${installmentCount > 1 ? "s" : ""} mensuel${installmentCount > 1 ? "s" : ""}`;
    return `${trimestrialLabel(installmentCount)} (${installmentCount} versement${installmentCount > 1 ? "s" : ""})`;
  };

  const handleSubmit = () => {
    if (!studentId || !totalAmount || !academicYear) return;
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    onSave({
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      studentInitials: student.initials,
      className: student.className,
      academicYear,
      enrollmentMonth,
      totalAmount: total,
      frequency,
      installmentCount,
      installmentAmount,
      description: description || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le tarif" : "Nouveau tarif"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Student */}
          <div className="space-y-1.5">
            <Label>Étudiant</Label>
            <Select
              value={studentId === "" ? "" : String(studentId)}
              onValueChange={(v) => setStudentId(Number(v))}
              disabled={isEdit}
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {students.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name} — {s.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Academic year */}
          <div className="space-y-1.5">
            <Label>Année scolaire</Label>
            <Input
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2024-2025"
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Enrollment month + frequency — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Mois d'intégration</Label>
              <Select
                value={String(enrollmentMonth)}
                onValueChange={(v) => setEnrollmentMonth(Number(v))}
              >
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {SCHOOL_MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Fréquence</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as PaymentFrequency)}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {FREQUENCY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enrollment note */}
          {enrollmentMonth !== 9 && (
            <p className="text-xs text-amber-400 -mt-1">
              Intégration en {monthLabel} — paiement à partir de ce mois uniquement.
            </p>
          )}

          {/* Total amount */}
          <div className="space-y-1.5">
            <Label>Montant total dû (MAD)</Label>
            <Input
              type="number"
              min={0}
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="30 000"
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Preview */}
          {total > 0 && (
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Échéancier</span>
                <span className="font-medium">{installmentSummary()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant par versement</span>
                <span className="font-medium text-primary">
                  {new Intl.NumberFormat("fr-MA").format(installmentAmount)} MAD
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description (optionnel)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes sur ce tarif…"
              rows={2}
              className="bg-secondary/50 border-border resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!studentId || !totalAmount || !academicYear}
          >
            {isEdit ? "Enregistrer" : "Créer le tarif"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
