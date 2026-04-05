import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserX, Trash2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  label: string;
  styles: { bg: string; text: string; border: string; dot: string };
}

export interface ProfessorOption {
  id: string;
  name: string;
  initials: string;
  available: boolean;
  /** Name of the class that has already taken this professor at this slot. */
  conflictClass?: string;
}

interface AssignSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayLabel: string;
  slotLabel: string;
  subjects: Subject[];
  /** Called each time selected subject changes to get fresh availability. */
  getProfessors: (subjectId: string) => ProfessorOption[];
  currentEntry: { matiereId: string; professorId: string } | null;
  onAssign: (matiereId: string, professorId: string) => void;
  onClear: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AssignSlotDialog({
  open,
  onOpenChange,
  dayLabel,
  slotLabel,
  subjects,
  getProfessors,
  currentEntry,
  onAssign,
  onClear,
}: AssignSlotDialogProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [professors, setProfessors] = useState<ProfessorOption[]>([]);

  // Reset when dialog opens; pre-select current matiere if editing
  useEffect(() => {
    if (open) {
      setSelectedSubject(currentEntry?.matiereId ?? null);
    } else {
      setSelectedSubject(null);
      setProfessors([]);
    }
  }, [open, currentEntry]);

  // Refresh professor list whenever selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      setProfessors(getProfessors(selectedSubject));
    } else {
      setProfessors([]);
    }
  }, [selectedSubject, getProfessors]);

  const handlePickProfessor = (prof: ProfessorOption) => {
    if (!prof.available || !selectedSubject) return;
    onAssign(selectedSubject, prof.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            Assigner un cours
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {dayLabel} · {slotLabel}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Current assignment */}
        {currentEntry && (
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Actuel :{" "}
              <span className="text-foreground font-medium">
                {subjects.find((s) => s.id === currentEntry.matiereId)?.label}
              </span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={() => { onClear(); onOpenChange(false); }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Effacer
            </Button>
          </div>
        )}

        {/* Step 1 — Subject grid */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            1. Matière
          </p>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all text-left",
                  selectedSubject === s.id
                    ? `${s.styles.bg} ${s.styles.text} ${s.styles.border}`
                    : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                )}
              >
                <span className={cn("h-2 w-2 rounded-full shrink-0", s.styles.dot)} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Professor list */}
        {selectedSubject && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              2. Professeur
            </p>
            {professors.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Aucun professeur pour cette matière.
              </p>
            ) : (
              <div className="space-y-1.5">
                {professors.map((prof) => (
                  <button
                    key={prof.id}
                    disabled={!prof.available}
                    onClick={() => handlePickProfessor(prof)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all",
                      prof.available
                        ? "border-border/50 hover:border-primary/50 hover:bg-primary/5 text-foreground cursor-pointer"
                        : "border-border/30 text-muted-foreground/50 cursor-not-allowed opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {prof.initials}
                      </div>
                      <span className="font-medium">{prof.name}</span>
                    </div>
                    {!prof.available && prof.conflictClass && (
                      <Badge className="bg-red-500/15 text-red-400 border-red-500/30 border gap-1 text-xs">
                        <UserX className="h-3 w-3" />
                        Occupé · {prof.conflictClass}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
