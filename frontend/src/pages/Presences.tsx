import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, CheckCircle2, Clock, XCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type AttendanceStatus = "present" | "late" | "absent";

interface Student {
  id: string;
  nom: string;
  prenom: string;
  avatar: string;
  status: AttendanceStatus;
}

const initialStudents: Student[] = [
  { id: "1", nom: "El Amrani", prenom: "Youssef", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "2", nom: "Bennis", prenom: "Fatima Zahra", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "3", nom: "Tazi", prenom: "Ahmed", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", status: "absent" },
  { id: "4", nom: "Idrissi", prenom: "Salma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "5", nom: "Benjelloun", prenom: "Omar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face", status: "late" },
  { id: "6", nom: "Alaoui", prenom: "Hiba", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "7", nom: "Fassi", prenom: "Karim", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "8", nom: "Cherkaoui", prenom: "Nadia", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "9", nom: "Belhaj", prenom: "Amine", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=face", status: "present" },
  { id: "10", nom: "Zouiten", prenom: "Leila", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&crop=face", status: "late" },
];

const classes = ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B", "TC-A", "TC-B"];

export default function Presences() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClasse, setSelectedClasse] = useState("2BAC-A");
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, status: newStatus } : s
    ));
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map(s => ({ ...s, status: "present" })));
    toast({
      title: "Présences mises à jour",
      description: "Tous les étudiants ont été marqués comme présents.",
    });
  };

  const counts = {
    present: students.filter(s => s.status === "present").length,
    late: students.filter(s => s.status === "late").length,
    absent: students.filter(s => s.status === "absent").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registre des Présences</h1>
            <p className="text-sm text-muted-foreground">
              Marquez les présences quotidiennes des étudiants
            </p>
          </div>
          <Button onClick={handleMarkAllPresent} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Tout marquer comme Présent
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4">
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
            <SelectTrigger className="w-[180px] bg-card/50 border-border">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{counts.present}</p>
              <p className="text-xs text-muted-foreground">Présents</p>
            </div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400 font-mono">{counts.late}</p>
              <p className="text-xs text-muted-foreground">Retards</p>
            </div>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400 font-mono">{counts.absent}</p>
              <p className="text-xs text-muted-foreground">Absents</p>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="divide-y divide-border">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {student.prenom[0]}{student.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {student.prenom} {student.nom}
                    </p>
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(student.id, "present")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      student.status === "present"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Présent
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, "late")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      student.status === "late"
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    Retard
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, "absent")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      student.status === "absent"
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                        : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                    )}
                  >
                    <XCircle className="h-4 w-4" />
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
