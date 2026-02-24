import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Phone, Mail, Users, ChevronRight } from "lucide-react";

// Mock data for parents with linked children
export const parentsData = [
  {
    id: "P001",
    nom: "El Amrani",
    prenom: "Mohammed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    telephone: "06 11 22 33 44",
    email: "m.elamrani@email.com",
    enfants: [
      { id: "E4509", prenom: "Youssef", classe: "2BAC-A", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
      { id: "E4521", prenom: "Sara", classe: "1BAC-B", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
    ],
    soldeDu: 15000,
  },
  {
    id: "P002",
    nom: "Benjelloun",
    prenom: "Ahmed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    telephone: "06 22 33 44 55",
    email: "a.benjelloun@email.com",
    enfants: [
      { id: "E4510", prenom: "Karim", classe: "3ème Collège", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face" },
      { id: "E4511", prenom: "Leila", classe: "5ème Primaire", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face" },
      { id: "E4512", prenom: "Omar", classe: "2ème Primaire", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=64&h=64&fit=crop&crop=face" },
    ],
    soldeDu: 45000,
  },
  {
    id: "P003",
    nom: "Alami",
    prenom: "Rachid",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face",
    telephone: "06 33 44 55 66",
    email: "r.alami@email.com",
    enfants: [
      { id: "E4513", prenom: "Amine", classe: "2BAC-S", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face" },
    ],
    soldeDu: 0,
  },
  {
    id: "P004",
    nom: "Fassi",
    prenom: "Nadia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
    telephone: "06 44 55 66 77",
    email: "n.fassi@email.com",
    enfants: [
      { id: "E4514", prenom: "Salma", classe: "1ère Collège", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face" },
      { id: "E4515", prenom: "Hamza", classe: "4ème Primaire", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=64&h=64&fit=crop&crop=face" },
    ],
    soldeDu: 30000,
  },
  {
    id: "P005",
    nom: "Idrissi",
    prenom: "Youssef",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop&crop=face",
    telephone: "06 55 66 77 88",
    email: "y.idrissi@email.com",
    enfants: [
      { id: "E4516", prenom: "Zineb", classe: "2BAC-L", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=face" },
    ],
    soldeDu: 15000,
  },
];

export default function Parents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA").format(amount);
  };

  const filteredParents = parentsData.filter((parent) => {
    const fullName = `${parent.prenom} ${parent.nom}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    // Search by parent name
    if (fullName.includes(query)) return true;
    
    // Search by children names
    if (parent.enfants.some(e => e.prenom.toLowerCase().includes(query))) return true;
    
    return false;
  });

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Parents & Tuteurs</h1>
              <p className="text-muted-foreground mt-1">
                Gérez les contacts parentaux et la logique familiale
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                Ajouter un Parent
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom de parent ou d'enfant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>

          {/* Results info when searching */}
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              {filteredParents.length} résultat(s) pour "{searchQuery}"
            </p>
          )}

          {/* Parents Table */}
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Nom du Parent</TableHead>
                  <TableHead className="text-muted-foreground">Enfants</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-muted-foreground text-right">État Financier</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow
                    key={parent.id}
                    className="border-border/50 hover:bg-white/5 cursor-pointer"
                    onClick={() => navigate(`/parents/${parent.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={parent.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {parent.prenom[0]}{parent.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {parent.prenom} {parent.nom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: #{parent.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Facepile of children */}
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {parent.enfants.map((enfant) => (
                            <Tooltip key={enfant.id}>
                              <TooltipTrigger asChild>
                                <Avatar className="h-8 w-8 border-2 border-background hover:z-10 transition-transform hover:scale-110">
                                  <AvatarImage src={enfant.avatar} />
                                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                    {enfant.prenom[0]}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{enfant.prenom} - {enfant.classe}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                        <span className="ml-3 text-sm text-muted-foreground">
                          {parent.enfants.length} enfant{parent.enfants.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{parent.telephone}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{parent.email}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {parent.soldeDu > 0 ? (
                        <span className="font-mono text-amber-400">
                          {formatAmount(parent.soldeDu)} MAD
                        </span>
                      ) : (
                        <span className="font-mono text-emerald-400">
                          À jour
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
