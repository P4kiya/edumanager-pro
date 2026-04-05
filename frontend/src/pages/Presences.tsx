import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { attendanceService, studentService } from "@/services";
import type { AttendanceRequest, AttendanceSession, AttendanceStatus, StudentDTO } from "@/types/api.types";

type UiStatus = "present" | "late" | "absent" | "unset";

interface Session {
  id: AttendanceSession;
  label: string;
}

interface StudentAttendance {
  id: number;
  nom: string;
  prenom: string;
  avatar: string;
  classe: string;
  statuses: Record<AttendanceSession, UiStatus>;
}

const sessions: Session[] = [
  { id: "SESSION_1", label: "08h00 – 10h00" },
  { id: "SESSION_2", label: "10h00 – 12h00" },
  { id: "SESSION_3", label: "14h00 – 16h00" },
  { id: "SESSION_4", label: "16h00 – 18h00" },
];

const statusConfig = {
  present: {
    label: "Présent",
    icon: CheckCircle2,
    active: "bg-emerald-500 text-white shadow-emerald-500/30 shadow-md",
    inactive: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
  },
  late: {
    label: "Retard",
    icon: Clock,
    active: "bg-amber-500 text-white shadow-amber-500/30 shadow-md",
    inactive: "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    active: "bg-red-500 text-white shadow-red-500/30 shadow-md",
    inactive: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  },
} as const;

const toUiStatus = (status: AttendanceStatus): UiStatus =>
  status === "PRESENT" ? "present" : status === "LATE" ? "late" : "absent";

const toApiStatus = (status: UiStatus): AttendanceStatus =>
  status === "present" ? "PRESENT" : status === "late" ? "LATE" : "ABSENT";

const toUiStudent = (student: StudentDTO): StudentAttendance => ({
  id: student.id,
  nom: student.lastName,
  prenom: student.firstName,
  avatar:
    student.avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${student.firstName}%20${student.lastName}`,
  classe: student.className,
  statuses: {
    SESSION_1: "unset",
    SESSION_2: "unset",
    SESSION_3: "unset",
    SESSION_4: "unset",
  },
});

export default function Presences() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClasse, setSelectedClasse] = useState<string>("all");
  const [activeSessionId, setActiveSessionId] = useState<AttendanceSession>("SESSION_1");
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const studentPage = await studentService.getAll(0, 300);
        const base = studentPage.content.map(toUiStudent);
        setStudents(base);

        const selectedDate = format(date, "yyyy-MM-dd");
        const attendance = await attendanceService.getAll();

        setStudents((prev) =>
          prev.map((student) => {
            const next = { ...student, statuses: { ...student.statuses } };
            attendance
              .filter((a) => a.studentId === student.id && a.date === selectedDate)
              .forEach((a) => {
                next.statuses[a.session] = toUiStatus(a.status);
              });
            return next;
          }),
        );
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les présences.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [date]);

  const classes = useMemo(
    () => ["all", ...Array.from(new Set(students.map((s) => s.classe))).sort()],
    [students],
  );

  const filteredStudents = useMemo(
    () =>
      selectedClasse === "all"
        ? students
        : students.filter((student) => student.classe === selectedClasse),
    [students, selectedClasse],
  );

  const activeSession = sessions.find((s) => s.id === activeSessionId)!;
  const sessionIndex = sessions.findIndex((s) => s.id === activeSessionId);

  const getStatus = (student: StudentAttendance, sessionId: AttendanceSession): UiStatus =>
    student.statuses[sessionId] ?? "unset";

  const handleStatusChange = (studentId: number, sessionId: AttendanceSession, newStatus: UiStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, statuses: { ...s.statuses, [sessionId]: newStatus } }
          : s,
      ),
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) =>
        selectedClasse === "all" || s.classe === selectedClasse
          ? { ...s, statuses: { ...s.statuses, [activeSessionId]: "present" } }
          : s,
      ),
    );
  };

  const handleSaveSession = async () => {
    const dateString = format(date, "yyyy-MM-dd");
    const toSave = filteredStudents
      .filter((student) => getStatus(student, activeSessionId) !== "unset")
      .map((student): AttendanceRequest => ({
        studentId: student.id,
        date: dateString,
        session: activeSessionId,
        status: toApiStatus(getStatus(student, activeSessionId)),
        className: student.classe,
        markedByTeacher: "Système",
      }));

    if (toSave.length === 0) {
      toast({ title: "Aucune donnée", description: "Aucune présence à enregistrer pour cette session." });
      return;
    }

    try {
      setIsSaving(true);
      await attendanceService.saveSessionAttendance(toSave);
      toast({
        title: "Session enregistrée",
        description: `Présences sauvegardées pour ${activeSession.label}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les présences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const counts = {
    present: filteredStudents.filter((s) => getStatus(s, activeSessionId) === "present").length,
    late: filteredStudents.filter((s) => getStatus(s, activeSessionId) === "late").length,
    absent: filteredStudents.filter((s) => getStatus(s, activeSessionId) === "absent").length,
    unset: filteredStudents.filter((s) => getStatus(s, activeSessionId) === "unset").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registre des Présences</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Suivez les présences par session
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleMarkAllPresent}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-2"
              disabled={isLoading}
            >
              <CheckCircle2 className="h-4 w-4" />
              Tous présents
            </Button>
            <Button onClick={handleSaveSession} className="bg-primary text-primary-foreground gap-2" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal border-border bg-card/50",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "EEEE d MMMM yyyy", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Select value={selectedClasse} onValueChange={setSelectedClasse}>
            <SelectTrigger className="w-[220px] bg-card/50 border-border">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.filter((c) => c !== "all").map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center border-b border-border overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveSessionId(sessions[Math.max(0, sessionIndex - 1)].id)}
              disabled={sessionIndex === 0}
              className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <button
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className={cn(
                    "flex-1 min-w-[140px] flex flex-col items-center py-3 px-4 border-b-2 transition-all text-sm",
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <span>{sess.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setActiveSessionId(sessions[Math.min(sessions.length - 1, sessionIndex + 1)].id)}
              disabled={sessionIndex === sessions.length - 1}
              className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-5 py-3 bg-primary/5 border-b border-border/50">
            <span className="font-semibold text-foreground">{activeSession.label}</span>
            <div className="flex gap-3 text-xs font-medium">
              <span className="text-emerald-400">{counts.present} présent{counts.present !== 1 ? "s" : ""}</span>
              <span className="text-amber-400">{counts.late} retard{counts.late !== 1 ? "s" : ""}</span>
              <span className="text-red-400">{counts.absent} absent{counts.absent !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="divide-y divide-border/50">
            {isLoading && (
              <div className="px-5 py-6 text-muted-foreground text-sm">Chargement des étudiants...</div>
            )}
            {!isLoading && filteredStudents.map((student) => {
              const current = getStatus(student, activeSessionId);
              return (
                <div key={student.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {student.prenom[0]}{student.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {student.prenom} {student.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">{student.classe}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {(["present", "late", "absent"] as const).map((status) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const isActive = current === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, activeSessionId, status)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            isActive ? config.active : config.inactive,
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Présents", value: counts.present, color: "emerald", icon: CheckCircle2 },
            { label: "Retards", value: counts.late, color: "amber", icon: Clock },
            { label: "Absents", value: counts.absent, color: "red", icon: XCircle },
            { label: "Non renseignés", value: counts.unset, color: "slate", icon: Users },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className={`rounded-xl border border-${color}-500/20 bg-${color}-500/10 p-4 flex items-center gap-3`}>
              <div className={`h-9 w-9 rounded-lg bg-${color}-500/20 flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 text-${color}-400`} />
              </div>
              <div>
                <p className={`text-2xl font-bold font-mono text-${color}-400`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
