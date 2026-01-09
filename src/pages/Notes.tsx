import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Plus, GraduationCap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface GradeCell {
  studentId: string;
  evaluationId: string;
  value: number | null;
}

interface Student {
  id: string;
  nom: string;
  prenom: string;
}

interface Evaluation {
  id: string;
  name: string;
  coeff: number;
  maxNote: number;
}

const students: Student[] = [
  { id: "1", nom: "El Amrani", prenom: "Youssef" },
  { id: "2", nom: "Bennis", prenom: "Fatima Zahra" },
  { id: "3", nom: "Tazi", prenom: "Ahmed" },
  { id: "4", nom: "Idrissi", prenom: "Salma" },
  { id: "5", nom: "Benjelloun", prenom: "Omar" },
  { id: "6", nom: "Alaoui", prenom: "Hiba" },
  { id: "7", nom: "Fassi", prenom: "Karim" },
  { id: "8", nom: "Cherkaoui", prenom: "Nadia" },
  { id: "9", nom: "Belhaj", prenom: "Amine" },
  { id: "10", nom: "Zouiten", prenom: "Leila" },
];

const evaluations: Evaluation[] = [
  { id: "c1", name: "Contrôle 1", coeff: 2, maxNote: 20 },
  { id: "ds1", name: "DS 1", coeff: 3, maxNote: 20 },
  { id: "c2", name: "Contrôle 2", coeff: 2, maxNote: 20 },
  { id: "ef", name: "Examen Final", coeff: 4, maxNote: 20 },
];

const initialGrades: Record<string, Record<string, number | null>> = {
  "1": { c1: 16, ds1: 15, c2: 17, ef: 14 },
  "2": { c1: 14, ds1: 13, c2: 15, ef: 16 },
  "3": { c1: 12, ds1: 10, c2: 11, ef: 9 },
  "4": { c1: 18, ds1: 17, c2: 19, ef: 18 },
  "5": { c1: 11, ds1: 12, c2: 10, ef: 13 },
  "6": { c1: 15, ds1: 14, c2: 16, ef: 15 },
  "7": { c1: 13, ds1: 11, c2: 12, ef: 14 },
  "8": { c1: 17, ds1: 16, c2: 18, ef: 17 },
  "9": { c1: 9, ds1: 8, c2: 10, ef: 11 },
  "10": { c1: 14, ds1: 15, c2: 13, ef: 14 },
};

const classes = ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B", "TC-A", "TC-B"];
const subjects = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Français",
  "Anglais",
  "Arabe",
  "Histoire-Géo",
  "Philosophie",
  "Informatique",
];

export default function Notes() {
  const [selectedClasse, setSelectedClasse] = useState("2BAC-A");
  const [selectedSubject, setSelectedSubject] = useState("Mathématiques");
  const [grades, setGrades] = useState(initialGrades);

  const handleGradeChange = (studentId: string, evalId: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    if (numValue !== null && (numValue < 0 || numValue > 20)) return;
    
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [evalId]: numValue,
      },
    }));
  };

  const calculateAverage = (studentId: string): number | null => {
    const studentGrades = grades[studentId];
    if (!studentGrades) return null;

    let totalPoints = 0;
    let totalCoeff = 0;

    evaluations.forEach(evaluation => {
      const grade = studentGrades[evaluation.id];
      if (grade !== null && grade !== undefined) {
        totalPoints += grade * evaluation.coeff;
        totalCoeff += evaluation.coeff;
      }
    });

    if (totalCoeff === 0) return null;
    return Math.round((totalPoints / totalCoeff) * 100) / 100;
  };

  const getAverageColor = (avg: number | null) => {
    if (avg === null) return "text-muted-foreground";
    if (avg >= 14) return "text-emerald-400";
    if (avg >= 10) return "text-amber-400";
    return "text-red-400";
  };

  const handleSave = () => {
    toast({
      title: "Notes enregistrées",
      description: "Les notes ont été sauvegardées avec succès.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cahier de Notes</h1>
            <p className="text-sm text-muted-foreground">
              Gérez les notes et évaluations des étudiants
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border bg-card/50">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Évaluation
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Selectors */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedClasse} onValueChange={setSelectedClasse}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border">
              <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {classes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[220px] bg-card/50 border-border">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gradebook Table */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="sticky left-0 z-10 bg-secondary/50 backdrop-blur-sm px-4 py-3 text-left text-sm font-medium text-muted-foreground min-w-[200px]">
                    Étudiant
                  </th>
                  {evaluations.map((evaluation) => (
                    <th
                      key={evaluation.id}
                      className="px-4 py-3 text-center text-sm font-medium text-muted-foreground min-w-[120px]"
                    >
                      <div>{evaluation.name}</div>
                      <div className="text-xs text-muted-foreground/60 font-normal">
                        Coeff. {evaluation.coeff}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-medium text-foreground min-w-[130px] bg-primary/10">
                    Moyenne Générale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => {
                  const average = calculateAverage(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="sticky left-0 z-10 bg-card/95 backdrop-blur-sm px-4 py-3">
                        <p className="font-medium text-foreground">
                          {student.prenom} {student.nom}
                        </p>
                      </td>
                      {evaluations.map((evaluation) => (
                        <td key={evaluation.id} className="px-4 py-3 text-center">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={grades[student.id]?.[evaluation.id] ?? ""}
                            onChange={(e) => handleGradeChange(student.id, evaluation.id, e.target.value)}
                            className={cn(
                              "w-16 mx-auto text-center font-mono bg-secondary/50 border-border focus:border-primary",
                              grades[student.id]?.[evaluation.id] !== null && grades[student.id]?.[evaluation.id] !== undefined && (
                                grades[student.id][evaluation.id]! >= 14 ? "text-emerald-400" :
                                grades[student.id][evaluation.id]! >= 10 ? "text-amber-400" :
                                "text-red-400"
                              )
                            )}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center bg-primary/5">
                        <span className={cn("font-mono font-bold text-lg", getAverageColor(average))}>
                          {average !== null ? average.toFixed(2) : "-"}
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
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">≥ 14 : Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">10-14 : Passable</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">&lt; 10 : Insuffisant</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
