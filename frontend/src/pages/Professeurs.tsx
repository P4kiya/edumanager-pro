import { useState } from "react";
import { Plus, Mail, Phone, Calendar, Clock, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  initials: string;
  subject: string;
  subjectColor: "blue" | "green" | "purple" | "orange" | "pink" | "cyan";
  classes: string[];
  status: "active" | "inactive";
  joinDate: string;
  schedule: {
    day: string;
    time: string;
    class: string;
  }[];
}

const subjectColors = {
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  pink: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

const teachers: Teacher[] = [
  {
    id: 1,
    name: "Mohammed Bennani",
    email: "m.bennani@edumanager.ma",
    phone: "+212 6 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    initials: "MB",
    subject: "Mathématiques",
    subjectColor: "blue",
    classes: ["2BAC-A", "2BAC-B", "1BAC-A"],
    status: "active",
    joinDate: "Sept 2020",
    schedule: [
      { day: "Lundi", time: "08:00 - 10:00", class: "2BAC-A" },
      { day: "Mardi", time: "10:00 - 12:00", class: "2BAC-B" },
      { day: "Jeudi", time: "08:00 - 10:00", class: "1BAC-A" },
    ],
  },
  {
    id: 2,
    name: "Fatima Alaoui",
    email: "f.alaoui@edumanager.ma",
    phone: "+212 6 23 45 67 89",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
    initials: "FA",
    subject: "Physique-Chimie",
    subjectColor: "purple",
    classes: ["2BAC-A", "1BAC-B"],
    status: "active",
    joinDate: "Sept 2019",
    schedule: [
      { day: "Lundi", time: "10:00 - 12:00", class: "2BAC-A" },
      { day: "Mercredi", time: "14:00 - 16:00", class: "1BAC-B" },
    ],
  },
  {
    id: 3,
    name: "Youssef El Fassi",
    email: "y.elfassi@edumanager.ma",
    phone: "+212 6 34 56 78 90",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    initials: "YF",
    subject: "Informatique",
    subjectColor: "green",
    classes: ["2BAC-A", "2BAC-B", "1BAC-A", "1BAC-B"],
    status: "active",
    joinDate: "Sept 2021",
    schedule: [
      { day: "Mardi", time: "14:00 - 16:00", class: "2BAC-A" },
      { day: "Vendredi", time: "08:00 - 10:00", class: "1BAC-B" },
    ],
  },
  {
    id: 4,
    name: "Sarah Smith",
    email: "s.smith@edumanager.ma",
    phone: "+212 6 45 67 89 01",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    initials: "SS",
    subject: "Anglais",
    subjectColor: "orange",
    classes: ["2BAC-A", "TC-S"],
    status: "active",
    joinDate: "Sept 2022",
    schedule: [
      { day: "Mercredi", time: "08:00 - 10:00", class: "2BAC-A" },
      { day: "Jeudi", time: "10:00 - 12:00", class: "TC-S" },
    ],
  },
  {
    id: 5,
    name: "Ahmed Hajji",
    email: "a.hajji@edumanager.ma",
    phone: "+212 6 56 78 90 12",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    initials: "AH",
    subject: "Arabe",
    subjectColor: "green",
    classes: ["2BAC-A", "2BAC-B"],
    status: "active",
    joinDate: "Sept 2018",
    schedule: [
      { day: "Samedi", time: "08:00 - 10:00", class: "2BAC-A" },
      { day: "Samedi", time: "10:00 - 12:00", class: "2BAC-B" },
    ],
  },
  {
    id: 6,
    name: "Nadia Berrada",
    email: "n.berrada@edumanager.ma",
    phone: "+212 6 67 89 01 23",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    initials: "NB",
    subject: "Français",
    subjectColor: "pink",
    classes: ["1BAC-A", "TC-S"],
    status: "active",
    joinDate: "Sept 2020",
    schedule: [
      { day: "Lundi", time: "14:00 - 16:00", class: "1BAC-A" },
      { day: "Mardi", time: "08:00 - 10:00", class: "TC-S" },
    ],
  },
];

export default function Professeurs() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRowClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsSheetOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Équipe Pédagogique
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez le personnel enseignant de l'établissement
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Professeur
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Total Professeurs</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {teachers.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Actifs</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {teachers.filter((t) => t.status === "active").length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Matières</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {new Set(teachers.map((t) => t.subject)).size}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Classes Couvertes</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {new Set(teachers.flatMap((t) => t.classes)).size}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Professeur</TableHead>
                <TableHead className="text-muted-foreground">Matière</TableHead>
                <TableHead className="text-muted-foreground">Classes</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  onClick={() => handleRowClick(teacher)}
                  className="border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {teacher.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {teacher.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${subjectColors[teacher.subjectColor]} border`}
                    >
                      {teacher.subject}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((cls) => (
                        <span
                          key={cls}
                          className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          teacher.status === "active"
                            ? "bg-emerald-400"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {teacher.status === "active" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Teacher Profile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md bg-popover border-border overflow-y-auto">
          {selectedTeacher && (
            <>
              <SheetHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-foreground">
                    Profil du Professeur
                  </SheetTitle>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedTeacher.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl">
                      {selectedTeacher.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {selectedTeacher.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`mt-2 ${subjectColors[selectedTeacher.subjectColor]} border`}
                  >
                    {selectedTeacher.subject}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/30 p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedTeacher.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{selectedTeacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Rejoint en {selectedTeacher.joinDate}
                    </span>
                  </div>
                </div>

                {/* Classes */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Classes Assignées
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.classes.map((cls) => (
                      <span
                        key={cls}
                        className="text-sm text-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Emploi du temps
                  </h4>
                  <div className="space-y-2">
                    {selectedTeacher.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.day}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.time}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-primary">{item.class}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
