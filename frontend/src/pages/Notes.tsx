import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { gradeService, studentService, teacherService } from "@/services";
import type {
  EvaluationType,
  GradeDTO,
  GradeRequest,
  Semester,
  StudentDTO,
  TeacherDTO,
} from "@/types/api.types";

interface NewGradeForm {
  studentId: string;
  teacherId: string;
  moduleName: string;
  evaluationType: EvaluationType;
  semester: Semester;
  score: string;
  coefficient: string;
  academicYear: string;
  gradedAt: string;
}

const evalTypeLabel: Record<EvaluationType, string> = {
  CONTROL: "Contrôle",
  DS: "DS",
  EXAM: "Examen",
  TP: "TP",
  ORAL: "Oral",
};

export default function Notes() {
  const [grades, setGrades] = useState<GradeDTO[]>([]);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [teachers, setTeachers] = useState<TeacherDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<Semester | "ALL">("ALL");
  const [selectedStudent, setSelectedStudent] = useState<string>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeDTO | null>(null);
  const [form, setForm] = useState<NewGradeForm>({
    studentId: "",
    teacherId: "",
    moduleName: "",
    evaluationType: "CONTROL",
    semester: "S1",
    score: "",
    coefficient: "1",
    academicYear: "2024-2025",
    gradedAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [gradeRes, studentRes, teacherRes] = await Promise.all([
          gradeService.getAll(),
          studentService.getAll(0, 300),
          teacherService.getAll(),
        ]);
        setGrades(gradeRes);
        setStudents(studentRes.content);
        setTeachers(teacherRes);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les notes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredGrades = useMemo(() => {
    return grades
      .filter((g) => selectedSemester === "ALL" || g.semester === selectedSemester)
      .filter((g) => selectedStudent === "ALL" || g.studentId.toString() === selectedStudent)
      .sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime());
  }, [grades, selectedSemester, selectedStudent]);

  const avg = useMemo(() => {
    if (filteredGrades.length === 0) return null;
    const totalWeighted = filteredGrades.reduce((sum, g) => sum + g.score * g.coefficient, 0);
    const totalCoeff = filteredGrades.reduce((sum, g) => sum + g.coefficient, 0);
    return totalCoeff > 0 ? Math.round((totalWeighted / totalCoeff) * 100) / 100 : null;
  }, [filteredGrades]);

  const resetForm = () => {
    setEditingGrade(null);
    setForm({
      studentId: "",
      teacherId: "",
      moduleName: "",
      evaluationType: "CONTROL",
      semester: "S1",
      score: "",
      coefficient: "1",
      academicYear: "2024-2025",
      gradedAt: new Date().toISOString().split("T")[0],
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (grade: GradeDTO) => {
    setEditingGrade(grade);
    setForm({
      studentId: grade.studentId.toString(),
      teacherId: grade.teacherId?.toString() ?? "",
      moduleName: grade.moduleName,
      evaluationType: grade.evaluationType,
      semester: grade.semester,
      score: grade.score.toString(),
      coefficient: grade.coefficient.toString(),
      academicYear: grade.academicYear,
      gradedAt: grade.gradedAt,
    });
    setDialogOpen(true);
  };

  const saveGrade = async () => {
    if (!form.studentId || !form.moduleName || !form.score || !form.coefficient) {
      toast({ title: "Champs requis", description: "Veuillez remplir les champs obligatoires." });
      return;
    }

    const payload: GradeRequest = {
      studentId: Number(form.studentId),
      teacherId: form.teacherId ? Number(form.teacherId) : 0,
      moduleName: form.moduleName,
      evaluationType: form.evaluationType,
      semester: form.semester,
      score: Number(form.score),
      coefficient: Number(form.coefficient),
      academicYear: form.academicYear,
      gradedAt: form.gradedAt,
    };

    try {
      if (editingGrade) {
        const updated = await gradeService.update(editingGrade.id, payload);
        setGrades((prev) => prev.map((g) => (g.id === editingGrade.id ? updated : g)));
        toast({ title: "Note modifiée", description: "La note a été mise à jour." });
      } else {
        const created = await gradeService.create(payload);
        setGrades((prev) => [created, ...prev]);
        toast({ title: "Note ajoutée", description: "La note a été enregistrée." });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la note.",
        variant: "destructive",
      });
    }
  };

  const removeGrade = async (id: number) => {
    try {
      await gradeService.delete(id);
      setGrades((prev) => prev.filter((g) => g.id !== id));
      toast({ title: "Note supprimée", description: "La note a été supprimée." });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notes</h1>
            <p className="text-sm text-muted-foreground">Gérez les évaluations et les notes des étudiants</p>
          </div>
          <Button className="gap-2" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Nouvelle note
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Select value={selectedSemester} onValueChange={(v) => setSelectedSemester(v as Semester | "ALL")}>
            <SelectTrigger className="bg-card/50 border-border">
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">Tous les semestres</SelectItem>
              <SelectItem value="S1">Semestre 1</SelectItem>
              <SelectItem value="S2">Semestre 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="bg-card/50 border-border">
              <SelectValue placeholder="Étudiant" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">Tous les étudiants</SelectItem>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.firstName} {s.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-lg border border-border bg-card/50 px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Moyenne pondérée</span>
            <span className="text-lg font-bold text-primary">{avg ?? "—"}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3">Étudiant</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Semestre</th>
                <th className="px-4 py-3">Note</th>
                <th className="px-4 py-3">Coeff.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement des notes...
                  </td>
                </tr>
              )}
              {!isLoading && filteredGrades.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Aucune note trouvée
                  </td>
                </tr>
              )}
              {!isLoading && filteredGrades.map((grade) => (
                <tr key={grade.id} className="border-b border-border/50 hover:bg-muted/40">
                  <td className="px-4 py-3">{grade.studentName}</td>
                  <td className="px-4 py-3">{grade.moduleName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {evalTypeLabel[grade.evaluationType]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{grade.semester}</td>
                  <td className="px-4 py-3 font-semibold">{grade.score.toFixed(2)}</td>
                  <td className="px-4 py-3">{grade.coefficient}</td>
                  <td className="px-4 py-3">{new Date(grade.gradedAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(grade)}>
                        Modifier
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeGrade(grade.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
            <DialogTitle>{editingGrade ? "Modifier la note" : "Ajouter une note"}</DialogTitle>
            <DialogDescription>
              Saisissez les informations de l'évaluation
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Étudiant</Label>
              <Select value={form.studentId} onValueChange={(v) => setForm((p) => ({ ...p, studentId: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choisir un étudiant" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Professeur</Label>
              <Select value={form.teacherId} onValueChange={(v) => setForm((p) => ({ ...p, teacherId: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choisir un professeur" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.firstName} {t.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Module</Label>
              <Input
                value={form.moduleName}
                onChange={(e) => setForm((p) => ({ ...p, moduleName: e.target.value }))}
                className="bg-secondary/50 border-border"
                placeholder="Ex: Mathématiques"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.evaluationType} onValueChange={(v) => setForm((p) => ({ ...p, evaluationType: v as EvaluationType }))}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="CONTROL">Contrôle</SelectItem>
                  <SelectItem value="DS">DS</SelectItem>
                  <SelectItem value="EXAM">Examen</SelectItem>
                  <SelectItem value="TP">TP</SelectItem>
                  <SelectItem value="ORAL">Oral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre</Label>
              <Select value={form.semester} onValueChange={(v) => setForm((p) => ({ ...p, semester: v as Semester }))}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="S1">S1</SelectItem>
                  <SelectItem value="S2">S2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note /20</Label>
              <Input
                type="number"
                min={0}
                max={20}
                step="0.01"
                value={form.score}
                onChange={(e) => setForm((p) => ({ ...p, score: e.target.value }))}
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Coefficient</Label>
              <Input
                type="number"
                min={0.5}
                step="0.5"
                value={form.coefficient}
                onChange={(e) => setForm((p) => ({ ...p, coefficient: e.target.value }))}
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Année académique</Label>
              <Input
                value={form.academicYear}
                onChange={(e) => setForm((p) => ({ ...p, academicYear: e.target.value }))}
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.gradedAt}
                onChange={(e) => setForm((p) => ({ ...p, gradedAt: e.target.value }))}
                className="bg-secondary/50 border-border"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={saveGrade} className="gap-2">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
