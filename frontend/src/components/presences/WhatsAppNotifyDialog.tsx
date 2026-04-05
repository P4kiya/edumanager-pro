import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, CheckCircle2, Phone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AbsentStudent {
  id: string;
  prenom: string;
  nom: string;
  avatar: string;
  parentName: string;
  parentPhone: string;
}

interface Session {
  label: string;
  matiere: string;
  professeur: string;
}

interface WhatsAppNotifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absentStudents: AbsentStudent[];
  session: Session;
  classe: string;
  date: Date;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildMessage(student: AbsentStudent, session: Session, classe: string, date: Date): string {
  const dateStr = format(date, "EEEE d MMMM yyyy", { locale: fr });
  return (
    `Bonjour ${student.parentName},\n\n` +
    `Votre enfant ${student.prenom} ${student.nom} a été absent(e) ce ${dateStr} ` +
    `lors du cours de ${session.matiere} (${session.label}).\n\n` +
    `Classe : ${classe}\n` +
    `Professeur : ${session.professeur}\n\n` +
    `Merci de prendre contact avec l'établissement pour régulariser la situation.\n\n` +
    `— Direction EduManager`
  );
}

function whatsappUrl(phone: string, message: string): string {
  // Strip everything except digits
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WhatsAppNotifyDialog({
  open,
  onOpenChange,
  absentStudents,
  session,
  classe,
  date,
}: WhatsAppNotifyDialogProps) {
  const [sent, setSent] = useState<Set<string>>(new Set());

  const handleSend = (student: AbsentStudent) => {
    const msg = buildMessage(student, session, classe, date);
    window.open(whatsappUrl(student.parentPhone, msg), "_blank");
    setSent((prev) => new Set(prev).add(student.id));
  };

  const handleSendAll = () => {
    absentStudents.forEach((s) => handleSend(s));
  };

  const allSent = absentStudents.every((s) => sent.has(s.id));

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setSent(new Set()); }}>
      <DialogContent className="bg-popover border-border text-foreground sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-emerald-400" />
            Notifier les parents par WhatsApp
          </DialogTitle>
        </DialogHeader>

        {/* Session context */}
        <div className="rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{session.matiere} · {session.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {classe} · {format(date, "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <Badge className="bg-red-500/15 text-red-400 border-red-500/30 border">
              {absentStudents.length} absent{absentStudents.length > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Message preview */}
        {absentStudents.length > 0 && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-emerald-400 font-medium mb-2">
              Aperçu du message
            </p>
            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
              {buildMessage(absentStudents[0], session, classe, date)}
            </p>
          </div>
        )}

        <Separator className="bg-border/50" />

        {/* Student list */}
        <div className="space-y-2">
          {absentStudents.map((student) => {
            const isSent = sent.has(student.id);
            return (
              <div
                key={student.id}
                className="flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {student.prenom[0]}{student.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{student.prenom} {student.nom}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{student.parentName} · {student.parentPhone}</p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isSent ? "outline" : "default"}
                  className={
                    isSent
                      ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-1.5"
                      : "bg-[#25D366] hover:bg-[#1ebe5a] text-white gap-1.5"
                  }
                  onClick={() => handleSend(student)}
                >
                  {isSent ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Envoyé
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1 bg-[#25D366] hover:bg-[#1ebe5a] text-white gap-2"
            onClick={handleSendAll}
            disabled={allSent}
          >
            <MessageCircle className="h-4 w-4" />
            {allSent ? "Tous notifiés" : `Envoyer à tous (${absentStudents.length})`}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
