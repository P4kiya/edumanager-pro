import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Inscription {
  id: string;
  nom: string;
  avatar: string;
  classe: string;
  date: string;
  statut: "payé" | "en_attente";
}

const inscriptions: Inscription[] = [
  {
    id: "1",
    nom: "Sophie Martin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
    classe: "6ème A",
    date: "5 Jan 2026",
    statut: "payé",
  },
  {
    id: "2",
    nom: "Lucas Bernard",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=64&h=64&fit=crop&crop=face",
    classe: "5ème B",
    date: "4 Jan 2026",
    statut: "payé",
  },
  {
    id: "3",
    nom: "Emma Dubois",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    classe: "4ème A",
    date: "4 Jan 2026",
    statut: "en_attente",
  },
  {
    id: "4",
    nom: "Thomas Petit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    classe: "3ème C",
    date: "3 Jan 2026",
    statut: "payé",
  },
  {
    id: "5",
    nom: "Léa Moreau",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    classe: "6ème B",
    date: "2 Jan 2026",
    statut: "en_attente",
  },
];

export function RecentInscriptions() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Dernières Inscriptions</h3>
        <p className="text-sm text-muted-foreground">Les 5 inscriptions les plus récentes</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">Nom</TableHead>
            <TableHead className="text-muted-foreground font-medium">Classe</TableHead>
            <TableHead className="text-muted-foreground font-medium">Date</TableHead>
            <TableHead className="text-muted-foreground font-medium text-right">Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inscriptions.map((inscription, index) => (
            <TableRow 
              key={inscription.id} 
              className={cn(
                "border-border transition-colors hover:bg-secondary/50",
                index === 0 && "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={inscription.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {inscription.nom.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{inscription.nom}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{inscription.classe}</TableCell>
              <TableCell className="text-muted-foreground">{inscription.date}</TableCell>
              <TableCell className="text-right">
                <span className={cn(
                  inscription.statut === "payé" ? "badge-success" : "badge-warning"
                )}>
                  {inscription.statut === "payé" ? "Payé" : "En attente"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
