import { useCallback, useState } from "react";
import { Plus, Printer, RotateCcw } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AssignSlotDialog,
  type Subject,
  type ProfessorOption,
} from "@/components/emploidutemps/AssignSlotDialog";

// ── Constants ─────────────────────────────────────────────────────────────────

const CLASSES = ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B", "TC-A", "TC-B"];

const DAYS: { id: string; label: string }[] = [
  { id: "lundi",    label: "Lundi"    },
  { id: "mardi",    label: "Mardi"    },
  { id: "mercredi", label: "Mercredi" },
  { id: "jeudi",    label: "Jeudi"    },
  { id: "vendredi", label: "Vendredi" },
];

const SLOTS: { id: string; label: string }[] = [
  { id: "S1", label: "08h00 – 10h00" },
  { id: "S2", label: "10h00 – 12h00" },
  { id: "S3", label: "14h00 – 16h00" },
  { id: "S4", label: "16h00 – 18h00" },
];

const SUBJECTS: Subject[] = [
  { id: "math",  label: "Mathématiques",     styles: { bg: "bg-indigo-500/15",  text: "text-indigo-300",   border: "border-indigo-500/30",  dot: "bg-indigo-400"  } },
  { id: "pc",    label: "Physique-Chimie",   styles: { bg: "bg-amber-500/15",   text: "text-amber-300",    border: "border-amber-500/30",   dot: "bg-amber-400"   } },
  { id: "fr",    label: "Français",          styles: { bg: "bg-emerald-500/15", text: "text-emerald-300",  border: "border-emerald-500/30", dot: "bg-emerald-400" } },
  { id: "hg",    label: "Histoire-Géo",      styles: { bg: "bg-rose-500/15",    text: "text-rose-300",     border: "border-rose-500/30",    dot: "bg-rose-400"    } },
  { id: "svt",   label: "SVT",              styles: { bg: "bg-green-500/15",   text: "text-green-300",    border: "border-green-500/30",   dot: "bg-green-400"   } },
  { id: "info",  label: "Informatique",      styles: { bg: "bg-cyan-500/15",    text: "text-cyan-300",     border: "border-cyan-500/30",    dot: "bg-cyan-400"    } },
  { id: "en",    label: "Anglais",           styles: { bg: "bg-blue-500/15",    text: "text-blue-300",     border: "border-blue-500/30",    dot: "bg-blue-400"    } },
  { id: "ar",    label: "Arabe",             styles: { bg: "bg-orange-500/15",  text: "text-orange-300",   border: "border-orange-500/30",  dot: "bg-orange-400"  } },
  { id: "eps",   label: "EPS",              styles: { bg: "bg-teal-500/15",    text: "text-teal-300",     border: "border-teal-500/30",    dot: "bg-teal-400"    } },
  { id: "philo", label: "Philosophie",       styles: { bg: "bg-violet-500/15",  text: "text-violet-300",   border: "border-violet-500/30",  dot: "bg-violet-400"  } },
];

interface Professor {
  id: string;
  name: string;
  initials: string;
  subjectIds: string[];
}

const PROFESSORS: Professor[] = [
  { id: "p1",  name: "M. Benali",      initials: "MB", subjectIds: ["math"]            },
  { id: "p2",  name: "Mme. Alaoui",    initials: "AL", subjectIds: ["pc", "svt"]       },
  { id: "p3",  name: "M. Dupont",      initials: "MD", subjectIds: ["fr"]              },
  { id: "p4",  name: "M. El Fassi",    initials: "EF", subjectIds: ["info"]            },
  { id: "p5",  name: "Mme. Smith",     initials: "SM", subjectIds: ["en"]              },
  { id: "p6",  name: "M. Berrada",     initials: "BR", subjectIds: ["hg", "philo"]     },
  { id: "p7",  name: "Mme. Tahiri",    initials: "TH", subjectIds: ["svt", "pc"]       },
  { id: "p8",  name: "M. Chraibi",     initials: "CH", subjectIds: ["philo", "hg"]     },
  { id: "p9",  name: "M. Karimi",      initials: "KR", subjectIds: ["eps"]             },
  { id: "p10", name: "M. Hajji",       initials: "HJ", subjectIds: ["ar"]              },
  { id: "p11", name: "Mme. Berrada",   initials: "BB", subjectIds: ["math", "pc"]      },
  { id: "p12", name: "Mme. Cherkaoui", initials: "CK", subjectIds: ["fr", "ar"]        },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SlotEntry {
  matiereId: string;
  professorId: string;
}

// classId → dayId → slotId → SlotEntry | null
type Timetable = Record<string, Record<string, Record<string, SlotEntry | null>>>;

// ── Demo initial data (2BAC-A fully filled, 2BAC-B partial, rest empty) ──────

const INITIAL_TIMETABLE: Timetable = {
  "2BAC-A": {
    lundi:    { S1: { matiereId: "math", professorId: "p1"  }, S2: { matiereId: "pc",   professorId: "p2"  }, S3: { matiereId: "fr",  professorId: "p3"  }, S4: null },
    mardi:    { S1: null,                                        S2: null,                                        S3: { matiereId: "info", professorId: "p4" }, S4: null },
    mercredi: { S1: { matiereId: "en",  professorId: "p5"  }, S2: { matiereId: "hg",  professorId: "p6"  }, S3: null,                                         S4: null },
    jeudi:    { S1: { matiereId: "math", professorId: "p1"  }, S2: null,                                        S3: { matiereId: "svt", professorId: "p2"  }, S4: null },
    vendredi: { S1: null,                                        S2: { matiereId: "philo", professorId: "p8" }, S3: { matiereId: "eps", professorId: "p9"  }, S4: { matiereId: "ar", professorId: "p10" } },
  },
  "2BAC-B": {
    lundi:    { S1: { matiereId: "math", professorId: "p11" }, S2: null,                                        S3: null, S4: null },
    mardi:    { S1: { matiereId: "pc",  professorId: "p2"  }, S2: null,                                        S3: null, S4: null },
    mercredi: { S1: null,                                        S2: null,                                        S3: { matiereId: "hg", professorId: "p6" }, S4: null },
    jeudi:    { S1: { matiereId: "info", professorId: "p4"  }, S2: null,                                        S3: null, S4: null },
    vendredi: { S1: { matiereId: "en",  professorId: "p5"  }, S2: null,                                        S3: null, S4: null },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEntry(timetable: Timetable, classId: string, dayId: string, slotId: string): SlotEntry | null {
  return timetable[classId]?.[dayId]?.[slotId] ?? null;
}

function subjectById(id: string) {
  return SUBJECTS.find((s) => s.id === id);
}
function professorById(id: string) {
  return PROFESSORS.find((p) => p.id === id);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EmploiDuTemps() {
  const [timetable, setTimetable]       = useState<Timetable>(INITIAL_TIMETABLE);
  const [selectedClass, setSelectedClass] = useState("2BAC-A");
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editingCell, setEditingCell]   = useState<{ dayId: string; slotId: string } | null>(null);

  // Current cell's entry
  const currentEntry = editingCell
    ? getEntry(timetable, selectedClass, editingCell.dayId, editingCell.slotId)
    : null;

  // Conflict-aware professor list for a given subject at the currently editing slot
  const getProfessors = useCallback(
    (subjectId: string): ProfessorOption[] => {
      if (!editingCell) return [];
      return PROFESSORS.filter((p) => p.subjectIds.includes(subjectId)).map((p) => {
        let conflictClass: string | undefined;
        for (const [classId, days] of Object.entries(timetable)) {
          if (classId === selectedClass) continue;
          const entry = days[editingCell.dayId]?.[editingCell.slotId];
          if (entry?.professorId === p.id) { conflictClass = classId; break; }
        }
        return { id: p.id, name: p.name, initials: p.initials, available: !conflictClass, conflictClass };
      });
    },
    [editingCell, timetable, selectedClass]
  );

  const openCell = (dayId: string, slotId: string) => {
    setEditingCell({ dayId, slotId });
    setDialogOpen(true);
  };

  const handleAssign = (matiereId: string, professorId: string) => {
    if (!editingCell) return;
    setTimetable((prev) => ({
      ...prev,
      [selectedClass]: {
        ...(prev[selectedClass] ?? {}),
        [editingCell.dayId]: {
          ...(prev[selectedClass]?.[editingCell.dayId] ?? {}),
          [editingCell.slotId]: { matiereId, professorId },
        },
      },
    }));
    const subj = subjectById(matiereId)?.label ?? matiereId;
    const prof = professorById(professorId)?.name ?? professorId;
    toast.success(`${subj} assigné à ${prof}`);
  };

  const handleClear = () => {
    if (!editingCell) return;
    setTimetable((prev) => ({
      ...prev,
      [selectedClass]: {
        ...(prev[selectedClass] ?? {}),
        [editingCell.dayId]: {
          ...(prev[selectedClass]?.[editingCell.dayId] ?? {}),
          [editingCell.slotId]: null,
        },
      },
    }));
    toast.success("Créneau libéré");
  };

  const handleResetClass = () => {
    setTimetable((prev) => ({ ...prev, [selectedClass]: {} }));
    toast.success(`Emploi du temps de ${selectedClass} réinitialisé`);
  };

  const handlePrint = () => {
    const rows = SLOTS.map((slot) =>
      `<tr>
        <td style="padding:8px 12px;font-weight:600;white-space:nowrap;border:1px solid #e2e8f0;background:#f8fafc;font-size:12px;color:#64748b">${slot.label}</td>
        ${DAYS.map((day) => {
          const entry = getEntry(timetable, selectedClass, day.id, slot.id);
          if (!entry) return `<td style="padding:8px;border:1px solid #e2e8f0;"></td>`;
          const subj = subjectById(entry.matiereId);
          const prof = professorById(entry.professorId);
          return `<td style="padding:8px;border:1px solid #e2e8f0;">
            <div style="font-weight:700;font-size:13px;margin-bottom:2px">${subj?.label ?? entry.matiereId}</div>
            <div style="font-size:11px;color:#64748b">${prof?.name ?? entry.professorId}</div>
          </td>`;
        }).join("")}
      </tr>`
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Emploi du temps – ${selectedClass}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px}h2{margin-bottom:16px}table{width:100%;border-collapse:collapse}th{padding:10px 12px;background:#1e293b;color:#fff;font-size:13px;border:1px solid #334155;text-align:left}@media print{body{padding:0}}</style></head>
    <body><h2>Emploi du temps — ${selectedClass}</h2>
    <table><thead><tr><th>Horaire</th>${DAYS.map((d) => `<th>${d.label}</th>`).join("")}</tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;

    const w = window.open("");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.addEventListener("load", () => w.print());
  };

  // Slot fill stats for the selected class
  const totalSlots  = DAYS.length * SLOTS.length;
  const filledSlots = DAYS.reduce((acc, d) =>
    acc + SLOTS.filter((s) => getEntry(timetable, selectedClass, d.id, s.id) !== null).length, 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emploi du temps</h1>
            <p className="text-sm text-muted-foreground">
              {filledSlots}/{totalSlots} créneaux assignés · {selectedClass}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[160px] border-border bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                {CLASSES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-secondary/50 hover:bg-secondary gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
              onClick={handleResetClass}
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Timetable grid */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                {/* empty corner */}
                <th className="w-[130px] border-b border-r border-border/50 p-3" />
                {DAYS.map((day) => (
                  <th
                    key={day.id}
                    className="border-b border-r border-border/50 p-3 text-center text-sm font-semibold text-foreground last:border-r-0"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot, slotIdx) => (
                <tr key={slot.id}>
                  {/* Time label */}
                  <td
                    className={cn(
                      "border-r border-border/50 px-3 py-2 text-right",
                      slotIdx < SLOTS.length - 1 && "border-b"
                    )}
                  >
                    <p className="text-xs font-semibold text-muted-foreground">{slot.label}</p>
                  </td>

                  {/* Day cells */}
                  {DAYS.map((day, dayIdx) => {
                    const entry = getEntry(timetable, selectedClass, day.id, slot.id);
                    const subj  = entry ? subjectById(entry.matiereId) : null;
                    const prof  = entry ? professorById(entry.professorId) : null;

                    return (
                      <td
                        key={day.id}
                        className={cn(
                          "p-2 border-border/50",
                          slotIdx < SLOTS.length - 1 && "border-b",
                          dayIdx < DAYS.length - 1 && "border-r"
                        )}
                      >
                        {entry && subj ? (
                          /* Filled cell */
                          <button
                            onClick={() => openCell(day.id, slot.id)}
                            className={cn(
                              "w-full rounded-lg border px-3 py-2.5 text-left transition-all hover:brightness-110",
                              subj.styles.bg,
                              subj.styles.border
                            )}
                          >
                            <p className={cn("text-sm font-semibold truncate", subj.styles.text)}>
                              {subj.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {prof?.name ?? "—"}
                            </p>
                          </button>
                        ) : (
                          /* Empty cell */
                          <button
                            onClick={() => openCell(day.id, slot.id)}
                            className="w-full h-[62px] rounded-lg border border-dashed border-border/40 text-muted-foreground/40 hover:border-primary/40 hover:text-primary/60 hover:bg-primary/5 transition-all flex items-center justify-center gap-1"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subject legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {SUBJECTS.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", s.styles.dot)} />
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment dialog */}
      <AssignSlotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dayLabel={DAYS.find((d) => d.id === editingCell?.dayId)?.label ?? ""}
        slotLabel={SLOTS.find((s) => s.id === editingCell?.slotId)?.label ?? ""}
        subjects={SUBJECTS}
        getProfessors={getProfessors}
        currentEntry={currentEntry}
        onAssign={handleAssign}
        onClear={handleClear}
      />
    </DashboardLayout>
  );
}
