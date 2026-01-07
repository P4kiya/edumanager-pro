import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StudentForm, Student } from "@/components/dashboard/StudentForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const initialStudents: Student[] = [
  {
    id: "1",
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@email.com",
    telephone: "06 12 34 56 78",
    classe: "6ème A",
    dateNaissance: "2014-03-15",
    adresse: "12 Rue des Lilas, Paris",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "2",
    nom: "Bernard",
    prenom: "Lucas",
    email: "lucas.bernard@email.com",
    telephone: "06 23 45 67 89",
    classe: "5ème B",
    dateNaissance: "2013-07-22",
    adresse: "45 Avenue Victor Hugo, Lyon",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "3",
    nom: "Dubois",
    prenom: "Emma",
    email: "emma.dubois@email.com",
    telephone: "06 34 56 78 90",
    classe: "4ème A",
    dateNaissance: "2012-11-08",
    adresse: "78 Boulevard Haussmann, Paris",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "4",
    nom: "Petit",
    prenom: "Thomas",
    email: "thomas.petit@email.com",
    telephone: "06 45 67 89 01",
    classe: "3ème C",
    dateNaissance: "2011-05-30",
    adresse: "23 Rue de la Paix, Marseille",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "5",
    nom: "Moreau",
    prenom: "Léa",
    email: "lea.moreau@email.com",
    telephone: "06 56 78 90 12",
    classe: "6ème B",
    dateNaissance: "2014-09-12",
    adresse: "56 Rue du Commerce, Bordeaux",
    statut: "inactif",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "6",
    nom: "Laurent",
    prenom: "Hugo",
    email: "hugo.laurent@email.com",
    telephone: "06 67 89 01 23",
    classe: "5ème A",
    dateNaissance: "2013-01-25",
    adresse: "89 Avenue de la République, Toulouse",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "7",
    nom: "Garcia",
    prenom: "Camille",
    email: "camille.garcia@email.com",
    telephone: "06 78 90 12 34",
    classe: "4ème B",
    dateNaissance: "2012-06-18",
    adresse: "34 Rue Nationale, Nantes",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
  },
  {
    id: "8",
    nom: "Roux",
    prenom: "Nathan",
    email: "nathan.roux@email.com",
    telephone: "06 89 01 23 45",
    classe: "3ème A",
    dateNaissance: "2011-12-03",
    adresse: "67 Boulevard Saint-Michel, Paris",
    statut: "actif",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face",
  },
];

const classes = ["Toutes", "6ème A", "6ème B", "5ème A", "5ème B", "4ème A", "4ème B", "3ème A", "3ème B", "3ème C"];
const statuts = ["Tous", "actif", "inactif"];

const Etudiants = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("Toutes");
  const [selectedStatut, setSelectedStatut] = useState("Tous");
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClasse = selectedClasse === "Toutes" || student.classe === selectedClasse;
      const matchesStatut = selectedStatut === "Tous" || student.statut === selectedStatut;

      return matchesSearch && matchesClasse && matchesStatut;
    });
  }, [students, searchQuery, selectedClasse, selectedStatut]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast({
      title: "Étudiant supprimé",
      description: "L'étudiant a été supprimé avec succès.",
    });
  };

  const handleSaveStudent = (data: Omit<Student, "id" | "avatar"> & { id?: string }) => {
    if (data.id) {
      // Edit
      setStudents(students.map((s) => 
        s.id === data.id 
          ? { ...s, ...data } 
          : s
      ));
      toast({
        title: "Étudiant modifié",
        description: "Les informations ont été mises à jour.",
      });
    } else {
      // Add
      const newStudent: Student = {
        ...data,
        id: Date.now().toString(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.prenom}%20${data.nom}`,
      };
      setStudents([newStudent, ...students]);
      toast({
        title: "Étudiant ajouté",
        description: `${data.prenom} ${data.nom} a été ajouté avec succès.`,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClasse("Toutes");
    setSelectedStatut("Tous");
  };

  const hasActiveFilters = searchQuery || selectedClasse !== "Toutes" || selectedStatut !== "Tous";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold text-foreground">Étudiants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez la liste des étudiants inscrits
          </p>
        </div>
        
        <Button 
          onClick={handleAddStudent}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un étudiant
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Filter Toggle (mobile) */}
          <Button
            variant="outline"
            className="lg:hidden border-border text-foreground gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtres
          </Button>

          {/* Filters (desktop always visible, mobile toggleable) */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4",
            showFilters ? "flex" : "hidden lg:flex"
          )}>
            <Select value={selectedClasse} onValueChange={setSelectedClasse}>
              <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {classes.map((c) => (
                  <SelectItem key={c} value={c} className="text-foreground">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatut} onValueChange={setSelectedStatut}>
              <SelectTrigger className="w-full sm:w-[130px] bg-secondary/50 border-border text-foreground">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {statuts.map((s) => (
                  <SelectItem key={s} value={s} className="text-foreground capitalize">
                    {s === "Tous" ? "Tous" : s === "actif" ? "Actif" : "Inactif"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <X className="h-4 w-4" />
                Effacer
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mt-4">
          {filteredStudents.length} étudiant{filteredStudents.length !== 1 ? "s" : ""} trouvé{filteredStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Étudiant</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Téléphone</TableHead>
              <TableHead className="text-muted-foreground font-medium">Classe</TableHead>
              <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Statut</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow 
                key={student.id} 
                className="border-border transition-colors hover:bg-secondary/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {student.prenom[0]}{student.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{student.prenom} {student.nom}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">{student.email}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{student.telephone}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {student.classe}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className={cn(
                    student.statut === "actif" ? "badge-success" : "badge-warning"
                  )}>
                    {student.statut === "actif" ? "Actif" : "Inactif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem 
                        onClick={() => handleEditStudent(student)}
                        className="text-foreground cursor-pointer gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-destructive cursor-pointer gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Aucun étudiant trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <StudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        student={editingStudent}
        onSave={handleSaveStudent}
      />
    </DashboardLayout>
  );
};

export default Etudiants;
