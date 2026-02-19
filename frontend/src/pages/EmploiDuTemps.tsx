import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScheduleEvent {
  id: number;
  subject: string;
  room: string;
  teacher: string;
  day: number; // 0 = Lundi, 1 = Mardi, etc.
  startHour: number;
  endHour: number;
  color: "blue" | "purple" | "green" | "orange" | "pink" | "cyan";
}

const colorStyles = {
  blue: {
    bg: "bg-blue-500/15",
    border: "border-l-blue-500",
    text: "text-blue-300",
    hover: "hover:bg-blue-500/25",
  },
  purple: {
    bg: "bg-purple-500/15",
    border: "border-l-purple-500",
    text: "text-purple-300",
    hover: "hover:bg-purple-500/25",
  },
  green: {
    bg: "bg-emerald-500/15",
    border: "border-l-emerald-500",
    text: "text-emerald-300",
    hover: "hover:bg-emerald-500/25",
  },
  orange: {
    bg: "bg-orange-500/15",
    border: "border-l-orange-500",
    text: "text-orange-300",
    hover: "hover:bg-orange-500/25",
  },
  pink: {
    bg: "bg-pink-500/15",
    border: "border-l-pink-500",
    text: "text-pink-300",
    hover: "hover:bg-pink-500/25",
  },
  cyan: {
    bg: "bg-cyan-500/15",
    border: "border-l-cyan-500",
    text: "text-cyan-300",
    hover: "hover:bg-cyan-500/25",
  },
};

const scheduleData: ScheduleEvent[] = [
  {
    id: 1,
    subject: "Mathématiques",
    room: "Salle B2",
    teacher: "M. Bennani",
    day: 0,
    startHour: 8,
    endHour: 10,
    color: "blue",
  },
  {
    id: 2,
    subject: "Physique-Chimie",
    room: "Labo 3",
    teacher: "Mme. Alaoui",
    day: 0,
    startHour: 10,
    endHour: 12,
    color: "purple",
  },
  {
    id: 3,
    subject: "Français",
    room: "Salle A1",
    teacher: "M. Dupont",
    day: 0,
    startHour: 14,
    endHour: 16,
    color: "pink",
  },
  {
    id: 4,
    subject: "Informatique",
    room: "Salle Info 2",
    teacher: "M. El Fassi",
    day: 1,
    startHour: 14,
    endHour: 16,
    color: "green",
  },
  {
    id: 5,
    subject: "Anglais",
    room: "Salle C4",
    teacher: "Mme. Smith",
    day: 2,
    startHour: 8,
    endHour: 10,
    color: "orange",
  },
  {
    id: 6,
    subject: "Histoire-Géographie",
    room: "Salle D1",
    teacher: "M. Berrada",
    day: 2,
    startHour: 10,
    endHour: 12,
    color: "cyan",
  },
  {
    id: 7,
    subject: "Mathématiques",
    room: "Salle B2",
    teacher: "M. Bennani",
    day: 3,
    startHour: 8,
    endHour: 10,
    color: "blue",
  },
  {
    id: 8,
    subject: "Sciences de la Vie",
    room: "Labo SVT",
    teacher: "Mme. Tahiri",
    day: 3,
    startHour: 14,
    endHour: 16,
    color: "green",
  },
  {
    id: 9,
    subject: "Philosophie",
    room: "Salle E2",
    teacher: "M. Chraibi",
    day: 4,
    startHour: 10,
    endHour: 12,
    color: "purple",
  },
  {
    id: 10,
    subject: "Éducation Physique",
    room: "Gymnase",
    teacher: "M. Karimi",
    day: 4,
    startHour: 14,
    endHour: 16,
    color: "orange",
  },
  {
    id: 11,
    subject: "Arabe",
    room: "Salle A3",
    teacher: "M. Hajji",
    day: 5,
    startHour: 8,
    endHour: 10,
    color: "pink",
  },
];

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 08:00 to 18:00

const classes = [
  "2ème Année Bac - A",
  "2ème Année Bac - B",
  "1ère Année Bac - A",
  "1ère Année Bac - B",
  "Tronc Commun - Sciences",
];

export default function EmploiDuTemps() {
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekDates = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        day,
        date: date.getDate(),
        month: date.toLocaleDateString("fr-FR", { month: "short" }),
      };
    });
  }, [weekOffset]);

  const getEventsForCell = (dayIndex: number, hour: number) => {
    return scheduleData.filter(
      (event) =>
        event.day === dayIndex &&
        hour >= event.startHour &&
        hour < event.endHour
    );
  };

  const isEventStart = (event: ScheduleEvent, hour: number) => {
    return event.startHour === hour;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Emploi du temps
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez et consultez les plannings de cours
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Class Selector */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] border-border bg-secondary/50">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent className="border-border bg-[#111827]">
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Week Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="border-border bg-secondary/50 hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setWeekOffset(0)}
                className="border-border bg-secondary/50 hover:bg-secondary px-3"
              >
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="border-border bg-secondary/50 hover:bg-secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-border/50">
            <div className="p-3 border-r border-border/30" />
            {currentWeekDates.map((dateInfo, index) => (
              <div
                key={index}
                className="p-3 text-center border-r border-border/30 last:border-r-0"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {dateInfo.day}
                </p>
                <p className="text-lg font-semibold text-foreground mt-0.5">
                  {dateInfo.date}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    {dateInfo.month}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-[80px_repeat(6,1fr)]">
            {hours.map((hour) => (
              <div key={hour} className="contents">
                {/* Time Label */}
                <div className="p-2 text-right pr-4 border-r border-border/30 border-b border-border/30 flex items-start justify-end">
                  <span className="text-xs font-medium text-muted-foreground">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                </div>

                {/* Day Cells */}
                {days.map((_, dayIndex) => {
                  const events = getEventsForCell(dayIndex, hour);
                  const eventToRender = events.find((e) =>
                    isEventStart(e, hour)
                  );

                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className="relative min-h-[60px] border-r border-b border-border/30 last:border-r-0 p-1"
                    >
                      {eventToRender && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`absolute inset-1 z-10 rounded-lg border-l-4 ${colorStyles[eventToRender.color].bg
                                  } ${colorStyles[eventToRender.color].border} ${colorStyles[eventToRender.color].hover
                                  } cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 p-2.5 flex flex-col justify-center`}
                                style={{
                                  height: `calc(${(eventToRender.endHour -
                                      eventToRender.startHour) *
                                    100
                                    }% + ${(eventToRender.endHour -
                                      eventToRender.startHour -
                                      1) *
                                    0.5
                                    }rem - 0.5rem)`,
                                }}
                              >
                                <p
                                  className={`text-sm font-semibold ${colorStyles[eventToRender.color].text
                                    } truncate`}
                                >
                                  {eventToRender.subject}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {eventToRender.room}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {eventToRender.teacher}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="bg-[#1a1f2e] border-border p-3 max-w-[250px]"
                            >
                              <div className="space-y-2">
                                <p
                                  className={`font-semibold ${colorStyles[eventToRender.color].text
                                    }`}
                                >
                                  {eventToRender.subject}
                                </p>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {eventToRender.startHour
                                        .toString()
                                        .padStart(2, "0")}
                                      :00 -{" "}
                                      {eventToRender.endHour
                                        .toString()
                                        .padStart(2, "0")}
                                      :00
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{eventToRender.room}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-3 w-3" />
                                    <span>{eventToRender.teacher}</span>
                                  </div>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Légende :</span>
          {Object.entries(colorStyles).map(([color, styles]) => (
            <div key={color} className="flex items-center gap-1.5">
              <div
                className={`h-3 w-3 rounded ${styles.bg} border-l-2 ${styles.border}`}
              />
              <span className="capitalize">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
