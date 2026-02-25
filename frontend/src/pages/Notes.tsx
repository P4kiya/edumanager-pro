import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Save, Plus, GraduationCap, BookOpen, PlusCircle, X,
  FileText, Printer, TrendingUp, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ── Types ───────────────────────────────────────────────────────────────
interface Student { id: string; nom: string; prenom: string; classe: string; }
interface Evaluation { id: string; name: string; type: string; coeff: number; maxNote: number; date: string; }

// ── Mock Data ────────────────────────────────────────────────────────────
const students: Student[] = [
  { id: "1", nom: "El Amrani", prenom: "Youssef", classe: "2BAC-A" },
  { id: "2", nom: "Bennis", prenom: "Fatima Zahra", classe: "2BAC-A" },
  { id: "3", nom: "Tazi", prenom: "Ahmed", classe: "2BAC-A" },
  { id: "4", nom: "Idrissi", prenom: "Salma", classe: "2BAC-A" },
  { id: "5", nom: "Benjelloun", prenom: "Omar", classe: "2BAC-A" },
  { id: "6", nom: "Alaoui", prenom: "Hiba", classe: "2BAC-A" },
  { id: "7", nom: "Fassi", prenom: "Karim", classe: "2BAC-A" },
  { id: "8", nom: "Cherkaoui", prenom: "Nadia", classe: "2BAC-A" },
  { id: "9", nom: "Belhaj", prenom: "Amine", classe: "2BAC-A" },
  { id: "10", nom: "Zouiten", prenom: "Leila", classe: "2BAC-A" },
];

const defaultSubjects = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Anglais", "Arabe", "Histoire-Géographie", "Philosophie", "Informatique"];
const classes = ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B", "TC-A", "TC-B"];

const evalTypes = [
  { value: "controle", label: "Contrôle" },
  { value: "ds", label: "Devoir Surveillé (DS)" },
  { value: "examen", label: "Examen Final" },
  { value: "tp", label: "TP" },
  { value: "oral", label: "Oral" },
];
const typeBadgeColor: Record<string, string> = {
  controle: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  ds: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  examen: "bg-red-500/15 text-red-400 border-red-500/25",
  tp: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  oral: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

// Pre-built S1 & S2 mock grades per matière per student
const semesterGrades: Record<"S1" | "S2", Record<string, Record<string, number>>> = {
  S1: {
    "1": { "Mathématiques": 16, "Physique-Chimie": 15, "SVT": 14, "Français": 13, "Anglais": 17, "Arabe": 15, "Histoire-Géographie": 12, "Philosophie": 14, "Informatique": 18 },
    "2": { "Mathématiques": 12, "Physique-Chimie": 11, "SVT": 13, "Français": 15, "Anglais": 14, "Arabe": 16, "Histoire-Géographie": 13, "Philosophie": 11, "Informatique": 14 },
    "3": { "Mathématiques": 9, "Physique-Chimie": 10, "SVT": 8, "Français": 11, "Anglais": 10, "Arabe": 12, "Histoire-Géographie": 9, "Philosophie": 10, "Informatique": 11 },
    "4": { "Mathématiques": 18, "Physique-Chimie": 17, "SVT": 19, "Français": 16, "Anglais": 18, "Arabe": 17, "Histoire-Géographie": 15, "Philosophie": 16, "Informatique": 19 },
    "5": { "Mathématiques": 11, "Physique-Chimie": 12, "SVT": 10, "Français": 13, "Anglais": 11, "Arabe": 12, "Histoire-Géographie": 10, "Philosophie": 11, "Informatique": 13 },
    "6": { "Mathématiques": 15, "Physique-Chimie": 14, "SVT": 16, "Français": 14, "Anglais": 15, "Arabe": 13, "Histoire-Géographie": 14, "Philosophie": 12, "Informatique": 15 },
    "7": { "Mathématiques": 13, "Physique-Chimie": 11, "SVT": 12, "Français": 14, "Anglais": 12, "Arabe": 13, "Histoire-Géographie": 11, "Philosophie": 10, "Informatique": 14 },
    "8": { "Mathématiques": 17, "Physique-Chimie": 16, "SVT": 18, "Français": 15, "Anglais": 17, "Arabe": 16, "Histoire-Géographie": 14, "Philosophie": 15, "Informatique": 17 },
    "9": { "Mathématiques": 8, "Physique-Chimie": 9, "SVT": 10, "Français": 11, "Anglais": 9, "Arabe": 10, "Histoire-Géographie": 8, "Philosophie": 9, "Informatique": 10 },
    "10": { "Mathématiques": 14, "Physique-Chimie": 15, "SVT": 13, "Français": 14, "Anglais": 16, "Arabe": 14, "Histoire-Géographie": 12, "Philosophie": 13, "Informatique": 15 },
  },
  S2: {
    "1": { "Mathématiques": 17, "Physique-Chimie": 14, "SVT": 15, "Français": 14, "Anglais": 18, "Arabe": 16, "Histoire-Géographie": 13, "Philosophie": 15, "Informatique": 19 },
    "2": { "Mathématiques": 13, "Physique-Chimie": 12, "SVT": 14, "Français": 16, "Anglais": 15, "Arabe": 17, "Histoire-Géographie": 14, "Philosophie": 12, "Informatique": 13 },
    "3": { "Mathématiques": 10, "Physique-Chimie": 9, "SVT": 9, "Français": 12, "Anglais": 11, "Arabe": 13, "Histoire-Géographie": 10, "Philosophie": 11, "Informatique": 10 },
    "4": { "Mathématiques": 19, "Physique-Chimie": 18, "SVT": 18, "Français": 17, "Anglais": 19, "Arabe": 18, "Histoire-Géographie": 16, "Philosophie": 17, "Informatique": 20 },
    "5": { "Mathématiques": 12, "Physique-Chimie": 11, "SVT": 11, "Français": 14, "Anglais": 12, "Arabe": 11, "Histoire-Géographie": 11, "Philosophie": 12, "Informatique": 12 },
    "6": { "Mathématiques": 16, "Physique-Chimie": 15, "SVT": 17, "Français": 15, "Anglais": 16, "Arabe": 14, "Histoire-Géographie": 15, "Philosophie": 13, "Informatique": 16 },
    "7": { "Mathématiques": 14, "Physique-Chimie": 12, "SVT": 13, "Français": 15, "Anglais": 13, "Arabe": 14, "Histoire-Géographie": 12, "Philosophie": 11, "Informatique": 15 },
    "8": { "Mathématiques": 18, "Physique-Chimie": 17, "SVT": 19, "Français": 16, "Anglais": 18, "Arabe": 17, "Histoire-Géographie": 15, "Philosophie": 16, "Informatique": 18 },
    "9": { "Mathématiques": 9, "Physique-Chimie": 10, "SVT": 11, "Français": 12, "Anglais": 10, "Arabe": 11, "Histoire-Géographie": 9, "Philosophie": 10, "Informatique": 11 },
    "10": { "Mathématiques": 15, "Physique-Chimie": 14, "SVT": 14, "Français": 15, "Anglais": 17, "Arabe": 15, "Histoire-Géographie": 13, "Philosophie": 14, "Informatique": 16 },
  },
};

// Coefficients per matière (2BAC Sciences Maths-ish)
const subjectCoeff: Record<string, number> = {
  "Mathématiques": 7, "Physique-Chimie": 5, "SVT": 3,
  "Français": 2, "Anglais": 2, "Arabe": 2,
  "Histoire-Géographie": 2, "Philosophie": 2, "Informatique": 1,
};

const getAppreciation = (avg: number): string => {
  if (avg >= 17) return "Excellent(e)";
  if (avg >= 14) return "Très bien";
  if (avg >= 12) return "Bien";
  if (avg >= 10) return "Assez bien";
  if (avg >= 8) return "Passable";
  return "Insuffisant(e)";
};
const getAverageColor = (avg: number | null) => {
  if (avg === null) return "text-muted-foreground";
  if (avg >= 14) return "text-emerald-400";
  if (avg >= 10) return "text-amber-400";
  return "text-red-400";
};

const initialEvals: Evaluation[] = [
  { id: "c1", name: "Contrôle 1", type: "controle", coeff: 2, maxNote: 20, date: "2025-01-10" },
  { id: "ds1", name: "DS 1", type: "ds", coeff: 3, maxNote: 20, date: "2025-02-15" },
  { id: "c2", name: "Contrôle 2", type: "controle", coeff: 2, maxNote: 20, date: "2025-03-05" },
  { id: "ef", name: "Examen Final", type: "examen", coeff: 4, maxNote: 20, date: "2025-04-20" },
];
const initialGrades: Record<string, Record<string, number | null>> = {
  "1": { c1: 16, ds1: 15, c2: 17, ef: 14 }, "2": { c1: 14, ds1: 13, c2: 15, ef: 16 },
  "3": { c1: 12, ds1: 10, c2: 11, ef: 9 }, "4": { c1: 18, ds1: 17, c2: 19, ef: 18 },
  "5": { c1: 11, ds1: 12, c2: 10, ef: 13 }, "6": { c1: 15, ds1: 14, c2: 16, ef: 15 },
  "7": { c1: 13, ds1: 11, c2: 12, ef: 14 }, "8": { c1: 17, ds1: 16, c2: 18, ef: 17 },
  "9": { c1: 9, ds1: 8, c2: 10, ef: 11 }, "10": { c1: 14, ds1: 15, c2: 13, ef: 14 },
};

// ── Main Component ────────────────────────────────────────────────────────
export default function Notes() {
  const [activeTab, setActiveTab] = useState<"notes" | "bulletins">("notes");
  const [selectedClasse, setSelectedClasse] = useState("2BAC-A");
  const [selectedSubject, setSelectedSubject] = useState("Mathématiques");
  const [grades, setGrades] = useState(initialGrades);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvals);
  const [subjects, setSubjects] = useState<string[]>(defaultSubjects);
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newEval, setNewEval] = useState({ name: "", type: "controle", coeff: 2, maxNote: 20, date: new Date().toISOString().split("T")[0] });

  // Bulletins state
  const [bulletinStudent, setBulletinStudent] = useState(students[0].id);
  const [bulletinPeriod, setBulletinPeriod] = useState<"S1" | "S2" | "Annuel">("S1");
  const bulletinRef = useRef<HTMLDivElement>(null);

  // ── Grade helpers ──
  const handleGradeChange = (sid: string, eid: string, val: string) => {
    const n = val === "" ? null : parseFloat(val);
    if (n !== null && (n < 0 || n > 20)) return;
    setGrades(p => ({ ...p, [sid]: { ...p[sid], [eid]: n } }));
  };
  const calculateAverage = (sid: string): number | null => {
    const sg = grades[sid]; if (!sg) return null;
    let pts = 0, coef = 0;
    evaluations.forEach(ev => { const g = sg[ev.id]; if (g != null) { pts += g * ev.coeff; coef += ev.coeff; } });
    return coef === 0 ? null : Math.round((pts / coef) * 100) / 100;
  };

  // ── Evaluation CRUD ──
  const handleAddEvaluation = () => {
    if (!newEval.name.trim()) return;
    setEvaluations(p => [...p, { ...newEval, id: `eval_${Date.now()}` }]);
    toast({ title: "Évaluation créée", description: `"${newEval.name}" ajoutée.` });
    setEvalDialogOpen(false);
    setNewEval({ name: "", type: "controle", coeff: 2, maxNote: 20, date: new Date().toISOString().split("T")[0] });
  };
  const handleDeleteEvaluation = (eid: string) => {
    setEvaluations(p => p.filter(e => e.id !== eid));
    setGrades(p => { const n = { ...p }; Object.keys(n).forEach(sid => { const { [eid]: _, ...r } = n[sid]; n[sid] = r; }); return n; });
  };
  const handleAddSubject = () => {
    const name = newSubjectName.trim();
    if (!name || subjects.includes(name)) return;
    setSubjects(p => [...p, name]);
    setSelectedSubject(name);
    setNewSubjectName(""); setAddingSubject(false);
    toast({ title: "Matière ajoutée", description: `"${name}" ajoutée.` });
  };
  const handleSave = () => toast({ title: "Notes enregistrées", description: "Sauvegardées avec succès." });

  // ── Bulletin computation ──
  const bulletinStudentObj = students.find(s => s.id === bulletinStudent)!;
  const bulletinSubjects = subjects;
  const getBulletinGrade = (subject: string, sem: "S1" | "S2"): number | null =>
    semesterGrades[sem]?.[bulletinStudent]?.[subject] ?? null;
  const getBulletinRow = (subject: string) => {
    const s1 = getBulletinGrade(subject, "S1");
    const s2 = getBulletinGrade(subject, "S2");
    const coeff = subjectCoeff[subject] ?? 1;
    const annual = s1 !== null && s2 !== null ? Math.round(((s1 + s2) / 2) * 100) / 100 : null;
    return { s1, s2, annual, coeff };
  };
  const computeGeneralAverage = (period: "S1" | "S2" | "Annuel"): number | null => {
    let pts = 0, coeSum = 0;
    bulletinSubjects.forEach(sub => {
      const coeff = subjectCoeff[sub] ?? 1;
      const { s1, s2, annual } = getBulletinRow(sub);
      const grade = period === "S1" ? s1 : period === "S2" ? s2 : annual;
      if (grade !== null) { pts += grade * coeff; coeSum += coeff; }
    });
    return coeSum === 0 ? null : Math.round((pts / coeSum) * 100) / 100;
  };
  const generalAvg = computeGeneralAverage(bulletinPeriod);

  // ── Print ──
  const handlePrint = () => {
    const content = bulletinRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="UTF-8"><title>Bulletin — ${bulletinStudentObj.prenom} ${bulletinStudentObj.nom}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 24px; color: #1a1a2e; background: white; font-size: 13px; }
        .bulletin { max-width: 740px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB; }
        .school-name { font-size: 20px; font-weight: 700; color: #4F46E5; }
        .school-sub  { font-size: 12px; color: #6B7280; margin-top: 4px; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; }
        .student-info { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .info-row { display: flex; gap: 6px; }
        .info-label { color: #6B7280; min-width: 90px; }
        .info-value { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead tr { background: #4F46E5; color: white; }
        th { padding: 9px 12px; text-align: left; font-size: 12px; font-weight: 600; }
        th.right { text-align: right; }
        td { padding: 8px 12px; border-bottom: 1px solid #E5E7EB; }
        td.right { text-align: right; font-weight: 600; font-family: monospace; }
        tr:nth-child(even) { background: #F9FAFB; }
        tr:hover { background: #EEF2FF; }
        .green { color: #059669; } .amber { color: #D97706; } .red { color: #DC2626; }
        .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
        .summary-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px 18px; }
        .summary-card .label { font-size: 11px; color: #6B7280; margin-bottom: 4px; }
        .summary-card .value { font-size: 22px; font-weight: 700; font-family: monospace; }
        .footer { text-align: center; font-size: 11px; color: #9CA3AF; margin-top: 16px; border-top: 1px solid #E5E7EB; padding-top: 12px; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
  };

  // ── Render ──
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cahier de Notes</h1>
            <p className="text-sm text-muted-foreground">Notes, évaluations et bulletins scolaires</p>
          </div>
          {activeTab === "notes" ? (
            <div className="flex gap-2">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-2" onClick={() => setEvalDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Nouvelle Évaluation
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
                <Save className="h-4 w-4" /> Enregistrer
              </Button>
            </div>
          ) : (
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90 gap-2">
              <Printer className="h-4 w-4" /> Imprimer / PDF
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {[
            { key: "notes", label: "Gradebook", icon: BookOpen },
            { key: "bulletins", label: "Bulletins", icon: FileText },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "notes" | "bulletins")}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* ══ GRADEBOOK TAB ═══════════════════════════════════════════════ */}
        {activeTab === "notes" && (
          <>
            {/* Selectors */}
            <div className="flex flex-wrap gap-4 items-end">
              <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                <SelectTrigger className="w-[180px] bg-card/50 border-border">
                  <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                {addingSubject ? (
                  <div className="flex items-center gap-2">
                    <Input autoFocus placeholder="Nom de la matière..." value={newSubjectName}
                      onChange={e => setNewSubjectName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleAddSubject(); if (e.key === "Escape") setAddingSubject(false); }}
                      className="w-[220px] bg-card/50 border-primary text-foreground" />
                    <Button size="sm" onClick={handleAddSubject} className="bg-primary"><Plus className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setAddingSubject(false)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-[220px] bg-card/50 border-border">
                          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    <Button size="sm" variant="outline" onClick={() => setAddingSubject(true)}
                      className="border-dashed border-border text-muted-foreground hover:text-foreground gap-1.5">
                      <PlusCircle className="h-3.5 w-3.5" /> Autre matière
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Eval chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground mr-1">Évaluations :</span>
              {evaluations.map(ev => (
                <div key={ev.id} className={cn("flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full border text-xs font-medium", typeBadgeColor[ev.type])}>
                  {ev.name}<span className="opacity-60">· coeff {ev.coeff}</span>
                  <button onClick={() => handleDeleteEvaluation(ev.id)} className="ml-1 hover:opacity-70"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <button onClick={() => setEvalDialogOpen(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/50">
                <Plus className="h-3 w-3" /> Ajouter
              </button>
            </div>

            {/* Gradebook Table */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="sticky left-0 z-10 bg-secondary/50 backdrop-blur-sm px-4 py-3 text-left font-medium text-muted-foreground min-w-[200px]">Étudiant</th>
                      {evaluations.map(ev => (
                        <th key={ev.id} className="px-4 py-3 text-center font-medium text-muted-foreground min-w-[110px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>{ev.name}</span>
                            <Badge className={cn("text-[10px] px-1.5 py-0", typeBadgeColor[ev.type])}>
                              {evalTypes.find(t => t.value === ev.type)?.label.split(" ")[0]} · {ev.coeff}
                            </Badge>
                          </div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center font-semibold text-foreground min-w-[130px] bg-primary/10">Moyenne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map(student => {
                      const avg = calculateAverage(student.id);
                      return (
                        <tr key={student.id} className="hover:bg-white/5 transition-colors">
                          <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-4 py-3 font-medium text-foreground">{student.prenom} {student.nom}</td>
                          {evaluations.map(ev => (
                            <td key={ev.id} className="px-3 py-3 text-center">
                              <Input type="number" min="0" max={ev.maxNote} step="0.5"
                                value={grades[student.id]?.[ev.id] ?? ""}
                                onChange={e => handleGradeChange(student.id, ev.id, e.target.value)}
                                className={cn("w-16 mx-auto text-center font-mono bg-secondary/50 border-border focus:border-primary",
                                  grades[student.id]?.[ev.id] != null && (
                                    grades[student.id][ev.id]! >= 14 ? "text-emerald-400" :
                                      grades[student.id][ev.id]! >= 10 ? "text-amber-400" : "text-red-400"))}
                              />
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center bg-primary/5">
                            <span className={cn("font-mono font-bold text-base", getAverageColor(avg))}>
                              {avg !== null ? avg.toFixed(2) : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />≥ 14 : Excellent</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />10–14 : Passable</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />&lt; 10 : Insuffisant</span>
            </div>
          </>
        )}

        {/* ══ BULLETINS TAB ════════════════════════════════════════════════ */}
        {activeTab === "bulletins" && (
          <div className="space-y-5">
            {/* Selectors */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={bulletinStudent} onValueChange={setBulletinStudent}>
                <SelectTrigger className="w-[240px] bg-card/50 border-border">
                  <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {students.map(s => <SelectItem key={s.id} value={s.id}>{s.prenom} {s.nom}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex gap-1 rounded-lg border border-border p-0.5 bg-card/50">
                {(["S1", "S2", "Annuel"] as const).map(p => (
                  <button key={p} onClick={() => setBulletinPeriod(p)}
                    className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                      bulletinPeriod === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                    {p}
                  </button>
                ))}
              </div>

              <span className="ml-auto text-sm text-muted-foreground">
                Année scolaire <span className="font-semibold text-foreground">2024–2025</span>
              </span>
            </div>

            {/* Printable bulletin */}
            <div ref={bulletinRef} className="bulletin rounded-xl border border-border bg-white text-gray-900 overflow-hidden shadow-sm max-w-3xl mx-auto">
              {/* Bulletin Header */}
              <div className="header flex justify-between items-start px-8 pt-8 pb-6 border-b border-gray-200">
                <div>
                  <div className="school-name text-2xl font-bold text-indigo-600">EduManager Pro</div>
                  <div className="school-sub text-xs text-gray-500 mt-0.5">Établissement scolaire — Année 2024–2025</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">Bulletin {bulletinPeriod === "Annuel" ? "Annuel" : `Semestre ${bulletinPeriod.slice(1)}`}</div>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {bulletinStudentObj.classe}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="student-info grid grid-cols-2 gap-3 mx-8 my-5 rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm">
                {[
                  { label: "Nom & Prénom", value: `${bulletinStudentObj.prenom} ${bulletinStudentObj.nom}` },
                  { label: "Classe", value: bulletinStudentObj.classe },
                  { label: "N° Étudiant", value: `#${bulletinStudentObj.id.padStart(4, "0")}` },
                  { label: "Période", value: bulletinPeriod === "Annuel" ? "Annuel (S1 + S2)" : `Semestre ${bulletinPeriod.slice(1)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-500 min-w-[110px]">{label} :</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* Grades Table */}
              <div className="px-8 mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="px-4 py-2.5 text-left font-semibold">Matière</th>
                      <th className="px-4 py-2.5 text-center font-semibold w-16">Coeff.</th>
                      {bulletinPeriod !== "Annuel" ? (
                        <th className="px-4 py-2.5 text-right font-semibold w-24">Note /20</th>
                      ) : (
                        <>
                          <th className="px-4 py-2.5 text-right font-semibold w-20">S1 /20</th>
                          <th className="px-4 py-2.5 text-right font-semibold w-20">S2 /20</th>
                          <th className="px-4 py-2.5 text-right font-semibold w-24 bg-indigo-700">Année /20</th>
                        </>
                      )}
                      <th className="px-4 py-2.5 text-left font-semibold">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletinSubjects.map((sub, idx) => {
                      const { s1, s2, annual, coeff } = getBulletinRow(sub);
                      const displayGrade = bulletinPeriod === "S1" ? s1 : bulletinPeriod === "S2" ? s2 : annual;
                      const colorClass = displayGrade === null ? "text-gray-400" :
                        displayGrade >= 14 ? "text-emerald-600 font-bold" :
                          displayGrade >= 10 ? "text-amber-600 font-bold" : "text-red-600 font-bold";
                      return (
                        <tr key={sub} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 font-medium text-gray-800 border-b border-gray-100">{sub}</td>
                          <td className="px-4 py-2.5 text-center text-gray-500 border-b border-gray-100">{coeff}</td>
                          {bulletinPeriod !== "Annuel" ? (
                            <td className={cn("px-4 py-2.5 text-right font-mono border-b border-gray-100", colorClass)}>
                              {displayGrade !== null ? displayGrade.toFixed(2) : "—"}
                            </td>
                          ) : (
                            <>
                              <td className={cn("px-4 py-2.5 text-right font-mono border-b border-gray-100", s1 !== null && (s1 >= 14 ? "text-emerald-600" : s1 >= 10 ? "text-amber-600" : "text-red-600"))}>
                                {s1 !== null ? s1.toFixed(2) : "—"}
                              </td>
                              <td className={cn("px-4 py-2.5 text-right font-mono border-b border-gray-100", s2 !== null && (s2 >= 14 ? "text-emerald-600" : s2 >= 10 ? "text-amber-600" : "text-red-600"))}>
                                {s2 !== null ? s2.toFixed(2) : "—"}
                              </td>
                              <td className={cn("px-4 py-2.5 text-right font-mono border-b border-gray-100 bg-indigo-50", colorClass)}>
                                {annual !== null ? annual.toFixed(2) : "—"}
                              </td>
                            </>
                          )}
                          <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-100 italic">
                            {displayGrade !== null ? getAppreciation(displayGrade) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mx-8 mb-8">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" /> Moyenne générale
                  </div>
                  <div className={cn("text-3xl font-bold font-mono", getAverageColor(generalAvg))}>
                    {generalAvg !== null ? generalAvg.toFixed(2) : "—"}
                    <span className="text-base font-normal text-gray-400"> /20</span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> Mention
                  </div>
                  <div className={cn("text-lg font-bold", getAverageColor(generalAvg))}>
                    {generalAvg !== null ? getAppreciation(generalAvg) : "—"}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500 mb-1">Décision</div>
                  <div className={cn("text-lg font-bold", generalAvg !== null && generalAvg >= 10 ? "text-emerald-600" : "text-red-600")}>
                    {generalAvg === null ? "—" : generalAvg >= 10 ? "Admis(e)" : "Avertissement"}
                  </div>
                </div>
              </div>

              {/* Signature area */}
              <div className="footer flex justify-between text-gray-500 text-xs px-8 py-4 border-t border-gray-100">
                <div>
                  <div className="font-semibold text-gray-700 mb-4">Signature du Directeur</div>
                  <div className="mt-6 border-t border-gray-300 w-36 pt-1">Cachet de l'établissement</div>
                </div>
                <div className="text-center">
                  <p className="text-gray-400">Document généré le {new Date().toLocaleDateString("fr-FR")}</p>
                  <p className="mt-1">EduManager Pro · Année scolaire 2024–2025</p>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-4">Signature des Parents</div>
                  <div className="mt-6 border-t border-gray-300 w-36" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Nouvelle Évaluation Dialog ───────────────────────────────────── */}
      <Dialog open={evalDialogOpen} onOpenChange={setEvalDialogOpen}>
        <DialogContent className="sm:max-w-[520px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nouvelle Évaluation</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Ajoutez une évaluation pour {selectedSubject} — {selectedClasse}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Nom de l'évaluation</Label>
              <Input placeholder="ex: Contrôle 3, DS 2…" value={newEval.name}
                onChange={e => setNewEval({ ...newEval, name: e.target.value })}
                className="bg-secondary/50 border-border text-foreground" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Type</Label>
              <div className="flex flex-wrap gap-2">
                {evalTypes.map(t => (
                  <button key={t.value} type="button" onClick={() => setNewEval({ ...newEval, type: t.value })}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      newEval.type === t.value ? typeBadgeColor[t.value] + " border-current" : "border-border text-muted-foreground hover:text-foreground hover:bg-white/5")}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Coefficient</Label>
              <Input type="number" min="1" max="10" step="0.5" value={newEval.coeff}
                onChange={e => setNewEval({ ...newEval, coeff: parseFloat(e.target.value) || 1 })}
                className="bg-secondary/50 border-border text-foreground font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Note maximale</Label>
              <Input type="number" min="10" max="100" step="5" value={newEval.maxNote}
                onChange={e => setNewEval({ ...newEval, maxNote: parseFloat(e.target.value) || 20 })}
                className="bg-secondary/50 border-border text-foreground font-mono" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Date</Label>
              <Input type="date" value={newEval.date}
                onChange={e => setNewEval({ ...newEval, date: e.target.value })}
                className="bg-secondary/50 border-border text-foreground" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEvalDialogOpen(false)} className="border-border text-foreground">Annuler</Button>
            <Button onClick={handleAddEvaluation} disabled={!newEval.name.trim()} className="bg-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Créer l'évaluation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
