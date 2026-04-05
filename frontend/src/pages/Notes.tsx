import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Save, Plus, GraduationCap, BookOpen, PlusCircle, X, FileText, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────────────────────────
interface Student { id: string; nom: string; prenom: string; classe: string; filiere: string; }
interface Matiere { nom: string; coeff: number; }
interface Module { code: string; nom: string; matieres: Matiere[]; }
interface Evaluation { id: string; name: string; type: string; coeff: number; maxNote: number; date: string; }

// ── Static data ──────────────────────────────────────────────────────────
const students: Student[] = [
  { id: "1", nom: "El Amrani", prenom: "Youssef", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "2", nom: "Bennis", prenom: "Fatima Zahra", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "3", nom: "Tazi", prenom: "Ahmed", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "4", nom: "Idrissi", prenom: "Salma", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "5", nom: "Benjelloun", prenom: "Omar", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "6", nom: "Alaoui", prenom: "Hiba", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "7", nom: "Fassi", prenom: "Karim", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "8", nom: "Cherkaoui", prenom: "Nadia", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "9", nom: "Belhaj", prenom: "Amine", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
  { id: "10", nom: "Zouiten", prenom: "Leila", classe: "2BAC-A", filiere: "Sciences Mathématiques" },
];

// Modules organized per semester (S1 & S2)
const semesterModules: Record<"S1" | "S2", Module[]> = {
  S1: [
    {
      code: "MAT01", nom: "Analyse Mathématique", matieres: [
        { nom: "Analyse I — Suites et séries", coeff: 3 },
        { nom: "Analyse II — Fonctions réelles", coeff: 2 },
      ]
    },
    {
      code: "ALG01", nom: "Algèbre Linéaire", matieres: [
        { nom: "Algèbre linéaire et matrices", coeff: 3 },
        { nom: "Espaces vectoriels", coeff: 2 },
      ]
    },
    {
      code: "INF01", nom: "Informatique & Algorithmique", matieres: [
        { nom: "Algorithmique et structures de données", coeff: 2 },
        { nom: "Programmation C", coeff: 2 },
      ]
    },
    {
      code: "PHY01", nom: "Physique Générale", matieres: [
        { nom: "Mécanique du point", coeff: 2 },
        { nom: "Optique géométrique", coeff: 1 },
      ]
    },
    {
      code: "LNG01", nom: "Langue & Communication", matieres: [
        { nom: "Français niveau 1", coeff: 1 },
        { nom: "Anglais scientifique 1", coeff: 1 },
      ]
    },
  ],
  S2: [
    {
      code: "MAT02", nom: "Calcul Différentiel & Intégral", matieres: [
        { nom: "Intégration de Riemann", coeff: 3 },
        { nom: "Équations différentielles", coeff: 2 },
      ]
    },
    {
      code: "ALG02", nom: "Algèbre & Structures", matieres: [
        { nom: "Théorie des groupes", coeff: 2 },
        { nom: "Anneaux et corps", coeff: 2 },
      ]
    },
    {
      code: "INF02", nom: "Développement Logiciel", matieres: [
        { nom: "Programmation orientée objet (Java)", coeff: 2 },
        { nom: "Base de données relationnelles", coeff: 2 },
      ]
    },
    {
      code: "PRB01", nom: "Probabilités & Statistiques", matieres: [
        { nom: "Probabilités discrètes et continues", coeff: 2 },
        { nom: "Statistiques descriptives", coeff: 1 },
      ]
    },
    {
      code: "LNG02", nom: "Langue & Communication", matieres: [
        { nom: "Français niveau 2", coeff: 1 },
        { nom: "Anglais scientifique 2", coeff: 1 },
      ]
    },
  ],
};

// Mock grade data: sid -> semestre -> moduleCode -> matièreNom -> grade
const mockGrades: Record<string, Record<"S1" | "S2", Record<string, Record<string, number>>>> = {
  "1": { S1: { MAT01: { "Analyse I — Suites et séries": 16, "Analyse II — Fonctions réelles": 15 }, ALG01: { "Algèbre linéaire et matrices": 17, "Espaces vectoriels": 16 }, INF01: { "Algorithmique et structures de données": 18, "Programmation C": 17 }, PHY01: { "Mécanique du point": 15, "Optique géométrique": 14 }, LNG01: { "Français niveau 1": 13, "Anglais scientifique 1": 14 } }, S2: { MAT02: { "Intégration de Riemann": 15, "Équations différentielles": 14 }, ALG02: { "Théorie des groupes": 16, "Anneaux et corps": 15 }, INF02: { "Programmation orientée objet (Java)": 18, "Base de données relationnelles": 17 }, PRB01: { "Probabilités discrètes et continues": 14, "Statistiques descriptives": 15 }, LNG02: { "Français niveau 2": 13, "Anglais scientifique 2": 14 } } },
  "2": { S1: { MAT01: { "Analyse I — Suites et séries": 12, "Analyse II — Fonctions réelles": 11 }, ALG01: { "Algèbre linéaire et matrices": 13, "Espaces vectoriels": 12 }, INF01: { "Algorithmique et structures de données": 14, "Programmation C": 13 }, PHY01: { "Mécanique du point": 12, "Optique géométrique": 11 }, LNG01: { "Français niveau 1": 15, "Anglais scientifique 1": 14 } }, S2: { MAT02: { "Intégration de Riemann": 11, "Équations différentielles": 12 }, ALG02: { "Théorie des groupes": 12, "Anneaux et corps": 11 }, INF02: { "Programmation orientée objet (Java)": 14, "Base de données relationnelles": 13 }, PRB01: { "Probabilités discrètes et continues": 12, "Statistiques descriptives": 13 }, LNG02: { "Français niveau 2": 14, "Anglais scientifique 2": 13 } } },
  "3": { S1: { MAT01: { "Analyse I — Suites et séries": 8, "Analyse II — Fonctions réelles": 7 }, ALG01: { "Algèbre linéaire et matrices": 9, "Espaces vectoriels": 8 }, INF01: { "Algorithmique et structures de données": 10, "Programmation C": 9 }, PHY01: { "Mécanique du point": 9, "Optique géométrique": 8 }, LNG01: { "Français niveau 1": 11, "Anglais scientifique 1": 10 } }, S2: { MAT02: { "Intégration de Riemann": 9, "Équations différentielles": 8 }, ALG02: { "Théorie des groupes": 10, "Anneaux et corps": 9 }, INF02: { "Programmation orientée objet (Java)": 11, "Base de données relationnelles": 10 }, PRB01: { "Probabilités discrètes et continues": 9, "Statistiques descriptives": 10 }, LNG02: { "Français niveau 2": 11, "Anglais scientifique 2": 10 } } },
};
// Fill remaining students with generic passing grades
for (const sid of ["4", "5", "6", "7", "8", "9", "10"]) {
  const base = parseInt(sid) % 4 === 0 ? 18 : parseInt(sid) % 3 === 0 ? 12 : 14;
  mockGrades[sid] = { S1: {}, S2: {} };
  for (const [sem, mods] of Object.entries(semesterModules) as ["S1" | "S2", Module[]][]) {
    for (const mod of mods) {
      mockGrades[sid][sem][mod.code] = {};
      for (const mat of mod.matieres) {
        mockGrades[sid][sem][mod.code][mat.nom] = Math.min(20, base + (mat.coeff % 3));
      }
    }
  }
}

const classes = ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B", "TC-A", "TC-B"];

// ── School years (most recent first) ──────────────────────────────────
const schoolYears = ["2024–2025", "2023–2024", "2022–2023", "2021–2022"];

// Return a grade for a given year (past years get a small deterministic offset)
const getGradeForYear = (
  year: string,
  sid: string,
  sem: "S1" | "S2",
  modCode: string,
  matNom: string
): number | null => {
  const base = mockGrades[sid]?.[sem]?.[modCode]?.[matNom];
  if (base === undefined) return null;
  const idx = schoolYears.indexOf(year); // 0 = current year, no offset
  const seed = (sid.charCodeAt(0) + matNom.length + idx) % 5; // deterministic
  const offset = idx === 0 ? 0 : (seed % 2 === 0 ? -idx : idx) * 0.5;
  return Math.max(0, Math.min(20, Math.round((base + offset) * 2) / 2));
};

const evalTypes = [
  { value: "controle", label: "Contrôle" }, { value: "ds", label: "Devoir Surveillé (DS)" },
  { value: "examen", label: "Examen Final" }, { value: "tp", label: "TP" }, { value: "oral", label: "Oral" },
];
const typeBadgeColor: Record<string, string> = {
  controle: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  ds: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  examen: "bg-red-500/15 text-red-400 border-red-500/25",
  tp: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  oral: "bg-amber-500/15 text-amber-400 border-amber-500/25",
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

const defaultSubjects = ["Mathématiques", "Physique-Chimie", "SVT", "Français", "Anglais", "Arabe", "Histoire-Géographie", "Philosophie", "Informatique"];

const getAverageColor = (avg: number | null) => {
  if (avg === null) return "text-muted-foreground";
  return avg >= 14 ? "text-emerald-400" : avg >= 10 ? "text-amber-400" : "text-red-400";
};

// ── Main Component ─────────────────────────────────────────────────────
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

  const [bulletinStudent, setBulletinStudent] = useState(students[0].id);
  const [bulletinYear, setBulletinYear] = useState(schoolYears[0]);
  const bulletinRef = useRef<HTMLDivElement>(null);

  // Gradebook helpers
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
    setSubjects(p => [...p, name]); setSelectedSubject(name); setNewSubjectName(""); setAddingSubject(false);
    toast({ title: "Matière ajoutée", description: `"${name}" ajoutée.` });
  };

  // Bulletin helpers
  const stu = students.find(s => s.id === bulletinStudent)!;
  const getModuleAvg = (sid: string, sem: "S1" | "S2", mod: Module): number | null => {
    let pts = 0, csum = 0;
    mod.matieres.forEach(m => {
      const g = getGradeForYear(bulletinYear, sid, sem, mod.code, m.nom);
      if (g != null) { pts += g * m.coeff; csum += m.coeff; }
    });
    return csum === 0 ? null : Math.round((pts / csum) * 100) / 100;
  };
  const getSemesterAvg = (sid: string, sem: "S1" | "S2"): number | null => {
    const mods = semesterModules[sem];
    let pts = 0, csum = 0;
    mods.forEach(mod => {
      const avg = getModuleAvg(sid, sem, mod);
      const tc = mod.matieres.reduce((a, m) => a + m.coeff, 0);
      if (avg !== null) { pts += avg * tc; csum += tc; }
    });
    return csum === 0 ? null : Math.round((pts / csum) * 100) / 100;
  };
  const annualAvg = (): number | null => {
    const s1 = getSemesterAvg(bulletinStudent, "S1");
    const s2 = getSemesterAvg(bulletinStudent, "S2");
    if (s1 === null || s2 === null) return s1 ?? s2;
    return Math.round(((s1 + s2) / 2) * 100) / 100;
  };

  const handlePrint = () => {
    const content = bulletinRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>Bulletin — ${stu.prenom} ${stu.nom}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:Arial,sans-serif;font-size:11px;color:#000;background:#fff;padding:16px}
        .wrap{max-width:900px;margin:0 auto}
        .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:8px}
        .school-logo{font-size:28px;font-weight:900;letter-spacing:-1px;color:#1a237e;border:3px solid #1a237e;padding:4px 10px}
        .school-info{flex:1;padding-left:16px}
        .school-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
        .school-sub{font-size:10px;color:#444;margin-top:2px}
        .doc-title{text-align:center;margin:8px 0 4px;font-weight:700;font-size:12px;text-transform:uppercase}
        .doc-sub{text-align:center;font-size:11px;margin-bottom:10px}
        .student-info{display:grid;grid-template-columns:1fr 1fr;gap:2px 20px;font-size:10.5px;margin-bottom:10px;border:1px solid #000;padding:6px 10px}
        .student-info span{font-weight:700}
        table{width:100%;border-collapse:collapse;font-size:10px;margin-bottom:12px}
        th{background:#1a237e;color:#fff;text-align:center;padding:4px 5px;border:1px solid #000;font-size:9.5px;vertical-align:middle}
        th.left{text-align:left}
        td{border:1px solid #ccc;padding:3px 5px;vertical-align:middle}
        td.mat{padding-left:16px}
        tr.module-hdr td{background:#e8eaf6;font-weight:700}
        tr.abs-row td{background:#f5f5f5;font-style:italic;font-size:9.5px;color:#555}
        .right{text-align:right} .center{text-align:center}
        .bold{font-weight:700} .green{color:#1b5e20} .red{color:#b71c1c}
        .section-bar{background:#1a237e;color:#fff;text-align:center;font-weight:700;font-size:11px;padding:5px;margin:4px 0;letter-spacing:.5px}
        .summary{display:flex;gap:20px;border:1px solid #000;padding:8px 12px;margin-bottom:10px;font-size:10.5px}
        .summary-item label{font-weight:700;display:block;font-size:9px;text-transform:uppercase;color:#555}
        .summary-item .val{font-size:18px;font-weight:900}
        .footer{border-top:1px solid #000;padding-top:8px;display:flex;justify-content:space-between;margin-top:12px;font-size:9.5px}
        .sig{text-align:center} .sig .line{border-top:1px solid #000;width:120px;margin:30px auto 4px}
        .decisions{display:flex;gap:0} .decisions span{border:1px solid #000;padding:2px 6px;font-size:9px}
        @media print{body{padding:6px}}
      </style></head><body>
      ${content.innerHTML}
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  // Build printable HTML string for the bulletin table
  const buildSemesterTable = (sem: "S1" | "S2") => {
    const mods = semesterModules[sem];
    const semAvg = getSemesterAvg(bulletinStudent, sem);
    const rows: { mod: Module; matGrades: { mat: Matiere; grade: number | null }[]; modAvg: number | null }[] = mods.map(mod => ({
      mod,
      matGrades: mod.matieres.map(m => ({ mat: m, grade: mockGrades[bulletinStudent]?.[sem]?.[mod.code]?.[m.nom] ?? null })),
      modAvg: getModuleAvg(bulletinStudent, sem, mod),
    }));
    return rows.map(({ mod, matGrades, modAvg }) => {
      const validated = modAvg !== null && modAvg >= 10;
      return { mod, matGrades, modAvg, validated };
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cahier de Notes</h1>
            <p className="text-sm text-muted-foreground">Notes, évaluations et bulletins</p>
          </div>
          {activeTab === "notes" ? (
            <div className="flex gap-2">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-2" onClick={() => setEvalDialogOpen(true)}>
                <Plus className="h-4 w-4" />Nouvelle Évaluation
              </Button>
              <Button onClick={() => toast({ title: "Notes enregistrées" })} className="bg-primary gap-2">
                <Save className="h-4 w-4" />Enregistrer
              </Button>
            </div>
          ) : (
              <Button onClick={handlePrint} className="bg-primary gap-2">
                <Printer className="h-4 w-4" />Imprimer / PDF
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {[{ key: "notes", label: "Gradebook", icon: BookOpen }, { key: "bulletins", label: "Bulletins", icon: FileText }].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key as "notes" | "bulletins")}
              className={cn("flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* ══ GRADEBOOK ═══════════════════════════════════════════════════ */}
        {activeTab === "notes" && (
          <>
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
                        className="border-dashed border-border text-muted-foreground gap-1.5">
                        <PlusCircle className="h-3.5 w-3.5" />Autre matière
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground mr-1">Évaluations :</span>
              {evaluations.map(ev => (
                <div key={ev.id} className={cn("flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full border text-xs font-medium", typeBadgeColor[ev.type])}>
                  {ev.name}<span className="opacity-60">· coeff {ev.coeff}</span>
                  <button onClick={() => handleDeleteEvaluation(ev.id)} className="ml-1 hover:opacity-70"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <button onClick={() => setEvalDialogOpen(true)} className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:text-foreground">
                <Plus className="h-3 w-3" />Ajouter
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="sticky left-0 z-10 bg-secondary/50 px-4 py-3 text-left font-medium text-muted-foreground min-w-[200px]">Étudiant</th>
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
                        <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                          <td className="sticky left-0 z-10 bg-card/95 px-4 py-3 font-medium text-foreground">{student.prenom} {student.nom}</td>
                          {evaluations.map(ev => (
                            <td key={ev.id} className="px-3 py-3 text-center">
                              <Input type="number" min="0" max={ev.maxNote} step="0.5"
                                value={grades[student.id]?.[ev.id] ?? ""}
                                onChange={e => handleGradeChange(student.id, ev.id, e.target.value)}
                                className={cn("w-16 mx-auto text-center font-mono bg-secondary/50 border-border",
                                  grades[student.id]?.[ev.id] != null && (grades[student.id][ev.id]! >= 14 ? "text-emerald-400" : grades[student.id][ev.id]! >= 10 ? "text-amber-400" : "text-red-400"))} />
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center bg-primary/5">
                            <span className={cn("font-mono font-bold text-base", getAverageColor(avg))}>{avg !== null ? avg.toFixed(2) : "—"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />≥ 14 : Excellent</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />10–14 : Passable</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />&lt; 10 : Insuffisant</span>
            </div>
          </>
        )}

        {/* ══ BULLETINS ═══════════════════════════════════════════════════ */}
        {activeTab === "bulletins" && (
          <div className="space-y-5">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={bulletinStudent} onValueChange={setBulletinStudent}>
                <SelectTrigger className="w-[240px] bg-card/50 border-border">
                  <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {students.map(s => <SelectItem key={s.id} value={s.id}>{s.prenom} {s.nom}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Year selector */}
              <Select value={bulletinYear} onValueChange={setBulletinYear}>
                <SelectTrigger className="w-[160px] bg-card/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {schoolYears.map(y => (
                    <SelectItem key={y} value={y}>
                      {y}
                      {y === schoolYears[0] && (
                        <span className="ml-2 text-xs text-primary font-medium">En cours</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── Printable Bulletin ──────────────────────────────────── */}
            <div ref={bulletinRef} className="wrap bg-white rounded-xl border border-gray-200 shadow overflow-hidden p-6 max-w-4xl mx-auto text-gray-900" style={{ fontFamily: "Arial,sans-serif", fontSize: "11px" }}>
              {/* Document Header */}
              <div className="header flex justify-between items-start border-b-2 border-black pb-3 mb-3">
                <div className="school-logo font-black text-2xl text-indigo-900 border-4 border-indigo-900 px-3 py-1 leading-none">EDU</div>
                <div className="flex-1 pl-4">
                  <div className="font-bold text-sm uppercase tracking-wide">EduManager Pro — Établissement Scolaire</div>
                  <div className="text-xs text-gray-500">Rue de l'École, Marrakech — Maroc</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs uppercase">BULLETIN DE NOTES</div>
                  <div className="text-xs text-gray-500">{stu.classe} (2024/2025)</div>
                </div>
              </div>

              {/* Subtitle */}
              <div className="text-center font-bold text-xs uppercase mb-1">Relevé de Notes — Semestres 1 & 2</div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 border border-gray-300 p-3 mb-4 text-xs">
                <div>NOM ET PRÉNOM : <strong>{stu.prenom.toUpperCase()} {stu.nom.toUpperCase()}</strong></div>
                <div>N° ÉTUDIANT : <strong>#{stu.id.padStart(4, "0")}</strong></div>
                <div>FILIÈRE : <strong>{stu.filiere}</strong></div>
                <div>CLASSE : <strong>{stu.classe}</strong></div>
              </div>

              {/* Per-semester tables */}
              {(["S1", "S2"] as const).map(sem => {
                const rows = buildSemesterTable(sem);
                const semAvg = getSemesterAvg(bulletinStudent, sem);
                return (
                  <div key={sem} className="mb-4">
                    {/* Semester bar */}
                    <div className="bg-indigo-800 text-white text-center font-bold py-1 text-xs uppercase mb-0">
                      SEMESTRE {sem.slice(1)}
                    </div>

                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-indigo-700 text-white">
                          <th className="border border-indigo-600 px-2 py-1.5 text-left w-16">Codes</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-left w-36">Modules</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-left">Matières</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-center w-10">Coef</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-center w-20">Notes Matières</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-center w-20">Moy Module</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-center w-18">Module validé</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-center w-20">Module non validé</th>
                          <th className="border border-indigo-600 px-2 py-1.5 text-center w-28">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(({ mod, matGrades, modAvg, validated }, ri) => (
                          <>
                            {/* Module rows */}
                            {matGrades.map(({ mat, grade }, mi) => (
                              <tr key={mat.nom} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                {mi === 0 && <td rowSpan={matGrades.length + 1} className="border border-gray-300 px-2 py-1 font-bold text-center align-top bg-gray-100">{mod.code}</td>}
                                {mi === 0 && <td rowSpan={matGrades.length + 1} className="border border-gray-300 px-2 py-1 font-semibold align-top bg-gray-100 text-xs">{mod.nom}</td>}
                                <td className="border border-gray-200 px-2 py-1 pl-4">{mat.nom}</td>
                                <td className="border border-gray-200 px-2 py-1 text-center">{mat.coeff}</td>
                                <td className={`border border-gray-200 px-2 py-1 text-center font-mono font-semibold ${grade !== null && grade >= 14 ? "text-green-700" : grade !== null && grade >= 10 ? "text-amber-600" : "text-red-700"}`}>
                                  {grade !== null ? grade.toFixed(2) : "—"}
                                </td>
                                {mi === 0 && (
                                  <>
                                    <td rowSpan={matGrades.length + 1} className={`border border-gray-300 px-2 py-1 text-center font-bold align-middle text-base font-mono ${modAvg !== null && modAvg >= 14 ? "text-green-700" : modAvg !== null && modAvg >= 10 ? "text-amber-600" : "text-red-700"}`}>
                                      {modAvg !== null ? modAvg.toFixed(2) : "—"}
                                    </td>
                                    <td rowSpan={matGrades.length + 1} className="border border-gray-300 px-2 py-1 text-center align-middle">
                                      {validated && <span className="text-green-700 font-bold text-sm">✓</span>}
                                    </td>
                                    <td rowSpan={matGrades.length + 1} className="border border-gray-300 px-2 py-1 text-center align-middle">
                                      {!validated && modAvg !== null && <span className="text-red-700 font-bold text-sm">✗</span>}
                                    </td>
                                    <td rowSpan={matGrades.length + 1} className="border border-gray-300 px-2 py-1 text-center text-xs align-middle text-gray-500">
                                      {validated ? "Fév-2025" : "—"}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                            {/* Absences row */}
                            <tr className="bg-gray-100 text-gray-500 italic">
                              <td colSpan={2} className="border border-gray-200 px-2 py-0.5 pl-4 text-xs">
                                Nombre d'absences – Bonification – Moy Mod
                              </td>
                              <td className="border border-gray-200 px-2 py-0.5 text-center text-xs">—</td>
                              <td className="border border-gray-200 px-2 py-0.5 text-center text-xs">0</td>
                              <td colSpan={4} className="border border-gray-200" />
                            </tr>
                          </>
                        ))}
                        {/* Semester average row */}
                        <tr className="bg-indigo-50 font-bold">
                          <td colSpan={5} className="border border-indigo-200 px-3 py-1.5 text-right text-xs">Moyenne du Semestre {sem.slice(1)} :</td>
                          <td className={`border border-indigo-200 px-2 py-1.5 text-center font-mono text-sm ${semAvg !== null && semAvg >= 14 ? "text-green-700" : semAvg !== null && semAvg >= 10 ? "text-amber-600" : "text-red-700"}`}>
                            {semAvg !== null ? semAvg.toFixed(2) : "—"}
                          </td>
                          <td colSpan={3} className="border border-indigo-200" />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {/* Summary footer */}
              <div className="border border-gray-300 p-3 mt-2 grid grid-cols-2 gap-3 text-xs">
                <div className="flex gap-6">
                  <div>
                    <div className="text-gray-500 text-xs">Résultat Annuel</div>
                    <div className={`text-xl font-mono font-black mt-0.5 ${(annualAvg() ?? 0) >= 10 ? "text-green-700" : "text-red-700"}`}>{annualAvg() !== null ? annualAvg()!.toFixed(2) : "—"} /20</div>
                  </div>
                  <div className="flex gap-2 items-center mt-4">
                    {[["Admis(e)", (annualAvg() ?? 0) >= 10], ["Admissible", (annualAvg() ?? 0) >= 8 && (annualAvg() ?? 0) < 10], ["Module à repasser", false], ["Redoublable", (annualAvg() ?? 0) < 8]].map(([label, checked]) => (
                      <label key={label as string} className="flex items-center gap-1 cursor-default">
                        <span className={`h-3.5 w-3.5 border border-gray-400 rounded-sm flex items-center justify-center text-green-700 text-xs ${checked ? "bg-white" : "bg-gray-50"}`}>{checked ? "✓" : ""}</span>
                        <span>{label as string}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">Observations :</div>
                  <div className="border-b border-gray-300 mt-5 w-full" />
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between mt-6 text-xs text-gray-600">
                <div className="text-center">
                  <div className="font-semibold mb-8">Signature du Directeur des Études</div>
                  <div className="border-t border-gray-400 w-32 pt-1 text-center text-gray-400">Cachet</div>
                </div>
                <div className="text-center text-gray-400 self-end text-xs">
                  Fait le {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-8">Signature des Parents / Tuteur</div>
                  <div className="border-t border-gray-400 w-32 pt-1" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nouvelle Évaluation Dialog */}
      <Dialog open={evalDialogOpen} onOpenChange={setEvalDialogOpen}>
        <DialogContent className="sm:max-w-[520px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nouvelle Évaluation</DialogTitle>
            <DialogDescription className="text-muted-foreground">Ajoutez une évaluation pour {selectedSubject} — {selectedClasse}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Nom</Label>
              <Input placeholder="Contrôle 3, DS 2…" value={newEval.name} onChange={e => setNewEval({ ...newEval, name: e.target.value })} className="bg-secondary/50 border-border text-foreground" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-foreground">Type</Label>
              <div className="flex flex-wrap gap-2">
                {evalTypes.map(t => (
                  <button key={t.value} type="button" onClick={() => setNewEval({ ...newEval, type: t.value })}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      newEval.type === t.value ? typeBadgeColor[t.value] + " border-current" : "border-border text-muted-foreground hover:bg-muted/50")}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label className="text-foreground">Coefficient</Label>
              <Input type="number" min="1" max="10" step="0.5" value={newEval.coeff} onChange={e => setNewEval({ ...newEval, coeff: parseFloat(e.target.value) || 1 })} className="bg-secondary/50 border-border font-mono" />
            </div>
            <div className="space-y-2"><Label className="text-foreground">Note max</Label>
              <Input type="number" min="10" max="100" step="5" value={newEval.maxNote} onChange={e => setNewEval({ ...newEval, maxNote: parseFloat(e.target.value) || 20 })} className="bg-secondary/50 border-border font-mono" />
            </div>
            <div className="space-y-2 col-span-2"><Label className="text-foreground">Date</Label>
              <Input type="date" value={newEval.date} onChange={e => setNewEval({ ...newEval, date: e.target.value })} className="bg-secondary/50 border-border" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setEvalDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddEvaluation} disabled={!newEval.name.trim()} className="bg-primary gap-2">
              <Plus className="h-4 w-4" />Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
