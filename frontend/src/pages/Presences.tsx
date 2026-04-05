import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Save,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { WhatsAppNotifyDialog } from "@/components/presences/WhatsAppNotifyDialog";
import type { AbsentStudent } from "@/components/presences/WhatsAppNotifyDialog";

type AttendanceStatus = "present" | "late" | "absent" | "unset";

interface Session {
  id: string;
  label: string;
  matiere: string;
  professeur: string;
}

interface StudentAttendance {
  id: string;
  nom: string;
  prenom: string;
  avatar: string;
  parentName: string;
  parentPhone: string;
  statuses: Record<string, AttendanceStatus>;
}

const sessions: Session[] = [
  { id: "S1", label: "08h00 – 10h00", matiere: "Mathématiques",      professeur: "M. Benali"    },
  { id: "S2", label: "10h00 – 12h00", matiere: "Physique-Chimie",    professeur: "Mme. El Fassi"},
  { id: "S3", label: "14h00 – 16h00", matiere: "Français",           professeur: "M. Dubois"    },
  { id: "S4", label: "16h00 – 18h00", matiere: "Histoire-Géographie",professeur: "Mme. Alami"   },
];

const classes = ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B", "TC-A", "TC-B"];

const initialStudents = (): StudentAttendance[] => [
  { id: "1",  nom: "El Amrani",  prenom: "Youssef",      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", parentName: "M. El Amrani",    parentPhone: "+212661234567", statuses: {} },
  { id: "2",  nom: "Bennis",     prenom: "Fatima Zahra", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face", parentName: "Mme. Bennis",     parentPhone: "+212662345678", statuses: {} },
  { id: "3",  nom: "Tazi",       prenom: "Ahmed",        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", parentName: "M. Tazi",         parentPhone: "+212663456789", statuses: {} },
  { id: "4",  nom: "Idrissi",    prenom: "Salma",        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face", parentName: "M. Idrissi",      parentPhone: "+212664567890", statuses: {} },
  { id: "5",  nom: "Benjelloun", prenom: "Omar",         avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face", parentName: "M. Benjelloun",   parentPhone: "+212665678901", statuses: {} },
  { id: "6",  nom: "Alaoui",     prenom: "Hiba",         avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face", parentName: "Mme. Alaoui",     parentPhone: "+212666789012", statuses: {} },
  { id: "7",  nom: "Fassi",      prenom: "Karim",        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face", parentName: "M. Fassi",        parentPhone: "+212667890123", statuses: {} },
  { id: "8",  nom: "Cherkaoui",  prenom: "Nadia",        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=face", parentName: "Mme. Cherkaoui",  parentPhone: "+212668901234", statuses: {} },
  { id: "9",  nom: "Belhaj",     prenom: "Amine",        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=face", parentName: "M. Belhaj",       parentPhone: "+212669012345", statuses: {} },
  { id: "10", nom: "Zouiten",    prenom: "Leila",        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face", parentName: "Mme. Zouiten",    parentPhone: "+212670123456", statuses: {} },
];

const statusConfig = {
  present: {
    label: "Présent",
    icon: CheckCircle2,
    active:   "bg-emerald-500 text-white shadow-emerald-500/30 shadow-md",
    inactive: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
  },
  late: {
    label: "Retard",
    icon: Clock,
    active:   "bg-amber-500 text-white shadow-amber-500/30 shadow-md",
    inactive: "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    active:   "bg-red-500 text-white shadow-red-500/30 shadow-md",
    inactive: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  },
} as const;

export default function Presences() {
  const [date, setDate]                   = useState<Date>(new Date());
  const [selectedClasse, setSelectedClasse] = useState("2BAC-A");
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const [students, setStudents]           = useState<StudentAttendance[]>(initialStudents());
  const [notifyOpen, setNotifyOpen]       = useState(false);

  const activeSession  = sessions.find((s) => s.id === activeSessionId)!;
  const sessionIndex   = sessions.findIndex((s) => s.id === activeSessionId);

  const getStatus = (student: StudentAttendance, sessionId: string): AttendanceStatus =>
    student.statuses[sessionId] ?? "unset";

  const handleStatusChange = (studentId: string, sessionId: string, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, statuses: { ...s.statuses, [sessionId]: newStatus } }
          : s
      )
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, statuses: { ...s.statuses, [activeSessionId]: "present" } }))
    );
    toast({
      title: "Présences mises à jour",
      description: `Tous les étudiants marqués présents pour ${activeSession.matiere}.`,
    });
  };

  const handleSaveSession = () => {
    toast({
      title: "Session enregistrée",
      description: `Feuille de présence pour ${activeSession.matiere} (${activeSession.label}) sauvegardée.`,
    });
  };

  // Counts for the active session
  const counts = {
    present: students.filter((s) => getStatus(s, activeSessionId) === "present").length,
    late:    students.filter((s) => getStatus(s, activeSessionId) === "late").length,
    absent:  students.filter((s) => getStatus(s, activeSessionId) === "absent").length,
    unset:   students.filter((s) => getStatus(s, activeSessionId) === "unset").length,
  };

  // Absent students for the active session (for WhatsApp dialog)
  const absentStudents: AbsentStudent[] = students
    .filter((s) => getStatus(s, activeSessionId) === "absent")
    .map((s) => ({
      id:          s.id,
      prenom:      s.prenom,
      nom:         s.nom,
      avatar:      s.avatar,
      parentName:  s.parentName,
      parentPhone: s.parentPhone,
    }));

  const sessionsDone = sessions.filter((sess) =>
    students.every((s) => s.statuses[sess.id] && s.statuses[sess.id] !== "unset")
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registre des Présences</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Suivez les présences par session — {sessionsDone}/{sessions.length} sessions complétées
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {absentStudents.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setNotifyOpen(true)}
                className="border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Notifier les absents
                <Badge className="bg-red-500/15 text-red-400 border-red-500/30 border ml-1 px-1.5 py-0 text-xs">
                  {absentStudents.length}
                </Badge>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleMarkAllPresent}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Tous présents
            </Button>
            <Button onClick={handleSaveSession} className="bg-primary text-primary-foreground gap-2">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal border-border bg-card/50",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
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

          {/* Class Selector */}
          <Select value={selectedClasse} onValueChange={setSelectedClasse}>
            <SelectTrigger className="w-[170px] bg-card/50 border-border">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {classes.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Session Tabs */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Session selector header */}
          <div className="flex items-center border-b border-border overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveSessionId(sessions[Math.max(0, sessionIndex - 1)].id)}
              disabled={sessionIndex === 0}
              className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-30 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {sessions.map((sess) => {
              const done = students.every(
                (s) => s.statuses[sess.id] && s.statuses[sess.id] !== "unset"
              );
              const isActive = sess.id === activeSessionId;
              return (
                <button
                  key={sess.id}
                  onClick={() => setActiveSessionId(sess.id)}
                  className={cn(
                    "flex-1 min-w-[140px] flex flex-col items-center py-3 px-4 border-b-2 transition-all text-sm",
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{sess.matiere}</span>
                    {done && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                  </div>
                  <span className="text-xs opacity-60 mt-0.5">{sess.label}</span>
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

          {/* Session info bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-primary/5 border-b border-border/50">
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{activeSession.matiere}</span>
              <Badge className="bg-primary/15 text-primary border-primary/25 text-xs">
                {activeSession.label}
              </Badge>
              <span className="text-sm text-muted-foreground">· {activeSession.professeur}</span>
            </div>
            <div className="flex gap-3 text-xs font-medium">
              <span className="text-emerald-400">{counts.present} présent{counts.present !== 1 ? "s" : ""}</span>
              <span className="text-amber-400">{counts.late} retard{counts.late !== 1 ? "s" : ""}</span>
              <span className="text-red-400">{counts.absent} absent{counts.absent !== 1 ? "s" : ""}</span>
              {counts.unset > 0 && (
                <span className="text-muted-foreground">{counts.unset} non renseigné{counts.unset !== 1 ? "s" : ""}</span>
              )}
            </div>
          </div>

          {/* Student list */}
          <div className="divide-y divide-border/50">
            {students.map((student) => {
              const current = getStatus(student, activeSessionId);
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors"
                >
                  {/* Student Info */}
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
                      <div className="flex gap-1 mt-1">
                        {sessions.map((sess) => {
                          const st = getStatus(student, sess.id);
                          return (
                            <div
                              key={sess.id}
                              title={`${sess.matiere}: ${st === "unset" ? "—" : st}`}
                              className={cn(
                                "h-1.5 w-4 rounded-full",
                                st === "present" ? "bg-emerald-400" :
                                st === "late"    ? "bg-amber-400"   :
                                st === "absent"  ? "bg-red-400"     :
                                "bg-border"
                              )}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-2">
                    {(["present", "late", "absent"] as const).map((status) => {
                      const config = statusConfig[status];
                      const Icon   = config.icon;
                      const isActive = current === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, activeSessionId, status)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            isActive ? config.active : config.inactive
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

        {/* Overall Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Présents",        value: counts.present, color: "emerald", icon: CheckCircle2 },
            { label: "Retards",         value: counts.late,    color: "amber",   icon: Clock        },
            { label: "Absents",         value: counts.absent,  color: "red",     icon: XCircle      },
            { label: "Non renseignés",  value: counts.unset,   color: "slate",   icon: Users        },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className={`rounded-xl border border-${color}-500/20 bg-${color}-500/10 p-4 flex items-center gap-3`}
            >
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

      {/* WhatsApp Notify Dialog */}
      <WhatsAppNotifyDialog
        open={notifyOpen}
        onOpenChange={setNotifyOpen}
        absentStudents={absentStudents}
        session={activeSession}
        classe={selectedClasse}
        date={date}
      />
    </DashboardLayout>
  );
}
