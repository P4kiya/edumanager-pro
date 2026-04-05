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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Phone, Mail, Users, ChevronRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ParentForm, Parent } from "@/components/dashboard/ParentForm";
import { toast } from "@/hooks/use-toast";
import { ObjectifBaseStudentsData } from "@/data/mockStudents";

// Mock data for parents with linked children (childrenIds = student IDs from mockStudents)
export const parentsData: Parent[] = [
  {
    id: "P001",
    nom: "El Amrani",
    prenom: "Mohammed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    telephone: "06 11 22 33 44",
    email: "m.elamrani@email.com",
    childrenIds: ["1", "3"],
    soldeDu: 15000,
  },
  {
    id: "P002",
    nom: "Benjelloun",
    prenom: "Ahmed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    telephone: "06 22 33 44 55",
    email: "a.benjelloun@email.com",
    childrenIds: ["2", "6", "7"],
    soldeDu: 45000,
  },
  {
    id: "P003",
    nom: "Alami",
    prenom: "Rachid",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face",
    telephone: "06 33 44 55 66",
    email: "r.alami@email.com",
    childrenIds: ["4"],
    soldeDu: 0,
  },
  {
    id: "P004",
    nom: "Fassi",
    prenom: "Nadia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
    telephone: "06 44 55 66 77",
    email: "n.fassi@email.com",
    childrenIds: ["5", "8"],
    soldeDu: 30000,
  },
  {
    id: "P005",
    nom: "Idrissi",
    prenom: "Youssef",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop&crop=face",
    telephone: "06 55 66 77 88",
    email: "y.idrissi@email.com",
    childrenIds: ["9"],
    soldeDu: 15000,
  },
];

export default function Parents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [parents, setParents] = useState<any[]>(parentsData);
  const [formOpen, setFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA").format(amount);
  };

  const filteredParents = parents.filter((parent) => {
    const fullName = `${parent.prenom} ${parent.nom}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    if (fullName.includes(query)) return true;
    // Search by children names (via childrenIds)
    const children = ObjectifBaseStudentsData.filter(s => parent.childrenIds?.includes(s.id));
    if (children.some(s => `${s.prenom} ${s.nom}`.toLowerCase().includes(query))) return true;
    return false;
  });

  const handleAddParent = () => {
    setEditingParent(null);
    setFormOpen(true);
  };

  const handleEditParent = (parent: Parent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingParent(parent);
    setFormOpen(true);
  };

  const handleDeleteParent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setParents(parents.filter((p) => p.id !== id));
    toast({
      title: "Parent supprimé",
      description: "Le parent a été supprimé avec succès.",
    });
  };

  const handleSaveParent = (data: Omit<Parent, "id"> & { id?: string }) => {
    if (data.id) {
      setParents(parents.map((p) =>
        p.id === data.id
          ? { ...p, ...data, avatar: data.avatar || p.avatar }
          : p
      ));
      toast({
        title: "Parent modifié",
        description: "Les informations ont été mises à jour.",
      });
    } else {
      const newParent: Parent = {
        ...data,
        id: `P${Date.now().toString().slice(-3)}`,
        avatar: data.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${data.prenom}%20${data.nom}`,
        childrenIds: data.childrenIds || [],
      };
      setParents([newParent, ...parents]);
      toast({
        title: "Parent ajouté",
        description: `${data.prenom} ${data.nom} a été ajouté avec succès.`,
      });
    }
  };

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
              <Button onClick={handleAddParent} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
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
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow
                    key={parent.id}
                    className="border-border/50 hover:bg-muted/50 cursor-pointer group"
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
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {parent.prenom} {parent.nom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: #{parent.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Facepile of children via childrenIds */}
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {ObjectifBaseStudentsData.filter(s => parent.childrenIds?.includes(s.id)).map((enfant) => (
                            <Tooltip key={enfant.id}>
                              <TooltipTrigger asChild>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <Avatar className="h-8 w-8 border-2 border-background hover:z-10 transition-transform hover:scale-110">
                                    <AvatarImage src={enfant.avatar} />
                                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                      {enfant.prenom[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{enfant.prenom} - {enfant.classe}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                        <span className="ml-3 text-sm text-muted-foreground">
                          {parent.enfants?.length || 0} enfant{(parent.enfants?.length || 0) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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
                    <TableCell className="text-right">
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem
                              onClick={(e) => handleEditParent(parent, e as any)}
                              className="text-foreground cursor-pointer gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDeleteParent(parent.id, e as any)}
                              className="text-destructive cursor-pointer gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredParents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Aucun parent trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </TooltipProvider>

      <ParentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        parent={editingParent}
        onSave={handleSaveParent}
      />
    </DashboardLayout>
  );
}
