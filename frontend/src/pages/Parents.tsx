import { useEffect, useMemo, useState } from "react";
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
import { Search, Phone, Mail, Users, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ParentForm, Parent } from "@/components/dashboard/ParentForm";
import { toast } from "@/hooks/use-toast";
import { parentService, studentService } from "@/services";
import type { ParentDTO, ParentRequest, StudentDTO } from "@/types/api.types";

const toUiParent = (parent: ParentDTO): Parent => ({
  id: parent.id,
  nom: parent.lastName,
  prenom: parent.firstName,
  email: parent.email || "",
  telephone: parent.phone || "",
  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${parent.firstName}%20${parent.lastName}`,
  soldeDu: Number(parent.arrears || 0),
  adresse: parent.address || "",
  childrenIds: parent.childrenIds || [],
});

const toParentRequest = (parent: Omit<Parent, "id">): ParentRequest => ({
  firstName: parent.prenom,
  lastName: parent.nom,
  email: parent.email,
  phone: parent.telephone,
  address: parent.adresse || "",
  arrears: parent.soldeDu || 0,
});

export default function Parents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [parentsRes, studentsRes] = await Promise.all([
          parentService.getAll(),
          studentService.getAll(0, 200),
        ]);
        setParents(parentsRes.map(toUiParent));
        setStudents(studentsRes.content);
      } catch (error) {
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les parents.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatAmount = (amount: number) => new Intl.NumberFormat("fr-MA").format(amount);

  const childMap = useMemo(() => {
    const map = new Map<number, StudentDTO>();
    students.forEach((student) => map.set(student.id, student));
    return map;
  }, [students]);

  const filteredParents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return parents.filter((parent) => {
      const fullName = `${parent.prenom} ${parent.nom}`.toLowerCase();
      if (fullName.includes(query)) return true;
      const children = (parent.childrenIds || [])
        .map((id) => childMap.get(id))
        .filter(Boolean) as StudentDTO[];
      return children.some((child) =>
        `${child.firstName} ${child.lastName}`.toLowerCase().includes(query),
      );
    });
  }, [parents, searchQuery, childMap]);

  const handleAddParent = () => {
    setEditingParent(null);
    setFormOpen(true);
  };

  const handleEditParent = (parent: Parent) => {
    setEditingParent(parent);
    setFormOpen(true);
  };

  const handleDeleteParent = async (id: number) => {
    try {
      await parentService.delete(id);
      setParents((prev) => prev.filter((parent) => parent.id !== id));
      toast({
        title: "Parent supprimé",
        description: "Le parent a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le parent.",
        variant: "destructive",
      });
    }
  };

  const handleSaveParent = async (data: Omit<Parent, "id"> & { id?: number }) => {
    const payload = toParentRequest(data);

    try {
      if (data.id) {
        const updated = await parentService.update(data.id, payload);
        setParents((prev) =>
          prev.map((parent) => (parent.id === data.id ? toUiParent(updated) : parent)),
        );
        toast({
          title: "Parent modifié",
          description: "Les informations ont été mises à jour.",
        });
      } else {
        const created = await parentService.create(payload);
        setParents((prev) => [toUiParent(created), ...prev]);
        toast({
          title: "Parent ajouté",
          description: `${data.prenom} ${data.nom} a été ajouté avec succès.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le parent.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6">
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

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom de parent ou d'enfant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>

          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              {filteredParents.length} résultat(s) pour "{searchQuery}"
            </p>
          )}

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
                {!isLoading && filteredParents.map((parent) => {
                  const children = (parent.childrenIds || [])
                    .map((id) => childMap.get(id))
                    .filter(Boolean) as StudentDTO[];

                  return (
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
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {children.map((enfant) => (
                              <Tooltip key={enfant.id}>
                                <TooltipTrigger asChild>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <Avatar className="h-8 w-8 border-2 border-background hover:z-10 transition-transform hover:scale-110">
                                      <AvatarImage src={enfant.avatarUrl} />
                                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                        {enfant.firstName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{enfant.firstName} - {enfant.className}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                          <span className="ml-3 text-sm text-muted-foreground">
                            {children.length} enfant{children.length > 1 ? "s" : ""}
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
                                onClick={() => handleEditParent(parent)}
                                className="text-foreground cursor-pointer gap-2"
                              >
                                <Pencil className="h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteParent(parent.id)}
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
                  );
                })}
                {!isLoading && filteredParents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Aucun parent trouvé
                    </TableCell>
                  </TableRow>
                )}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      Chargement des parents...
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
        hideChildrenSelection
      />
    </DashboardLayout>
  );
}
